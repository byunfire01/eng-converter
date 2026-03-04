import Decimal from "decimal.js";

export type CategoryId =
  | "pressure"
  | "viscosity"
  | "kinematicViscosity"
  | "energy"
  | "length"
  | "mass"
  | "volume"
  | "temperature"
  | "area"
  | "power"
  | "force"
  | "speed"
  | "flowRate";

export type UnitId =
  | "Pa" | "kPa" | "MPa" | "psi" | "bar" | "atm" | "torr" | "kgf_per_cm2" | "mmH2O"
  | "Pa_s" | "P" | "cP"
  | "J" | "kJ" | "cal" | "kcal" | "BTU" | "eV" | "kWh"
  | "m" | "cm" | "mm" | "km" | "inch" | "ft" | "yard" | "mile" | "um"
  | "kg" | "g" | "mg" | "lb" | "oz" | "ton"
  | "m3" | "L" | "mL" | "cc" | "galUS" | "bbl"
  | "K" | "C" | "F"
  | "m2" | "cm2" | "mm2" | "km2" | "a" | "ha" | "pyeong" | "sqft" | "acre"
  | "W" | "kW" | "MW" | "hp" | "PS" | "kcal_per_h" | "RT"
  | "N" | "kN" | "kgf" | "tonf" | "lbf"
  | "m_per_s" | "km_per_h" | "mph" | "knot" | "fpm"
  | "m2_per_s" | "St" | "cSt"
  | "m3_per_s" | "m3_per_h" | "m3_per_min" | "L_per_min" | "CFM" | "GPM";

export interface UnitDefinition {
  id: UnitId;
  category: CategoryId;
  name: string;
  symbol: string;
  toSI: (value: Decimal) => Decimal;
  fromSI: (value: Decimal) => Decimal;
}

const ONE = new Decimal(1);

const PRESSURE_FACTORS = {
  kPa: new Decimal(1000), MPa: new Decimal(1000000), psi: new Decimal("6894.757293"),
  bar: new Decimal(100000), atm: new Decimal(101325), torr: new Decimal("133.322368"),
  kgf_per_cm2: new Decimal("98066.5"), mmH2O: new Decimal("9.80665"),
};

const VISCOSITY_FACTORS = { P: new Decimal(0.1), cP: new Decimal(0.001) };
const ENERGY_FACTORS = { kJ: new Decimal(1000), cal: new Decimal("4.184"), kcal: new Decimal("4184"), BTU: new Decimal("1055.0558"), eV: new Decimal("1.6021e-19"), kWh: new Decimal(3600000) };
const LENGTH_FACTORS = { cm: new Decimal(0.01), mm: new Decimal(0.001), km: new Decimal(1000), inch: new Decimal("0.0254"), ft: new Decimal("0.3048"), yard: new Decimal("0.9144"), mile: new Decimal("1609.344"), um: new Decimal("0.000001") };
const MASS_FACTORS = { g: new Decimal(0.001), mg: new Decimal(0.000001), lb: new Decimal("0.453592"), oz: new Decimal("0.028349"), ton: new Decimal(1000) };
const VOLUME_FACTORS = { L: new Decimal(0.001), mL: new Decimal(0.000001), cc: new Decimal(0.000001), galUS: new Decimal("0.003785"), bbl: new Decimal("0.158987") };
const AREA_FACTORS = { cm2: new Decimal(0.0001), mm2: new Decimal(0.000001), km2: new Decimal(1000000), a: new Decimal(100), ha: new Decimal(10000), pyeong: new Decimal("3.305785"), sqft: new Decimal("0.092903"), acre: new Decimal("4046.856") };
const POWER_FACTORS = { kW: new Decimal(1000), MW: new Decimal(1000000), hp: new Decimal("745.7"), PS: new Decimal("735.5"), kcal_per_h: new Decimal("1.16222"), RT: new Decimal("3516.85") };
const FORCE_FACTORS = { kN: new Decimal(1000), kgf: new Decimal("9.80665"), tonf: new Decimal("9806.65"), lbf: new Decimal("4.44822") };
const SPEED_FACTORS = { km_per_h: new Decimal("0.277777"), mph: new Decimal("0.44704"), knot: new Decimal("0.514444"), fpm: new Decimal("0.00508") };
const FLOW_RATE_FACTORS = { m3_per_h: ONE.div(3600), m3_per_min: ONE.div(60), L_per_min: ONE.div(60000), CFM: new Decimal("0.0004719474"), GPM: new Decimal("0.00006309020") };
const KINEMATIC_FACTORS = { St: new Decimal("0.0001"), cSt: new Decimal("0.000001") };

