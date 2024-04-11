import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
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
  dev: {
    writeToDisk: true,
  },
  tools: {
    htmlPlugin: false,
  },
})
