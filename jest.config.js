/** @type {import("jest").Config} */
export default {
  testEnvironment: "node",

  transform: {
    "^.+\\.tsx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "typescript",
            decorators: true,
            dynamicImport: true
          },
          target: "es2022",
          transform: {
            decoratorMetadata: true
          }
        },
        module: {
          type: "es6"
        }
      }
    ]
  },

  extensionsToTreatAsEsm: [".ts"],

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  moduleFileExtensions: ["ts", "js", "json"],

  testMatch: ["**/Test/**/*.test.ts"],

  setupFilesAfterEnv: ["<rootDir>/Test/setup.ts"],

  clearMocks: true,
  restoreMocks: true,
  verbose: true,
};