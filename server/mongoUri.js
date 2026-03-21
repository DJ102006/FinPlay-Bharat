import { Resolver, resolveSrv, resolveTxt } from 'dns/promises';

const DEFAULT_DNS_SERVERS = ['8.8.8.8', '1.1.1.1'];

function getDnsServers() {
  const configured = process.env.MONGODB_DNS_SERVERS
    ?.split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  return configured?.length ? configured : DEFAULT_DNS_SERVERS;
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
    const joinedRecord = record.join('');
    const txtParams = new URLSearchParams(joinedRecord);

    for (const [key, value] of txtParams.entries()) {
      if (!searchParams.has(key)) {
        searchParams.set(key, value);
      }
    }
  }
}

export async function resolveMongoConnectionUri(uri) {
  if (!uri?.startsWith('mongodb+srv://')) {
    return uri;
  }

  const parsed = parseMongoSrvUri(uri);
  const hostname = parsed.hostname;
  let srvRecords;
  let txtRecords;

  try {
    srvRecords = await resolveSrv(`_mongodb._tcp.${hostname}`);
    txtRecords = await resolveTxt(hostname).catch(() => []);
  } catch {
    const resolver = new Resolver();
    resolver.setServers(getDnsServers());
    srvRecords = await resolver.resolveSrv(`_mongodb._tcp.${hostname}`);
    txtRecords = await resolver.resolveTxt(hostname).catch(() => []);
  }

  if (srvRecords.length === 0) {
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
