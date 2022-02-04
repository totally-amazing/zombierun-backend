module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/.history/**',
    '!**/*.config.js',
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
};
