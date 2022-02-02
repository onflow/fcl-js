/**
 * @jest-environment jsdom
 */
 import { TextEncoder, TextDecoder } from 'util'
 window.TextEncoder = TextEncoder
 window.TextDecoder = TextDecoder

import {
  hex_to_utf8,
  hex_to_base64,
  utf8_to_base64,
  utf8_to_hex,
  base64_to_hex,
  base64_to_utf8,
} from "../util-string.js"

const UTF16_ALPHABET = " !\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[ ]^_\`abcdefghijklmnopqrstuvwxyz{|}~ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿĂăĄąĆćČčĎďĐđĘęĚěĹĺĽľŁłŃńŇňŐőŒœŔŕŘřŚśŞşŠšŢţŤťŮůŰűŸŹźŻżŽžƒˆˇ˘˙˛˜˝–—‘’‚“”„†‡•…‰‹›€™".split("")
const ASCII_ALPHABET = " !\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~".split("")

let TEST_STRING_MAX_LEN = 500
let TEST_STRING_MIN_LEN = 50

function _genUtf8String() {
  return Array.from({ length: Math.max(~~(Math.random() * TEST_STRING_MAX_LEN), TEST_STRING_MIN_LEN) })
    .map(() => UTF16_ALPHABET[Math.max(~~(Math.random() * UTF16_ALPHABET.length) - 1, 0)])
    .join("")
}

function _genBase64SafeUtf8String() {
  return Array.from({ length: Math.max(~~(Math.random() * TEST_STRING_MAX_LEN), TEST_STRING_MIN_LEN) })
    .map(() => ASCII_ALPHABET[Math.max(~~(Math.random() * ASCII_ALPHABET.length) - 1, 0)])
    .join("")
}

function _genBase64String() {
  return Buffer.from(_genBase64SafeUtf8String()).toString("base64")
}

function _genHexString() {
  return Buffer.from(_genBase64SafeUtf8String()).toString("hex")
}

describe("String Lib :: Browser", () => {
  test("README Example", () => {
    const test_string = "Flow Blockchain"
    expect(
        base64_to_utf8(
            utf8_to_base64(test_string)
        )
    ).toEqual(
        test_string
    )
  })

  Array.from({ length: 100 })
    .forEach(() => {
      let testStr = _genUtf8String()
      test(`utf8 -> hex :: input = ${testStr}`, () => {
        Array.from({ length: 100 })
          .forEach(() => {
            expect(
              utf8_to_hex(testStr)
            ).toEqual(
              Buffer.from(testStr).toString("hex")
            )
          })
      })
    })

  Array.from({ length: 100 })
    .forEach(() => {
      let testStr = _genBase64SafeUtf8String()
      test(`utf8 -> base64 :: input = ${testStr}`, () => {
        Array.from({ length: 100 })
          .forEach(() => {
            expect(
              utf8_to_base64(testStr)
            ).toEqual(
              Buffer.from(testStr).toString("base64")
            )
          })
      })
    })

  Array.from({ length: 100 })
    .forEach(() => {
      let testStr = _genHexString()
      test(`hex -> base64 :: input = ${testStr}`, () => {
        Array.from({ length: 100 })
          .forEach(() => {
            expect(
              hex_to_base64(testStr)
            ).toEqual(
              Buffer.from(testStr, "hex").toString("base64")
            )
          })
      })
    })

  Array.from({ length: 100 })
    .forEach(() => {
      let testStr = _genHexString()
      test(`hex -> utf8 :: input = ${testStr}`, () => {
        Array.from({ length: 100 })
          .forEach(() => {
            expect(
              hex_to_utf8(testStr)
            ).toEqual(
              Buffer.from(testStr, "hex").toString()
            )
          })
      })
    })

  Array.from({ length: 100 })
    .forEach(() => {
      let testStr = _genBase64String()
      test(`base64 -> hex :: input = ${testStr}`, () => {
        Array.from({ length: 100 })
          .forEach(() => {
            expect(
              base64_to_hex(testStr)
            ).toEqual(
              Buffer.from(testStr, "base64").toString("hex")
            )
          })
      })
    })

  Array.from({ length: 100 })
    .forEach(() => {
      let testStr = _genBase64String()
      test(`base64 -> utf8 :: input = ${testStr}`, () => {
        Array.from({ length: 100 })
          .forEach(() => {
            expect(
              base64_to_utf8(testStr)
            ).toEqual(
              Buffer.from(testStr, "base64").toString()
            )
          })
      })
    })
})
