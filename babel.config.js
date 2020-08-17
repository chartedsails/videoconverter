module.exports = {
  presets: [
    [
      "@babel/preset-env",
      // Required for async to work in the electron process
      {
        targets: {
          esmodules: true,
        },
      },
    ],
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
}
