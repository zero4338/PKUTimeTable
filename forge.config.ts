import path from 'path';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { MakerZIP } from '@electron-forge/maker-zip';

export default {
  packagerConfig: {
    extraResources: [
      {
        from: 'vendor/chrome',
        to: 'chrome',
      },
    ],
  },
  rebuildConfig: {},
  makers: [
    new MakerZIP({}, ['win32', 'linux']),
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