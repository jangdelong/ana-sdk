
export function logger (tag) {
  return function (...msg) {
    console.log(`%c${tag}`, 'color:#bada55;background:#222', ...msg)
  }
}
