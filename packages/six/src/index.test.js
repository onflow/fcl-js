import { SEND_FLOW_TOKEN } from "./index"
const crypto = require('crypto');

const generateHash = async (message) => {
    return crypto.createHash('sha256').update(message).digest('hex');
}

test("SEND_FLOW_TOKEN hash is correct", async () => {
    expect(await generateHash(SEND_FLOW_TOKEN.code)).toBe(SEND_FLOW_TOKEN.hash)
})
  