const units: UnitDefinition[] = [
  // 압력
  { id: "Pa", category: "pressure", name: "Pascal", symbol: "Pa", toSI: (v) => v, fromSI: (v) => v },
  { id: "kPa", category: "pressure", name: "Kilopascal", symbol: "kPa", toSI: (v) => v.mul(PRESSURE_FACTORS.kPa), fromSI: (v) => v.div(PRESSURE_FACTORS.kPa) },
  { id: "MPa", category: "pressure", name: "Megapascal", symbol: "MPa", toSI: (v) => v.mul(PRESSURE_FACTORS.MPa), fromSI: (v) => v.div(PRESSURE_FACTORS.MPa) },
  { id: "bar", category: "pressure", name: "Bar", symbol: "bar", toSI: (v) => v.mul(PRESSURE_FACTORS.bar), fromSI: (v) => v.div(PRESSURE_FACTORS.bar) },
  { id: "atm", category: "pressure", name: "Atmosphere", symbol: "atm", toSI: (v) => v.mul(PRESSURE_FACTORS.atm), fromSI: (v) => v.div(PRESSURE_FACTORS.atm) },
  { id: "psi", category: "pressure", name: "psi", symbol: "psi", toSI: (v) => v.mul(PRESSURE_FACTORS.psi), fromSI: (v) => v.div(PRESSURE_FACTORS.psi) },
  { id: "kgf_per_cm2", category: "pressure", name: "kgf/cm²", symbol: "kgf/cm²", toSI: (v) => v.mul(PRESSURE_FACTORS.kgf_per_cm2), fromSI: (v) => v.div(PRESSURE_FACTORS.kgf_per_cm2) },
  { id: "mmH2O", category: "pressure", name: "mmH2O", symbol: "mmH₂O", toSI: (v) => v.mul(PRESSURE_FACTORS.mmH2O), fromSI: (v) => v.div(PRESSURE_FACTORS.mmH2O) },
  { id: "torr", category: "pressure", name: "Torr", symbol: "Torr", toSI: (v) => v.mul(PRESSURE_FACTORS.torr), fromSI: (v) => v.div(PRESSURE_FACTORS.torr) },
  // 점도
  { id: "Pa_s", category: "viscosity", name: "Pa·s", symbol: "Pa·s", toSI: (v) => v, fromSI: (v) => v },
  { id: "P", category: "viscosity", name: "Poise", symbol: "P", toSI: (v) => v.mul(VISCOSITY_FACTORS.P), fromSI: (v) => v.div(VISCOSITY_FACTORS.P) },
  { id: "cP", category: "viscosity", name: "Centipoise", symbol: "cP", toSI: (v) => v.mul(VISCOSITY_FACTORS.cP), fromSI: (v) => v.div(VISCOSITY_FACTORS.cP) },
  // 동점도
  { id: "m2_per_s", category: "kinematicViscosity", name: "m²/s", symbol: "m²/s", toSI: (v) => v, fromSI: (v) => v },
  { id: "St", category: "kinematicViscosity", name: "Stokes", symbol: "St", toSI: (v) => v.mul(KINEMATIC_FACTORS.St), fromSI: (v) => v.div(KINEMATIC_FACTORS.St) },
  { id: "cSt", category: "kinematicViscosity", name: "Centistokes", symbol: "cSt", toSI: (v) => v.mul(KINEMATIC_FACTORS.cSt), fromSI: (v) => v.div(KINEMATIC_FACTORS.cSt) },
  // 에너지
  { id: "J", category: "energy", name: "Joule", symbol: "J", toSI: (v) => v, fromSI: (v) => v },
  { id: "kJ", category: "energy", name: "Kilojoule", symbol: "kJ", toSI: (v) => v.mul(ENERGY_FACTORS.kJ), fromSI: (v) => v.div(ENERGY_FACTORS.kJ) },
  { id: "cal", category: "energy", name: "Calorie", symbol: "cal", toSI: (v) => v.mul(ENERGY_FACTORS.cal), fromSI: (v) => v.div(ENERGY_FACTORS.cal) },
  { id: "kcal", category: "energy", name: "Kilocalorie", symbol: "kcal", toSI: (v) => v.mul(ENERGY_FACTORS.kcal), fromSI: (v) => v.div(ENERGY_FACTORS.kcal) },
  { id: "BTU", category: "energy", name: "BTU", symbol: "BTU", toSI: (v) => v.mul(ENERGY_FACTORS.BTU), fromSI: (v) => v.div(ENERGY_FACTORS.BTU) },
  { id: "eV", category: "energy", name: "Electronvolt", symbol: "eV", toSI: (v) => v.mul(ENERGY_FACTORS.eV), fromSI: (v) => v.div(ENERGY_FACTORS.eV) },
  { id: "kWh", category: "energy", name: "kWh", symbol: "kWh", toSI: (v) => v.mul(ENERGY_FACTORS.kWh), fromSI: (v) => v.div(ENERGY_FACTORS.kWh) },
  // 길이
  { id: "m", category: "length", name: "Meter", symbol: "m", toSI: (v) => v, fromSI: (v) => v },
  { id: "cm", category: "length", name: "Centimeter", symbol: "cm", toSI: (v) => v.mul(LENGTH_FACTORS.cm), fromSI: (v) => v.div(LENGTH_FACTORS.cm) },
  { id: "mm", category: "length", name: "Millimeter", symbol: "mm", toSI: (v) => v.mul(LENGTH_FACTORS.mm), fromSI: (v) => v.div(LENGTH_FACTORS.mm) },
  { id: "um", category: "length", name: "Micrometer", symbol: "µm", toSI: (v) => v.mul(LENGTH_FACTORS.um), fromSI: (v) => v.div(LENGTH_FACTORS.um) },
  { id: "km", category: "length", name: "Kilometer", symbol: "km", toSI: (v) => v.mul(LENGTH_FACTORS.km), fromSI: (v) => v.div(LENGTH_FACTORS.km) },
  { id: "inch", category: "length", name: "Inch", symbol: "in", toSI: (v) => v.mul(LENGTH_FACTORS.inch), fromSI: (v) => v.div(LENGTH_FACTORS.inch) },
  { id: "ft", category: "length", name: "Feet", symbol: "ft", toSI: (v) => v.mul(LENGTH_FACTORS.ft), fromSI: (v) => v.div(LENGTH_FACTORS.ft) },
  { id: "yard", category: "length", name: "Yard", symbol: "yd", toSI: (v) => v.mul(LENGTH_FACTORS.yard), fromSI: (v) => v.div(LENGTH_FACTORS.yard) },
  { id: "mile", category: "length", name: "Mile", symbol: "mi", toSI: (v) => v.mul(LENGTH_FACTORS.mile), fromSI: (v) => v.div(LENGTH_FACTORS.mile) },
  // 질량
  { id: "kg", category: "mass", name: "Kilogram", symbol: "kg", toSI: (v) => v, fromSI: (v) => v },
  { id: "g", category: "mass", name: "Gram", symbol: "g", toSI: (v) => v.mul(MASS_FACTORS.g), fromSI: (v) => v.div(MASS_FACTORS.g) },
  { id: "mg", category: "mass", name: "Milligram", symbol: "mg", toSI: (v) => v.mul(MASS_FACTORS.mg), fromSI: (v) => v.div(MASS_FACTORS.mg) },
  { id: "lb", category: "mass", name: "Pound", symbol: "lb", toSI: (v) => v.mul(MASS_FACTORS.lb), fromSI: (v) => v.div(MASS_FACTORS.lb) },
  { id: "oz", category: "mass", name: "Ounce", symbol: "oz", toSI: (v) => v.mul(MASS_FACTORS.oz), fromSI: (v) => v.div(MASS_FACTORS.oz) },
  { id: "ton", category: "mass", name: "Metric Ton", symbol: "t", toSI: (v) => v.mul(MASS_FACTORS.ton), fromSI: (v) => v.div(MASS_FACTORS.ton) },
  // 부피
  { id: "m3", category: "volume", name: "m³", symbol: "m³", toSI: (v) => v, fromSI: (v) => v },
  { id: "L", category: "volume", name: "Liter", symbol: "L", toSI: (v) => v.mul(VOLUME_FACTORS.L), fromSI: (v) => v.div(VOLUME_FACTORS.L) },
  { id: "mL", category: "volume", name: "Milliliter", symbol: "mL", toSI: (v) => v.mul(VOLUME_FACTORS.mL), fromSI: (v) => v.div(VOLUME_FACTORS.mL) },
  { id: "cc", category: "volume", name: "cc (cm³)", symbol: "cc", toSI: (v) => v.mul(VOLUME_FACTORS.cc), fromSI: (v) => v.div(VOLUME_FACTORS.cc) },
  { id: "galUS", category: "volume", name: "US Gallon", symbol: "gal", toSI: (v) => v.mul(VOLUME_FACTORS.galUS), fromSI: (v) => v.div(VOLUME_FACTORS.galUS) },
  { id: "bbl", category: "volume", name: "Barrel", symbol: "bbl", toSI: (v) => v.mul(VOLUME_FACTORS.bbl), fromSI: (v) => v.div(VOLUME_FACTORS.bbl) },
  // 온도
  { id: "C", category: "temperature", name: "Celsius", symbol: "°C", toSI: (v) => v.plus(273.15), fromSI: (v) => v.minus(273.15) },
  { id: "F", category: "temperature", name: "Fahrenheit", symbol: "°F", toSI: (v) => v.minus(32).mul(5).div(9).plus(273.15), fromSI: (v) => v.minus(273.15).mul(9).div(5).plus(32) },
  { id: "K", category: "temperature", name: "Kelvin", symbol: "K", toSI: (v) => v, fromSI: (v) => v },
  // 면적
  { id: "m2", category: "area", name: "m²", symbol: "m²", toSI: (v) => v, fromSI: (v) => v },
  { id: "cm2", category: "area", name: "cm²", symbol: "cm²", toSI: (v) => v.mul(AREA_FACTORS.cm2), fromSI: (v) => v.div(AREA_FACTORS.cm2) },
  { id: "mm2", category: "area", name: "mm²", symbol: "mm²", toSI: (v) => v.mul(AREA_FACTORS.mm2), fromSI: (v) => v.div(AREA_FACTORS.mm2) },
  { id: "km2", category: "area", name: "km²", symbol: "km²", toSI: (v) => v.mul(AREA_FACTORS.km2), fromSI: (v) => v.div(AREA_FACTORS.km2) },
  { id: "a", category: "area", name: "Are", symbol: "a", toSI: (v) => v.mul(AREA_FACTORS.a), fromSI: (v) => v.div(AREA_FACTORS.a) },
  { id: "ha", category: "area", name: "Hectare", symbol: "ha", toSI: (v) => v.mul(AREA_FACTORS.ha), fromSI: (v) => v.div(AREA_FACTORS.ha) },
  { id: "pyeong", category: "area", name: "Pyeong", symbol: "평", toSI: (v) => v.mul(AREA_FACTORS.pyeong), fromSI: (v) => v.div(AREA_FACTORS.pyeong) },
  { id: "sqft", category: "area", name: "sq ft", symbol: "ft²", toSI: (v) => v.mul(AREA_FACTORS.sqft), fromSI: (v) => v.div(AREA_FACTORS.sqft) },
  { id: "acre", category: "area", name: "Acre", symbol: "acre", toSI: (v) => v.mul(AREA_FACTORS.acre), fromSI: (v) => v.div(AREA_FACTORS.acre) },
  // 동력
  { id: "W", category: "power", name: "Watt", symbol: "W", toSI: (v) => v, fromSI: (v) => v },
  { id: "kW", category: "power", name: "Kilowatt", symbol: "kW", toSI: (v) => v.mul(POWER_FACTORS.kW), fromSI: (v) => v.div(POWER_FACTORS.kW) },
  { id: "MW", category: "power", name: "Megawatt", symbol: "MW", toSI: (v) => v.mul(POWER_FACTORS.MW), fromSI: (v) => v.div(POWER_FACTORS.MW) },
  { id: "hp", category: "power", name: "Horsepower", symbol: "hp", toSI: (v) => v.mul(POWER_FACTORS.hp), fromSI: (v) => v.div(POWER_FACTORS.hp) },
  { id: "PS", category: "power", name: "PS (독일마력)", symbol: "PS", toSI: (v) => v.mul(POWER_FACTORS.PS), fromSI: (v) => v.div(POWER_FACTORS.PS) },
  { id: "kcal_per_h", category: "power", name: "kcal/h", symbol: "kcal/h", toSI: (v) => v.mul(POWER_FACTORS.kcal_per_h), fromSI: (v) => v.div(POWER_FACTORS.kcal_per_h) },
  { id: "RT", category: "power", name: "Ton of Refrigeration", symbol: "RT", toSI: (v) => v.mul(POWER_FACTORS.RT), fromSI: (v) => v.div(POWER_FACTORS.RT) },
  // 힘
  { id: "N", category: "force", name: "Newton", symbol: "N", toSI: (v) => v, fromSI: (v) => v },
  { id: "kN", category: "force", name: "Kilonewton", symbol: "kN", toSI: (v) => v.mul(FORCE_FACTORS.kN), fromSI: (v) => v.div(FORCE_FACTORS.kN) },
  { id: "kgf", category: "force", name: "kgf", symbol: "kgf", toSI: (v) => v.mul(FORCE_FACTORS.kgf), fromSI: (v) => v.div(FORCE_FACTORS.kgf) },
  { id: "tonf", category: "force", name: "Ton-force", symbol: "tonf", toSI: (v) => v.mul(FORCE_FACTORS.tonf), fromSI: (v) => v.div(FORCE_FACTORS.tonf) },
  { id: "lbf", category: "force", name: "Pound-force", symbol: "lbf", toSI: (v) => v.mul(FORCE_FACTORS.lbf), fromSI: (v) => v.div(FORCE_FACTORS.lbf) },
  // 속도
  { id: "m_per_s", category: "speed", name: "m/s", symbol: "m/s", toSI: (v) => v, fromSI: (v) => v },
  { id: "km_per_h", category: "speed", name: "km/h", symbol: "km/h", toSI: (v) => v.mul(SPEED_FACTORS.km_per_h), fromSI: (v) => v.div(SPEED_FACTORS.km_per_h) },
  { id: "mph", category: "speed", name: "mph", symbol: "mph", toSI: (v) => v.mul(SPEED_FACTORS.mph), fromSI: (v) => v.div(SPEED_FACTORS.mph) },
  { id: "knot", category: "speed", name: "Knot", symbol: "knot", toSI: (v) => v.mul(SPEED_FACTORS.knot), fromSI: (v) => v.div(SPEED_FACTORS.knot) },
  { id: "fpm", category: "speed", name: "ft/min", symbol: "fpm", toSI: (v) => v.mul(SPEED_FACTORS.fpm), fromSI: (v) => v.div(SPEED_FACTORS.fpm) },
  // 유량
  { id: "m3_per_s", category: "flowRate", name: "m³/s", symbol: "m³/s", toSI: (v) => v, fromSI: (v) => v },
  { id: "m3_per_h", category: "flowRate", name: "m³/h (CMH)", symbol: "CMH", toSI: (v) => v.mul(FLOW_RATE_FACTORS.m3_per_h), fromSI: (v) => v.div(FLOW_RATE_FACTORS.m3_per_h) },
  { id: "m3_per_min", category: "flowRate", name: "m³/min", symbol: "m³/min", toSI: (v) => v.mul(FLOW_RATE_FACTORS.m3_per_min), fromSI: (v) => v.div(FLOW_RATE_FACTORS.m3_per_min) },
  { id: "L_per_min", category: "flowRate", name: "L/min (LPM)", symbol: "LPM", toSI: (v) => v.mul(FLOW_RATE_FACTORS.L_per_min), fromSI: (v) => v.div(FLOW_RATE_FACTORS.L_per_min) },
  { id: "CFM", category: "flowRate", name: "CFM", symbol: "CFM", toSI: (v) => v.mul(FLOW_RATE_FACTORS.CFM), fromSI: (v) => v.div(FLOW_RATE_FACTORS.CFM) },
  { id: "GPM", category: "flowRate", name: "GPM", symbol: "GPM", toSI: (v) => v.mul(FLOW_RATE_FACTORS.GPM), fromSI: (v) => v.div(FLOW_RATE_FACTORS.GPM) },
];

