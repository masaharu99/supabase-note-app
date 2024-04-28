import { QueryClient, QueryClientProvider } from 'react-query'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { supabase } from '../utils/supabase'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  const { push, pathname } = useRouter()
  const validateSession = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user && pathname === '/') {
      console.log('go notes')
    } else if (!user && pathname !== '/') {
      console.log('go root')
      push('/')
    }
  }

  supabase.auth.onAuthStateChange((event, _) => {
    if (event === 'SIGNED_IN' && pathname === '/') {
      push('notes')
    }
    if (event === 'SIGNED_OUT') {
      push('/')
    }
  })

  useEffect(() => {
    validateSession()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}

export default MyApp
