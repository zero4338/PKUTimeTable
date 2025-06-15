import path from 'path';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';

export default {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
    },
  ],
  plugins: [
    new WebpackPlugin({
      mainConfig: path.resolve(__dirname, './webpack.main.config.js'),
      renderer: {
        config: path.resolve(__dirname, './webpack.renderer.config.js'),
        entryPoints: [
          {
            name: 'main_window',
            html: path.resolve(__dirname, './src/renderer/index.html'),
            js: path.resolve(__dirname, './src/renderer/index.tsx'),
            preload: {
              js: path.resolve(__dirname, './src/preload.ts'),
            },
          },
        ],
      },
    }),
  ],
};