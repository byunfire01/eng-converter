"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { ArrowRightLeft, Copy, Check, Sun, Moon, Globe, Calculator } from "lucide-react";
import Decimal from "decimal.js";
import {
  categories, convertUnit, DEFAULT_UNITS,
  getUnitsByCategory, parseToDecimal, QUICK_CONVERSIONS,
  type CategoryId, type UnitId, type UnitDefinition,
} from "@/lib/converter";
import {
  type Locale, UI, CATEGORY_LABELS, CATEGORY_DESCRIPTIONS,
  UNIT_DESCRIPTIONS_I18N, QUICK_REFERENCE_I18N,
} from "@/lib/i18n";

export default function Home() {
  const [category, setCategory] = useState<CategoryId>("pressure");
  const [inputValue, setInputValue] = useState("1");
  const [fromUnit, setFromUnit] = useState<UnitId>("bar");
  const [toUnit, setToUnit] = useState<UnitId>("psi");
  const [precision, setPrecision] = useState(10);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [locale, setLocale] = useState<Locale>("en");

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
    if (saved === "ko" || saved === "en") {
      setLocale(saved);
    } else {
      const browserLang = navigator.language || "";
      setLocale(browserLang.startsWith("ko") ? "ko" : "en");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("eng-converter-lang", locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const toggleTheme = () => setTheme(t => (t === "dark" ? "light" : "dark"));
  const toggleLocale = () => setLocale(l => (l === "ko" ? "en" : "ko"));
  const t = useCallback((key: string) => UI[locale]?.[key] ?? key, [locale]);
  const desc = useCallback((unitId: string) => UNIT_DESCRIPTIONS_I18N[locale]?.[unitId] ?? "", [locale]);

  const availableUnits = useMemo(() => getUnitsByCategory(category), [category]);
  const parsed = useMemo(() => parseToDecimal(inputValue), [inputValue]);

  const result = useMemo(() => {
    if (!parsed) return null;
    try { return convertUnit(category, fromUnit, toUnit, parsed); } catch { return null; }
  }, [category, fromUnit, toUnit, parsed]);

  const conversionFactor = useMemo(() => {
    try { return convertUnit(category, fromUnit, toUnit, new Decimal(1)); } catch { return null; }
  }, [category, fromUnit, toUnit]);

  const allConversions = useMemo(() => {
    if (!parsed) return [];
    return availableUnits.map(u => {
      try { return { unit: u, value: convertUnit(category, fromUnit, u.id, parsed) }; }
      catch { return null; }
    }).filter((x): x is { unit: UnitDefinition; value: Decimal } => x !== null);
  }, [category, fromUnit, parsed, availableUnits]);

  const fmt = useCallback((v: Decimal) => v.toSignificantDigits(precision).toString(), [precision]);

  const handleCategoryChange = (newCat: CategoryId) => {
    if (newCat === category) return;
    setCategory(newCat);
    const d = DEFAULT_UNITS[newCat];
    if (d) { setFromUnit(d.from); setToUnit(d.to); }
  };

  const handleSwap = () => {
    const f = fromUnit, tt = toUnit;
    setFromUnit(tt); setToUnit(f);
  };

  const handleQuickConversion = (q: typeof QUICK_CONVERSIONS[number]) => {
    setCategory(q.category);
    setFromUnit(q.fromId); setToUnit(q.toId);
  };

  const copyValue = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const fromDef = availableUnits.find(u => u.id === fromUnit);
  const toDef = availableUnits.find(u => u.id === toUnit);
  const refs = QUICK_REFERENCE_I18N[locale]?.[category] || [];
  const catLabel = (id: string) => CATEGORY_LABELS[locale]?.[id] ?? id;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-5 lg:px-8 lg:py-5">

        {/* Header */}
        <header className="mb-4 flex items-start justify-between">
          <div>
            <div className="flex items-baseline gap-3">
              <h1 className="text-xl lg:text-2xl font-bold tracking-tight">{t("title")}</h1>
              <span className="text-[11px] text-[var(--text-faint)]">v3.0</span>
            </div>
            <p className="text-[13px] text-[var(--text-sub)] mt-0.5">{t("subtitle")}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <div
              className="flex items-center gap-1.5 px-3 min-h-10 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-bg)] text-xs font-medium whitespace-nowrap"
              title={t("navConverter")}
            >
              <ArrowRightLeft size={14} className="text-[var(--accent)]" />
              <span className="text-[var(--accent)]">{t("navConverter")}</span>
            </div>
            <Link
              href="/calculator"
              className="flex items-center gap-1.5 px-3 min-h-10 rounded-lg border border-[var(--border)] text-[var(--text-sub)] hover:text-[var(--text)] hover:border-[var(--border-input)] transition text-xs font-medium whitespace-nowrap"
              title={t("navCalculator")}
            >
              <Calculator size={14} />
              <span>{t("navCalculator")}</span>
            </Link>
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-3 min-h-10 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-bg)] hover:bg-[var(--accent)] hover:text-white transition whitespace-nowrap"
              title={t("langToggle")}
            >
              <Globe size={15} className="text-[var(--accent)]" />
              <span className="text-[var(--accent)] text-xs font-semibold">{t("langToggle")}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--border)] hover:border-[var(--accent-border)] transition"
              title={t("themeToggle")}
            >
              {theme === "dark"
                ? <Sun size={18} className="text-[var(--text-sub)]" />
                : <Moon size={18} className="text-[var(--text-sub)]" />}
            </button>
          </div>
        </header>

        {/* Category Tabs */}
        <nav className="mb-4 -mx-4 px-4 overflow-x-auto pt-1">
          <div className="flex gap-1 min-w-max pb-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id as CategoryId)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition whitespace-nowrap border ${
                  category === cat.id
                    ? "bg-[var(--accent-bg)] text-[var(--accent)] border-[var(--accent-border)]"
                    : "text-[var(--text-sub)] hover:text-[var(--text)] hover:bg-[var(--hover-bg)] border-transparent"
                }`}
              >
                {catLabel(cat.id)}
              </button>
            ))}
          </div>
        </nav>

        {/* Quick Conversions */}
        <div className="mb-4 flex items-center gap-2 overflow-x-auto text-sm pb-1">
          <span className="text-[var(--text-dim)] shrink-0">{t("quick")}</span>
          {QUICK_CONVERSIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleQuickConversion(q)}
              className="px-2.5 py-1 rounded bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-sub)] hover:text-[var(--accent)] hover:border-[var(--accent-border)] transition whitespace-nowrap shrink-0"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* ── Main Converter ── */}
        <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 lg:p-5 mb-3 transition-colors">
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 lg:gap-6 items-start">

            {/* Input */}
            <div>
              <label className="text-[11px] font-semibold text-[var(--text-sub)] uppercase tracking-wider block mb-1">{t("input")}</label>
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] px-4 py-2.5 rounded-lg text-xl font-mono outline-none focus:border-[var(--accent)] transition"
                placeholder={t("placeholder")}
                autoFocus
              />
              <select
                value={fromUnit}
                onChange={e => setFromUnit(e.target.value as UnitId)}
                className="w-full mt-2 bg-[var(--bg-elevated)] border border-[var(--border-input)] px-3 py-2.5 rounded-lg text-base"
              >
                {availableUnits.map(u => (
                  <option key={u.id} value={u.id}>{u.symbol} — {u.name}</option>
                ))}
              </select>
              {desc(fromUnit) && (
                <p className="mt-2 text-sm text-[var(--text-dim)]">{desc(fromUnit)}</p>
              )}
            </div>

            {/* Swap */}
            <button
              onClick={handleSwap}
              className="self-center mt-7 p-2 rounded-full border border-[var(--border-input)] hover:border-[var(--accent)] hover:bg-[var(--accent-bg)] transition group"
              title={t("swap")}
            >
              <ArrowRightLeft size={18} className="text-[var(--text-sub)] group-hover:text-[var(--accent)] transition" />
            </button>

            {/* Output */}
            <div>
              <label className="text-[11px] font-semibold text-[var(--text-sub)] uppercase tracking-wider block mb-1">{t("output")}</label>
              <div className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] px-4 py-2.5 rounded-lg min-h-[2.75rem] flex items-center justify-between gap-2">
                <span className="text-xl font-mono font-bold text-[var(--accent)] truncate">
                  {result ? fmt(result) : "\u2014"}
                </span>
                {result && (
                  <button
                    onClick={() => copyValue(fmt(result!), "main")}
                    className="shrink-0 p-1 rounded hover:bg-[var(--bg-elevated)] transition"
                    title={t("copyResult")}
                  >
                    {copiedId === "main"
                      ? <Check size={16} className="text-[var(--accent)]" />
                      : <Copy size={16} className="text-[var(--text-dim)]" />}
                  </button>
                )}
              </div>
              <select
                value={toUnit}
                onChange={e => setToUnit(e.target.value as UnitId)}
                className="w-full mt-2 bg-[var(--bg-elevated)] border border-[var(--border-input)] px-3 py-2.5 rounded-lg text-base"
              >
                {availableUnits.map(u => (
                  <option key={u.id} value={u.id}>{u.symbol} — {u.name}</option>
                ))}
              </select>
              {desc(toUnit) && (
                <p className="mt-2 text-sm text-[var(--text-dim)]">{desc(toUnit)}</p>
              )}
            </div>
          </div>

          {/* Formula + Precision */}
          <div className="mt-3 pt-2 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
            {conversionFactor && fromDef && toDef && (
              <p className="text-sm font-mono text-[var(--text-sub)]">
                1 {fromDef.symbol} ={" "}
                <span className="text-[var(--accent)]">{fmt(conversionFactor)}</span>{" "}
                {toDef.symbol}
              </p>
            )}
            <div className="flex items-center gap-2 text-xs text-[var(--text-dim)]">
              <label htmlFor="precision-select">{t("precision")}</label>
              <select
                id="precision-select"
                value={precision}
                onChange={e => setPrecision(Number(e.target.value))}
                className="bg-[var(--bg-elevated)] border border-[var(--border-input)] px-2 min-h-8 rounded text-base sm:text-xs"
              >
                {[6, 8, 10, 12, 15].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* ── All Conversions ── */}
        {allConversions.length > 0 && (
          <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 lg:p-5 mb-3 transition-colors">
            <h2 className="text-[11px] font-semibold text-[var(--text-sub)] uppercase tracking-wider mb-2">
              {t("allConversions")}
              {fromDef && (
                <span className="normal-case tracking-normal text-[var(--text-dim)] ml-2">
                  — {inputValue} {fromDef.symbol}
                </span>
              )}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              {allConversions.map(({ unit, value }) => (
                <div
                  key={unit.id}
                  onClick={() => setToUnit(unit.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setToUnit(unit.id); }}
                  className={`group cursor-pointer text-left px-3 py-2 rounded-lg border transition ${
                    unit.id === toUnit
                      ? "border-[var(--accent-border)] bg-[var(--accent-bg)]"
                      : unit.id === fromUnit
                        ? "border-[var(--border)] bg-[var(--bg-subtle)] opacity-50"
                        : "border-[var(--border)] hover:border-[var(--border-input)] bg-[var(--bg-subtle)]"
                  }`}
                  title={desc(unit.id) || unit.name}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className={`font-mono text-base truncate ${
                      unit.id === toUnit ? "text-[var(--accent)] font-semibold" : ""
                    }`}>
                      {fmt(value)}
                    </span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        copyValue(`${fmt(value)} ${unit.symbol}`, unit.id);
                      }}
                      className="shrink-0 opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-[var(--bg-elevated)] transition"
                      title={`${fmt(value)} ${unit.symbol} ${t("copyUnit")}`}
                    >
                      {copiedId === unit.id
                        ? <Check size={12} className="text-[var(--accent)]" />
                        : <Copy size={12} className="text-[var(--text-dim)]" />}
                    </button>
                  </div>
                  <div className="text-sm text-[var(--text-sub)] mt-1">{unit.symbol}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Quick Reference ── */}
        {refs.length > 0 && (
          <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 lg:p-5 mb-3 transition-colors">
            <h2 className="text-[11px] font-semibold text-[var(--text-sub)] uppercase tracking-wider mb-2">
              {t("quickReference")}
              <span className="normal-case tracking-normal text-[var(--text-dim)] ml-2">
                — {catLabel(category)}
              </span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {refs.map((item, i) => (
                <div
                  key={i}
                  className="px-3 py-2 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] text-[13px] text-[var(--text-sub)]"
                >
                  {item}
                </div>
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
