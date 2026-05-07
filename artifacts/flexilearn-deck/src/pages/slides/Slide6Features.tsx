export default function Slide6Features() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#1B3A5C", fontFamily: "'Space Grotesk', sans-serif", position: "relative", color: "#FFFFFF" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "2vw 2vh" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "10vw 10vh" }} />
      <div style={{ position: "absolute", top: "3vh", left: "3vw", right: "3vw", bottom: "3vh", border: "1px solid rgba(255,255,255,0.2)" }} />
      <div style={{ position: "absolute", top: "5vh", left: "5vw", right: "5vw", bottom: "5vh", border: "0.5px solid rgba(255,255,255,0.1)" }} />

      <div style={{ padding: "7vh 7vw", display: "flex", height: "100%", position: "relative", boxSizing: "border-box", gap: "5vw" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "0.7vw", textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.5 }}>Section 05</div>
            <div style={{ fontSize: "1vw", fontWeight: 600, fontFamily: "monospace" }}>PLATFORM FEATURES</div>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: "3vh" }}>
            <div style={{ fontSize: "2.8vw", fontWeight: 300, letterSpacing: "0.03em", marginBottom: "5vh", lineHeight: 1.1, textWrap: "balance" }}>
              THE CONTENT ADAPTS —{" "}
              <span style={{ opacity: 0.5 }}>NOT THE STUDENT</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2.5vh" }}>
              <div style={{ display: "flex", gap: "2vw", alignItems: "flex-start", borderBottom: "0.5px solid rgba(255,255,255,0.12)", paddingBottom: "2vh" }}>
                <div style={{ fontFamily: "monospace", fontSize: "1vw", color: "#BAE6FD", opacity: 0.6, flexShrink: 0, width: "5vw" }}>F-01</div>
                <div style={{ fontSize: "1.4vw", fontWeight: 300, lineHeight: 1.5 }}>Session feedback recaps strengths and growth areas</div>
              </div>
              <div style={{ display: "flex", gap: "2vw", alignItems: "flex-start", borderBottom: "0.5px solid rgba(255,255,255,0.12)", paddingBottom: "2vh" }}>
                <div style={{ fontFamily: "monospace", fontSize: "1vw", color: "#BAE6FD", opacity: 0.6, flexShrink: 0, width: "5vw" }}>F-02</div>
                <div style={{ fontSize: "1.4vw", fontWeight: 300, lineHeight: 1.5 }}>TTS voice playback on every AI response</div>
              </div>
              <div style={{ display: "flex", gap: "2vw", alignItems: "flex-start" }}>
                <div style={{ fontFamily: "monospace", fontSize: "1vw", color: "#BAE6FD", opacity: 0.6, flexShrink: 0, width: "5vw" }}>F-03</div>
                <div style={{ fontSize: "1.4vw", fontWeight: 300, lineHeight: 1.5 }}>Clickable multimedia resources embedded in every lesson</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "0.5px solid rgba(255,255,255,0.2)", paddingTop: "1.5vh" }}>
            <div>
              <div style={{ fontSize: "0.6vw", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.4 }}>Status</div>
              <div style={{ fontSize: "0.9vw", fontFamily: "monospace" }}>DEPLOYED</div>
            </div>
            <div>
              <div style={{ fontSize: "0.6vw", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.4 }}>Revision</div>
              <div style={{ fontSize: "0.9vw", fontFamily: "monospace" }}>E.1</div>
            </div>
            <div>
              <div style={{ fontSize: "0.6vw", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.4 }}>Page</div>
              <div style={{ fontSize: "0.9vw", fontFamily: "monospace" }}>06</div>
            </div>
          </div>
        </div>

        <div style={{ width: "28vw", display: "flex", flexDirection: "column", justifyContent: "center", gap: "2vh" }}>
          <div style={{ border: "1px solid rgba(255,255,255,0.2)", padding: "2.5vh 2vw", background: "rgba(255,255,255,0.03)" }}>
            <div style={{ fontFamily: "monospace", fontSize: "0.75vw", color: "#BAE6FD", opacity: 0.6, marginBottom: "1vh" }}>&gt; ANALYZER OUTPUT</div>
            <div style={{ fontSize: "1.1vw", fontWeight: 300, opacity: 0.7, lineHeight: 1.6 }}>Learning style: visual</div>
            <div style={{ fontSize: "1.1vw", fontWeight: 300, opacity: 0.7, lineHeight: 1.6 }}>Neuro-profile: adhd</div>
            <div style={{ fontSize: "1.1vw", fontWeight: 300, opacity: 0.7, lineHeight: 1.6 }}>Specialist: visualizer</div>
          </div>
          <div style={{ border: "1px solid rgba(255,255,255,0.2)", padding: "2.5vh 2vw", background: "rgba(186,230,253,0.05)" }}>
            <div style={{ fontFamily: "monospace", fontSize: "0.75vw", color: "#BAE6FD", opacity: 0.6, marginBottom: "1vh" }}>&gt; SESSION STATE</div>
            <div style={{ fontSize: "1.1vw", fontWeight: 300, opacity: 0.7, lineHeight: 1.6 }}>Focus timer: 25:00</div>
            <div style={{ fontSize: "1.1vw", fontWeight: 300, opacity: 0.7, lineHeight: 1.6 }}>Reward points: 40</div>
            <div style={{ fontSize: "1.1vw", fontWeight: 300, opacity: 0.7, lineHeight: 1.6 }}>Diagram rendered</div>
          </div>
        </div>
      </div>
    </div>
  );
}
