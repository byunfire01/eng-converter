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
  | "Pa"
  | "kPa"
  | "MPa"
  | "psi"
  | "bar"
  | "atm"
  | "torr"
  | "kgf_per_cm2"
  | "mmH2O"
  | "Pa_s"
  | "P"
  | "cP"
  | "J"
  | "kJ"
  | "cal"
  | "kcal"
  | "BTU"
  | "eV"
  | "kWh"
  // length
  | "m"
  | "cm"
  | "mm"
  | "km"
  | "inch"
  | "ft"
  | "yard"
  | "mile"
  | "um"
  // mass
  | "kg"
  | "g"
  | "mg"
  | "lb"
  | "oz"
  | "ton"
  // volume
  | "m3"
  | "L"
  | "mL"
  | "cc"
  | "galUS"
  | "bbl"
  // temperature
  | "K"
  | "C"
  | "F"
  // area
  | "m2"
  | "cm2"
  | "mm2"
  | "km2"
  | "a"
  | "ha"
  | "pyeong"
  | "sqft"
  | "acre"
  // power
  | "W"
  | "kW"
  | "MW"
  | "hp"
  | "PS"
  | "kcal_per_h"
  | "RT"
  // force
  | "N"
  | "kN"
  | "kgf"
  | "tonf"
  | "lbf"
  // speed
  | "m_per_s"
  | "km_per_h"
  | "mph"
  | "knot"
  | "fpm"
  // kinematic viscosity
  | "m2_per_s"
  | "St"
  | "cSt"
  // flow rate
  | "m3_per_s"
  | "m3_per_h"
  | "m3_per_min"
  | "L_per_min"
  | "CFM"
  | "GPM";

export interface UnitDefinition {
  id: UnitId;
  category: CategoryId;
  name: string;
  symbol: string;
  /**
   * value: 입력 단위 값
   * 반환값: SI 기준 단위 값
   */
  toSI: (value: Decimal) => Decimal;
  /**
   * value: SI 기준 단위 값
   * 반환값: 출력 단위 값
   */
  fromSI: (value: Decimal) => Decimal;
}

const ONE = new Decimal(1);

// 물리 상수 및 변환 계수 (Decimal 사용)
const PRESSURE_FACTORS = {
  kPa: new Decimal(1_000), // 1 kPa = 1000 Pa
  MPa: new Decimal(1_000_000), // 1 MPa = 1e6 Pa
  psi: new Decimal("6894.757293168"), // 1 psi ≈ 6894.757293168 Pa
  bar: new Decimal(100_000), // 1 bar = 1e5 Pa
  atm: new Decimal(101_325), // 1 atm = 101325 Pa
  torr: new Decimal("133.3223684211"), // 1 torr ≈ 133.3223684211 Pa
  kgf_per_cm2: new Decimal("98066.5"), // 1 kgf/cm² = 98066.5 Pa
  mmH2O: new Decimal("9.80665"), // 1 mmH2O = 9.80665 Pa
} as const;

const VISCOSITY_FACTORS = {
  P: new Decimal(0.1), // 1 Poise = 0.1 Pa·s
  cP: new Decimal(0.001), // 1 cP = 0.001 Pa·s
} as const;

const ENERGY_FACTORS = {
  kJ: new Decimal(1_000), // 1 kJ = 1000 J
  cal: new Decimal("4.184"), // 1 cal ≈ 4.184 J
  kcal: new Decimal("4184"), // 1 kcal = 4184 J
  BTU: new Decimal("1055.05585262"), // 1 BTU ≈ 1055.05585262 J
  eV: new Decimal("1.602176634e-19"), // 1 eV = 1.602176634e-19 J
  kWh: new Decimal(3_600_000), // 1 kWh = 3.6e6 J
} as const;

// 길이 (Length) - SI: meter (m)
const LENGTH_FACTORS = {
  cm: new Decimal(0.01), // 1 cm = 0.01 m
  mm: new Decimal(0.001), // 1 mm = 0.001 m
  km: new Decimal(1000), // 1 km = 1000 m
  inch: new Decimal("0.0254"), // 1 in = 0.0254 m
  ft: new Decimal("0.3048"), // 1 ft = 0.3048 m
  yard: new Decimal("0.9144"), // 1 yd = 0.9144 m
  mile: new Decimal("1609.344"), // 1 mile = 1609.344 m
  um: new Decimal("0.000001"), // 1 µm = 1e-6 m
} as const;

