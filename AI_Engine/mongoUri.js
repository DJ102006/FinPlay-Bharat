const dns = require('dns').promises;

const DEFAULT_DNS_SERVERS = ['8.8.8.8', '1.1.1.1'];

function getDnsServers() {
  const configured = process.env.MONGODB_DNS_SERVERS
    ?.split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  return configured && configured.length > 0 ? configured : DEFAULT_DNS_SERVERS;
}

function parseMongoSrvUri(uri) {
  const withoutScheme = uri.slice('mongodb+srv://'.length);
  const firstSlash = withoutScheme.indexOf('/');
  const authority = firstSlash === -1 ? withoutScheme : withoutScheme.slice(0, firstSlash);
  const pathAndQuery = firstSlash === -1 ? '/' : withoutScheme.slice(firstSlash);
  return new URL(`http://${authority}${pathAndQuery}`);
}

function mergeTxtOptions(searchParams, txtRecords) {
  for (const record of txtRecords) {
    const joined = record.join('');
    const txtParams = new URLSearchParams(joined);

    for (const [key, value] of txtParams.entries()) {
      if (!searchParams.has(key)) {
        searchParams.set(key, value);
      }
    }
  }
}

async function resolveMongoConnectionUri(uri) {
  if (!uri || !uri.startsWith('mongodb+srv://')) {
    return uri;
  }

  const parsed = parseMongoSrvUri(uri);
  const hostname = parsed.hostname;
  let srvRecords;
  let txtRecords;

  try {
    srvRecords = await dns.resolveSrv(`_mongodb._tcp.${hostname}`);
    txtRecords = await dns.resolveTxt(hostname).catch(() => []);
  } catch (error) {
    const resolver = new dns.Resolver();
    resolver.setServers(getDnsServers());
    srvRecords = await resolver.resolveSrv(`_mongodb._tcp.${hostname}`);
    txtRecords = await resolver.resolveTxt(hostname).catch(() => []);
  }

  if (!srvRecords.length) {
    throw new Error(`No SRV records found for ${hostname}`);
  }

  const username = decodeURIComponent(parsed.username);
  const password = decodeURIComponent(parsed.password);
  const credentials = username
    ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@`
    : '';
  const hosts = srvRecords
    .sort((left, right) => left.priority - right.priority || left.weight - right.weight)
    .map((record) => `${record.name}:${record.port}`)
    .join(',');
  const searchParams = new URLSearchParams(parsed.search);

  mergeTxtOptions(searchParams, txtRecords);

  if (!searchParams.has('tls')) {
    searchParams.set('tls', 'true');
  }

  const dbName = parsed.pathname.replace(/^\//, '');
  const query = searchParams.toString();

  return `mongodb://${credentials}${hosts}/${dbName}${query ? `?${query}` : ''}`;
}

module.exports = { resolveMongoConnectionUri };
