/* eslint-disable */
export default {
  displayName: 'examples-tic-tac-toe-view-model-implementation',
  preset: '../../../jest.preset.js',
  globals: {},
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../coverage/libs/examples/tic-tac-toe-view-model-implementation',
};
