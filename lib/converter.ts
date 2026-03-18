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
  | "flowRate"
  | "torque"
  | "density"
  | "angle";

export type UnitId =
  | "Pa" | "kPa" | "MPa" | "psi" | "bar" | "atm" | "torr" | "kgf_per_cm2" | "mmH2O" | "inHg" | "inH2O"
  | "Pa_s" | "P" | "cP"
  | "J" | "kJ" | "MJ" | "cal" | "kcal" | "BTU" | "eV" | "kWh" | "Wh" | "ft_lbf"
  | "m" | "cm" | "mm" | "km" | "inch" | "ft" | "yard" | "mile" | "um" | "nm" | "mil" | "nmi"
  | "kg" | "g" | "mg" | "lb" | "oz" | "ton" | "short_ton" | "long_ton" | "carat"
  | "m3" | "L" | "mL" | "cc" | "galUS" | "bbl" | "ft3" | "galUK" | "fl_oz"
  | "K" | "C" | "F" | "R"
  | "m2" | "cm2" | "mm2" | "km2" | "a" | "ha" | "pyeong" | "sqft" | "acre"
  | "W" | "kW" | "MW" | "hp" | "PS" | "kcal_per_h" | "RT"
  | "N" | "kN" | "kgf" | "tonf" | "lbf"
  | "m_per_s" | "km_per_h" | "mph" | "knot" | "fpm" | "ft_per_s"
  | "m2_per_s" | "St" | "cSt"
  | "m3_per_s" | "m3_per_h" | "m3_per_min" | "L_per_min" | "CFM" | "GPM" | "L_per_s" | "L_per_h"
  | "Nm" | "kNm" | "kgf_m" | "lbf_ft" | "lbf_in"
  | "kg_per_m3" | "g_per_cm3" | "lb_per_ft3" | "lb_per_gal" | "kg_per_L"
  | "deg" | "rad" | "grad" | "arcmin" | "arcsec" | "rev";

export interface UnitDefinition {
  id: UnitId;
  category: CategoryId;
  name: string;
  symbol: string;
  toSI: (value: Decimal) => Decimal;
  fromSI: (value: Decimal) => Decimal;
}

const ONE = new Decimal(1);
const PI = new Decimal("3.14159265358979323846");

/* ─── Conversion Factors (value × factor = SI base) ─── */

const PRESSURE_FACTORS = {
  kPa: new Decimal(1000), MPa: new Decimal(1000000), psi: new Decimal("6894.757293"),
  bar: new Decimal(100000), atm: new Decimal(101325), torr: new Decimal("133.322368"),
  kgf_per_cm2: new Decimal("98066.5"), mmH2O: new Decimal("9.80665"),
  inHg: new Decimal("3386.389"), inH2O: new Decimal("249.08891"),
};

const VISCOSITY_FACTORS = { P: new Decimal(0.1), cP: new Decimal(0.001) };

const ENERGY_FACTORS = {
  kJ: new Decimal(1000), MJ: new Decimal(1000000), cal: new Decimal("4.184"), kcal: new Decimal("4184"),
  BTU: new Decimal("1055.0558"), eV: new Decimal("1.6021e-19"), kWh: new Decimal(3600000),
  Wh: new Decimal(3600), ft_lbf: new Decimal("1.355818"),
};

const LENGTH_FACTORS = {
  cm: new Decimal(0.01), mm: new Decimal(0.001), km: new Decimal(1000),
  inch: new Decimal("0.0254"), ft: new Decimal("0.3048"), yard: new Decimal("0.9144"),
  mile: new Decimal("1609.344"), um: new Decimal("0.000001"),
  nm: new Decimal("1e-9"), mil: new Decimal("0.0000254"), nmi: new Decimal("1852"),
};

