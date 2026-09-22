module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    moduleNameMapper: {
        '\\.(png|jpg|webp|ttf|woff|woff2|svg|mp4)$': 'identity-obj-proxy',
        '\\.(css)$': 'identity-obj-proxy', 
    },
};
  