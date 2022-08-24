const path = require("path")
const fs = require("fs")
const URL = require("url").URL
const request = require("request")
const {exit} = require("process")

const LINK_REGEXP = /\[([^\]]*)\]\(([^\)]*)\)/g
const HEADING_REGEXP = /^#{1,6}(.*)$/
const rootPath = path.resolve(process.cwd(), process.argv[2])

let setHeadingsDone
const headingsPromise = new Promise(resolve => (setHeadingsDone = resolve))
const headings = []

const verifyPromises = []

walk(rootPath, rootPath, file => {
  const filePath = path.resolve(process.cwd(), rootPath, file)
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err)
        return
      }
      const lines = data.toString().split("\n")
      lines.forEach((line, idx) => {
        // Extract headings from line
        extractHeadings(line, filePath)

        const re = cloneRegex(LINK_REGEXP)
        let m
        while ((m = re.exec(line))) {
          const {index} = m
          const match = [...m]
          const i = idx + 1,
            j = index
          verifyPromises.push({
            i,
            j,
            filePath,
            link: match[0],
            p: verifyLink(match, filePath),
          })
        }
      })
      resolve()
    })
  })
}).then(async () => {
  setHeadingsDone()

  const results = await Promise.all(
    verifyPromises.map(async o => ({...o, p: await o.p}))
  )
  const failed = results.filter(r => !r.p)

  if (failed.length === 0) {
    console.log("All links are good!")
    exit(0)
  } else {
    console.error(
      `Resolving ${failed.length} markdown links have failed.  See more below:\n\n`
    )
    failed.forEach(res => {
      console.error(
        `Failed resolving link "${res.link}" at ${res.filePath}:${res.i}:${res.j}.\n`
      )
    })
    exit(1)
  }
})

async function verifyLink(match, filePath) {
  const [markdown, text, link] = match
  if (stringIsAValidUrl(link)) {
    try {
      return verifyURL(link)
    } catch (e) {
      return false
    }
  } else {
    await headingsPromise
    const [relativeLink, anchor] = link.split("#")
    const absoluteLink = path.resolve(relativeLink, filePath)
    if (!anchor) {
      return fs.existsSync(absoluteLink)
    } else {
      const headingPath = `${absoluteLink}#${anchor}`
      return headings.includes(headingPath)
    }
  }
}

function extractHeadings(line, filePath) {
  const headingMatch = line.match(HEADING_REGEXP)
  if (headingMatch) {
    const baseHeadingAnchor = headingMatch[1]
      .toLowerCase()
      .trim()
      .replace(LINK_REGEXP, match => {
        return match[1]
      })
      .replace(/\s+/g, "-")
      .replace(/[^\w-]*/g, "")

    const getHeadingPath = i =>
      `${filePath}#${baseHeadingAnchor}${i !== 0 ? `-${i}` : ""}`

    let i
    for (i = 0; headings.includes(getHeadingPath(i)); i++) {}
    headings.push(getHeadingPath(i))
  }
}

async function verifyURL(url, attempt = 0) {
  try {
    const options = {
      url,
      method: "GET",
      followAllRedirects: true,
    }

    const result = await new Promise(resolve => {
      request(options)
        .on("response", res => {
          if (res.statusCode === 404) resolve(false)
          else if (res.statusCode === 200) resolve(true)
          else reject("Unrecognized status code " + res.statusCode)
        })
        .on("error", err => {
          reject(err)
        })
    })

    return result
  } catch (e) {
    if (attempt > 5) throw new Error(`Error making http request to ${url}`)

    console.log("Request failed, retrying in 1000ms...")

    await new Promise(resolve =>
      setTimeout(() => {
        resolve()
      }, 1000)
    )

    return verifyURL(url, attempt + 1)
  }
}

const stringIsAValidUrl = s => {
  try {
    new URL(s)
    return true
  } catch (err) {
    return false
  }
}

function cloneRegex(input) {
  var pattern = input.source
  return new RegExp(pattern, input.flags)
}

function walk(p, root, callback) {
  return new Promise((resolve, reject) => {
    fs.readdir(p, (err, files) => {
      if (err) {
        reject(err)
        return
      }
      Promise.all(
        files.map(
          async f =>
            new Promise(async (_resolve, _reject) => {
              const file = path.resolve(root, p, f)
              fs.lstat(file, (err, stats) => {
                if (err) {
                  _reject(err)
                  return
                }
                if (stats.isFile()) {
                  if (![".md", ".mdx"].includes(path.extname(file))) {
                    _resolve()
                    return
                  }
                  callback(path.resolve(root, file)).then(_resolve)
                } else if (stats.isDirectory()) {
                  walk(path.resolve(root, file), root, callback).then(_resolve)
                }
              })
            })
        )
      ).then(resolve)
    })
  })
}
