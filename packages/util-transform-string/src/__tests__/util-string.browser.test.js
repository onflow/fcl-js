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
  
  const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789".split("")
  let TEST_STRING_MAX_LEN = 50
  let TEST_STRING_MIN_LEN = 5
  
  function _genUtf8String() {
    return Array.from({ length: Math.max(~~(Math.random() * TEST_STRING_MAX_LEN), TEST_STRING_MIN_LEN) })
      .map(() => ALPHABET[Math.max(~~(Math.random() * ALPHABET.length) - 1, 0)])
      .join("")
  }
  
  function _genBase64String() {
    return Buffer.from(_genUtf8String()).toString("base64")
  }
  
  function _genHexString() {
    return Buffer.from(_genUtf8String()).toString("hex")
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

    test("utf8 -> hex", () => {
      Array.from({ length: 100 })
        .forEach(() => {
          let testStr = _genUtf8String()
          expect(
            utf8_to_hex(testStr)
          ).toEqual(
            Buffer.from(testStr).toString("hex")
          )
        })
    })
  
    test("utf8 -> base64", () => {
      Array.from({ length: 100 })
        .forEach(() => {
          let testStr = _genUtf8String()
          expect(
            utf8_to_base64(testStr)
          ).toEqual(
            Buffer.from(testStr).toString("base64")
          )
        })
    })
  
    test("hex -> base64", () => {
      Array.from({ length: 100 })
        .forEach(() => {
          let testStr = _genHexString()
          expect(
            hex_to_base64(testStr)
          ).toEqual(
            Buffer.from(testStr, "hex").toString("base64")
          )
        })
    })
  
    test("hex -> utf8", () => {
      Array.from({ length: 100 })
        .forEach(() => {
          let testStr = _genHexString()
          expect(
            hex_to_utf8(testStr)
          ).toEqual(
            Buffer.from(testStr, "hex").toString()
          )
        })
    })
  
    test("base64 -> hex", () => {
      Array.from({ length: 100 })
        .forEach(() => {
          let testStr = _genBase64String()
          expect(
            base64_to_hex(testStr)
          ).toEqual(
            Buffer.from(testStr, "base64").toString("hex")
          )
        })
    })
  
    test("base64 -> utf8", () => {
      Array.from({ length: 100 })
        .forEach(() => {
          let testStr = _genBase64String()
          expect(
            base64_to_utf8(testStr)
          ).toEqual(
            Buffer.from(testStr, "base64").toString()
          )
        })
    })
  })
  