// 질량 (Mass) - SI: kilogram (kg)
const MASS_FACTORS = {
  g: new Decimal(0.001), // 1 g = 0.001 kg
  mg: new Decimal(0.000001), // 1 mg = 1e-6 kg
  lb: new Decimal("0.45359237"), // 1 lb = 0.45359237 kg
  oz: new Decimal("0.028349523125"), // 1 oz = 0.028349523125 kg
  ton: new Decimal(1000), // 1 metric ton = 1000 kg
} as const;

// 부피 (Volume) - SI: cubic meter (m^3)
const VOLUME_FACTORS = {
  L: new Decimal(0.001), // 1 L = 1e-3 m^3
  mL: new Decimal(0.000001), // 1 mL = 1e-6 m^3
  cc: new Decimal(0.000001), // 1 cc = 1e-6 m^3
  galUS: new Decimal("0.003785411784"), // 1 US gallon = 0.003785411784 m^3
  bbl: new Decimal("0.158987294928"), // 1 bbl (petroleum barrel) ≈ 0.158987294928 m^3
} as const;

// 면적 (Area) - SI: square meter (m^2)
const AREA_FACTORS = {
  cm2: new Decimal(0.0001), // 1 cm² = 1e-4 m²
  mm2: new Decimal(0.000001), // 1 mm² = 1e-6 m²
  km2: new Decimal(1_000_000), // 1 km² = 1e6 m²
  a: new Decimal(100), // 1 a = 100 m²
  ha: new Decimal(10_000), // 1 ha = 1e4 m²
  pyeong: new Decimal("3.305785"), // 1 평 ≈ 3.305785 m²
  sqft: new Decimal("0.09290304"), // 1 ft² = 0.09290304 m²
  acre: new Decimal("4046.8564224"), // 1 acre = 4046.8564224 m²
} as const;

// 동력 / 일률 (Power) - SI: watt (W)
const POWER_FACTORS = {
  kW: new Decimal(1_000), // 1 kW = 1000 W
  MW: new Decimal(1_000_000), // 1 MW = 1e6 W
  hp: new Decimal("745.69987158227022"), // 1 hp (mechanical horsepower) ≈ 745.69987158227022 W
  PS: new Decimal("735.49875"), // 1 PS (metric horsepower) = 735.49875 W
  kcal_per_h: new Decimal("1.16222"), // 1 kcal/h = 1.16222 W
  RT: new Decimal("3516.85"), // 1 RT (US refrigeration ton) ≈ 3516.85 W
} as const;

// 힘 / 하중 (Force) - SI: newton (N)
const FORCE_FACTORS = {
  kN: new Decimal(1_000), // 1 kN = 1000 N
  kgf: new Decimal("9.80665"), // 1 kgf = 9.80665 N
  tonf: new Decimal("9806.65"), // 1 tonf (metric) = 9806.65 N
  lbf: new Decimal("4.4482216152605"), // 1 lbf ≈ 4.4482216152605 N
} as const;

// 속도 (Speed) - SI: meter per second (m/s)
const SPEED_FACTORS = {
  km_per_h: new Decimal("0.2777777777777778"), // 1 km/h = (1000/3600) m/s
  mph: new Decimal("0.44704"), // 1 mph = 0.44704 m/s
  knot: new Decimal("0.5144444444444445"), // 1 knot = 0.514444... m/s
  fpm: new Decimal("0.00508"), // 1 fpm = 0.00508 m/s
} as const;

// 유량 (Flow rate) - SI: cubic meter per second (m^3/s)
const FLOW_RATE_FACTORS = {
  m3_per_h: ONE.div(3600), // 1 m³/h = 1/3600 m³/s
  m3_per_min: ONE.div(60), // 1 m³/min = 1/60 m³/s
  L_per_min: ONE.div(60_000), // 1 L/min = (1e-3 / 60) m³/s
  CFM: new Decimal("0.0004719474"), // 1 CFM = 0.0004719474 m³/s
  GPM: new Decimal("0.00006309020"), // 1 GPM = 0.00006309020 m³/s
} as const;

// 동점도 (Kinematic viscosity) - SI: m²/s
const KINEMATIC_VISCOSITY_FACTORS = {
  St: new Decimal("0.0001"), // 1 St = 1e-4 m²/s
  cSt: new Decimal("0.000001"), // 1 cSt = 1e-6 m²/s
} as const;