const MASS_FACTORS = {
  g: new Decimal(0.001), mg: new Decimal(0.000001), lb: new Decimal("0.453592"),
  oz: new Decimal("0.028349"), ton: new Decimal(1000),
  short_ton: new Decimal("907.18474"), long_ton: new Decimal("1016.0469"), carat: new Decimal("0.0002"),
};

const VOLUME_FACTORS = {
  L: new Decimal(0.001), mL: new Decimal(0.000001), cc: new Decimal(0.000001),
  galUS: new Decimal("0.003785"), bbl: new Decimal("0.158987"),
  ft3: new Decimal("0.0283168"), galUK: new Decimal("0.00454609"), fl_oz: new Decimal("0.0000295735"),
};

const AREA_FACTORS = {
  cm2: new Decimal(0.0001), mm2: new Decimal(0.000001), km2: new Decimal(1000000),
  a: new Decimal(100), ha: new Decimal(10000), pyeong: new Decimal("3.305785"),
  sqft: new Decimal("0.092903"), acre: new Decimal("4046.856"),
};

const POWER_FACTORS = {
  kW: new Decimal(1000), MW: new Decimal(1000000), hp: new Decimal("745.7"),
  PS: new Decimal("735.5"), kcal_per_h: new Decimal("1.16222"), RT: new Decimal("3516.85"),
};

const FORCE_FACTORS = {
  kN: new Decimal(1000), kgf: new Decimal("9.80665"), tonf: new Decimal("9806.65"), lbf: new Decimal("4.44822"),
};

const SPEED_FACTORS = {
  km_per_h: new Decimal("0.277778"), mph: new Decimal("0.44704"), knot: new Decimal("0.514444"),
  fpm: new Decimal("0.00508"), ft_per_s: new Decimal("0.3048"),
};

const FLOW_RATE_FACTORS = {
  m3_per_h: ONE.div(3600), m3_per_min: ONE.div(60), L_per_min: ONE.div(60000),
  CFM: new Decimal("0.0004719474"), GPM: new Decimal("0.00006309020"),
  L_per_s: new Decimal("0.001"), L_per_h: ONE.div(3600000),
};

const KINEMATIC_FACTORS = { St: new Decimal("0.0001"), cSt: new Decimal("0.000001") };

const TORQUE_FACTORS = {
  kNm: new Decimal(1000), kgf_m: new Decimal("9.80665"),
  lbf_ft: new Decimal("1.355818"), lbf_in: new Decimal("0.112985"),
};

const DENSITY_FACTORS = {
  g_per_cm3: new Decimal(1000), lb_per_ft3: new Decimal("16.01846"),
  lb_per_gal: new Decimal("119.8264"), kg_per_L: new Decimal(1000),
};

/* ─── Helper: build simple linear unit ─── */
function linear(id: UnitId, cat: CategoryId, name: string, sym: string, factor: Decimal): UnitDefinition {
  return { id, category: cat, name, symbol: sym, toSI: (v) => v.mul(factor), fromSI: (v) => v.div(factor) };
}
function base(id: UnitId, cat: CategoryId, name: string, sym: string): UnitDefinition {
  return { id, category: cat, name, symbol: sym, toSI: (v) => v, fromSI: (v) => v };
}

