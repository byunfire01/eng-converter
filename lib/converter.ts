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
  { id: "Pa", category: "pressure", name: "Pascal", symbol: "Pa", toSI: (v) => v, fromSI: (v) => v },
  { id: "kPa", category: "pressure", name: "Kilopascal", symbol: "kPa", toSI: (v) => v.mul(PRESSURE_FACTORS.kPa), fromSI: (v) => v.div(PRESSURE_FACTORS.kPa) },
  { id: "MPa", category: "pressure", name: "Megapascal", symbol: "MPa", toSI: (v) => v.mul(PRESSURE_FACTORS.MPa), fromSI: (v) => v.div(PRESSURE_FACTORS.MPa) },
  { id: "psi", category: "pressure", name: "psi", symbol: "psi", toSI: (v) => v.mul(PRESSURE_FACTORS.psi), fromSI: (v) => v.div(PRESSURE_FACTORS.psi) },
  { id: "bar", category: "pressure", name: "Bar", symbol: "bar", toSI: (v) => v.mul(PRESSURE_FACTORS.bar), fromSI: (v) => v.div(PRESSURE_FACTORS.bar) },
  { id: "atm", category: "pressure", name: "Atmosphere", symbol: "atm", toSI: (v) => v.mul(PRESSURE_FACTORS.atm), fromSI: (v) => v.div(PRESSURE_FACTORS.atm) },
  { id: "torr", category: "pressure", name: "Torr", symbol: "Torr", toSI: (v) => v.mul(PRESSURE_FACTORS.torr), fromSI: (v) => v.div(PRESSURE_FACTORS.torr) },
  { id: "kgf_per_cm2", category: "pressure", name: "kgf/cm²", symbol: "kgf/cm²", toSI: (v) => v.mul(PRESSURE_FACTORS.kgf_per_cm2), fromSI: (v) => v.div(PRESSURE_FACTORS.kgf_per_cm2) },
  { id: "mmH2O", category: "pressure", name: "mmH2O", symbol: "mmH₂O", toSI: (v) => v.mul(PRESSURE_FACTORS.mmH2O), fromSI: (v) => v.div(PRESSURE_FACTORS.mmH2O) },
  { id: "Pa_s", category: "viscosity", name: "Pa·s", symbol: "Pa·s", toSI: (v) => v, fromSI: (v) => v },
  { id: "P", category: "viscosity", name: "Poise", symbol: "P", toSI: (v) => v.mul(VISCOSITY_FACTORS.P), fromSI: (v) => v.div(VISCOSITY_FACTORS.P) },
  { id: "cP", category: "viscosity", name: "Centipoise", symbol: "cP", toSI: (v) => v.mul(VISCOSITY_FACTORS.cP), fromSI: (v) => v.div(VISCOSITY_FACTORS.cP) },
  { id: "J", category: "energy", name: "Joule", symbol: "J", toSI: (v) => v, fromSI: (v) => v },
  { id: "kJ", category: "energy", name: "Kilojoule", symbol: "kJ", toSI: (v) => v.mul(ENERGY_FACTORS.kJ), fromSI: (v) => v.div(ENERGY_FACTORS.kJ) },
  { id: "kcal", category: "energy", name: "Kilocalorie", symbol: "kcal", toSI: (v) => v.mul(ENERGY_FACTORS.kcal), fromSI: (v) => v.div(ENERGY_FACTORS.kcal) },
  { id: "kWh", category: "energy", name: "kWh", symbol: "kWh", toSI: (v) => v.mul(ENERGY_FACTORS.kWh), fromSI: (v) => v.div(ENERGY_FACTORS.kWh) },
  { id: "m", category: "length", name: "Meter", symbol: "m", toSI: (v) => v, fromSI: (v) => v },
  { id: "cm", category: "length", name: "Centimeter", symbol: "cm", toSI: (v) => v.mul(LENGTH_FACTORS.cm), fromSI: (v) => v.div(LENGTH_FACTORS.cm) },
  { id: "mm", category: "length", name: "Millimeter", symbol: "mm", toSI: (v) => v.mul(LENGTH_FACTORS.mm), fromSI: (v) => v.div(LENGTH_FACTORS.mm) },
  { id: "km", category: "length", name: "Kilometer", symbol: "km", toSI: (v) => v.mul(LENGTH_FACTORS.km), fromSI: (v) => v.div(LENGTH_FACTORS.km) },
  { id: "um", category: "length", name: "Micrometer", symbol: "µm", toSI: (v) => v.mul(LENGTH_FACTORS.um), fromSI: (v) => v.div(LENGTH_FACTORS.um) },
  { id: "kg", category: "mass", name: "Kilogram", symbol: "kg", toSI: (v) => v, fromSI: (v) => v },
  { id: "ton", category: "mass", name: "Ton", symbol: "t", toSI: (v) => v.mul(MASS_FACTORS.ton), fromSI: (v) => v.div(MASS_FACTORS.ton) },
  { id: "m3", category: "volume", name: "m³", symbol: "m³", toSI: (v) => v, fromSI: (v) => v },
  { id: "L", category: "volume", name: "Liter", symbol: "L", toSI: (v) => v.mul(VOLUME_FACTORS.L), fromSI: (v) => v.div(VOLUME_FACTORS.L) },
  { id: "K", category: "temperature", name: "Kelvin", symbol: "K", toSI: (v) => v, fromSI: (v) => v },
  { id: "C", category: "temperature", name: "Celsius", symbol: "°C", toSI: (v) => v.plus(273.15), fromSI: (v) => v.minus(273.15) },
  { id: "m2", category: "area", name: "m²", symbol: "m²", toSI: (v) => v, fromSI: (v) => v },
  { id: "pyeong", category: "area", name: "Pyeong", symbol: "평", toSI: (v) => v.mul(AREA_FACTORS.pyeong), fromSI: (v) => v.div(AREA_FACTORS.pyeong) },
  { id: "W", category: "power", name: "Watt", symbol: "W", toSI: (v) => v, fromSI: (v) => v },
  { id: "kW", category: "power", name: "kW", symbol: "kW", toSI: (v) => v.mul(POWER_FACTORS.kW), fromSI: (v) => v.div(POWER_FACTORS.kW) },
  { id: "RT", category: "power", name: "RT", symbol: "RT", toSI: (v) => v.mul(POWER_FACTORS.RT), fromSI: (v) => v.div(POWER_FACTORS.RT) },
  { id: "N", category: "force", name: "Newton", symbol: "N", toSI: (v) => v, fromSI: (v) => v },
  { id: "kgf", category: "force", name: "kgf", symbol: "kgf", toSI: (v) => v.mul(FORCE_FACTORS.kgf), fromSI: (v) => v.div(FORCE_FACTORS.kgf) },
  { id: "m_per_s", category: "speed", name: "m/s", symbol: "m/s", toSI: (v) => v, fromSI: (v) => v },
  { id: "km_per_h", category: "speed", name: "km/h", symbol: "km/h", toSI: (v) => v.mul(SPEED_FACTORS.km_per_h), fromSI: (v) => v.div(SPEED_FACTORS.km_per_h) },
  { id: "m3_per_s", category: "flowRate", name: "m³/s", symbol: "m³/s", toSI: (v) => v, fromSI: (v) => v },
  { id: "m3_per_h", category: "flowRate", name: "m³/h", symbol: "m³/h (CMH)", toSI: (v) => v.mul(FLOW_RATE_FACTORS.m3_per_h), fromSI: (v) => v.div(FLOW_RATE_FACTORS.m3_per_h) },
  { id: "CFM", category: "flowRate", name: "CFM", symbol: "CFM", toSI: (v) => v.mul(FLOW_RATE_FACTORS.CFM), fromSI: (v) => v.div(FLOW_RATE_FACTORS.CFM) },
  { id: "m2_per_s", category: "kinematicViscosity", name: "m²/s", symbol: "m²/s", toSI: (v) => v, fromSI: (v) => v },
  { id: "cSt", category: "kinematicViscosity", name: "cSt", symbol: "cSt", toSI: (v) => v.mul(KINEMATIC_FACTORS.cSt), fromSI: (v) => v.div(KINEMATIC_FACTORS.cSt) },
];

