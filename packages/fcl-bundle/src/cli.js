#!/usr/bin/env node
const program = require("./program")
const getPackageJSON = require("./get-package-json")
const parsePackageJSON = require("./package-config")

const pkg = getPackageJSON()
const config = parsePackageJSON(pkg)

program(config)(pkg)