const units: UnitDefinition[] = [
  // 압력 - Pressure (SI: Pa)
  {
    id: "Pa",
    category: "pressure",
    name: "Pascal",
    symbol: "Pa",
    toSI: (v) => v,
    fromSI: (v) => v,
  },
  {
    id: "kPa",
    category: "pressure",
    name: "Kilopascal",
    symbol: "kPa",
    toSI: (v) => v.mul(PRESSURE_FACTORS.kPa),
    fromSI: (v) => v.div(PRESSURE_FACTORS.kPa),
  },
  {
    id: "MPa",
    category: "pressure",
    name: "Megapascal",
    symbol: "MPa",
    toSI: (v) => v.mul(PRESSURE_FACTORS.MPa),
    fromSI: (v) => v.div(PRESSURE_FACTORS.MPa),
  },
  {
    id: "psi",
    category: "pressure",
    name: "Pound per square inch",
    symbol: "psi",
    toSI: (v) => v.mul(PRESSURE_FACTORS.psi),
    fromSI: (v) => v.div(PRESSURE_FACTORS.psi),
  },
  {
    id: "bar",
    category: "pressure",
    name: "Bar",
    symbol: "bar",
    toSI: (v) => v.mul(PRESSURE_FACTORS.bar),
    fromSI: (v) => v.div(PRESSURE_FACTORS.bar),
  },
  {
    id: "atm",
    category: "pressure",
    name: "Standard atmosphere",
    symbol: "atm",
    toSI: (v) => v.mul(PRESSURE_FACTORS.atm),
    fromSI: (v) => v.div(PRESSURE_FACTORS.atm),
  },
  {
    id: "torr",
    category: "pressure",
    name: "Torr",
    symbol: "Torr",
    toSI: (v) => v.mul(PRESSURE_FACTORS.torr),
    fromSI: (v) => v.div(PRESSURE_FACTORS.torr),
  },
  {
    id: "kgf_per_cm2",
    category: "pressure",
    name: "Kilogram-force per square centimeter",
    symbol: "kgf/cm²",
    toSI: (v) => v.mul(PRESSURE_FACTORS.kgf_per_cm2),
    fromSI: (v) => v.div(PRESSURE_FACTORS.kgf_per_cm2),
  },
  {
    id: "mmH2O",
    category: "pressure",
    name: "Millimeter of water",
    symbol: "mmH₂O",
    toSI: (v) => v.mul(PRESSURE_FACTORS.mmH2O),
    fromSI: (v) => v.div(PRESSURE_FACTORS.mmH2O),
  },

  // 점성 (동점성계수) - Dynamic viscosity (SI: Pa·s)
  {
    id: "Pa_s",
    category: "viscosity",
    name: "Pascal second",
    symbol: "Pa·s",
    toSI: (v) => v,
    fromSI: (v) => v,
  },
  {
    id: "P",
    category: "viscosity",
    name: "Poise",
    symbol: "P",
    toSI: (v) => v.mul(VISCOSITY_FACTORS.P),
    fromSI: (v) => v.div(VISCOSITY_FACTORS.P),
  },
  {
    id: "cP",
    category: "viscosity",
    name: "Centipoise",
    symbol: "cP",
    toSI: (v) => v.mul(VISCOSITY_FACTORS.cP),
    fromSI: (v) => v.div(VISCOSITY_FACTORS.cP),
  },

  // 에너지/일 - Energy / Work (SI: J)
  {
    id: "J",
    category: "energy",
    name: "Joule",
    symbol: "J",
    toSI: (v) => v,
    fromSI: (v) => v,
  },
  {
    id: "kJ",
    category: "energy",
    name: "Kilojoule",
    symbol: "kJ",
    toSI: (v) => v.mul(ENERGY_FACTORS.kJ),
    fromSI: (v) => v.div(ENERGY_FACTORS.kJ),
  },
  {
    id: "cal",
    category: "energy",
    name: "Calorie",
    symbol: "cal",
    toSI: (v) => v.mul(ENERGY_FACTORS.cal),
    fromSI: (v) => v.div(ENERGY_FACTORS.cal),
  },
  {
    id: "kcal",
    category: "energy",
    name: "Kilocalorie",
    symbol: "kcal",
    toSI: (v) => v.mul(ENERGY_FACTORS.kcal),
    fromSI: (v) => v.div(ENERGY_FACTORS.kcal),
  },
  {
    id: "BTU",
    category: "energy",
    name: "British thermal unit",
    symbol: "BTU",
    toSI: (v) => v.mul(ENERGY_FACTORS.BTU),
    fromSI: (v) => v.div(ENERGY_FACTORS.BTU),
  },
  {
    id: "eV",
    category: "energy",
    name: "Electronvolt",
    symbol: "eV",
    toSI: (v) => v.mul(ENERGY_FACTORS.eV),
    fromSI: (v) => v.div(ENERGY_FACTORS.eV),
  },
  {
    id: "kWh",
    category: "energy",
    name: "Kilowatt-hour",
    symbol: "kWh",
    toSI: (v) => v.mul(ENERGY_FACTORS.kWh),
    fromSI: (v) => v.div(ENERGY_FACTORS.kWh),
  },

  // 길이 - Length (SI: m)
  {
    id: "m",
    category: "length",
    name: "Meter",
    symbol: "m",
    toSI: (v) => v,
    fromSI: (v) => v,
  },
  {
    id: "cm",
    category: "length",
    name: "Centimeter",
    symbol: "cm",
    toSI: (v) => v.mul(LENGTH_FACTORS.cm),
    fromSI: (v) => v.div(LENGTH_FACTORS.cm),
  },
  {
    id: "mm",
    category: "length",
    name: "Millimeter",
    symbol: "mm",
    toSI: (v) => v.mul(LENGTH_FACTORS.mm),
    fromSI: (v) => v.div(LENGTH_FACTORS.mm),
  },
  {
    id: "km",
    category: "length",
    name: "Kilometer",
    symbol: "km",
    toSI: (v) => v.mul(LENGTH_FACTORS.km),
    fromSI: (v) => v.div(LENGTH_FACTORS.km),
  },
  {
    id: "inch",
    category: "length",
    name: "Inch",
    symbol: "in",
    toSI: (v) => v.mul(LENGTH_FACTORS.inch),
    fromSI: (v) => v.div(LENGTH_FACTORS.inch),
  },
  {
    id: "ft",
    category: "length",
    name: "Foot",
    symbol: "ft",
    toSI: (v) => v.mul(LENGTH_FACTORS.ft),
    fromSI: (v) => v.div(LENGTH_FACTORS.ft),
  },
  {
    id: "yard",
    category: "length",
    name: "Yard",
    symbol: "yd",
    toSI: (v) => v.mul(LENGTH_FACTORS.yard),
    fromSI: (v) => v.div(LENGTH_FACTORS.yard),
  },
  {
    id: "mile",
    category: "length",
    name: "Mile",
    symbol: "mi",
    toSI: (v) => v.mul(LENGTH_FACTORS.mile),
    fromSI: (v) => v.div(LENGTH_FACTORS.mile),
  },
  {
    id: "um",
    category: "length",
    name: "Micrometer",
    symbol: "µm",
    toSI: (v) => v.mul(LENGTH_FACTORS.um),
    fromSI: (v) => v.div(LENGTH_FACTORS.um),
  },

  // 질량 / 무게 - Mass (SI: kg)
  {
    id: "kg",
    category: "mass",
    name: "Kilogram",
    symbol: "kg",
    toSI: (v) => v,
    fromSI: (v) => v,
  },
  {
    id: "g",
    category: "mass",
    name: "Gram",
    symbol: "g",
    toSI: (v) => v.mul(MASS_FACTORS.g),
    fromSI: (v) => v.div(MASS_FACTORS.g),
  },
  {
    id: "mg",
    category: "mass",
    name: "Milligram",
    symbol: "mg",
    toSI: (v) => v.mul(MASS_FACTORS.mg),
    fromSI: (v) => v.div(MASS_FACTORS.mg),
  },
  {
    id: "lb",
    category: "mass",
    name: "Pound",
    symbol: "lb",
    toSI: (v) => v.mul(MASS_FACTORS.lb),
    fromSI: (v) => v.div(MASS_FACTORS.lb),
  },
  {
    id: "oz",
    category: "mass",
    name: "Ounce",
    symbol: "oz",
    toSI: (v) => v.mul(MASS_FACTORS.oz),
    fromSI: (v) => v.div(MASS_FACTORS.oz),
  },
  {
    id: "ton",
    category: "mass",
    name: "Metric ton",
    symbol: "t",
    toSI: (v) => v.mul(MASS_FACTORS.ton),
    fromSI: (v) => v.div(MASS_FACTORS.ton),
  },

  // 부피 - Volume (SI: m^3)
  {
    id: "m3",
    category: "volume",
    name: "Cubic meter",
    symbol: "m³",
    toSI: (v) => v,
    fromSI: (v) => v,
  },
  {
    id: "L",
    category: "volume",
    name: "Liter",
    symbol: "L",
    toSI: (v) => v.mul(VOLUME_FACTORS.L),
    fromSI: (v) => v.div(VOLUME_FACTORS.L),
  },
  {
    id: "mL",
    category: "volume",
    name: "Milliliter",
    symbol: "mL",
    toSI: (v) => v.mul(VOLUME_FACTORS.mL),
    fromSI: (v) => v.div(VOLUME_FACTORS.mL),
  },
  {
    id: "cc",
    category: "volume",
    name: "Cubic centimeter",
    symbol: "cc",
    toSI: (v) => v.mul(VOLUME_FACTORS.cc),
    fromSI: (v) => v.div(VOLUME_FACTORS.cc),
  },
  {
    id: "galUS",
    category: "volume",
    name: "US gallon",
    symbol: "gal (US)",
    toSI: (v) => v.mul(VOLUME_FACTORS.galUS),
    fromSI: (v) => v.div(VOLUME_FACTORS.galUS),
  },
  {
    id: "bbl",
    category: "volume",
    name: "Barrel",
    symbol: "bbl",
    toSI: (v) => v.mul(VOLUME_FACTORS.bbl),
    fromSI: (v) => v.div(VOLUME_FACTORS.bbl),
  },

  // 온도 - Temperature (SI: K)
  // 주의: 단순 배율이 아닌 오프셋(덧셈/뺄셈)이 포함되므로 개별적으로 정의
  {
    id: "K",
    category: "temperature",
    name: "Kelvin",
    symbol: "K",
    toSI: (v) => v,
    fromSI: (v) => v,
  },
  {
    id: "C",
    category: "temperature",
    name: "Celsius",
    symbol: "°C",
    toSI: (v) => v.plus(273.15), // °C → K
    fromSI: (v) => v.minus(273.15), // K → °C
  },
  {
    id: "F",
    category: "temperature",
    name: "Fahrenheit",
    symbol: "°F",
    toSI: (v) =>
      // (°F - 32) × 5/9 + 273.15
      v.minus(32).mul(new Decimal(5).div(9)).plus(273.15),
    fromSI: (v) =>
      // (K - 273.15) × 9/5 + 32
      v.minus(273.15).mul(new Decimal(9).div(5)).plus(32),
  },

  // 면적 - Area (SI: m²)
  {
    id: "m2",
    category: "area",
    name: "Square meter",
    symbol: "m²",
    toSI: (v) => v,
    fromSI: (v) => v,
  },
  {
    id: "cm2",
    category: "area",
    name: "Square centimeter",
    symbol: "cm²",
    toSI: (v) => v.mul(AREA_FACTORS.cm2),
    fromSI: (v) => v.div(AREA_FACTORS.cm2),
  },
  {
    id: "mm2",
    category: "area",
    name: "Square millimeter",
    symbol: "mm²",
    toSI: (v) => v.mul(AREA_FACTORS.mm2),
    fromSI: (v) => v.div(AREA_FACTORS.mm2),
  },
  {
    id: "km2",
    category: "area",
    name: "Square kilometer",
    symbol: "km²",
    toSI: (v) => v.mul(AREA_FACTORS.km2),
    fromSI: (v) => v.div(AREA_FACTORS.km2),
  },
  {
    id: "a",
    category: "area",
    name: "Are",
    symbol: "a",
    toSI: (v) => v.mul(AREA_FACTORS.a),
    fromSI: (v) => v.div(AREA_FACTORS.a),
  },
  {
    id: "ha",
    category: "area",
    name: "Hectare",
    symbol: "ha",
    toSI: (v) => v.mul(AREA_FACTORS.ha),
    fromSI: (v) => v.div(AREA_FACTORS.ha),
  },
  {
    id: "pyeong",
    category: "area",
    name: "Pyeong",
    symbol: "평",
    toSI: (v) => v.mul(AREA_FACTORS.pyeong),
    fromSI: (v) => v.div(AREA_FACTORS.pyeong),
  },
  {
    id: "sqft",
    category: "area",
    name: "Square foot",
    symbol: "ft²",
    toSI: (v) => v.mul(AREA_FACTORS.sqft),
    fromSI: (v) => v.div(AREA_FACTORS.sqft),
  },
  {
    id: "acre",
    category: "area",
    name: "Acre",
    symbol: "acre",
    toSI: (v) => v.mul(AREA_FACTORS.acre),
    fromSI: (v) => v.div(AREA_FACTORS.acre),
  },

  // 동력 / 일률 - Power (SI: W)
  {
    id: "W",
    category: "power",
    name: "Watt",
    symbol: "W",
    toSI: (v) => v,
    fromSI: (v) => v,
  },
  {
    id: "kW",
    category: "power",
    name: "Kilowatt",
    symbol: "kW",
    toSI: (v) => v.mul(POWER_FACTORS.kW),
    fromSI: (v) => v.div(POWER_FACTORS.kW),
  },
  {
    id: "MW",
    category: "power",
    name: "Megawatt",
    symbol: "MW",
    toSI: (v) => v.mul(POWER_FACTORS.MW),
    fromSI: (v) => v.div(POWER_FACTORS.MW),
  },
  {
    id: "hp",
    category: "power",
    name: "Horsepower (mechanical)",
    symbol: "hp",
    toSI: (v) => v.mul(POWER_FACTORS.hp),
    fromSI: (v) => v.div(POWER_FACTORS.hp),
  },
  {
    id: "PS",
    category: "power",
    name: "Pferdestärke (metric horsepower)",
    symbol: "PS",
    toSI: (v) => v.mul(POWER_FACTORS.PS),
    fromSI: (v) => v.div(POWER_FACTORS.PS),
  },
  {
    id: "kcal_per_h",
    category: "power",
    name: "Kilocalorie per hour",
    symbol: "kcal/h",
    toSI: (v) => v.mul(POWER_FACTORS.kcal_per_h),
    fromSI: (v) => v.div(POWER_FACTORS.kcal_per_h),
  },
  {
    id: "RT",
    category: "power",
    name: "Refrigeration ton (US)",
    symbol: "RT",
    toSI: (v) => v.mul(POWER_FACTORS.RT),
    fromSI: (v) => v.div(POWER_FACTORS.RT),
  },

  // 힘 / 하중 - Force (SI: N)
  {
    id: "N",
    category: "force",
    name: "Newton",
    symbol: "N",
    toSI: (v) => v,
    fromSI: (v) => v,
  },
  {
    id: "kN",
    category: "force",
    name: "Kilonewton",
    symbol: "kN",
    toSI: (v) => v.mul(FORCE_FACTORS.kN),
    fromSI: (v) => v.div(FORCE_FACTORS.kN),
  },
  {
    id: "kgf",
    category: "force",
    name: "Kilogram-force",
    symbol: "kgf",
    toSI: (v) => v.mul(FORCE_FACTORS.kgf),
    fromSI: (v) => v.div(FORCE_FACTORS.kgf),
  },
  {
    id: "tonf",
    category: "force",
    name: "Ton-force (metric)",
    symbol: "tonf",
    toSI: (v) => v.mul(FORCE_FACTORS.tonf),
    fromSI: (v) => v.div(FORCE_FACTORS.tonf),
  },
  {
    id: "lbf",
    category: "force",
    name: "Pound-force",
    symbol: "lbf",
    toSI: (v) => v.mul(FORCE_FACTORS.lbf),
    fromSI: (v) => v.div(FORCE_FACTORS.lbf),
  },

  // 속도 - Speed (SI: m/s)
  {
    id: "m_per_s",
    category: "speed",
    name: "Meters per second",
    symbol: "m/s",
    toSI: (v) => v,
    fromSI: (v) => v,
  },
  {
    id: "km_per_h",
    category: "speed",
    name: "Kilometers per hour",
    symbol: "km/h",
    toSI: (v) => v.mul(SPEED_FACTORS.km_per_h),
    fromSI: (v) => v.div(SPEED_FACTORS.km_per_h),
  },
  {
    id: "mph",
    category: "speed",
    name: "Miles per hour",
    symbol: "mph",
    toSI: (v) => v.mul(SPEED_FACTORS.mph),
    fromSI: (v) => v.div(SPEED_FACTORS.mph),
  },
  {
    id: "knot",
    category: "speed",
    name: "Knot",
    symbol: "kn",
    toSI: (v) => v.mul(SPEED_FACTORS.knot),
    fromSI: (v) => v.div(SPEED_FACTORS.knot),
  },
  {
    id: "fpm",
    category: "speed",
    name: "Feet per minute",
    symbol: "ft/min",
    toSI: (v) => v.mul(SPEED_FACTORS.fpm),
    fromSI: (v) => v.div(SPEED_FACTORS.fpm),
  },

  // 유량 - Flow rate (SI: m³/s)
  {
    id: "m3_per_s",
    category: "flowRate",
    name: "Cubic meter per second",
    symbol: "m³/s",
    toSI: (v) => v,
    fromSI: (v) => v,
  },
  {
    id: "m3_per_h",
    category: "flowRate",
    name: "Cubic meter per hour",
    symbol: "m³/h (CMH)",
    toSI: (v) => v.mul(FLOW_RATE_FACTORS.m3_per_h),
    fromSI: (v) => v.div(FLOW_RATE_FACTORS.m3_per_h),
  },
  {
    id: "m3_per_min",
    category: "flowRate",
    name: "Cubic meter per minute",
    symbol: "m³/min (CMM)",
    toSI: (v) => v.mul(FLOW_RATE_FACTORS.m3_per_min),
    fromSI: (v) => v.div(FLOW_RATE_FACTORS.m3_per_min),
  },
  {
    id: "L_per_min",
    category: "flowRate",
    name: "Liter per minute",
    symbol: "L/min (LPM)",
    toSI: (v) => v.mul(FLOW_RATE_FACTORS.L_per_min),
    fromSI: (v) => v.div(FLOW_RATE_FACTORS.L_per_min),
  },
  {
    id: "CFM",
    category: "flowRate",
    name: "Cubic feet per minute",
    symbol: "CFM",
    toSI: (v) => v.mul(FLOW_RATE_FACTORS.CFM),
    fromSI: (v) => v.div(FLOW_RATE_FACTORS.CFM),
  },
  {
    id: "GPM",
    category: "flowRate",
    name: "US gallons per minute",
    symbol: "GPM",
    toSI: (v) => v.mul(FLOW_RATE_FACTORS.GPM),
    fromSI: (v) => v.div(FLOW_RATE_FACTORS.GPM),
  },

  // 동점도 - Kinematic viscosity (SI: m²/s)
  {
    id: "m2_per_s",
    category: "kinematicViscosity",
    name: "Square meter per second",
    symbol: "m²/s",
    toSI: (v) => v,
    fromSI: (v) => v,
  },
  {
    id: "St",
    category: "kinematicViscosity",
    name: "Stokes",
    symbol: "St",
    toSI: (v) => v.mul(KINEMATIC_VISCOSITY_FACTORS.St),
    fromSI: (v) => v.div(KINEMATIC_VISCOSITY_FACTORS.St),
  },
  {
    id: "cSt",
    category: "kinematicViscosity",
    name: "Centistokes",
    symbol: "cSt",
    toSI: (v) => v.mul(KINEMATIC_VISCOSITY_FACTORS.cSt),
    fromSI: (v) => v.div(KINEMATIC_VISCOSITY_FACTORS.cSt),
  },
];

