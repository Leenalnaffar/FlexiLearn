export default function Slide7Closing() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#1B3A5C", fontFamily: "'Space Grotesk', sans-serif", position: "relative", color: "#FFFFFF" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "2vw 2vh" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "10vw 10vh" }} />
      <div style={{ position: "absolute", top: "3vh", left: "3vw", right: "3vw", bottom: "3vh", border: "1px solid rgba(255,255,255,0.2)" }} />
      <div style={{ position: "absolute", top: "5vh", left: "5vw", right: "5vw", bottom: "5vh", border: "0.5px solid rgba(255,255,255,0.1)" }} />

      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "60vw", height: "60vw", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "40vw", height: "40vw", border: "0.5px dashed rgba(255,255,255,0.06)", borderRadius: "50%" }} />

      <div style={{ padding: "7vh 7vw", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", position: "relative", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: "0.7vw", textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.5 }}>Drawing No.</div>
            <div style={{ fontSize: "1vw", fontWeight: 600, fontFamily: "monospace" }}>FL-DCK-007</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.7vw", textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.5 }}>Status</div>
            <div style={{ fontSize: "1vw", fontFamily: "monospace" }}>FINAL</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ fontSize: "0.8vw", textTransform: "uppercase", letterSpacing: "0.3em", opacity: 0.5, marginBottom: "2vh" }}>Project</div>
          <div style={{ fontSize: "7vw", fontWeight: 300, lineHeight: 0.85, letterSpacing: "0.05em" }}>FLEXI</div>
          <div style={{ fontSize: "7vw", fontWeight: 300, lineHeight: 0.85, letterSpacing: "0.05em" }}>LEARN</div>
          <div style={{ width: "8vw", height: "1px", background: "rgba(255,255,255,0.4)", margin: "3vh 0" }} />
          <div style={{ fontSize: "1.5vw", fontWeight: 300, opacity: 0.65, letterSpacing: "0.05em" }}>
            Education that adapts to you.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "0.5px solid rgba(255,255,255,0.2)", paddingTop: "1.5vh" }}>
          <div>
            <div style={{ fontSize: "0.6vw", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.4 }}>Prepared By</div>
            <div style={{ fontSize: "0.9vw", fontFamily: "monospace" }}>FlexiLearn AI</div>
          </div>
          <div>
            <div style={{ fontSize: "0.6vw", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.4 }}>Classification</div>
            <div style={{ fontSize: "0.9vw", fontFamily: "monospace" }}>OPEN</div>
          </div>
          <div>
            <div style={{ fontSize: "0.6vw", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.4 }}>Page</div>
            <div style={{ fontSize: "0.9vw", fontFamily: "monospace" }}>07</div>
          </div>
        </div>
      </div>
    </div>
  );
}
