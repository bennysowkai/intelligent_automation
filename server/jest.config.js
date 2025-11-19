export default {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js'
  ],
  transform: {},
  testMatch: [
    '**/__tests__/**/*.test.js'
  ]
};
