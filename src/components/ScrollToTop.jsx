import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      document.documentElement.style.scrollBehavior = 'auto'; // Temporarily disable smooth scroll
      window.scrollTo(0, 0);
      document.documentElement.style.scrollBehavior = 'smooth'; // Re-enable for anchor links
    }
  }, [pathname, hash])

  return null
}