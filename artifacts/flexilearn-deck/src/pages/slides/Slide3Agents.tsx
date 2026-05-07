export default function Slide3Agents() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#1B3A5C", fontFamily: "'Space Grotesk', sans-serif", position: "relative", color: "#FFFFFF" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "2vw 2vh" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "10vw 10vh" }} />
      <div style={{ position: "absolute", top: "3vh", left: "3vw", right: "3vw", bottom: "3vh", border: "1px solid rgba(255,255,255,0.2)" }} />
      <div style={{ position: "absolute", top: "5vh", left: "5vw", right: "5vw", bottom: "5vh", border: "0.5px solid rgba(255,255,255,0.1)" }} />

      <div style={{ padding: "7vh 7vw", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", position: "relative", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: "0.7vw", textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.5 }}>Section 02</div>
            <div style={{ fontSize: "1vw", fontWeight: 600, fontFamily: "monospace" }}>SYSTEM ARCHITECTURE</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.7vw", textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.5 }}>Ref No.</div>
            <div style={{ fontSize: "1vw", fontFamily: "monospace" }}>FL-02X</div>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "2vh", marginBottom: "2vh" }}>
          <div style={{ fontSize: "2.8vw", fontWeight: 300, letterSpacing: "0.03em", marginBottom: "5vh" }}>
            A TEAM OF AI AGENTS, NOT ONE BOT
          </div>

          <div style={{ display: "flex", gap: "2vw" }}>
            <div style={{ flex: 1, border: "1px solid rgba(255,255,255,0.25)", padding: "2.5vh 2vw", background: "rgba(255,255,255,0.04)", display: "flex", flexDirection: "column", gap: "1.5vh" }}>
              <div style={{ fontFamily: "monospace", fontSize: "0.8vw", color: "#BAE6FD", letterSpacing: "0.15em", textTransform: "uppercase" }}>Tier 1</div>
              <div style={{ fontSize: "1.8vw", fontWeight: 600, lineHeight: 1.1 }}>Analyzers</div>
              <div style={{ width: "3vw", height: "1px", background: "rgba(255,255,255,0.3)" }} />
              <div style={{ fontSize: "1.3vw", fontWeight: 300, opacity: 0.7, lineHeight: 1.5 }}>Classify learning needs instantly behind the scenes</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", opacity: 0.4 }}>
              <div style={{ width: "2vw", height: "1px", background: "#BAE6FD" }} />
              <div style={{ width: 0, height: 0, borderTop: "0.5vh solid transparent", borderBottom: "0.5vh solid transparent", borderLeft: "1vw solid #BAE6FD" }} />
            </div>
            <div style={{ flex: 1, border: "1px solid rgba(255,255,255,0.25)", padding: "2.5vh 2vw", background: "rgba(186,230,253,0.06)", display: "flex", flexDirection: "column", gap: "1.5vh" }}>
              <div style={{ fontFamily: "monospace", fontSize: "0.8vw", color: "#BAE6FD", letterSpacing: "0.15em", textTransform: "uppercase" }}>Tier 2</div>
              <div style={{ fontSize: "1.8vw", fontWeight: 600, lineHeight: 1.1 }}>Manager Agent</div>
              <div style={{ width: "3vw", height: "1px", background: "rgba(255,255,255,0.3)" }} />
              <div style={{ fontSize: "1.3vw", fontWeight: 300, opacity: 0.7, lineHeight: 1.5 }}>Coordinates the lesson plan and monitors comprehension</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", opacity: 0.4 }}>
              <div style={{ width: "2vw", height: "1px", background: "#BAE6FD" }} />
              <div style={{ width: 0, height: 0, borderTop: "0.5vh solid transparent", borderBottom: "0.5vh solid transparent", borderLeft: "1vw solid #BAE6FD" }} />
            </div>
            <div style={{ flex: 1, border: "1px solid rgba(255,255,255,0.25)", padding: "2.5vh 2vw", background: "rgba(255,255,255,0.04)", display: "flex", flexDirection: "column", gap: "1.5vh" }}>
              <div style={{ fontFamily: "monospace", fontSize: "0.8vw", color: "#BAE6FD", letterSpacing: "0.15em", textTransform: "uppercase" }}>Tier 3</div>
              <div style={{ fontSize: "1.8vw", fontWeight: 600, lineHeight: 1.1 }}>Specialists</div>
              <div style={{ width: "3vw", height: "1px", background: "rgba(255,255,255,0.3)" }} />
              <div style={{ fontSize: "1.3vw", fontWeight: 300, opacity: 0.7, lineHeight: 1.5 }}>Deliver content in the right format for each learner</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "0.5px solid rgba(255,255,255,0.2)", paddingTop: "1.5vh" }}>
          <div>
            <div style={{ fontSize: "0.6vw", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.4 }}>Status</div>
            <div style={{ fontSize: "0.9vw", fontFamily: "monospace" }}>ACTIVE</div>
          </div>
          <div>
            <div style={{ fontSize: "0.6vw", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.4 }}>Revision</div>
            <div style={{ fontSize: "0.9vw", fontFamily: "monospace" }}>B.2</div>
          </div>
          <div>
            <div style={{ fontSize: "0.6vw", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.4 }}>Page</div>
            <div style={{ fontSize: "0.9vw", fontFamily: "monospace" }}>03</div>
          </div>
        </div>
      </div>
    </div>
  );
}