/* ─── Unit Definitions ─── */
const units: UnitDefinition[] = [
  // ── Pressure (SI base: Pa) ──
  base("Pa", "pressure", "Pascal", "Pa"),
  linear("kPa", "pressure", "Kilopascal", "kPa", PRESSURE_FACTORS.kPa),
  linear("MPa", "pressure", "Megapascal", "MPa", PRESSURE_FACTORS.MPa),
  linear("bar", "pressure", "Bar", "bar", PRESSURE_FACTORS.bar),
  linear("atm", "pressure", "Atmosphere", "atm", PRESSURE_FACTORS.atm),
  linear("psi", "pressure", "psi", "psi", PRESSURE_FACTORS.psi),
  linear("kgf_per_cm2", "pressure", "kgf/cm²", "kgf/cm²", PRESSURE_FACTORS.kgf_per_cm2),
  linear("mmH2O", "pressure", "mmH₂O", "mmH₂O", PRESSURE_FACTORS.mmH2O),
  linear("torr", "pressure", "Torr", "Torr", PRESSURE_FACTORS.torr),
  linear("inHg", "pressure", "inHg", "inHg", PRESSURE_FACTORS.inHg),
  linear("inH2O", "pressure", "inH₂O", "inH₂O", PRESSURE_FACTORS.inH2O),

  // ── Viscosity (SI base: Pa·s) ──
  base("Pa_s", "viscosity", "Pa·s", "Pa·s"),
  linear("P", "viscosity", "Poise", "P", VISCOSITY_FACTORS.P),
  linear("cP", "viscosity", "Centipoise", "cP", VISCOSITY_FACTORS.cP),

  // ── Kinematic Viscosity (SI base: m²/s) ──
  base("m2_per_s", "kinematicViscosity", "m²/s", "m²/s"),
  linear("St", "kinematicViscosity", "Stokes", "St", KINEMATIC_FACTORS.St),
  linear("cSt", "kinematicViscosity", "Centistokes", "cSt", KINEMATIC_FACTORS.cSt),

  // ── Energy (SI base: J) ──
  base("J", "energy", "Joule", "J"),
  linear("kJ", "energy", "Kilojoule", "kJ", ENERGY_FACTORS.kJ),
  linear("MJ", "energy", "Megajoule", "MJ", ENERGY_FACTORS.MJ),
  linear("cal", "energy", "Calorie", "cal", ENERGY_FACTORS.cal),
  linear("kcal", "energy", "Kilocalorie", "kcal", ENERGY_FACTORS.kcal),
  linear("BTU", "energy", "BTU", "BTU", ENERGY_FACTORS.BTU),
  linear("eV", "energy", "Electronvolt", "eV", ENERGY_FACTORS.eV),
  linear("kWh", "energy", "kWh", "kWh", ENERGY_FACTORS.kWh),
  linear("Wh", "energy", "Watt-hour", "Wh", ENERGY_FACTORS.Wh),
  linear("ft_lbf", "energy", "ft·lbf", "ft·lbf", ENERGY_FACTORS.ft_lbf),

  // ── Length (SI base: m) ──
  base("m", "length", "Meter", "m"),
  linear("cm", "length", "Centimeter", "cm", LENGTH_FACTORS.cm),
  linear("mm", "length", "Millimeter", "mm", LENGTH_FACTORS.mm),
  linear("um", "length", "Micrometer", "µm", LENGTH_FACTORS.um),
  linear("nm", "length", "Nanometer", "nm", LENGTH_FACTORS.nm),
  linear("km", "length", "Kilometer", "km", LENGTH_FACTORS.km),
  linear("inch", "length", "Inch", "in", LENGTH_FACTORS.inch),
  linear("ft", "length", "Feet", "ft", LENGTH_FACTORS.ft),
  linear("yard", "length", "Yard", "yd", LENGTH_FACTORS.yard),
  linear("mile", "length", "Mile", "mi", LENGTH_FACTORS.mile),
  linear("mil", "length", "Mil (thou)", "mil", LENGTH_FACTORS.mil),
  linear("nmi", "length", "Nautical Mile", "nmi", LENGTH_FACTORS.nmi),

  // ── Mass (SI base: kg) ──
  base("kg", "mass", "Kilogram", "kg"),
  linear("g", "mass", "Gram", "g", MASS_FACTORS.g),
  linear("mg", "mass", "Milligram", "mg", MASS_FACTORS.mg),
  linear("lb", "mass", "Pound", "lb", MASS_FACTORS.lb),
  linear("oz", "mass", "Ounce", "oz", MASS_FACTORS.oz),
  linear("ton", "mass", "Metric Ton", "t", MASS_FACTORS.ton),
  linear("short_ton", "mass", "Short Ton (US)", "sh tn", MASS_FACTORS.short_ton),
  linear("long_ton", "mass", "Long Ton (UK)", "lg tn", MASS_FACTORS.long_ton),
  linear("carat", "mass", "Carat", "ct", MASS_FACTORS.carat),

  // ── Volume (SI base: m³) ──
  base("m3", "volume", "m³", "m³"),
  linear("L", "volume", "Liter", "L", VOLUME_FACTORS.L),
  linear("mL", "volume", "Milliliter", "mL", VOLUME_FACTORS.mL),
  linear("cc", "volume", "cc (cm³)", "cc", VOLUME_FACTORS.cc),
  linear("galUS", "volume", "US Gallon", "gal", VOLUME_FACTORS.galUS),
  linear("galUK", "volume", "UK Gallon", "UK gal", VOLUME_FACTORS.galUK),
  linear("bbl", "volume", "Barrel", "bbl", VOLUME_FACTORS.bbl),
  linear("ft3", "volume", "Cubic Foot", "ft³", VOLUME_FACTORS.ft3),
  linear("fl_oz", "volume", "US Fluid Ounce", "fl oz", VOLUME_FACTORS.fl_oz),

  // ── Temperature (SI base: K) ──
  { id: "C", category: "temperature", name: "Celsius", symbol: "°C", toSI: (v) => v.plus(273.15), fromSI: (v) => v.minus(273.15) },
  { id: "F", category: "temperature", name: "Fahrenheit", symbol: "°F", toSI: (v) => v.minus(32).mul(5).div(9).plus(273.15), fromSI: (v) => v.minus(273.15).mul(9).div(5).plus(32) },
  base("K", "temperature", "Kelvin", "K"),
  { id: "R", category: "temperature", name: "Rankine", symbol: "°R", toSI: (v) => v.div(new Decimal("1.8")), fromSI: (v) => v.mul(new Decimal("1.8")) },

  // ── Area (SI base: m²) ──
  base("m2", "area", "m²", "m²"),
  linear("cm2", "area", "cm²", "cm²", AREA_FACTORS.cm2),
  linear("mm2", "area", "mm²", "mm²", AREA_FACTORS.mm2),
  linear("km2", "area", "km²", "km²", AREA_FACTORS.km2),
  linear("a", "area", "Are", "a", AREA_FACTORS.a),
  linear("ha", "area", "Hectare", "ha", AREA_FACTORS.ha),
  linear("pyeong", "area", "Pyeong", "평", AREA_FACTORS.pyeong),
  linear("sqft", "area", "sq ft", "ft²", AREA_FACTORS.sqft),
  linear("acre", "area", "Acre", "acre", AREA_FACTORS.acre),

  // ── Power (SI base: W) ──
  base("W", "power", "Watt", "W"),
  linear("kW", "power", "Kilowatt", "kW", POWER_FACTORS.kW),
  linear("MW", "power", "Megawatt", "MW", POWER_FACTORS.MW),
  linear("hp", "power", "Horsepower", "hp", POWER_FACTORS.hp),
  linear("PS", "power", "PS (Metric HP)", "PS", POWER_FACTORS.PS),
  linear("kcal_per_h", "power", "kcal/h", "kcal/h", POWER_FACTORS.kcal_per_h),
  linear("RT", "power", "Ton of Refrigeration", "RT", POWER_FACTORS.RT),

  // ── Force (SI base: N) ──
  base("N", "force", "Newton", "N"),
  linear("kN", "force", "Kilonewton", "kN", FORCE_FACTORS.kN),
  linear("kgf", "force", "kgf", "kgf", FORCE_FACTORS.kgf),
  linear("tonf", "force", "Ton-force", "tonf", FORCE_FACTORS.tonf),
  linear("lbf", "force", "Pound-force", "lbf", FORCE_FACTORS.lbf),

  // ── Speed (SI base: m/s) ──
  base("m_per_s", "speed", "m/s", "m/s"),
  linear("km_per_h", "speed", "km/h", "km/h", SPEED_FACTORS.km_per_h),
  linear("mph", "speed", "mph", "mph", SPEED_FACTORS.mph),
  linear("knot", "speed", "Knot", "knot", SPEED_FACTORS.knot),
  linear("fpm", "speed", "ft/min", "fpm", SPEED_FACTORS.fpm),
  linear("ft_per_s", "speed", "ft/s", "ft/s", SPEED_FACTORS.ft_per_s),

  // ── Flow Rate (SI base: m³/s) ──
  base("m3_per_s", "flowRate", "m³/s", "m³/s"),
  linear("m3_per_h", "flowRate", "m³/h (CMH)", "CMH", FLOW_RATE_FACTORS.m3_per_h),
  linear("m3_per_min", "flowRate", "m³/min", "m³/min", FLOW_RATE_FACTORS.m3_per_min),
  linear("L_per_min", "flowRate", "L/min (LPM)", "LPM", FLOW_RATE_FACTORS.L_per_min),
  linear("L_per_s", "flowRate", "L/s", "L/s", FLOW_RATE_FACTORS.L_per_s),
  linear("L_per_h", "flowRate", "L/h", "L/h", FLOW_RATE_FACTORS.L_per_h),
  linear("CFM", "flowRate", "CFM", "CFM", FLOW_RATE_FACTORS.CFM),
  linear("GPM", "flowRate", "GPM", "GPM", FLOW_RATE_FACTORS.GPM),

  // ── Torque (SI base: N·m) ──
  base("Nm", "torque", "N·m", "N·m"),
  linear("kNm", "torque", "kN·m", "kN·m", TORQUE_FACTORS.kNm),
  linear("kgf_m", "torque", "kgf·m", "kgf·m", TORQUE_FACTORS.kgf_m),
  linear("lbf_ft", "torque", "lbf·ft", "lbf·ft", TORQUE_FACTORS.lbf_ft),
  linear("lbf_in", "torque", "lbf·in", "lbf·in", TORQUE_FACTORS.lbf_in),

  // ── Density (SI base: kg/m³) ──
  base("kg_per_m3", "density", "kg/m³", "kg/m³"),
  linear("g_per_cm3", "density", "g/cm³", "g/cm³", DENSITY_FACTORS.g_per_cm3),
  linear("kg_per_L", "density", "kg/L", "kg/L", DENSITY_FACTORS.kg_per_L),
  linear("lb_per_ft3", "density", "lb/ft³", "lb/ft³", DENSITY_FACTORS.lb_per_ft3),
  linear("lb_per_gal", "density", "lb/gal", "lb/gal", DENSITY_FACTORS.lb_per_gal),

  // ── Angle (SI base: rad) ──
  base("rad", "angle", "Radian", "rad"),
  { id: "deg", category: "angle", name: "Degree", symbol: "°", toSI: (v) => v.mul(PI).div(180), fromSI: (v) => v.mul(180).div(PI) },
  { id: "grad", category: "angle", name: "Gradian", symbol: "grad", toSI: (v) => v.mul(PI).div(200), fromSI: (v) => v.mul(200).div(PI) },
  { id: "arcmin", category: "angle", name: "Arcminute", symbol: "′", toSI: (v) => v.mul(PI).div(10800), fromSI: (v) => v.mul(10800).div(PI) },
  { id: "arcsec", category: "angle", name: "Arcsecond", symbol: "″", toSI: (v) => v.mul(PI).div(648000), fromSI: (v) => v.mul(648000).div(PI) },
  { id: "rev", category: "angle", name: "Revolution", symbol: "rev", toSI: (v) => v.mul(PI).mul(2), fromSI: (v) => v.div(PI.mul(2)) },
];