const unitMap: Record<string, UnitDefinition> = units.reduce((acc, u) => { acc[u.id] = u; return acc; }, {} as any);
export const categories = [
  { id: "pressure", label: "압력", description: "Pa, bar, psi, atm 등" },
  { id: "viscosity", label: "점도", description: "Pa·s, cP 등" },
  { id: "kinematicViscosity", label: "동점도", description: "m²/s, St, cSt" },
  { id: "energy", label: "에너지", description: "J, kcal, BTU, kWh 등" },
  { id: "length", label: "길이", description: "m, mm, inch, ft 등" },
  { id: "mass", label: "질량", description: "kg, g, lb, oz 등" },
  { id: "volume", label: "부피", description: "m³, L, mL, gal 등" },
  { id: "temperature", label: "온도", description: "°C, °F, K" },
  { id: "area", label: "면적", description: "m², 평, ha, ft² 등" },
  { id: "power", label: "동력", description: "W, kW, hp, RT 등" },
  { id: "force", label: "힘", description: "N, kgf, lbf 등" },
  { id: "speed", label: "속도", description: "m/s, km/h, mph 등" },
  { id: "flowRate", label: "유량", description: "CMH, CFM, GPM 등" },
];

export const DEFAULT_UNITS: Record<CategoryId, { from: UnitId; to: UnitId }> = {
  pressure: { from: "bar", to: "psi" }, viscosity: { from: "Pa_s", to: "cP" }, kinematicViscosity: { from: "cSt", to: "St" },
  energy: { from: "kcal", to: "kJ" }, length: { from: "mm", to: "inch" }, mass: { from: "kg", to: "lb" },
  volume: { from: "L", to: "galUS" }, temperature: { from: "C", to: "F" }, area: { from: "m2", to: "pyeong" },
  power: { from: "kW", to: "hp" }, force: { from: "kgf", to: "N" }, speed: { from: "km_per_h", to: "mph" },
  flowRate: { from: "m3_per_h", to: "CFM" },
};

