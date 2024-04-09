import { renderToString } from 'react-dom/server'
import { Request } from 'express'
import fs from 'fs'
import { App } from '../App'
import { AppManifest } from '../../rsbuild/plugins/asset-plugin'

export const serverRender = (req: Request, res, next) => {
  const manifestString = fs.readFileSync(`${process.cwd()}/dist/static/app-manifest.json`, 'utf-8')

  const manifest: AppManifest = JSON.parse(manifestString)

  const markup = renderToString(<App />)

  res.statusCode = 200
  res.setHeader('Content-type', 'text/html')
  res.write('<!DOCTYPE html>')
  res.write('<html>')

  res.write(`<head>`)
  {
    manifest.css.map(({ path }) => {
      res.write(`<link rel="stylesheet" href="${path}"/>`)
    })
  }
  res.write(`</head>`)

  // res.write(`<head>${linkTags}</head><body>`)
  res.write(`<div id="root">${markup}</div>`)

  // res.write(scriptTags)

  {
    manifest.js.map(({ path }) => {
      res.write(`<script async data-chunk="main" src="${path}"></script>`)
    })
  }
  // res.write('<script async data-chunk="main" src="http://localhost:8080/static/index.js"></script>')
  res.write('</body></html>')
  res.send()

  next()
}
