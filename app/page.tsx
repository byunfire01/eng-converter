/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowLeftRight,
  Beaker,
  Bolt,
  Droplets,
  Gauge,
  Hammer,
  Ruler,
  Square,
  Thermometer,
  Timer,
  Weight,
  Wind,
  Zap,
} from "lucide-react";
import Decimal from "decimal.js";
import {
  categories,
  convertUnit,
  DEFAULT_UNITS,
  formatDecimalForDisplay,
  getUnitLabel,
  getUnitsByCategory,
  parseToDecimal,
  type CategoryId,
  type UnitId,
} from "@/lib/converter";

function getDefaultUnits(category: CategoryId): { from: UnitId; to: UnitId } {
  return DEFAULT_UNITS[category];
}

export default function Home() {
  const [category, setCategory] = useState<CategoryId>("pressure");
  const [inputValue, setInputValue] = useState<string>("1");

  const [fromUnit, setFromUnit] = useState<UnitId>("Pa");
  const [toUnit, setToUnit] = useState<UnitId>("bar");

  const availableUnits = useMemo(
    () => getUnitsByCategory(category),
    [category],
  );

  // 카테고리가 바뀌면 기본 단위 묶음으로 리셋
  useMemo(() => {
    const defaults = getDefaultUnits(category);
    setFromUnit(defaults.from);
    setToUnit(defaults.to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const parsedInput = useMemo(() => parseToDecimal(inputValue), [inputValue]);

  const result = useMemo(() => {
    if (!parsedInput) return null;
    try {
      const value = new Decimal(parsedInput);
      const converted = convertUnit(category, fromUnit, toUnit, value);
      return converted;
    } catch {
      return null;
    }
  }, [category, fromUnit, toUnit, parsedInput]);

  const activeCategoryMeta = categories.find((c) => c.id === category);

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 antialiased">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* 헤더 */}
        <header className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Engineering Unit Converter
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300 sm:text-base">
              고정밀 Decimal 연산과 SI 기반 아키텍처를 사용하는 공학용 단위 변환기입니다.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-xs text-slate-300 sm:text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800/80">
              <Bolt className="h-4 w-4 text-amber-300" />
            </div>
            <div>
              <div className="font-medium text-slate-100">
                SI Base · Decimal.js
              </div>
              <div className="text-[11px] text-slate-400 sm:text-xs">
                입력 단위 → SI 기준 단위 → 출력 단위 파이프라인
              </div>
            </div>
          </div>
        </header>

        <main className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.5fr)]">
          {/* 카테고리 / 정보 패널 */}
          <section className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.85)] sm:p-5">
            <h2 className="mb-1 text-sm font-medium uppercase tracking-[0.15em] text-slate-400">
              CATEGORY
            </h2>
            <div className="grid gap-3 min-[480px]:grid-cols-2 lg:grid-cols-3">
              <CategoryTab
                id="pressure"
                label="압력"
                description="압력 단위 변환"
                icon={<Gauge className="h-4 w-4" />}
                active={category === "pressure"}
                onClick={() => setCategory("pressure")}
              />
              <CategoryTab
                id="viscosity"
                label="점도"
                description="동점성계수"
                icon={<Droplets className="h-4 w-4" />}
                active={category === "viscosity"}
                onClick={() => setCategory("viscosity")}
              />
              <CategoryTab
                id="kinematicViscosity"
                label="동점도"
                description="m²/s, St, cSt"
                icon={<Activity className="h-4 w-4" />}
                active={category === "kinematicViscosity"}
                onClick={() => setCategory("kinematicViscosity")}
              />
              <CategoryTab
                id="energy"
                label="에너지 / 일"
                description="에너지, 열량"
                icon={<Bolt className="h-4 w-4" />}
                active={category === "energy"}
                onClick={() => setCategory("energy")}
              />
              <CategoryTab
                id="length"
                label="길이"
                description="선형 치수 변환"
                icon={<Ruler className="h-4 w-4" />}
                active={category === "length"}
                onClick={() => setCategory("length")}
              />
              <CategoryTab
                id="mass"
                label="질량 / 무게"
                description="질량 및 중량 단위"
                icon={<Weight className="h-4 w-4" />}
                active={category === "mass"}
                onClick={() => setCategory("mass")}
              />
              <CategoryTab
                id="volume"
                label="부피"
                description="유체 및 용적 단위"
                icon={<Beaker className="h-4 w-4" />}
                active={category === "volume"}
                onClick={() => setCategory("volume")}
              />
              <CategoryTab
                id="temperature"
                label="온도"
                description="K, °C, °F 온도 변환"
                icon={<Thermometer className="h-4 w-4" />}
                active={category === "temperature"}
                onClick={() => setCategory("temperature")}
              />
              <CategoryTab
                id="area"
                label="면적"
                description="토지 및 평면 면적 단위"
                icon={<Square className="h-4 w-4" />}
                active={category === "area"}
                onClick={() => setCategory("area")}
              />
              <CategoryTab
                id="power"
                label="동력 / 일률"
                description="전력 및 마력 단위"
                icon={<Zap className="h-4 w-4" />}
                active={category === "power"}
                onClick={() => setCategory("power")}
              />
              <CategoryTab
                id="force"
                label="힘 / 하중"
                description="하중 및 힘 단위"
                icon={<Hammer className="h-4 w-4" />}
                active={category === "force"}
                onClick={() => setCategory("force")}
              />
              <CategoryTab
                id="speed"
                label="속도"
                description="유체 및 차량 속도"
                icon={<Timer className="h-4 w-4" />}
                active={category === "speed"}
                onClick={() => setCategory("speed")}
              />
              <CategoryTab
                id="flowRate"
                label="유량"
                description="송풍기 및 펌프 유량"
                icon={<Wind className="h-4 w-4" />}
                active={category === "flowRate"}
                onClick={() => setCategory("flowRate")}
              />
            </div>

            <div className="mt-3 rounded-2xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-xs text-slate-300 sm:text-sm">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 sm:text-[12px]">
                  ACTIVE CATEGORY
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-300 ring-1 ring-emerald-500/40">
                  High Precision
                </span>
              </div>
              <div className="mt-2 text-sm font-medium text-slate-50 sm:text-base">
                {activeCategoryMeta?.label}
              </div>
              <div className="mt-1 text-xs text-slate-400 sm:text-[13px]">
                {activeCategoryMeta?.description}
              </div>
            </div>
          </section>

          {/* 변환기 패널 */}
          <section className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.90)] sm:p-5">
            <h2 className="mb-2 text-sm font-medium uppercase tracking-[0.15em] text-slate-400">
              CONVERTER
            </h2>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_auto_minmax(0,1.2fr)] md:items-center">
              {/* 입력 */}
              <div className="space-y-3">
                <label className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                  INPUT
                </label>
                <div className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2.5 shadow-inner shadow-slate-950/40">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full bg-transparent text-lg font-semibold text-slate-50 outline-none placeholder:text-slate-600 sm:text-xl"
                    placeholder="값을 입력하세요"
                  />
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value as UnitId)}
                    className="mt-1 w-full rounded-xl border border-slate-800/70 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-100 outline-none ring-0 focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/60 sm:text-sm"
                  >
                    {availableUnits.map((u) => (
                      <option key={u.id} value={u.id}>
                        {getUnitLabel(u)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 스왑 버튼 */}
              <div className="flex justify-center md:justify-center">
                <button
                  type="button"
                  onClick={handleSwapUnits}
                  className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900/80 text-slate-300 shadow-lg shadow-slate-950/60 transition hover:border-emerald-500/60 hover:bg-slate-900 hover:text-emerald-300"
                  aria-label="단위 교환"
                >
                  <ArrowLeftRight className="h-4 w-4 transition-transform group-hover:rotate-90" />
                </button>
              </div>

              {/* 출력 */}
              <div className="space-y-3">
                <label className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                  OUTPUT
                </label>
                <div className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2.5">
                  <div className="min-h-[2.25rem] text-lg font-semibold text-emerald-300 sm:text-xl">
                    {result ? formatDecimalForDisplay(result) : "—"}
                  </div>
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value as UnitId)}
                    className="mt-1 w-full rounded-xl border border-slate-800/70 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-100 outline-none ring-0 focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/60 sm:text-sm"
                  >
                    {availableUnits.map((u) => (
                      <option key={u.id} value={u.id}>
                        {getUnitLabel(u)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 상태 & 설명 바 */}
            <div className="mt-4 grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-[11px] text-slate-300 sm:grid-cols-3 sm:text-xs">
              <div className="space-y-1">
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  PIPELINE
                </div>
                <div>
                  입력 단위 → <span className="font-semibold">SI 기준 단위</span>{" "}
                  → 출력 단위 순으로 변환됩니다.
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  PRECISION
                </div>
                <div>
                  모든 연산은{" "}
                  <span className="font-semibold text-emerald-300">
                    decimal.js
                  </span>{" "}
                  로 수행되어 부동소수점 오차를 방지합니다.
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  NOTATION
                </div>
                <div>
                  값이 너무 크거나 작으면{" "}
                  <span className="font-semibold">과학적 기수법</span> (예:
                  1.5e-6)으로 자동 표시됩니다.
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4 text-[11px] text-slate-500 sm:text-xs">
          <span>Engineering Unit Converter · SI 기반 공학용 도구</span>
          <span className="hidden sm:inline">
            Powered by Next.js · Tailwind CSS · decimal.js
          </span>
        </footer>
      </div>
    </div>
  );
}

interface CategoryTabProps {
  id: CategoryId;
  label: string;
  description: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

function CategoryTab({
  label,
  description,
  icon,
  active,
  onClick,
}: CategoryTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group flex min-w-[9rem] flex-col items-start rounded-2xl border px-3.5 py-3 text-left text-[11px] transition sm:text-xs",
        active
          ? "border-emerald-500/70 bg-gradient-to-br from-emerald-500/25 via-emerald-500/5 to-slate-900/80 text-emerald-50 shadow-[0_18px_50px_rgba(16,185,129,0.35)]"
          : "border-slate-800 bg-slate-900/70 text-slate-200 hover:border-emerald-500/40 hover:bg-slate-900/90",
      ].join(" ")}
    >
      <div className="mb-1 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">
        <span
          className={[
            "flex h-6 w-6 items-center justify-center rounded-xl border text-slate-200 transition",
            active
              ? "border-emerald-400/80 bg-emerald-500/20 text-emerald-50"
              : "border-slate-700 bg-slate-900/80 group-hover:border-emerald-400/70 group-hover:text-emerald-200",
          ].join(" ")}
        >
          {icon}
        </span>
        <span className="whitespace-nowrap">{label}</span>
      </div>
      <div className="text-[10px] text-slate-400 whitespace-nowrap sm:text-[11px]">
        {description}
      </div>
    </button>
  );
}

