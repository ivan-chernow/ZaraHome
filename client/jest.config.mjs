import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|webp|avif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};

export default createJestConfig(customJestConfig);


