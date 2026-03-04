/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState, useEffect } from "react";
import { ArrowLeftRight, BookOpen, Zap } from "lucide-react";
import {
  categories, convertUnit, DEFAULT_UNITS, formatDecimalForDisplay, getUnitLabel,
  getUnitsByCategory, parseToDecimal, UNIT_DESCRIPTIONS, QUICK_REFERENCE, QUICK_CONVERSIONS,
  type CategoryId, type UnitId,
} from "@/lib/converter";

export default function Home() {
  const [category, setCategory] = useState<CategoryId>("pressure");
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<UnitId>("bar");
  const [toUnit, setToUnit] = useState<UnitId>("psi");

  const availableUnits = useMemo(() => getUnitsByCategory(category), [category]);

  useEffect(() => {
    const defaults = DEFAULT_UNITS[category];
    if (defaults) {
      setFromUnit(defaults.from);
      setToUnit(defaults.to);
    }
  }, [category]);

  const result = useMemo(() => {
    const parsed = parseToDecimal(inputValue);
    if (!parsed) return null;
    try { return convertUnit(category, fromUnit, toUnit, parsed); } catch { return null; }
  }, [category, fromUnit, toUnit, inputValue]);

  const handleQuickConversion = (q: typeof QUICK_CONVERSIONS[number]) => {
    setCategory(q.category);
    setTimeout(() => {
      setFromUnit(q.fromId);
      setToUnit(q.toId);
    }, 0);
  };

  const referenceItems = QUICK_REFERENCE[category] || [];

  return (
    <div className="h-screen bg-slate-950 text-slate-50 p-4 lg:p-6 overflow-auto">
      <div className="max-w-7xl mx-auto flex flex-col h-full">
        {/* Header */}
        <header className="mb-4 flex-shrink-0">
          <h1 className="text-2xl lg:text-3xl font-bold">Engineering Unit Converter</h1>
          <p className="text-slate-500 text-sm">고정밀 SI 기반 공학용 단위 변환기</p>
        </header>

        {/* Main: Category + Converter */}
        <main className="grid lg:grid-cols-[280px_1fr] gap-4 flex-shrink-0">
          {/* Category */}
          <section className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <h2 className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Category</h2>
            <div className="grid grid-cols-3 lg:grid-cols-2 gap-1.5">
              {categories.map((cat) => (
                <button key={cat.id} onClick={() => setCategory(cat.id as CategoryId)} className={`px-2 py-1.5 rounded-lg border text-left transition ${category === cat.id ? 'border-emerald-500 bg-emerald-500/10 text-emerald-50' : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'}`}>
                  <div className="font-bold text-[11px]">{cat.label}</div>
                  <div className="text-[9px] opacity-50 truncate">{cat.description}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Converter */}
          <section className="bg-slate-900 p-4 lg:p-6 rounded-xl border border-slate-800">
            <div className="grid md:grid-cols-[1fr_auto_1fr] items-start gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500">INPUT</label>
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-lg outline-none focus:border-emerald-500 transition" />
                <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value as UnitId)} className="w-full bg-slate-800 p-1.5 rounded-lg text-xs">
                  {availableUnits.map(u => <option key={u.id} value={u.id}>{getUnitLabel(u)}</option>)}
                </select>
                {UNIT_DESCRIPTIONS[fromUnit] && (
                  <p className="text-[10px] text-slate-500 leading-snug">{UNIT_DESCRIPTIONS[fromUnit]}</p>
                )}
              </div>

              <ArrowLeftRight size={18} className="text-slate-600 mx-auto mt-8" />

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500">OUTPUT</label>
                <div className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-lg text-emerald-400 font-bold min-h-[3rem] flex items-center">
                  {result ? formatDecimalForDisplay(result) : "—"}
                </div>
                <select value={toUnit} onChange={(e) => setToUnit(e.target.value as UnitId)} className="w-full bg-slate-800 p-1.5 rounded-lg text-xs">
                  {availableUnits.map(u => <option key={u.id} value={u.id}>{getUnitLabel(u)}</option>)}
                </select>
                {UNIT_DESCRIPTIONS[toUnit] && (
                  <p className="text-[10px] text-slate-500 leading-snug">{UNIT_DESCRIPTIONS[toUnit]}</p>
                )}
              </div>
            </div>
          </section>
        </main>

        {/* Bottom: Reference + Quick Conversions side by side */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-4 mt-4 flex-1 min-h-0">
          {/* Quick Reference */}
          <section className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 mb-2">
              <BookOpen size={13} className="text-emerald-500" />
              <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quick Reference</h2>
              <span className="text-[10px] text-slate-600 ml-1">— {categories.find(c => c.id === category)?.label}</span>
            </div>
            <div className="space-y-1.5">
              {referenceItems.map((item, i) => (
                <div key={i} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2">
                  <span className="text-[11px] text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Conversions */}
          <section className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 mb-2">
              <Zap size={13} className="text-emerald-500" />
              <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">자주 쓰는 변환</h2>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {QUICK_CONVERSIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickConversion(q)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-left transition hover:border-emerald-500 hover:bg-emerald-500/5 group"
                >
                  <div className="text-[11px] font-bold text-slate-300 group-hover:text-emerald-400 transition">{q.label}</div>
                  <div className="text-[9px] text-slate-600">{categories.find(c => c.id === q.category)?.label}</div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-3 pb-1 text-center text-[10px] text-slate-700 flex-shrink-0">
          <p>Decimal.js 기반 고정밀 연산 · SI 단위계 준거</p>
        </footer>
      </div>
    </div>
  );
}
