#!/usr/bin/env node
const program = require("./program")
const getPackageJSON = require("./get-package-json")
const parsePackageJSON = require("./package-config")

const package = getPackageJSON()
const config = parsePackageJSON(package)

program(config)(package)
