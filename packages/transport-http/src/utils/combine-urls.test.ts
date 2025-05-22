import {combineURLs} from "./combine-urls"

describe("combineUrls", () => {
  test("base url (no slash, no path), relative url (no slash)", () => {
    const baseURL = "https://example.com"
    const relativeURL = "users"
    const combinedURL = combineURLs(baseURL, relativeURL)
    expect(combinedURL).toBe("https://example.com/users")
  })

  test("base url (no slash, no path), relative url (with slash)", () => {
    const baseURL = "https://example.com"
    const relativeURL = "/users"
    const combinedURL = combineURLs(baseURL, relativeURL)
    expect(combinedURL).toBe("https://example.com/users")
  })

  test("base url (no slash, with path), relative url (no slash)", () => {
    const baseURL = "https://example.com/api"
    const relativeURL = "/users"
    const combinedURL = combineURLs(baseURL, relativeURL)
    expect(combinedURL).toBe("https://example.com/api/users")
  })

  test("base url (no slash, with path), relative url (with slash)", () => {
    const baseURL = "https://example.com/api"
    const relativeURL = "/users"
    const combinedURL = combineURLs(baseURL, relativeURL)
    expect(combinedURL).toBe("https://example.com/api/users")
  })

  test("base url (with slash, no path), relative url (no slash)", () => {
    const baseURL = "https://example.com/"
    const relativeURL = "users"
    const combinedURL = combineURLs(baseURL, relativeURL)
    expect(combinedURL).toBe("https://example.com/users")
  })

  test("base url (with slash, no path), relative url (with slash)", () => {
    const baseURL = "https://example.com/"
    const relativeURL = "/users"
    const combinedURL = combineURLs(baseURL, relativeURL)
    expect(combinedURL).toBe("https://example.com/users")
  })

  test("base url (with slash, with path), relative url (no slash)", () => {
    const baseURL = "https://example.com/api/"
    const relativeURL = "users"
    const combinedURL = combineURLs(baseURL, relativeURL)
    expect(combinedURL).toBe("https://example.com/api/users")
  })

  test("base url (with slash, with path), relative url (with slash)", () => {
    const baseURL = "https://example.com/api/"
    const relativeURL = "/users"
    const combinedURL = combineURLs(baseURL, relativeURL)
    expect(combinedURL).toBe("https://example.com/api/users")
  })

  test("base url (with slash, with path), relative url (with slash)", () => {
    const baseURL = "https://example.com/api/"
    const relativeURL = "/users"
    const combinedURL = combineURLs(baseURL, relativeURL)
    expect(combinedURL).toBe("https://example.com/api/users")
  })

  test("base url, no relative url", () => {
    const baseURL = "https://example.com/api"
    const combinedURL = combineURLs(baseURL)
    expect(combinedURL).toBe("https://example.com/api")
  })
})
