export function norm(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/[−–—]/g, "-")
    .replace(/∞/g, "inf")
    .replace(/\s+/g, "")
    .replace(/（/g, "(")
    .replace(/）/g, ")");
}

function parseNum(s: string): number | null {
  const t = s.trim().replace(/[−–—]/g, "-").replace(/,/g, "");
  if (/^[+-]?\d+(\.\d+)?$/.test(t)) return Number(t);
  const frac = t.match(/^([+-]?\d+)\s*\/\s*(\d+)$/);
  if (frac) {
    const den = Number(frac[2]);
    if (den === 0) return null;
    return Number(frac[1]) / den;
  }
  return null;
}

function closeEnough(input: number, target: number) {
  if (Number.isInteger(target)) return input === target;
  return Math.abs(input - target) <= 0.021;
}

export function isMatch(input: string, accept: string[]) {
  const n = norm(input);
  if (!n) return false;
  if (accept.some((item) => norm(item) === n)) return true;
  const x = parseNum(input);
  if (x == null || Number.isNaN(x)) return false;
  return accept.some((item) => {
    const y = parseNum(item);
    return y != null && closeEnough(x, y);
  });
}

export function allMatch(
  values: Record<string, string>,
  fields: { id: string; accept: string[] }[],
) {
  return fields.every((field) => isMatch(values[field.id] ?? "", field.accept));
}
