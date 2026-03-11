import { useState } from "react";

const shimmer = `
  @keyframes shimmer {
    0% { background-position: -800px 0; }
    100% { background-position: 800px 0; }
  }
  .skeleton-box {
    background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
    background-size: 800px 100%;
    animation: shimmer 1.6s infinite linear;
    border-radius: 6px;
  }
  @keyframes pulse-glow {
    0%, 100% { opacity: 0.15; }
    50% { opacity: 0.35; }
  }
  .glow-orb { animation: pulse-glow 2.5s ease-in-out infinite; }
  .btn-skel {
    background: linear-gradient(90deg, #3a1a08 25%, #5a2a10 50%, #3a1a08 75%);
    background-size: 800px 100%;
    animation: shimmer 1.6s infinite linear;
    border-radius: 10px;
  }
  .stat-skel {
    background: linear-gradient(90deg, #3a1a08 25%, #6b3010 50%, #3a1a08 75%);
    background-size: 800px 100%;
    animation: shimmer 1.6s infinite linear;
    border-radius: 4px;
  }
`;

function Box({ w, h, r = 6, cls = "skeleton-box", style = {} }) {
  return (
    <div
      className={cls}
      style={{
        width: w,
        height: h,
        maxWidth: "100%",
        borderRadius: r,
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

export default function HomePageSkeleton() {
  return (
    <>
      <style>{shimmer}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Ambient glow */}
        <div
          className="glow-orb"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -55%)",
            width: "80vw",
            maxWidth: 700,
            height: "60vw",
            maxHeight: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(200,70,10,0.22) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Navbar */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            padding: "18px 5vw",
            borderBottom: "1px solid #1e1e1e",
            gap: 24,
            position: "relative",
            zIndex: 10,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginRight: 16,
            }}
          >
            <Box w={32} h={32} r={8} />
            <Box w={110} h={20} />
          </div>

          <Box w={52} h={16} />
          <Box w={120} h={16} />

          <div style={{ flex: 1 }} />

          <Box w={90} h={40} r={8} cls="btn-skel" />
        </nav>

        {/* Hero */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "60px 20px",
            gap: 28,
            position: "relative",
            zIndex: 10,
          }}
        >
          <Box w={180} h={14} r={4} />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              width: "100%",
              maxWidth: 720,
            }}
          >
            <Box w={560} h={60} r={8} />
            <Box w={700} h={60} r={8} />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              marginTop: 4,
              width: "100%",
              maxWidth: 540,
            }}
          >
            <Box w={540} h={18} r={4} />
            <Box w={420} h={18} r={4} />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginTop: 4,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Box w={130} h={18} r={4} cls="stat-skel" />
            <Box w={210} h={18} r={4} />
          </div>

          <Box w={220} h={56} r={10} cls="btn-skel" style={{ marginTop: 12 }} />
        </div>
      </div>
    </>
  );
}