const unitMap: Record<UnitId, UnitDefinition> = units.reduce(
  (acc, u) => {
    acc[u.id] = u;
    return acc;
  },
  {} as Record<UnitId, UnitDefinition>,
);

export const categories: { id: CategoryId; label: string; description: string }[] =
  [
    {
      id: "pressure",
      label: "압력 (Pressure)",
      description:
        "Pa, kPa, MPa, psi, bar, atm, torr, kgf/cm², mmH₂O",
    },
    {
      id: "viscosity",
      label: "점도 (Dynamic viscosity)",
      description: "Pa·s, Poise, cP",
    },
    {
      id: "kinematicViscosity",
      label: "동점도 (Kinematic viscosity)",
      description: "m²/s, St, cSt",
    },
    {
      id: "energy",
      label: "에너지 / 일 (Energy / Work)",
      description: "J, kJ, cal, kcal, kWh, BTU, eV",
    },
    {
      id: "length",
      label: "길이 (Length)",
      description: "m, cm, mm, km, inch, ft, yard, mile, µm",
    },
    {
      id: "mass",
      label: "질량 / 무게 (Mass)",
      description: "kg, g, mg, lb, oz, t",
    },
    {
      id: "volume",
      label: "부피 (Volume)",
      description: "m³, L, mL, cc, gal(US), bbl",
    },
    {
      id: "temperature",
      label: "온도 (Temperature)",
      description: "K, °C, °F",
    },
    {
      id: "area",
      label: "면적 (Area)",
      description:
        "m², cm², mm², km², a, ha, 평, sq ft, acre",
    },
    {
      id: "power",
      label: "동력 / 일률 (Power)",
      description: "W, kW, MW, hp, PS, kcal/h, RT",
    },
    {
      id: "force",
      label: "힘 / 하중 (Force)",
      description: "N, kN, kgf, tonf, lbf",
    },
    {
      id: "speed",
      label: "속도 (Speed)",
      description: "m/s, km/h, mph, knot, fpm",
    },
    {
      id: "flowRate",
      label: "유량 (Flow Rate)",
      description: "m³/s, m³/h, m³/min, L/min, CFM, GPM",
    },
  ];

