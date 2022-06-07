module.exports = {
  presets: [
    [
      '@vue/app',
      {
        useBuiltIns: 'entry'
      }
    ],
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: "3.6.5"
      }
    ]
  ],
  plugins: [
    "@babel/plugin-proposal-nullish-coalescing-operator",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-class-properties"
  ]
}
