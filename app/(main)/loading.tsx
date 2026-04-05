// app/(main)/loading.tsx
export default function Loading() {
  return (
    <div className="container _custom_container">
      <div className="_layout_inner_wrap">
        <div className="row">
          {/* Left sidebar skeleton */}
          <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
            <div className="_b_radious6 _feed_inner_area" style={{ padding: 24, marginBottom: 16 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  style={{
                    height: 14,
                    background: "var(--input-bg)",
                    borderRadius: 6,
                    marginBottom: 18,
                    width: i % 2 === 0 ? "70%" : "90%",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Feed skeleton */}
          <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
            <div className="_b_radious6 _feed_inner_area" style={{ padding: 24, marginBottom: 16, height: 120 }} />
            {[1, 2].map((i) => (
              <div
                key={i}
                className="_b_radious6 _feed_inner_area"
                style={{ padding: 24, marginBottom: 16 }}
              >
                <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--input-bg)", animation: "pulse 1.5s ease-in-out infinite", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 14, width: "45%", background: "var(--input-bg)", borderRadius: 6, marginBottom: 10, animation: "pulse 1.5s ease-in-out infinite" }} />
                    <div style={{ height: 11, width: "28%", background: "var(--input-bg)", borderRadius: 6, animation: "pulse 1.5s ease-in-out infinite" }} />
                  </div>
                </div>
                <div style={{ height: 180, background: "var(--input-bg)", borderRadius: 8, animation: "pulse 1.5s ease-in-out infinite" }} />
              </div>
            ))}
          </div>

          {/* Right sidebar skeleton */}
          <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
            <div className="_b_radious6 _feed_inner_area" style={{ padding: 24, marginBottom: 16 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--input-bg)", animation: "pulse 1.5s ease-in-out infinite", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 13, width: "70%", background: "var(--input-bg)", borderRadius: 6, marginBottom: 8, animation: "pulse 1.5s ease-in-out infinite" }} />
                    <div style={{ height: 11, width: "50%", background: "var(--input-bg)", borderRadius: 6, animation: "pulse 1.5s ease-in-out infinite" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}