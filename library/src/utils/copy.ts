export function deepCopy(object: any) {
  return JSON.parse(JSON.stringify(object));
}
