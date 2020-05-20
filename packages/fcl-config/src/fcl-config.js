import os from "os"
import path from "path"
import fs from "fs"

const TARGET = "flow.json"
let CONFIG = null

function isDir(dir) {
  return fs.lstatSync(dir).isDirectory()
}

function listFiles(dir) {
  return new Set(fs.readdirSync(dir))
}

function parentDir(dir) {
  return path.dirname(dir)
}

function findTarget(dir) {
  if (!isDir(dir)) throw new Error(`Not a directory: ${dir}`)
  return listFiles(dir).has(TARGET) ? path.resolve(dir, TARGET) : null
}

function recSearch(dir) {
  const filePath = findTarget(dir)

  if (filePath == null) {
    if (dir === os.homedir()) throw new Error("No flow.json found")
    return recSearch(parentDir(dir))
  }

  CONFIG = JSON.parse(fs.readFileSync(filePath, "utf8"))
  return flowConfig()
}

export function flowConfig() {
  return CONFIG == null ? recSearch(process.cwd()) : CONFIG
}
