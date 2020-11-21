export function fmtFlow(balance) {
  if (balance == null) return "N/A"
  return String(Number(balance) / 100000000) + " FLOW"
}
