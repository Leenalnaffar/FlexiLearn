export default function Slide2Problem() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#1B3A5C", fontFamily: "'Space Grotesk', sans-serif", position: "relative", color: "#FFFFFF" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "2vw 2vh" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "10vw 10vh" }} />
      <div style={{ position: "absolute", top: "3vh", left: "3vw", right: "3vw", bottom: "3vh", border: "1px solid rgba(255,255,255,0.2)" }} />
      <div style={{ position: "absolute", top: "5vh", left: "5vw", right: "5vw", bottom: "5vh", border: "0.5px solid rgba(255,255,255,0.1)" }} />

      <div style={{ padding: "7vh 7vw", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", position: "relative", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: "0.7vw", textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.5 }}>Section 01</div>
            <div style={{ fontSize: "1vw", fontWeight: 600, fontFamily: "monospace" }}>PROBLEM STATEMENT</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.7vw", textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.5 }}>Ref No.</div>
            <div style={{ fontSize: "1vw", fontFamily: "monospace" }}>FL-01X</div>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "2vh", marginBottom: "2vh" }}>
          <div style={{ fontSize: "2.8vw", fontWeight: 300, letterSpacing: "0.03em", marginBottom: "5vh", textWrap: "balance" }}>
            THE PROBLEM WITH TRADITIONAL LEARNING
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2.5vh" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "2vw", border: "1px solid rgba(255,255,255,0.15)", padding: "2vh 2vw", background: "rgba(255,255,255,0.03)" }}>
              <div style={{ fontFamily: "monospace", fontSize: "1.1vw", color: "#BAE6FD", opacity: 0.7, flexShrink: 0, marginTop: "0.2vh" }}>01</div>
              <div style={{ fontSize: "1.5vw", fontWeight: 300, lineHeight: 1.5 }}>One-size-fits-all content ignores how individuals actually learn</div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "2vw", border: "1px solid rgba(255,255,255,0.15)", padding: "2vh 2vw", background: "rgba(255,255,255,0.03)" }}>
              <div style={{ fontFamily: "monospace", fontSize: "1.1vw", color: "#BAE6FD", opacity: 0.7, flexShrink: 0, marginTop: "0.2vh" }}>02</div>
              <div style={{ fontSize: "1.5vw", fontWeight: 300, lineHeight: 1.5 }}>Students with ADHD, Autism, and Dyslexia are underserved by standard tools</div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "2vw", border: "1px solid rgba(255,255,255,0.15)", padding: "2vh 2vw", background: "rgba(255,255,255,0.03)" }}>
              <div style={{ fontFamily: "monospace", fontSize: "1.1vw", color: "#BAE6FD", opacity: 0.7, flexShrink: 0, marginTop: "0.2vh" }}>03</div>
              <div style={{ fontSize: "1.5vw", fontWeight: 300, lineHeight: 1.5 }}>A single chatbot cannot adapt to radically different cognitive needs</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "0.5px solid rgba(255,255,255,0.2)", paddingTop: "1.5vh" }}>
          <div>
            <div style={{ fontSize: "0.6vw", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.4 }}>Status</div>
            <div style={{ fontSize: "0.9vw", fontFamily: "monospace" }}>IDENTIFIED</div>
          </div>
          <div>
            <div style={{ fontSize: "0.6vw", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.4 }}>Revision</div>
            <div style={{ fontSize: "0.9vw", fontFamily: "monospace" }}>A.1</div>
          </div>
          <div>
            <div style={{ fontSize: "0.6vw", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.4 }}>Page</div>
            <div style={{ fontSize: "0.9vw", fontFamily: "monospace" }}>02</div>
          </div>
        </div>
      </div>
    </div>
  );
}
