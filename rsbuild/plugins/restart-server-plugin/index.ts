import { RsbuildPlugin } from '@rsbuild/core'

export const pluginRestartServer = (): RsbuildPlugin => ({
  name: 'sowtame:restart-server',

  setup(api) {
    api.onDevCompileDone(({ stats }) => {
      const a = stats.toJson()
      console.log(a)
    })
  },
})
