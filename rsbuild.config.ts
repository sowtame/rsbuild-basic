import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginRestartServer } from './rsbuild/plugins/restart-server-plugin'
import { pluginAssets } from './rsbuild/plugins/asset-plugin'

export default defineConfig({
  source: {
    entry({ target }) {
      if (target === 'web') {
        return {
          index: './src/index.tsx',
        }
      }
      if (target === 'node') {
        return {
          index: './src/server/index',
        }
      }
    },
  },
  plugins: [pluginReact(), pluginAssets()],
  output: {
    targets: ['node', 'web'],
  },
  performance: {
    chunkSplit: {
      strategy: 'split-by-module',
    },
  },
  server: {},
  dev: {
    writeToDisk: true,
    // setupMiddlewares: [
    //   (middleware) => {
    //     middleware.unshift(app)
    //   },
    // ],
  },
  // tools: {
  //   htmlPlugin: false,
  // },
})
