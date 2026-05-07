export default function Slide4Styles() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#1B3A5C", fontFamily: "'Space Grotesk', sans-serif", position: "relative", color: "#FFFFFF" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "2vw 2vh" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "10vw 10vh" }} />
      <div style={{ position: "absolute", top: "3vh", left: "3vw", right: "3vw", bottom: "3vh", border: "1px solid rgba(255,255,255,0.2)" }} />
      <div style={{ position: "absolute", top: "5vh", left: "5vw", right: "5vw", bottom: "5vh", border: "0.5px solid rgba(255,255,255,0.1)" }} />

      <div style={{ padding: "7vh 7vw", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", position: "relative", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: "0.7vw", textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.5 }}>Section 03</div>
            <div style={{ fontSize: "1vw", fontWeight: 600, fontFamily: "monospace" }}>LEARNING STYLE MATRIX</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.7vw", textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.5 }}>Ref No.</div>
            <div style={{ fontSize: "1vw", fontFamily: "monospace" }}>FL-03X</div>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "2vh", marginBottom: "2vh" }}>
          <div style={{ fontSize: "2.8vw", fontWeight: 300, letterSpacing: "0.03em", marginBottom: "4vh" }}>
            FOUR LEARNING STYLES, FULLY SUPPORTED
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2vh 2vw" }}>
            <div style={{ border: "1px solid rgba(255,255,255,0.2)", padding: "2vh 2vw", background: "rgba(255,255,255,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1vh" }}>
                <div style={{ fontSize: "1.6vw", fontWeight: 600 }}>Visual</div>
                <div style={{ fontFamily: "monospace", fontSize: "0.8vw", color: "#BAE6FD", opacity: 0.6 }}>SPEC-V</div>
              </div>
              <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.15)", marginBottom: "1.2vh" }} />
              <div style={{ fontSize: "1.3vw", fontWeight: 300, opacity: 0.75, lineHeight: 1.5 }}>Diagrams and Mermaid charts generated on demand</div>
            </div>
            <div style={{ border: "1px solid rgba(255,255,255,0.2)", padding: "2vh 2vw", background: "rgba(255,255,255,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1vh" }}>
                <div style={{ fontSize: "1.6vw", fontWeight: 600 }}>Auditory</div>
                <div style={{ fontFamily: "monospace", fontSize: "0.8vw", color: "#BAE6FD", opacity: 0.6 }}>SPEC-A</div>
              </div>
              <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.15)", marginBottom: "1.2vh" }} />
              <div style={{ fontSize: "1.3vw", fontWeight: 300, opacity: 0.75, lineHeight: 1.5 }}>Conversational prose with podcast and video links</div>
            </div>
            <div style={{ border: "1px solid rgba(255,255,255,0.2)", padding: "2vh 2vw", background: "rgba(255,255,255,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1vh" }}>
                <div style={{ fontSize: "1.6vw", fontWeight: 600 }}>Reading / Writing</div>
                <div style={{ fontFamily: "monospace", fontSize: "0.8vw", color: "#BAE6FD", opacity: 0.6 }}>SPEC-R</div>
              </div>
              <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.15)", marginBottom: "1.2vh" }} />
              <div style={{ fontSize: "1.3vw", fontWeight: 300, opacity: 0.75, lineHeight: 1.5 }}>Structured textbook-style notes, downloadable</div>
            </div>
            <div style={{ border: "1px solid rgba(255,255,255,0.2)", padding: "2vh 2vw", background: "rgba(255,255,255,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1vh" }}>
                <div style={{ fontSize: "1.6vw", fontWeight: 600 }}>Kinesthetic</div>
                <div style={{ fontFamily: "monospace", fontSize: "0.8vw", color: "#BAE6FD", opacity: 0.6 }}>SPEC-K</div>
              </div>
              <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.15)", marginBottom: "1.2vh" }} />
              <div style={{ fontSize: "1.3vw", fontWeight: 300, opacity: 0.75, lineHeight: 1.5 }}>Feynman teach-back with active session feedback</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "0.5px solid rgba(255,255,255,0.2)", paddingTop: "1.5vh" }}>
          <div>
            <div style={{ fontSize: "0.6vw", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.4 }}>Status</div>
            <div style={{ fontSize: "0.9vw", fontFamily: "monospace" }}>VERIFIED</div>
          </div>
          <div>
            <div style={{ fontSize: "0.6vw", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.4 }}>Revision</div>
            <div style={{ fontSize: "0.9vw", fontFamily: "monospace" }}>C.1</div>
          </div>
          <div>
            <div style={{ fontSize: "0.6vw", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.4 }}>Page</div>
            <div style={{ fontSize: "0.9vw", fontFamily: "monospace" }}>04</div>
          </div>
        </div>
      </div>
    </div>
  );
}
