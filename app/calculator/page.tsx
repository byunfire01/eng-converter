"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftRight, Calculator, Check, Copy, Globe, Moon, Sun, Trash2,
} from "lucide-react";
import {
  evaluateExpression, formatResult, toggleLastSign,
  type AngleMode,
} from "@/lib/calculator";
import { type Locale, UI } from "@/lib/i18n";

type HistoryEntry = { expr: string; result: string };

const MAX_HISTORY = 5;

export default function CalculatorPage() {
  const [expr, setExpr] = useState("");
  const [angleMode, setAngleMode] = useState<AngleMode>("deg");
  const [memory, setMemory] = useState(0);
  const [ans, setAns] = useState<number | null>(null);
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copied, setCopied] = useState<"expr" | "result" | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [locale, setLocale] = useState<Locale>("en");
  const exprScrollRef = useRef<HTMLDivElement>(null);

  /* ─── Persistence: theme ─── */
  useEffect(() => {
    const saved = localStorage.getItem("eng-converter-theme");
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("eng-converter-theme", theme);
  }, [theme]);

  /* ─── Persistence: locale ─── */
  useEffect(() => {
    const saved = localStorage.getItem("eng-converter-lang");
    if (saved === "ko" || saved === "en") setLocale(saved);
    else {
      const browserLang = navigator.language || "";
      setLocale(browserLang.startsWith("ko") ? "ko" : "en");
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("eng-converter-lang", locale);
    document.documentElement.lang = locale;
  }, [locale]);

  /* ─── Persistence: angle mode & memory ─── */
  useEffect(() => {
    const savedMode = localStorage.getItem("eng-calc-angle");
    if (savedMode === "deg" || savedMode === "rad") setAngleMode(savedMode);
    const savedMem = localStorage.getItem("eng-calc-memory");
    if (savedMem) {
      const n = Number(savedMem);
      if (Number.isFinite(n)) setMemory(n);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("eng-calc-angle", angleMode);
  }, [angleMode]);
  useEffect(() => {
    localStorage.setItem("eng-calc-memory", String(memory));
  }, [memory]);

  const t = useCallback((k: string) => UI[locale]?.[k] ?? k, [locale]);

  /* ─── Auto-scroll display to the right as user types (mobile-friendly) ─── */
  useEffect(() => {
    if (exprScrollRef.current) {
      exprScrollRef.current.scrollLeft = exprScrollRef.current.scrollWidth;
    }
  }, [expr]);

  /* ─── Live preview of result ─── */
  const livePreview = useMemo(() => {
    if (!expr.trim()) return null;
    try {
      return evaluateExpression(expr, angleMode);
    } catch {
      return null;
    }
  }, [expr, angleMode]);

  /* ─── Button handlers ─── */
  // After `=`, a digit/dot starts a new expression; an operator continues from the result.
  const insert = useCallback((snippet: string) => {
    const startsFresh = justEvaluated && /^[0-9.]/.test(snippet);
    setJustEvaluated(false);
    setExpr(prev => (startsFresh ? snippet : prev + snippet));
  }, [justEvaluated]);

  const backspace = useCallback(() => {
    setJustEvaluated(false);
    setExpr(prev => prev.slice(0, -1));
  }, []);

  const clearAll = useCallback(() => {
    setJustEvaluated(false);
    setExpr("");
  }, []);

  const equals = useCallback(() => {
    if (!expr.trim()) return;
    try {
      const r = evaluateExpression(expr, angleMode);
      const formatted = formatResult(r);
      setAns(r);
      setHistory(h => [{ expr, result: formatted }, ...h].slice(0, MAX_HISTORY));
      setExpr(formatted);
      setJustEvaluated(true);
    } catch {
      /* leave expr; error shown via livePreview === null */
    }
  }, [expr, angleMode]);

  const insertAns = useCallback(() => {
    if (ans === null) return;
    setJustEvaluated(false);
    setExpr(prev => prev + formatResult(ans));
  }, [ans]);

  const toggleSign = useCallback(() => {
    setJustEvaluated(false);
    setExpr(prev => toggleLastSign(prev));
  }, []);

  /* ─── Memory ops ─── */
  const memClear = () => setMemory(0);
  const memRecall = () => insert(formatResult(memory));
  const memAdd = () => { if (livePreview !== null) setMemory(m => m + livePreview); };
  const memSub = () => { if (livePreview !== null) setMemory(m => m - livePreview); };

  /* ─── Keyboard input ─── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Skip if focus is in an input/textarea
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      const k = e.key;
      if (k === "Enter" || k === "=") { e.preventDefault(); equals(); return; }
      if (k === "Backspace") { e.preventDefault(); backspace(); return; }
      if (k === "Escape") { e.preventDefault(); clearAll(); return; }
      if (k === "Delete") { e.preventDefault(); clearAll(); return; }
      if (/^[0-9.()+\-*/^!%]$/.test(k)) {
        e.preventDefault();
        const map: Record<string, string> = { "*": "×", "/": "÷", "-": "−" };
        insert(map[k] ?? k);
        return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [equals, backspace, clearAll, insert]);

  const copy = (text: string, id: "expr" | "result") => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const displayResult = livePreview !== null ? formatResult(livePreview) : null;
  const hasError = expr.trim().length > 0 && livePreview === null;

  /* ─── Button groups ─── */
  const sciButtons: { label: string; insert?: string; onClick?: () => void; title?: string }[][] = [
    [
      { label: "sin", insert: "sin(" },
      { label: "cos", insert: "cos(" },
      { label: "tan", insert: "tan(" },
      { label: "π", insert: "π" },
      { label: "e", insert: "e" },
    ],
    [
      { label: "sin⁻¹", insert: "asin(" },
      { label: "cos⁻¹", insert: "acos(" },
      { label: "tan⁻¹", insert: "atan(" },
      { label: "log", insert: "log10(", title: "log₁₀" },
      { label: "ln", insert: "log(", title: "ln (natural log)" },
    ],
    [
      { label: "x²", insert: "^2" },
      { label: "xʸ", insert: "^" },
      { label: "√", insert: "√(" },
      { label: "∛", insert: "∛(" },
      { label: "n!", insert: "!" },
    ],
    [
      { label: "1/x", insert: "1/" },
      { label: "|x|", insert: "abs(" },
      { label: "10ˣ", insert: "10^" },
      { label: "eˣ", insert: "e^" },
      { label: "+/−", onClick: () => toggleSign() },
    ],
  ];

  const basicButtons: { label: string; insert?: string; onClick?: () => void; variant?: "op" | "eq" | "fn" }[][] = [
    [
      { label: "AC", onClick: clearAll, variant: "fn" },
      { label: "⌫", onClick: backspace, variant: "fn" },
      { label: "(", insert: "(" },
      { label: ")", insert: ")" },
      { label: "%", insert: "%", variant: "op" },
    ],
    [
      { label: "7", insert: "7" },
      { label: "8", insert: "8" },
      { label: "9", insert: "9" },
      { label: "÷", insert: "÷", variant: "op" },
      { label: "×", insert: "×", variant: "op" },
    ],
    [
      { label: "4", insert: "4" },
      { label: "5", insert: "5" },
      { label: "6", insert: "6" },
      { label: "−", insert: "−", variant: "op" },
      { label: "+", insert: "+", variant: "op" },
    ],
    [
      { label: "1", insert: "1" },
      { label: "2", insert: "2" },
      { label: "3", insert: "3" },
      { label: "Ans", onClick: insertAns, variant: "fn" },
      { label: "=", onClick: equals, variant: "eq" },
    ],
    [
      { label: "0", insert: "0" },
      { label: ".", insert: "." },
    ],
  ];

  const btnBase =
    "h-12 sm:h-11 rounded-lg text-sm font-medium transition border flex items-center justify-center select-none active:scale-95";
  const btnNormal =
    `${btnBase} bg-[var(--bg-subtle)] border-[var(--border)] text-[var(--text)] hover:border-[var(--border-input)] hover:bg-[var(--bg-elevated)] active:bg-[var(--accent-bg)]`;
  const btnOp =
    `${btnBase} bg-[var(--bg-elevated)] border-[var(--border-input)] text-[var(--accent)] hover:bg-[var(--accent-bg)]`;
  const btnEq =
    `${btnBase} bg-[var(--accent)] border-transparent text-white font-bold hover:opacity-90`;
  const btnFn =
    `${btnBase} bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--text-sub)] hover:text-[var(--text)] hover:border-[var(--border-input)]`;
  const btnSci =
    `${btnBase} bg-[var(--bg-subtle)] border-[var(--border)] text-[var(--text-sub)] hover:text-[var(--accent)] hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)] font-mono`;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-5 lg:px-8 lg:py-5">

        {/* Header */}
        <header className="mb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-baseline gap-3">
              <h1 className="text-xl lg:text-2xl font-bold tracking-tight">{t("calcTitle")}</h1>
              <span className="text-[11px] text-[var(--text-faint)]">v3.0</span>
            </div>
            <p className="text-[13px] text-[var(--text-sub)] mt-0.5">{t("calcSubtitle")}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap sm:justify-end">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 min-h-10 rounded-lg border border-[var(--border)] text-[var(--text-sub)] hover:text-[var(--text)] hover:border-[var(--border-input)] transition text-xs font-medium whitespace-nowrap"
              title={t("navConverter")}
            >
              <ArrowLeftRight size={14} />
              <span>{t("navConverter")}</span>
            </Link>
            <div
              className="flex items-center gap-1.5 px-3 min-h-10 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-bg)] text-xs font-medium whitespace-nowrap"
              title={t("navCalculator")}
            >
              <Calculator size={14} className="text-[var(--accent)]" />
              <span className="text-[var(--accent)]">{t("navCalculator")}</span>
            </div>
            <button
              onClick={() => setLocale(l => (l === "ko" ? "en" : "ko"))}
              className="flex items-center gap-1.5 px-3 min-h-10 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-bg)] hover:bg-[var(--accent)] hover:text-white transition whitespace-nowrap"
              title={t("langToggle")}
            >
              <Globe size={15} className="text-[var(--accent)]" />
              <span className="text-[var(--accent)] text-xs font-semibold">{t("langToggle")}</span>
            </button>
            <button
              onClick={() => setTheme(th => (th === "dark" ? "light" : "dark"))}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--border)] hover:border-[var(--accent-border)] transition"
              title={t("themeToggle")}
            >
              {theme === "dark"
                ? <Sun size={18} className="text-[var(--text-sub)]" />
                : <Moon size={18} className="text-[var(--text-sub)]" />}
            </button>
          </div>
        </header>

        {/* Display — sticky so it stays visible while scrolling to tap the numpad on mobile */}
        <section className="sticky top-0 z-10 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 lg:p-5 mb-3 transition-colors shadow-lg shadow-black/10 sm:shadow-none">
          <div className="flex items-center justify-between mb-2 gap-2">
            <label className="text-[11px] font-semibold text-[var(--text-sub)] uppercase tracking-wider">
              {t("calcExpression")}
            </label>
            <div className="flex items-center gap-1.5">
              {memory !== 0 && (
                <span className="text-[11px] px-2 min-h-8 flex items-center rounded bg-[var(--accent-bg)] text-[var(--accent)] font-semibold">
                  M
                </span>
              )}
              <button
                onClick={() => setAngleMode(m => (m === "deg" ? "rad" : "deg"))}
                className="text-xs px-3 min-h-9 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-bg)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition font-mono font-bold whitespace-nowrap"
                title={t("calcAngleToggle")}
              >
                {angleMode === "deg" ? t("calcAngleDeg") : t("calcAngleRad")}
              </button>
            </div>
          </div>
          <div className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg px-3 py-3 min-h-[3.5rem] flex items-center justify-between gap-2">
            <div
              ref={exprScrollRef}
              className="flex-1 min-w-0 overflow-x-auto whitespace-nowrap text-lg lg:text-xl font-mono [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
            >
              {expr || <span className="text-[var(--text-faint)]">{t("calcEmpty")}</span>}
            </div>
            {expr && (
              <button
                onClick={() => copy(expr, "expr")}
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded hover:bg-[var(--bg-elevated)] transition"
                title={t("calcCopyExpr")}
              >
                {copied === "expr"
                  ? <Check size={16} className="text-[var(--accent)]" />
                  : <Copy size={16} className="text-[var(--text-dim)]" />}
              </button>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0 min-h-[2rem] flex items-center justify-end overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
              {hasError ? (
                <span className="text-sm text-red-400 font-mono">{t("calcError")}</span>
              ) : displayResult !== null ? (
                <span className="text-2xl lg:text-3xl font-mono font-bold text-[var(--accent)] whitespace-nowrap">
                  = {displayResult}
                </span>
              ) : (
                <span className="text-[var(--text-faint)]">&nbsp;</span>
              )}
            </div>
            {displayResult !== null && !hasError && (
              <button
                onClick={() => copy(displayResult, "result")}
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded hover:bg-[var(--bg-elevated)] transition"
                title={t("copyResult")}
              >
                {copied === "result"
                  ? <Check size={16} className="text-[var(--accent)]" />
                  : <Copy size={16} className="text-[var(--text-dim)]" />}
              </button>
            )}
          </div>
        </section>

        {/* Memory row */}
        <section className="grid grid-cols-5 gap-1.5 mb-3">
          <button className={btnFn} onClick={memClear} title="Memory Clear">MC</button>
          <button className={btnFn} onClick={memRecall} title="Memory Recall">MR</button>
          <button className={btnFn} onClick={memAdd} title="Memory Add">M+</button>
          <button className={btnFn} onClick={memSub} title="Memory Subtract">M−</button>
          <button className={btnFn} onClick={insertAns} title="Last answer">Ans</button>
        </section>

        {/* Main pad: scientific + basic */}
        <section className="grid lg:grid-cols-[1fr_1fr] gap-3 mb-3">
          {/* Scientific */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 transition-colors">
            <div className="grid grid-cols-5 gap-1.5">
              {sciButtons.flat().map((b, i) => (
                <button
                  key={i}
                  onClick={() => (b.onClick ? b.onClick() : b.insert && insert(b.insert))}
                  className={btnSci}
                  title={b.title ?? b.label}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Basic */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 transition-colors">
            <div className="grid grid-cols-5 gap-1.5">
              {basicButtons.flat().map((b, i) => {
                const cls =
                  b.variant === "eq" ? btnEq
                  : b.variant === "op" ? btnOp
                  : b.variant === "fn" ? btnFn
                  : btnNormal;
                const extra =
                  b.label === "0" ? "col-span-3"
                  : b.label === "." ? "col-span-2"
                  : "";
                return (
                  <button
                    key={i}
                    onClick={() => (b.onClick ? b.onClick() : b.insert && insert(b.insert))}
                    className={`${cls} ${extra}`}
                  >
                    {b.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* History */}
        {history.length > 0 && (
          <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 lg:p-5 mb-3 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[11px] font-semibold text-[var(--text-sub)] uppercase tracking-wider">
                {t("calcHistory")}
              </h2>
              <button
                onClick={() => setHistory([])}
                className="flex items-center gap-1 px-2 min-h-8 rounded text-[11px] text-[var(--text-dim)] hover:text-[var(--accent)] hover:bg-[var(--hover-bg)] transition"
                title={t("calcClearHistory")}
              >
                <Trash2 size={12} />
                <span>{t("calcClearHistory")}</span>
              </button>
            </div>
            <div className="space-y-1.5">
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => setExpr(h.expr)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] hover:border-[var(--border-input)] transition flex items-center justify-between gap-3"
                >
                  <span className="font-mono text-sm text-[var(--text-sub)] truncate">{h.expr}</span>
                  <span className="font-mono text-sm text-[var(--accent)] font-semibold shrink-0">= {h.result}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="pt-2 pb-3 text-center text-[11px] text-[var(--text-faint)]">
          <p>{t("footer")}</p>
          <p className="mt-1">{locale === "ko" ? "Designed by 변영덕" : "Designed by DANIEL BYUN"}</p>
        </footer>
      </div>
    </div>
  );
}
