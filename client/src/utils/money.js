export function formatPaise(paise) {
  return `₹${(paise / 100).toLocaleString('en-IN')}`
}
