module.exports = {
     testEnvironment: 'jsdom',
     setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
     moduleNameMapper: {
       '^@/components/(.*)$': '<rootDir>/components/$1',
       '^@/styles/(.*)$': '<rootDir>/styles/$1',
       '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
     },
     transform: {
       '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
     },
   };