const unitMap: Record<string, UnitDefinition> = units.reduce((acc, u) => { acc[u.id] = u; return acc; }, {} as Record<string, UnitDefinition>);

/* ─── Category list (display order) ─── */
export const categories: { id: string }[] = [
  { id: "area" }, { id: "length" }, { id: "mass" }, { id: "volume" },
  { id: "power" }, { id: "pressure" }, { id: "energy" }, { id: "force" },
  { id: "speed" }, { id: "flowRate" }, { id: "torque" }, { id: "density" },
  { id: "angle" }, { id: "viscosity" }, { id: "kinematicViscosity" }, { id: "temperature" },
];

/* ─── Default unit pairs per category ─── */
export const DEFAULT_UNITS: Record<CategoryId, { from: UnitId; to: UnitId }> = {
  pressure: { from: "bar", to: "psi" }, viscosity: { from: "Pa_s", to: "cP" },
  kinematicViscosity: { from: "cSt", to: "St" }, energy: { from: "kcal", to: "kJ" },
  length: { from: "mm", to: "inch" }, mass: { from: "kg", to: "lb" },
  volume: { from: "L", to: "galUS" }, temperature: { from: "C", to: "F" },
  area: { from: "m2", to: "pyeong" }, power: { from: "kW", to: "hp" },
  force: { from: "kgf", to: "N" }, speed: { from: "km_per_h", to: "mph" },
  flowRate: { from: "m3_per_h", to: "CFM" }, torque: { from: "Nm", to: "lbf_ft" },
  density: { from: "kg_per_m3", to: "g_per_cm3" }, angle: { from: "deg", to: "rad" },
};

