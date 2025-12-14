'use client'

import { PropsWithChildren } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'

import queryClient from '../query-client'

const UnreadMessagesQueryClientProvider = (props: PropsWithChildren) => (
  <QueryClientProvider {...props} client={queryClient} />
)

export default UnreadMessagesQueryClientProvider
