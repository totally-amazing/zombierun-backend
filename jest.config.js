module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['**/*.js', '!**/node_modules/**', '!**/coverage/**'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
};
