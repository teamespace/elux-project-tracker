import { createConfigForNuxt as withNuxt } from '@nuxt/eslint-config/flat'

export default withNuxt({}, {
  rules: {
    'vue/multi-word-component-names': 'off',
  },
})
