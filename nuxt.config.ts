import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  ssr: true,

  modules: [
    '@nuxthub/core',
    'nuxt-auth-utils',
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
  ],

  hub: {
    database: true,
  },

  nitro: {
    preset: 'cloudflare-pages',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },

  typescript: {
    strict: true,
  },

  fonts: {
    families: [
      { name: 'Plus Jakarta Sans', provider: 'google' },
    ],
  },

  icon: {
    collections: ['ph'],
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-06-17',
})
