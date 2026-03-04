"use client";

import { useMemo, useState, useCallback } from "react";
import { ArrowRightLeft, Copy, Check } from "lucide-react";
import Decimal from "decimal.js";
import {
  categories, convertUnit, DEFAULT_UNITS,
  getUnitsByCategory, parseToDecimal, UNIT_DESCRIPTIONS, QUICK_REFERENCE, QUICK_CONVERSIONS,
  type CategoryId, type UnitId, type UnitDefinition,
} from "@/lib/converter";

export default function Home() {
  const [category, setCategory] = useState<CategoryId>("pressure");
  const [inputValue, setInputValue] = useState("1");
  const [fromUnit, setFromUnit] = useState<UnitId>("bar");
  const [toUnit, setToUnit] = useState<UnitId>("psi");
  const [precision, setPrecision] = useState(10);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
    const f = fromUnit, t = toUnit;
    setFromUnit(t);
    setToUnit(f);
  };

  const handleQuickConversion = (q: typeof QUICK_CONVERSIONS[number]) => {
    setCategory(q.category);
    setFromUnit(q.fromId);
    setToUnit(q.toId);
  };

  const copyValue = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const fromDef = availableUnits.find(u => u.id === fromUnit);
  const toDef = availableUnits.find(u => u.id === toUnit);
  const refs = QUICK_REFERENCE[category] || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-5 lg:px-8 lg:py-6">

        {/* Header */}
        <header className="mb-5">
          <div className="flex items-baseline gap-3">
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight">Engineering Unit Converter</h1>
            <span className="text-[11px] text-slate-700">v2.0</span>
          </div>
          <p className="text-[13px] text-slate-500 mt-0.5">고정밀 SI 기반 공학용 단위 변환기</p>
        </header>

        {/* Category Tabs */}
        <nav className="mb-3 -mx-4 px-4 overflow-x-auto">
          <div className="flex gap-1 min-w-max pb-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id as CategoryId)}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition whitespace-nowrap border ${
                  category === cat.id
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Quick Conversions */}
        <div className="mb-4 flex items-center gap-2 overflow-x-auto text-xs pb-1">
          <span className="text-slate-600 shrink-0">Quick</span>
          {QUICK_CONVERSIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleQuickConversion(q)}
              className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-500 hover:text-emerald-400 hover:border-emerald-500/30 transition whitespace-nowrap shrink-0"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* ── Main Converter ── */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 lg:p-6 mb-3">
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 lg:gap-6 items-start">

            {/* Input */}
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Input</label>
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 px-4 py-3 rounded-lg text-xl font-mono outline-none focus:border-emerald-500 transition"
                placeholder="값 입력"
                autoFocus
              />
              <select
                value={fromUnit}
                onChange={e => setFromUnit(e.target.value as UnitId)}
                className="w-full mt-2 bg-slate-800 border border-slate-700 px-3 py-2 rounded-lg text-sm"
              >
                {availableUnits.map(u => (
                  <option key={u.id} value={u.id}>{u.symbol} — {u.name}</option>
                ))}
              </select>
              {UNIT_DESCRIPTIONS[fromUnit] && (
                <p className="mt-1 text-[11px] text-slate-600">{UNIT_DESCRIPTIONS[fromUnit]}</p>
              )}
            </div>

            {/* Swap */}
            <button
              onClick={handleSwap}
              className="self-center mt-7 p-2 rounded-full border border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/10 transition group"
              title="단위 교환"
            >
              <ArrowRightLeft size={18} className="text-slate-500 group-hover:text-emerald-400 transition" />
            </button>

            {/* Output */}
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Output</label>
              <div className="w-full bg-slate-950 border border-slate-700 px-4 py-3 rounded-lg min-h-[3.25rem] flex items-center justify-between gap-2">
                <span className="text-xl font-mono font-bold text-emerald-400 truncate">
                  {result ? fmt(result) : "\u2014"}
                </span>
                {result && (
                  <button
                    onClick={() => copyValue(fmt(result!), "main")}
                    className="shrink-0 p-1 rounded hover:bg-slate-800 transition"
                    title="결과 복사"
                  >
                    {copiedId === "main"
                      ? <Check size={16} className="text-emerald-400" />
                      : <Copy size={16} className="text-slate-600" />}
                  </button>
                )}
              </div>
              <select
                value={toUnit}
                onChange={e => setToUnit(e.target.value as UnitId)}
                className="w-full mt-2 bg-slate-800 border border-slate-700 px-3 py-2 rounded-lg text-sm"
              >
                {availableUnits.map(u => (
                  <option key={u.id} value={u.id}>{u.symbol} — {u.name}</option>
                ))}
              </select>
              {UNIT_DESCRIPTIONS[toUnit] && (
                <p className="mt-1 text-[11px] text-slate-600">{UNIT_DESCRIPTIONS[toUnit]}</p>
              )}
            </div>
          </div>

          {/* Formula + Precision */}
          <div className="mt-4 pt-3 border-t border-slate-800/50 flex flex-wrap items-center justify-between gap-3">
            {conversionFactor && fromDef && toDef && (
              <p className="text-sm font-mono text-slate-400">
                1 {fromDef.symbol} ={" "}
                <span className="text-emerald-400">{fmt(conversionFactor)}</span>{" "}
                {toDef.symbol}
              </p>
            )}
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <label htmlFor="precision-select">유효숫자</label>
              <select
                id="precision-select"
                value={precision}
                onChange={e => setPrecision(Number(e.target.value))}
                className="bg-slate-800 border border-slate-700 px-2 py-1 rounded text-xs"
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
          <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 lg:p-6 mb-3">
            <h2 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
              All Conversions
              {fromDef && (
                <span className="normal-case tracking-normal text-slate-600 ml-2">
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
                  className={`group cursor-pointer text-left px-3 py-2.5 rounded-lg border transition ${
                    unit.id === toUnit
                      ? "border-emerald-500/40 bg-emerald-500/10"
                      : unit.id === fromUnit
                        ? "border-slate-700/50 bg-slate-800/20 opacity-50"
                        : "border-slate-800 hover:border-slate-700 bg-slate-950/30"
                  }`}
                  title={UNIT_DESCRIPTIONS[unit.id] || unit.name}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`font-mono text-sm truncate ${
                        unit.id === toUnit ? "text-emerald-400 font-semibold" : "text-slate-200"
                      }`}
                    >
                      {fmt(value)}
                    </span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        copyValue(`${fmt(value)} ${unit.symbol}`, unit.id);
                      }}
                      className="shrink-0 opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-700 transition"
                      title={`${fmt(value)} ${unit.symbol} 복사`}
                    >
                      {copiedId === unit.id
                        ? <Check size={12} className="text-emerald-400" />
                        : <Copy size={12} className="text-slate-600" />}
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{unit.symbol}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Quick Reference ── */}
        {refs.length > 0 && (
          <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 lg:p-6 mb-3">
            <h2 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Quick Reference
              <span className="normal-case tracking-normal text-slate-600 ml-2">
                — {categories.find(c => c.id === category)?.label}
              </span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {refs.map((item, i) => (
                <div
                  key={i}
                  className="px-3 py-2 rounded-lg bg-slate-950/50 border border-slate-800/50 text-[13px] text-slate-400"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="pt-2 pb-4 text-center text-[11px] text-slate-700">
          Decimal.js 고정밀 연산 · SI 단위계 준거
        </footer>
      </div>
    </div>
  );
}
