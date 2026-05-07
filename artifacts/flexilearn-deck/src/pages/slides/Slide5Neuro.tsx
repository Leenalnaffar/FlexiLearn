export default function Slide5Neuro() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#1B3A5C", fontFamily: "'Space Grotesk', sans-serif", position: "relative", color: "#FFFFFF" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "2vw 2vh" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "10vw 10vh" }} />
      <div style={{ position: "absolute", top: "3vh", left: "3vw", right: "3vw", bottom: "3vh", border: "1px solid rgba(255,255,255,0.2)" }} />
      <div style={{ position: "absolute", top: "5vh", left: "5vw", right: "5vw", bottom: "5vh", border: "0.5px solid rgba(255,255,255,0.1)" }} />

      <div style={{ padding: "7vh 7vw", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", position: "relative", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: "0.7vw", textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.5 }}>Section 04</div>
            <div style={{ fontSize: "1vw", fontWeight: 600, fontFamily: "monospace" }}>NEURO-PROFILE SPECS</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.7vw", textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.5 }}>Ref No.</div>
            <div style={{ fontSize: "1vw", fontFamily: "monospace" }}>FL-04X</div>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "2vh", marginBottom: "2vh" }}>
          <div style={{ fontSize: "2.8vw", fontWeight: 300, letterSpacing: "0.03em", marginBottom: "4.5vh" }}>
            BUILT FOR NEURODIVERGENT LEARNERS
          </div>

          <div style={{ display: "flex", gap: "2vw" }}>
            <div style={{ flex: 1, border: "1px solid rgba(255,255,255,0.2)", padding: "2.5vh 2vw", background: "rgba(255,255,255,0.03)", display: "flex", flexDirection: "column", gap: "1.2vh" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "1.6vw", fontWeight: 600 }}>ADHD</div>
                <div style={{ fontFamily: "monospace", fontSize: "0.75vw", color: "#BAE6FD", opacity: 0.6 }}>NP-01</div>
              </div>
              <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.15)" }} />
              <div style={{ fontSize: "1.2vw", fontWeight: 300, opacity: 0.75, lineHeight: 1.6 }}>Focus timer</div>
              <div style={{ fontSize: "1.2vw", fontWeight: 300, opacity: 0.75, lineHeight: 1.6 }}>Reward points</div>
              <div style={{ fontSize: "1.2vw", fontWeight: 300, opacity: 0.75, lineHeight: 1.6 }}>Punchy pacing</div>
            </div>
            <div style={{ flex: 1, border: "1px solid rgba(255,255,255,0.2)", padding: "2.5vh 2vw", background: "rgba(186,230,253,0.06)", display: "flex", flexDirection: "column", gap: "1.2vh" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "1.6vw", fontWeight: 600 }}>Autism</div>
                <div style={{ fontFamily: "monospace", fontSize: "0.75vw", color: "#BAE6FD", opacity: 0.6 }}>NP-02</div>
              </div>
              <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.15)" }} />
              <div style={{ fontSize: "1.2vw", fontWeight: 300, opacity: 0.75, lineHeight: 1.6 }}>Literal language, no metaphors</div>
              <div style={{ fontSize: "1.2vw", fontWeight: 300, opacity: 0.75, lineHeight: 1.6 }}>Sensory-safe palette</div>
              <div style={{ fontSize: "1.2vw", fontWeight: 300, opacity: 0.75, lineHeight: 1.6 }}>Predictable structure</div>
            </div>
            <div style={{ flex: 1, border: "1px solid rgba(255,255,255,0.2)", padding: "2.5vh 2vw", background: "rgba(255,255,255,0.03)", display: "flex", flexDirection: "column", gap: "1.2vh" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "1.6vw", fontWeight: 600 }}>Dyslexia</div>
                <div style={{ fontFamily: "monospace", fontSize: "0.75vw", color: "#BAE6FD", opacity: 0.6 }}>NP-03</div>
              </div>
              <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.15)" }} />
              <div style={{ fontSize: "1.2vw", fontWeight: 300, opacity: 0.75, lineHeight: 1.6 }}>Short sentences</div>
              <div style={{ fontSize: "1.2vw", fontWeight: 300, opacity: 0.75, lineHeight: 1.6 }}>Syllable-broken words</div>
              <div style={{ fontSize: "1.2vw", fontWeight: 300, opacity: 0.75, lineHeight: 1.6 }}>Decoding-friendly font</div>
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
            <div style={{ fontSize: "0.9vw", fontFamily: "monospace" }}>D.3</div>
          </div>
          <div>
            <div style={{ fontSize: "0.6vw", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.4 }}>Page</div>
            <div style={{ fontSize: "0.9vw", fontFamily: "monospace" }}>05</div>
          </div>
        </div>
      </div>
    </div>
  );
}
