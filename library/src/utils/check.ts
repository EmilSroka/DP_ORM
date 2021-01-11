export function parseType(el: number | string): string {
  return typeof el === 'number' ? `${el}` : `'${el}'`;
}
