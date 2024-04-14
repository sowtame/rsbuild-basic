import { renderToString } from 'react-dom/server'
import fs from 'fs'
import { App } from '../App'
import { AppManifest } from '../../rsbuild/plugins/asset-plugin'

export const serverRender = () => {
  const manifestString = fs.readFileSync(`${process.cwd()}/dist/static/app-manifest.json`, 'utf-8')

  const manifest: AppManifest = JSON.parse(manifestString)

  const markup = renderToString(<App />)

  return `<!DOCTYPE html>
  <html>
      <head>
      <title>Rsbuild custom server</title>
      ${manifest.css
        .map(({ path }) => {
          return `<link rel="stylesheet" href="${path}"/>`
        })
        .join('')}
      </head>
      <body>
          <div id="roo3131t">test332</div>
          <div id="root">
              ${markup}
              </div>
          </div>
          ${manifest.js
            .map(({ path }) => {
              return `<script defer src="${path}"></script>`
            })
            .join('')}
      </body>
  </html>
`
}