/**
 * 카테고리별 기본 변환 단위 (from: SI 기준 단위 ID, to: 출력 단위 ID).
 * getDefaultUnits 등 UI에서 사용. 단일 소스로 ID 오타/불일치 방지.
 */
export const DEFAULT_UNITS: Record<
  CategoryId,
  { from: UnitId; to: UnitId }
> = {
  pressure: { from: "Pa", to: "bar" },
  viscosity: { from: "Pa_s", to: "cP" },
  kinematicViscosity: { from: "m2_per_s", to: "cSt" },
  energy: { from: "J", to: "kJ" },
  length: { from: "m", to: "km" },
  mass: { from: "kg", to: "lb" },
  volume: { from: "m3", to: "L" },
  temperature: { from: "C", to: "K" },
  area: { from: "m2", to: "pyeong" },
  power: { from: "W", to: "kW" },
  force: { from: "N", to: "kN" },
  speed: { from: "m_per_s", to: "km_per_h" },
  flowRate: { from: "m3_per_s", to: "CFM" },
};

export function getUnitsByCategory(category: CategoryId): UnitDefinition[] {
  return units.filter((u) => u.category === category);
}

/**
 * SI 기준 단위 아키텍처:
 * 입력 단위 -> SI 기준 단위 -> 출력 단위
 */
