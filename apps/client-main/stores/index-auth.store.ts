import { useServerIndexApi } from '~/api/server-index'

const LOCAL_STORAGE_AUTHENTICATION_TOKEN_KEY = 'server-index:auth-token'

export const useIndexAuthStore = defineStore('index-auth', () => {
  const twa = useTwa()
  const authToken = ref<string>()
  const serverIndexApi = useServerIndexApi()

  const isAuthenticated = computed(() => {
    return !!authToken.value
  })

  const tryAuthenticate = async () => {
    loadAuthenticationTokenFromLocalStorage()

    if (!authToken.value) {
      return await tryAuthenticateWithInitData()
    }

    const checkResult = await checkAuthToken()

    if (checkResult) {
      return true
    }

    removeAuthenticationTokenFromLocalStorage()
    authToken.value = undefined
    return false
  }

  const checkAuthToken = async () => {
    if (!authToken.value) {
      throw new Error(
        'Cannot call checkAuthToken without authToken value being set'
      )
    }

    try {
      const iamResult = await serverIndexApi.auth.iam.execute()

      return iamResult.success
    } catch {
      return false
    }
  }

  const tryAuthenticateWithInitData = async () => {
    const initData = twa.initData

    const authResult = await serverIndexApi.auth.login.execute({ initData })

    if (!authResult.success) {
      console.warn(
        `Failed to authenticate on index server, ${authResult.error}`
      )
      return false
    }

    authToken.value = authResult.output.token
    saveAuthenticationTokenToLocalStorage()
    return true
  }

  const removeAuthenticationTokenFromLocalStorage = () => {
    localStorage.removeItem(LOCAL_STORAGE_AUTHENTICATION_TOKEN_KEY)
  }

  const saveAuthenticationTokenToLocalStorage = () => {
    if (!authToken.value) {
      return
    }

    localStorage.setItem(
      LOCAL_STORAGE_AUTHENTICATION_TOKEN_KEY,
      authToken.value
    )
  }

  const loadAuthenticationTokenFromLocalStorage = () => {
    const token = localStorage.getItem(LOCAL_STORAGE_AUTHENTICATION_TOKEN_KEY)

    authToken.value = token ?? undefined
  }

  return {
    authToken,

    isAuthenticated,
    tryAuthenticate,
  }
})
