import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-04-17',
  experimental: {
    clientNodeCompat: true,
  },
  modules: [
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
  ],
  components: false,
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBaseUrl: '',
      bridgeUrl: '',
    },
  },
  vite: {
    server: {
      allowedHosts: ['telegram-mini-app.local'],
    },
    plugins: [tailwindcss()],
  },
  fonts: {
    families: [
      {
        name: 'Montserrat',
        provider: 'google',
      },
    ],
  },
  ssr: false,
})
