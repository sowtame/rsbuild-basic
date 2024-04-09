import { JsStatsChunkGroupAsset } from '@rspack/binding'

type AppManifestFile = {
  path: string
}
export type AppManifest = {
  css: AppManifestFile[]
  js: AppManifestFile[]
}

export const getParsedAssets = (assets: JsStatsChunkGroupAsset[]) => {
  return assets.reduce<AppManifest>(
    (acc, asset) => {
      if (asset.name.includes('css')) {
        acc.css.push({
          path: asset.name,
        })
      }
      if (asset.name.includes('js')) {
        acc.js.push({
          path: asset.name,
        })
      }

      return acc
    },
    {
      css: [],
      js: [],
    }
  )
}
