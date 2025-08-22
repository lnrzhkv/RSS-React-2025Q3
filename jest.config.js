import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const customConfig = {
  roots: ['<rootDir>/src'],

  testEnvironment: 'jest-environment-jsdom',

  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts',
    '<rootDir>/src/setupTests.ts',
  ],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
  },

  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/test/',
  ],

  transformIgnorePatterns: [
    '/node_modules/(?!(next-intl)/)',
  ],

  collectCoverage: true,
  coverageDirectory: '.coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};

export default createJestConfig(customConfig);
