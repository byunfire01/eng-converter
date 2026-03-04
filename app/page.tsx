/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState, useEffect } from "react";
import { Activity, ArrowLeftRight, Beaker, Bolt, Droplets, Gauge, Hammer, Ruler, Square, Thermometer, Timer, Weight, Wind, Zap } from "lucide-react";
import { categories, convertUnit, DEFAULT_UNITS, formatDecimalForDisplay, getUnitLabel, getUnitsByCategory, parseToDecimal, type CategoryId, type UnitId } from "@/lib/converter";

export default function Home() {
  const [category, setCategory] = useState<CategoryId>("pressure");
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<UnitId>("Pa");
  const [toUnit, setToUnit] = useState<UnitId>("bar");

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold">Engineering Unit Converter</h1>
          <p className="text-slate-400 mt-2">고정밀 SI 기반 공학용 단위 변환기</p>
        </header>

        <main className="grid lg:grid-cols-[1fr_1.5fr] gap-8">
          <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h2 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-widest">Category</h2>
            <div className="grid grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button key={cat.id} onClick={() => setCategory(cat.id as CategoryId)} className={`p-3 rounded-xl border text-left transition ${category === cat.id ? 'border-emerald-500 bg-emerald-500/10 text-emerald-50' : 'border-slate-800 bg-slate-950 text-slate-400'}`}>
                  <div className="font-bold text-xs">{cat.label}</div>
                  <div className="text-[10px] opacity-60 truncate">{cat.description}</div>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-slate-900 p-8 rounded-2xl border border-slate-800 flex flex-col gap-8">
            <div className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">INPUT</label>
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-xl outline-none focus:border-emerald-500" />
                <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value as UnitId)} className="w-full bg-slate-800 p-2 rounded-lg text-sm">
                  {availableUnits.map(u => <option key={u.id} value={u.id}>{getUnitLabel(u)}</option>)}
                </select>
              </div>

              <ArrowLeftRight className="text-slate-600 mx-auto" />

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">OUTPUT</label>
                <div className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-xl text-emerald-400 font-bold min-h-[4rem]">
                  {result ? formatDecimalForDisplay(result) : "—"}
                </div>
                <select value={toUnit} onChange={(e) => setToUnit(e.target.value as UnitId)} className="w-full bg-slate-800 p-2 rounded-lg text-sm">
                  {availableUnits.map(u => <option key={u.id} value={u.id}>{getUnitLabel(u)}</option>)}
                </select>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}