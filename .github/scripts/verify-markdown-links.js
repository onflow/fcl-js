const path = require("path")
const fs = require("fs")
const URL = require("url").URL
const request = require("request")
const {exit} = require("process")

const LINK_REGEXP = /\[([^\]]*)\]\(([^\)]*)\)/g
const HEADING_REGEXP = /^#{1,6}(.*)$/
const rootPath = path.resolve(process.cwd(), process.argv[2])

// Promise to resolve when all files have been crawled for headings/existance and setter for promise
let setFilesDone
const filesPromise = new Promise(resolve => (setFilesDone = resolve))

const files = {}

const verifyPromises = []

walk(rootPath, rootPath, file => {
  const filePath = path.resolve(process.cwd(), rootPath, file)
  return new Promise((resolve, reject) => {
    // Register file path
    files[filePath] = {headings: []}

    // Abort parsing file if not markdown
    if (![".md", ".mdx"].includes(path.extname(file))) {
      resolve()
      return
    }

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
            p: verifyLink(match[2]),
          })
        }
      })
      resolve()
    })
  })
}).then(async () => {
  setFilesDone()

  const results = await Promise.all(
    verifyPromises.map(async o => {
      let p, error
      try {
        p = await o.p
      } catch (e) {
        error = e
        p = false
      }

      return {
        ...o,
        p,
        error: error,
      }
    })
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
        `Failed resolving link "${res.link}" at ${res.filePath}:${res.i}:${
          res.j
        }.\n${res.error ? `${res.error}\n` : ""}`
      )
    })
    exit(1)
  }
})

async function verifyLink(link) {
  if (stringIsAValidUrl(link)) {
    const res = await verifyURL(link)
    console.log(res, link)
    return res
  } else {
    // Wait for all files to be resolved before verifying link
    await filesPromise

    // Split link into anchor and base
    const [relativeLink, anchor] = link.split("#")

    // Translate link into absolute link for lookup
    const absoluteLink = path.resolve(relativeLink, link)

    // Parse link info
    const {dir, base, ext} = path.parse(absoluteLink)

    if (ext && [".mdx", ".md"].includes(ext)) {
      throw new Error(
        "Linking to markdown files with extension provided is not supported by docs site.  Please remove .md/.mdx extension and try again " +
          absoluteLink +
          " " +
          ext
      )
    }

    // Resolve target file priority queue => name/index.mdx > name/index.md > name.mdx > name.md
    const attempts = ["/index.mdx", "/index.md", ".mdx", ".md"]
    while (attempts.length > 0) {
      const suffix = attempts.shift()
      const resolveAttempt = path.join(dir, base) + suffix

      if (Object.keys(files).includes(resolveAttempt)) {
        if (!anchor) return true
        else {
          return headings.includes(anchor)
        }
      }
    }
    return false
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

    const getHeadingPath = i => `${baseHeadingAnchor}${i !== 0 ? `-${i}` : ""}`

    let i
    for (i = 0; files[filePath].headings.includes(getHeadingPath(i)); i++) {}
    files[filePath].headings.push(getHeadingPath(i))
  }
}

async function verifyURL(url, attempt = 0) {
  try {
    const options = {
      url,
      method: "GET",
      followAllRedirects: true,
    }

    const result = await new Promise((resolve, reject) => {
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
