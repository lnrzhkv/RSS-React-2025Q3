/** @type {import('jest').Config} */
const config = {
  verbose: false,
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  rootDir: '.',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverage: true,
  coverageDirectory: '.coverage',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};
export default config;
