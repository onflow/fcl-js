# Transitions

## 0001 Deprecate opts.httpRequest
- **Date:** Jun 24th 2022
- **Type:** Deprecation of `opts.httpRequest`

The prior implementation of `opts.httpRequest` is now deprecated and has been superseded by the passing of an axios instance instead via `opts.axiosInstance` if a user desires custom configuration for their HTTP transport.

Information describing how to create an axios instance may be found here: https://axios-http.com/docs/instance.