/* ─── Quick Conversions (language-independent labels) ─── */
export const QUICK_CONVERSIONS: { label: string; category: CategoryId; fromId: UnitId; toId: UnitId }[] = [
  { label: "m² → 평", category: "area", fromId: "m2", toId: "pyeong" },
  { label: "mm → inch", category: "length", fromId: "mm", toId: "inch" },
  { label: "kg → lb", category: "mass", fromId: "kg", toId: "lb" },
  { label: "L → gal", category: "volume", fromId: "L", toId: "galUS" },
  { label: "kW → hp", category: "power", fromId: "kW", toId: "hp" },
  { label: "psi → bar", category: "pressure", fromId: "psi", toId: "bar" },
  { label: "kcal → kJ", category: "energy", fromId: "kcal", toId: "kJ" },
  { label: "kgf → N", category: "force", fromId: "kgf", toId: "N" },
  { label: "km/h → mph", category: "speed", fromId: "km_per_h", toId: "mph" },
  { label: "CMH → CFM", category: "flowRate", fromId: "m3_per_h", toId: "CFM" },
  { label: "N·m → lbf·ft", category: "torque", fromId: "Nm", toId: "lbf_ft" },
  { label: "g/cm³ → lb/ft³", category: "density", fromId: "g_per_cm3", toId: "lb_per_ft3" },
  { label: "° → rad", category: "angle", fromId: "deg", toId: "rad" },
  { label: "cP → Pa·s", category: "viscosity", fromId: "cP", toId: "Pa_s" },
  { label: "°C → °F", category: "temperature", fromId: "C", toId: "F" },
];

/* ─── Public API ─── */
export function getUnitsByCategory(category: CategoryId) { return units.filter((u) => u.category === category); }
export function getUnitLabel(u: UnitDefinition) { return `${u.symbol} (${u.name})`; }
export function parseToDecimal(i: string) { try { return new Decimal(i); } catch { return null; } }
export function formatDecimalForDisplay(v: Decimal) { return v.toSignificantDigits(10).toString(); }
export function convertUnit(cat: CategoryId, fromId: UnitId, toId: UnitId, val: Decimal) {
  const from = unitMap[fromId]; const to = unitMap[toId];
  return to.fromSI(from.toSI(val));
}