const unitMap: Record<string, UnitDefinition> = units.reduce((acc, u) => { acc[u.id] = u; return acc; }, {} as any);
export const categories = [
  { id: "pressure", label: "압력", description: "Pa, bar, kgf/cm², mmH₂O 등" },
  { id: "viscosity", label: "점도", description: "Pa·s, cP 등" },
  { id: "kinematicViscosity", label: "동점도", description: "m²/s, cSt 등" },
  { id: "energy", label: "에너지", description: "J, kcal, kWh 등" },
  { id: "length", label: "길이", description: "m, mm, km, µm 등" },
  { id: "mass", label: "질량", description: "kg, ton 등" },
  { id: "volume", label: "부피", description: "m³, L 등" },
  { id: "temperature", label: "온도", description: "°C, K, °F" },
  { id: "area", label: "면적", description: "m², 평 등" },
  { id: "power", label: "동력", description: "W, kW, RT 등" },
  { id: "force", label: "힘", description: "N, kgf 등" },
  { id: "speed", label: "속도", description: "m/s, km/h 등" },
  { id: "flowRate", label: "유량", description: "m³/s, CMH, CFM 등" },
];

export const DEFAULT_UNITS: any = {
  pressure: { from: "Pa", to: "bar" }, viscosity: { from: "Pa_s", to: "cP" }, kinematicViscosity: { from: "m2_per_s", to: "cSt" },
  energy: { from: "J", to: "kcal" }, length: { from: "m", to: "mm" }, mass: { from: "kg", to: "ton" },
  volume: { from: "m3", to: "L" }, temperature: { from: "C", to: "K" }, area: { from: "m2", to: "pyeong" },
  power: { from: "W", to: "kW" }, force: { from: "N", to: "kgf" }, speed: { from: "m_per_s", to: "km_per_h" },
  flowRate: { from: "m3_per_s", to: "CFM" },
};

export function getUnitsByCategory(category: CategoryId) { return units.filter((u) => u.category === category); }
export function getUnitLabel(u: UnitDefinition) { return `${u.symbol} (${u.name})`; }
export function parseToDecimal(i: string) { try { return new Decimal(i); } catch { return null; } }
export function formatDecimalForDisplay(v: Decimal) { return v.toSignificantDigits(10).toString(); }
export function convertUnit(cat: CategoryId, fromId: UnitId, toId: UnitId, val: Decimal) {
  const from = unitMap[fromId]; const to = unitMap[toId];
  return to.fromSI(from.toSI(val));
}