"use client"

import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error("[React Query] Query failed:", {
        queryKey: query.queryKey,
        message: error.message,
      })
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export function AppProvider(props: ColorModeProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider {...props} />
      </ChakraProvider>
    </QueryClientProvider>
  )
}
