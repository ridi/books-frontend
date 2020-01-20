module.exports = {
  setupFiles: ['<rootDir>/src/tests/setup.js'],
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/types/**/*',
    '!**/__test__/*.*',
    '!**/_document.tsx',
    '!**/utils/sentry.ts',
  ],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
    '\\.(jpg|png|webp|ico|ttf|otf|woff|woff2)$': '<rootDir>/src/tests/__mocks__/fileMock.ts',
    '\\.svg': '<rootDir>/src/tests/__mocks__/svgrMock.tsx',
  },
  coveragePathIgnorePatterns: ['/node_modules/', '/cypress/'],
  testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
  moduleDirectories: ['node_modules'],
};
