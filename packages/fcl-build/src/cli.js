#!/usr/bin/env node
const program = require("./program")
const getPackageJSON = require("./get-package-json")
const config = require("./package-config")

const packageJSON = getPackageJSON()
const packageConfig = config(packageJSON)

program(packageConfig)(packageJSON)
