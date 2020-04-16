import * as CONFIG from "./config"

export const render = (_, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${CONFIG.NAME}</title>
        <link
          href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAAF0lEQVRIx2NgGAWjYBSMglEwCkbBSAcACBAAAeaR9cIAAAAASUVORK5CYII="
          rel="icon"
          type="image/x-icon"
        />
      </head>
      <body>
        <div id="Root"></div>
        <script type="module" src="/index.js"></script>
      </body>
    </html>
  `)
}