export const UNIT_DESCRIPTIONS: Record<string, string> = {
  Pa: "SI 압력 기본 단위 (N/m²)", kPa: "1 kPa = 1,000 Pa", MPa: "1 MPa = 10⁶ Pa",
  psi: "Pound per Square Inch, 미국/영국 관용 압력 단위", bar: "1 bar = 100,000 Pa, 산업용 표준",
  atm: "표준 대기압 (101,325 Pa)", torr: "1 Torr ≈ 1 mmHg, 진공 기술에서 사용",
  kgf_per_cm2: "중력 단위계 압력, 한국 산업현장에서 다수 사용", mmH2O: "수두 압력, 공조/환기 분야에서 사용",
  Pa_s: "SI 점도 기본 단위 (동적 점도)", P: "CGS 점도 단위, 1 P = 0.1 Pa·s", cP: "1 cP = 0.001 Pa·s, 유체역학에서 가장 많이 사용",
  J: "SI 에너지 기본 단위", kJ: "1 kJ = 1,000 J", cal: "열량 단위, 1 cal = 4.184 J",
  kcal: "1 kcal = 4,184 J, 식품/보일러 분야 사용", BTU: "British Thermal Unit, 공조 냉난방 분야",
  eV: "전자볼트, 원자/입자 물리학 에너지 단위", kWh: "전력량 단위, 1 kWh = 3.6 MJ",
  m: "SI 길이 기본 단위", cm: "1 cm = 0.01 m", mm: "1 mm = 0.001 m", km: "1 km = 1,000 m",
  inch: "1 inch = 25.4 mm", ft: "1 ft = 0.3048 m (약 30.5 cm)", yard: "1 yard = 0.9144 m (약 91.4 cm)",
  mile: "1 mile = 1,609.344 m", um: "마이크로미터 (1 µm = 10⁻⁶ m)",
  kg: "SI 질량 기본 단위", g: "1 g = 0.001 kg", mg: "1 mg = 10⁻⁶ kg",
  lb: "파운드, 1 lb ≈ 0.4536 kg", oz: "온스, 1 oz ≈ 28.35 g", ton: "미터톤, 1 t = 1,000 kg",
  m3: "SI 부피 기본 단위 (세제곱미터)", L: "리터, 1 L = 0.001 m³", mL: "밀리리터, 1 mL = 10⁻⁶ m³",
  cc: "1 cc = 1 mL = 1 cm³", galUS: "미국 갤런, 1 gal ≈ 3.785 L", bbl: "배럴, 1 bbl ≈ 158.987 L (석유 산업)",
  K: "켈빈, SI 절대 온도", C: "섭씨온도 (°C = K − 273.15)", F: "화씨온도 (°F = °C × 9/5 + 32)",
  m2: "SI 면적 기본 단위 (제곱미터)", cm2: "1 cm² = 10⁻⁴ m²", mm2: "1 mm² = 10⁻⁶ m²",
  km2: "1 km² = 10⁶ m²", a: "아르, 1 a = 100 m²", ha: "헥타르, 1 ha = 10,000 m²",
  pyeong: "평, 1 평 ≈ 3.306 m² (한국 면적 단위)", sqft: "제곱피트, 1 ft² ≈ 0.0929 m²", acre: "에이커, 1 acre ≈ 4,047 m²",
  W: "SI 동력 기본 단위 (J/s)", kW: "1 kW = 1,000 W", MW: "1 MW = 10⁶ W",
  hp: "마력(영국), 1 hp ≈ 745.7 W", PS: "마력(독일), 1 PS ≈ 735.5 W",
  kcal_per_h: "1 kcal/h ≈ 1.162 W, 보일러 용량", RT: "냉동톤, 1 RT ≈ 3,516.85 W (공조 냉동)",
  N: "SI 힘 기본 단위 (kg·m/s²)", kN: "1 kN = 1,000 N", kgf: "킬로그램중, 1 kgf ≈ 9.807 N",
  tonf: "톤중, 1 tonf ≈ 9,806.65 N", lbf: "파운드력, 1 lbf ≈ 4.448 N",
  m_per_s: "SI 속도 기본 단위", km_per_h: "1 km/h ≈ 0.2778 m/s", mph: "1 mph ≈ 1.609 km/h",
  knot: "1 knot ≈ 1.852 km/h (해양/항공)", fpm: "ft/min, 공조 풍속 측정",
  m2_per_s: "SI 동점도 기본 단위", St: "스토크스, 1 St = 10⁻⁴ m²/s (CGS)",
  cSt: "센티스토크스, 1 cSt = 10⁻⁶ m²/s (윤활유 점도 등)",
  m3_per_s: "SI 유량 기본 단위", m3_per_h: "CMH (Cubic Meter per Hour), 공조 유량",
  m3_per_min: "1 m³/min = 60 m³/h", L_per_min: "LPM, 소규모 유량 측정",
  CFM: "Cubic Feet per Minute, 미국 공조 유량", GPM: "Gallons per Minute, 미국 펌프 유량",
};

