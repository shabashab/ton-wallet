// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-04-17',
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxt/icon', '@nuxt/eslint'],
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBaseUrl: '',
    },
  },
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  build: {
    transpile: ['@api-def/provider-http'],
  },
  ssr: false,
})
