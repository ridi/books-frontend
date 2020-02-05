const presets = [
  [
    'next/babel',
    {
      'preset-env': {
        exclude: process.env.NODE_ENV === 'test' ? ['transform-classes'] : undefined, // jest class invoke 'new' related
        useBuiltIns: 'entry',
        corejs: 3,
      },
    },
  ],
  ['@emotion/babel-preset-css-prop', { autoLabel: true, labelFormat: '[local]' }],
];

const plugins = [
  ['emotion', { inline: true }],
  [
    /*
    tsconfig 의 paths 는 IDE & tsc 에서만 경로를 도와주고
    실제 Next.js 빌드 시에는 경로를 제대로 찾지 못하는 문제가 있음
    다음 플러그인을 사용해서 사용하려는 상대 경로를 추가해야 한다.
    https://github.com/tleunen/babel-plugin-module-resolver
    */
    'module-resolver',
    {
      root: ['./'],
      alias: {
        src: './src',
        server: './server',
      },
      extensions: ['.js', '.ts', '.tsx'],
    },
  ],
  '@babel/plugin-proposal-optional-chaining',
  '@babel/plugin-proposal-nullish-coalescing-operator',
];

module.exports = { plugins, presets };
