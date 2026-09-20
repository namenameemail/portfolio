import { useCallback, useEffect, useState } from 'react'
import { pageFromPathname, pathFor, type AppRoute } from './routes'

function readRoute(): AppRoute {
  return pageFromPathname(window.location.pathname)
}

export function usePathRoute() {
  const [route, setRoute] = useState<AppRoute>(readRoute)
  const [skipEnter, setSkipEnter] = useState(() => readRoute() !== 'home')

  useEffect(() => {
    const onPop = () => {
      setSkipEnter(false)
      setRoute(readRoute())
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((next: AppRoute) => {
    const path = pathFor(next)
    const url = next === 'home' ? path : `./${path}`
    window.history.pushState(null, '', url)
    setSkipEnter(false)
    setRoute(next)
  }, [])

  return { route, navigate, skipEnter }
}
