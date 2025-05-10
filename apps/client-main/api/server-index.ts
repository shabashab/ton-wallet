import { createHttpApi } from '@api-def/provider-http'
import { serverIndexAuth } from './server-index/auth'
import { serverIndexWallets } from './server-index/wallets'

export const useServerIndexApi = () => {
  const runtimeConfig = useRuntimeConfig()
  const indexAuthStore = useIndexAuthStore()

  const api = createHttpApi({
    baseUrl: runtimeConfig.public.apiBaseUrl,
    authenticationStrategy: {
      getIsAuthenticated: () => {
        return indexAuthStore.isAuthenticated
      },
      authenticateRequest: (request) => {
        const newHeaders = new Headers(request.headers)
        newHeaders.set('Authorization', `Bearer ${indexAuthStore.authToken}`)

        request.headers = newHeaders

        return request
      },
      defaultAuthenticationRequired: true,
    },
  })

  return {
    auth: serverIndexAuth(api),
    wallets: serverIndexWallets(api),
  }
}