export const QUICK_REFERENCE: Record<CategoryId, string[]> = {
  pressure: [
    "타이어 공기압 약 32 psi ≈ 2.2 bar",
    "1기압(atm) = 약 10m 수심의 압력",
    "1 kgf/cm² ≈ 1 atm ≈ 14.7 psi",
    "1 bar = 100 kPa = 0.1 MPa",
    "혈압 120 mmHg ≈ 120 Torr",
    "에어컨 냉매 압력 약 5~25 bar",
  ],
  viscosity: [
    "물(20°C) ≈ 1 cP — 기준점으로 자주 사용",
    "꿀 ≈ 2,000~10,000 cP",
    "엔진오일(상온) ≈ 100~250 cP",
    "케첩 ≈ 50,000~100,000 cP",
    "공기(20°C) ≈ 0.018 cP",
    "1 Pa·s = 1,000 cP = 10 P",
  ],
  kinematicViscosity: [
    "물(20°C) ≈ 1 cSt — 기준점으로 자주 사용",
    "엔진오일 5W-30(100°C) ≈ 10~12 cSt",
    "경유 ≈ 2~5 cSt",
    "1 St = 100 cSt",
    "ISO VG 46 유압유 ≈ 46 cSt(40°C)",
    "동점도 = 점도 ÷ 밀도",
  ],
  energy: [
    "밥 한 공기 ≈ 300 kcal",
    "1 kWh = 860 kcal (전기요금 단위)",
    "1 BTU ≈ 0.252 kcal (냉난방 용량)",
    "스마트폰 배터리 ≈ 15~20 Wh",
    "가정 월 전기 사용 ≈ 300~400 kWh",
    "도시가스 1 m³ ≈ 10,500 kcal",
  ],
  length: [
    "1 inch = 25.4 mm (나사/배관 규격)",
    "1 ft = 30.48 cm (건축/항공)",
    "A4 용지 폭 ≈ 210 mm = 약 8.27 inch",
    "1 mile = 1.609 km (미국 도로)",
    "배관 1인치 = 외경 약 33.4 mm",
    "사람 키 170 cm ≈ 5 ft 7 in",
  ],
  mass: [
    "1 lb ≈ 0.454 kg (약 반 킬로)",
    "1 oz ≈ 28.35 g (귀금속/식품 단위)",
    "소고기 1근 = 600 g (한국 근)",
    "체중 70 kg ≈ 154 lb",
    "쌀 한 포대 = 20 kg",
    "컨테이너 적재량 약 20~25 ton",
  ],
  volume: [
    "생수 1병 = 500 mL",
    "1 gallon ≈ 3.785 L (미국 연비 단위)",
    "원유 1 barrel ≈ 159 L",
    "소주 1병 = 360 mL",
    "맥주 1 pint ≈ 473 mL (미국)",
    "욕조 물 ≈ 200~300 L",
  ],
  temperature: [
    "물 끓는점: 100°C = 212°F",
    "체온: 36.5°C = 97.7°F",
    "절대영도: −273.15°C = 0 K",
    "냉동고: −18°C = 0°F",
    "에어컨 냉방: 약 24~26°C = 75~79°F",
    "철 녹는점: 1,538°C = 2,800°F",
  ],
  area: [
    "아파트 30평 ≈ 99.17 m²",
    "축구장 ≈ 7,140 m² ≈ 0.714 ha",
    "1 acre ≈ 약 1,224 평",
    "주차장 1면 ≈ 12.5 m² ≈ 약 3.8 평",
    "서울 면적 ≈ 605 km²",
    "1 ha = 100 m × 100 m (만 제곱미터)",
  ],
  power: [
    "가정용 에어컨 약 1~3 RT",
    "자동차 100 hp ≈ 74.6 kW",
    "1 RT ≈ 3,517 W (냉동 능력)",
    "전자레인지 ≈ 700~1,200 W",
    "보일러 10만 kcal/h ≈ 116 kW",
    "hp와 PS 차이: 1 hp ≈ 1.014 PS",
  ],
  force: [
    "사과 1개 무게 ≈ 1 N",
    "1 kgf ≈ 9.81 N (중력가속도 기반)",
    "성인 악력 ≈ 30~50 kgf",
    "볼트 토크 10 kgf·m ≈ 98.1 N·m",
    "1 tonf ≈ 9,807 N (크레인 하중)",
    "1 lbf ≈ 4.45 N (미국 구조 계산)",
  ],
  speed: [
    "고속도로 100 km/h ≈ 62.1 mph",
    "태풍급 풍속 ≈ 34 knot 이상",
    "1 m/s = 3.6 km/h",
    "걷는 속도 약 4~5 km/h ≈ 1.2 m/s",
    "소리 속도(20°C 공기) ≈ 343 m/s",
    "환기 덕트 풍속 약 500~1,500 fpm",
  ],
  flowRate: [
    "가정 수도 꼭지 ≈ 10~15 LPM",
    "공조 풍량: 1 CMH ≈ 0.59 CFM",
    "소방 펌프 ≈ 500~1,000 GPM",
    "사무실 환기 1인당 약 30 CMH",
    "냉각탑 순환수 약 200~500 LPM",
    "1 m³/s = 3,600 CMH = 2,119 CFM",
  ],
};

