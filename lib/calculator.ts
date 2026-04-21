import { create, all, type MathJsInstance } from "mathjs";

const math: MathJsInstance = create(all, {
  number: "number",
  precision: 64,
});

export type AngleMode = "deg" | "rad";

/**
 * Translate display-friendly tokens into math.js-compatible syntax.
 * Display uses ×, ÷, −, π, ∛, eˣ-style for readability; math.js needs ASCII.
 */
export function translateExpression(expr: string): string {
  let s = expr;
  s = s.replace(/×/g, "*");
  s = s.replace(/÷/g, "/");
  s = s.replace(/−/g, "-");
  s = s.replace(/π/g, "pi");
  s = s.replace(/√/g, "sqrt");
  s = s.replace(/∛/g, "cbrt");
  // postfix % → /100 for the preceding number or parenthesised group
  s = s.replace(/(\d+(?:\.\d+)?|\))%/g, "($1/100)");
  return s;
}

const DEG = Math.PI / 180;

function buildScope(mode: AngleMode): Record<string, unknown> {
  if (mode === "rad") return {};
  return {
    sin: (x: number) => Math.sin(x * DEG),
    cos: (x: number) => Math.cos(x * DEG),
    tan: (x: number) => Math.tan(x * DEG),
    asin: (x: number) => Math.asin(x) / DEG,
    acos: (x: number) => Math.acos(x) / DEG,
    atan: (x: number) => Math.atan(x) / DEG,
    atan2: (y: number, x: number) => Math.atan2(y, x) / DEG,
  };
}

export function evaluateExpression(
  expr: string,
  angleMode: AngleMode
): number {
  const translated = translateExpression(expr);
  const scope = buildScope(angleMode);
  const result = math.evaluate(translated, scope);
  if (typeof result !== "number" || !Number.isFinite(result)) {
    throw new Error("non-finite");
  }
  return result;
}

/**
 * Format a numeric result for display.
 * Trims trailing zeros, uses scientific notation for very large/small values.
 */
export function formatResult(value: number, sigDigits = 12): string {
  if (value === 0) return "0";
  const abs = Math.abs(value);
  if (abs < 1e-9 || abs >= 1e15) {
    return value.toExponential(Math.min(sigDigits - 1, 10));
  }
  const fixed = value.toPrecision(sigDigits);
  if (fixed.includes(".") && !fixed.includes("e")) {
    return fixed.replace(/\.?0+$/, "");
  }
  return fixed;
}

/** Toggle the sign of the trailing number in a display expression. */
export function toggleLastSign(expr: string): string {
  if (!expr) return "-";
  const m = expr.match(/(-?)(\d+(?:\.\d+)?(?:e[+-]?\d+)?)$/i);
  if (m) {
    const head = expr.slice(0, m.index!);
    const sign = m[1];
    const num = m[2];
    return head + (sign ? num : "-" + num);
  }
  const last = expr[expr.length - 1];
  if ("+-×÷*/(^".includes(last)) return expr + "-";
  return "-(" + expr + ")";
}
