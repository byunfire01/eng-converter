export default function FeatureGraphic() {
  return (
    <div style={{ background: "#000", width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: 1024,
          height: 500,
          transform: "scale(0.58)",
          transformOrigin: "center center",
          overflow: "hidden",
          fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
          background: "linear-gradient(135deg, #0d1117 0%, #161b22 40%, #0d1117 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderRadius: 4,
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(52,211,153,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow orbs */}
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)", top: -100, right: 100 }} />
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)", bottom: -80, left: 60 }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 50, padding: "0 60px", width: "100%" }}>
          {/* Left */}
          <div style={{ flex: 1 }}>
            <div style={{
              display: "inline-block", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)",
              color: "#34d399", fontSize: 13, fontWeight: 600, padding: "4px 14px", borderRadius: 20, marginBottom: 18, letterSpacing: 0.5,
            }}>
              HIGH-PRECISION SI ENGINE
            </div>
            <div style={{ color: "#f0f6fc", fontSize: 42, fontWeight: 800, lineHeight: 1.15, letterSpacing: -1, marginBottom: 14 }}>
              Engineering<br />Unit <span style={{ color: "#34d399" }}>Converter</span>
            </div>
            <div style={{ color: "#8b949e", fontSize: 17, lineHeight: 1.5, maxWidth: 400 }}>
              Professional-grade unit conversion for engineers.<br />
              Decimal.js powered, zero floating-point errors.
            </div>
            <div style={{ display: "flex", gap: 30, marginTop: 24 }}>
              {[{ num: "16", label: "Categories" }, { num: "110+", label: "Units" }, { num: "2", label: "Languages" }].map((s) => (
                <div key={s.label} style={{ textAlign: "center" as const }}>
                  <div style={{ color: "#34d399", fontSize: 28, fontWeight: 800 }}>{s.num}</div>
                  <div style={{ color: "#6e7681", fontSize: 12, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: 1, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mock Card */}
          <div style={{ width: 320, flexShrink: 0, background: "#161b22", border: "1px solid #30363d", borderRadius: 16, padding: 22, boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
              {["Pressure", "Length", "Mass", "Torque"].map((tab, i) => (
                <div key={tab} style={{
                  padding: "5px 11px", borderRadius: 8, fontSize: 11, fontWeight: 600,
                  color: i === 0 ? "#34d399" : "#8b949e",
                  background: i === 0 ? "rgba(16,185,129,0.15)" : "transparent",
                  border: i === 0 ? "1px solid rgba(16,185,129,0.3)" : "1px solid transparent",
                }}>{tab}</div>
              ))}
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#6e7681", textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 5 }}>Input</div>
              <div style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 8, padding: "9px 12px", color: "#f0f6fc", fontSize: 18, fontFamily: "'Courier New', monospace", fontWeight: 700 }}>14.696</div>
              <div style={{ background: "#21262d", border: "1px solid #30363d", borderRadius: 8, padding: "7px 10px", color: "#8b949e", fontSize: 12, marginTop: 5 }}>psi — Pound per Square Inch</div>
            </div>
            <div style={{ textAlign: "center" as const, margin: "6px 0", color: "#484f58", fontSize: 16 }}>⇅</div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#6e7681", textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 5 }}>Output</div>
              <div style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 8, padding: "9px 12px", color: "#34d399", fontSize: 18, fontFamily: "'Courier New', monospace", fontWeight: 700 }}>1.01325</div>
              <div style={{ background: "#21262d", border: "1px solid #30363d", borderRadius: 8, padding: "7px 10px", color: "#8b949e", fontSize: 12, marginTop: 5 }}>bar — Bar</div>
            </div>
            <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid #30363d", fontFamily: "'Courier New', monospace", fontSize: 11, color: "#6e7681" }}>
              1 psi = <span style={{ color: "#34d399", fontWeight: 700 }}>0.0689476</span> bar
            </div>
          </div>
        </div>

        {/* Designer credit */}
        <div style={{ position: "absolute", bottom: 14, right: 24, color: "#484f58", fontSize: 11, letterSpacing: 0.5 }}>
          Designed by DANIEL BYUN
        </div>
      </div>
    </div>
  );
}
