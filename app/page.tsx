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
          <p className="text-slate-300 text-base">고정밀 SI 기반 공학용 단위 변환기</p>
        </header>

        {/* Main: Category + Converter */}
        <main className="grid lg:grid-cols-[280px_1fr] gap-4 flex-shrink-0">
          {/* Category */}
          <section className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <h2 className="text-sm font-bold text-slate-300 mb-2 uppercase tracking-widest">Category</h2>
            <div className="grid grid-cols-3 lg:grid-cols-2 gap-1.5">
              {categories.map((cat) => (
                <button key={cat.id} onClick={() => setCategory(cat.id as CategoryId)} className={`px-3 py-2.5 rounded-lg border text-left transition ${category === cat.id ? 'border-emerald-500 bg-emerald-500/10 text-emerald-50' : 'border-slate-800 bg-slate-950 text-slate-200 hover:border-slate-700'}`}>
                  <div className="font-bold text-base">{cat.label}</div>
                  <div className="text-sm text-slate-400 truncate">{cat.description}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Converter */}
          <section className="bg-slate-900 p-4 lg:p-6 rounded-xl border border-slate-800">
            <div className="grid md:grid-cols-[1fr_auto_1fr] items-start gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300">INPUT</label>
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-2xl outline-none focus:border-emerald-500 transition" />
                <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value as UnitId)} className="w-full bg-slate-800 p-2.5 rounded-lg text-base">
                  {availableUnits.map(u => <option key={u.id} value={u.id}>{getUnitLabel(u)}</option>)}
                </select>
                {UNIT_DESCRIPTIONS[fromUnit] && (
                  <p className="text-sm text-slate-400 leading-relaxed">{UNIT_DESCRIPTIONS[fromUnit]}</p>
                )}
              </div>

              <ArrowLeftRight size={24} className="text-slate-400 mx-auto mt-8" />

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300">OUTPUT</label>
                <div className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-2xl text-emerald-400 font-bold min-h-[3rem] flex items-center">
                  {result ? formatDecimalForDisplay(result) : "—"}
                </div>
                <select value={toUnit} onChange={(e) => setToUnit(e.target.value as UnitId)} className="w-full bg-slate-800 p-2.5 rounded-lg text-base">
                  {availableUnits.map(u => <option key={u.id} value={u.id}>{getUnitLabel(u)}</option>)}
                </select>
                {UNIT_DESCRIPTIONS[toUnit] && (
                  <p className="text-sm text-slate-400 leading-relaxed">{UNIT_DESCRIPTIONS[toUnit]}</p>
                )}
              </div>
            </div>
          </section>
        </main>

        {/* Bottom: Reference + Quick Conversions side by side */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-4 mt-4 flex-1 min-h-0">
          {/* Quick Reference */}
          <section className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={18} className="text-emerald-500" />
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Quick Reference</h2>
              <span className="text-sm text-slate-400 ml-1">— {categories.find(c => c.id === category)?.label}</span>
            </div>
            <div className="space-y-1.5">
              {referenceItems.map((item, i) => (
                <div key={i} className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3">
                  <span className="text-base text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Conversions */}
          <section className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={18} className="text-emerald-500" />
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest">자주 쓰는 변환</h2>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {QUICK_CONVERSIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickConversion(q)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-left transition hover:border-emerald-500 hover:bg-emerald-500/5 group"
                >
                  <div className="text-base font-bold text-slate-200 group-hover:text-emerald-400 transition">{q.label}</div>
                  <div className="text-sm text-slate-400">{categories.find(c => c.id === q.category)?.label}</div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-3 pb-1 text-center text-sm text-slate-400 flex-shrink-0">
          <p>Decimal.js 기반 고정밀 연산 · SI 단위계 준거</p>
        </footer>
      </div>
    </div>
  );
}
