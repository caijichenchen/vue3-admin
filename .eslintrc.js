module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      tsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended', // 添加 prettier 插件
  ],
  rules: {
    // js/ts
    '@typescript-eslint/no-var-requires': 0,
    'eol-last': 'error', // 结尾语句换行符
    'no-trailing-spaces': 'error', // 禁用行尾空格
    'comma-style': ['error', 'last'], // 强制使用一致的逗号风格
    'comma-dangle': ['error', 'always-multiline'], // 要求或禁止末尾逗号
    quotes: [
      'error',
      'single',
      { avoidEscape: true, allowTemplateLiterals: true },
    ], // 强制使用一致的反勾号、双引号或单引号
    camelcase: ['error', { properties: 'never' }],
    semi: ['error', 'never'],
    // indent: ['error', 2, { SwitchCase: 2, offsetTernaryExpressions: true }],
    indent: 0,
    // '@typescript-eslint/indent': ['error', 12],
    // '@typescript-eslint/indent': ['error'],
    'object-curly-spacing': ['error', 'always'],
    'arrow-parens': ['error', 'always'], // argument 括号
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: false,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: true,
        },
      },
    ],
    // vue
    'vue/no-v-html': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 10,
        multiline: 1,
      },
    ],
    'vue/require-default-prop': 'off',
    'vue/html-closing-bracket-spacing': 'error',
  },
}
