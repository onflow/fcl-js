import {mailbox as genMailbox} from "./"

test("send and receive", async () => {
  const m = genMailbox()
  m.deliver("TEST")
  expect(await m.receive()).toBe("TEST")
})

test("first in -- first out", async () => {
  const m = genMailbox()
  const msgx = ["A", "B", "C", "D", "E", "F"]
  for (let msg of msgx) m.deliver(msg)
  for (let msg of msgx) expect(await m.receive()).toBe(msg)
})

test("many mailboxes", async () => {
  const m1 = genMailbox()
  const m2 = genMailbox()
  const m3 = genMailbox()
  const m4 = genMailbox()

  const m1x = ["A", "B", "C"]
  const m2x = ["1", "2", "3"]
  const m3x = ["X", "Y", "Z"]
  const m4x = ["7", "8", "9"]

  for (let msg of m1x) m1.deliver(msg)
  for (let msg of m2x) m2.deliver(msg)
  for (let msg of m3x) m3.deliver(msg)
  for (let msg of m4x) m4.deliver(msg)

  for (let msg of m1x) expect(await m1.receive()).toBe(msg)
  for (let msg of m2x) expect(await m2.receive()).toBe(msg)
  for (let msg of m3x) expect(await m3.receive()).toBe(msg)
  for (let msg of m4x) expect(await m4.receive()).toBe(msg)
})
