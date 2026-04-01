'use client'

import { SWRConfig } from 'swr'
import type { ReactNode } from 'react'

type SWRProviderProps = {
  children: ReactNode
}

export const SWRProvider = ({ children }: SWRProviderProps) => {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
        dedupingInterval: 60000,
        shouldRetryOnError: false,
        // キャッシュをメモリに保持
        provider: () => new Map(),
      }}
    >
      {children}
    </SWRConfig>
  )
}