export function convertUnit(
  category: CategoryId,
  fromUnitId: UnitId,
  toUnitId: UnitId,
  value: Decimal,
): Decimal {
  const from = unitMap[fromUnitId];
  const to = unitMap[toUnitId];

  if (!from || !to) {
    throw new Error("지원하지 않는 단위입니다.");
  }
  if (from.category !== category || to.category !== category) {
    throw new Error("서로 다른 카테고리 간 변환은 허용되지 않습니다.");
  }

  // 1. 입력 단위 -> SI 기준 단위
  const valueInSI = from.toSI(value);
  // 2. SI 기준 단위 -> 출력 단위
  const result = to.fromSI(valueInSI);

  return result;
}

/**
 * 결과를 UI용 문자열로 포맷팅.
 * - 너무 크거나 작으면 과학적 기수법 (e.g., 1.5e-6)
 * - 그렇지 않으면 적당한 자릿수로 고정 소수점
 */
export function formatDecimalForDisplay(value: Decimal): string {
  if (!value.isFinite()) return "NaN";
  if (value.isZero()) return "0";

  // 절댓값 기준으로 범위를 보고 과학적 기수법 여부 결정
  const abs = value.abs();
  const useExponential =
    abs.lessThan(new Decimal("1e-4")) || abs.greaterThan(new Decimal("1e6"));

  if (useExponential) {
    // 과학적 기수법, 6 유효숫자
    const expStr = value.toExponential(6);
    // Decimal.js는 '1.234000e+5' 형태를 줄 수 있으므로, 보기 좋게 정리
    const [coeff, exp] = expStr.split("e");
    const trimmedCoeff = trimTrailingZeros(coeff);
    const cleanedExp = exp.replace(/\+/g, "").replace(/^0+(-?)/, "$1");
    return `${trimmedCoeff}e${cleanedExp}`;
  }

  // 일반적인 범위에서는 최대 12 유효숫자
  const normal = value.toSignificantDigits(12).toString();
  return trimTrailingZeros(normal);
}

function trimTrailingZeros(numStr: string): string {
  if (!numStr.includes(".")) return numStr;
  return numStr.replace(/(\.\d*?[1-9])0+$/u, "$1").replace(/\.0+$/u, "");
}

export function parseToDecimal(input: string): Decimal | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    const d = new Decimal(trimmed);
    if (!d.isFinite()) return null;
    return d;
  } catch {
    return null;
  }
}

export function getUnitLabel(u: UnitDefinition): string {
  return `${u.symbol} (${u.name})`;
}