export const QUICK_CONVERSIONS: { label: string; category: CategoryId; fromId: UnitId; toId: UnitId }[] = [
  { label: "psi → bar", category: "pressure", fromId: "psi", toId: "bar" },
  { label: "°C → °F", category: "temperature", fromId: "C", toId: "F" },
  { label: "kW → hp", category: "power", fromId: "kW", toId: "hp" },
  { label: "mm → inch", category: "length", fromId: "mm", toId: "inch" },
  { label: "kg → lb", category: "mass", fromId: "kg", toId: "lb" },
  { label: "CMH → CFM", category: "flowRate", fromId: "m3_per_h", toId: "CFM" },
  { label: "kgf/cm² → psi", category: "pressure", fromId: "kgf_per_cm2", toId: "psi" },
  { label: "RT → kW", category: "power", fromId: "RT", toId: "kW" },
];

export function getUnitsByCategory(category: CategoryId) { return units.filter((u) => u.category === category); }
export function getUnitLabel(u: UnitDefinition) { return `${u.symbol} (${u.name})`; }
export function parseToDecimal(i: string) { try { return new Decimal(i); } catch { return null; } }
export function formatDecimalForDisplay(v: Decimal) { return v.toSignificantDigits(10).toString(); }
export function convertUnit(cat: CategoryId, fromId: UnitId, toId: UnitId, val: Decimal) {
  const from = unitMap[fromId]; const to = unitMap[toId];
  return to.fromSI(from.toSI(val));
}
