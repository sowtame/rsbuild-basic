import { RsbuildPlugin } from '@rsbuild/core'
import fs from 'fs'

const writeAssetsFile = (manifest) => {
  const outputFile = ''

  fs.writeFileSync(outputFile, manifest)
}

export const pluginAssets = (): RsbuildPlugin => ({
  name: 'sowtame:plugin-upload-dist',

  setup(api) {
    api.onDevCompileDone(({ stats }) => {
      // stats.toJson({ cachedAssets: false }).children[1].assets
    })
  },
})
