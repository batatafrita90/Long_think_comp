import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './web-app',
});

const config = createJestConfig({
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/',
  },
  moduleDirectories: ['node_modules', '<rootDir>/'],
});

export default config;

