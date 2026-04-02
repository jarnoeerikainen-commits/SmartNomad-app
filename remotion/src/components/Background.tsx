import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const PersistentBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const hueShift = interpolate(frame, [0, durationInFrames], [0, 60]);
  const gradAngle = interpolate(frame, [0, durationInFrames], [135, 225]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(${gradAngle}deg, 
          hsl(${220 + hueShift * 0.3}, 60%, 6%) 0%, 
          hsl(${210 + hueShift * 0.2}, 50%, 10%) 40%, 
          hsl(${200 + hueShift * 0.4}, 45%, 8%) 100%)`,
      }}
    />
  );
};

export const FloatingOrbs: React.FC = () => {
  const frame = useCurrentFrame();

  const orbs = [
    { x: 15, y: 20, size: 400, color: "rgba(212,175,55,0.06)", speed: 0.3 },
    { x: 75, y: 70, size: 500, color: "rgba(0,212,255,0.04)", speed: 0.2 },
    { x: 50, y: 40, size: 350, color: "rgba(212,175,55,0.03)", speed: 0.4 },
    { x: 85, y: 15, size: 300, color: "rgba(0,180,220,0.05)", speed: 0.25 },
  ];

  return (
    <>
      {orbs.map((orb, i) => {
        const offsetX = Math.sin(frame * 0.005 * orb.speed + i * 2) * 60;
        const offsetY = Math.cos(frame * 0.004 * orb.speed + i * 1.5) * 40;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              width: orb.size,
              height: orb.size,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
              transform: `translate(${offsetX}px, ${offsetY}px)`,
              filter: "blur(40px)",
            }}
          />
        );
      })}
    </>
  );
};

export const GridOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 60], [0, 0.03], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        backgroundImage: `
          linear-gradient(rgba(212,175,55,0.15) 1px, transparent 1px),
          linear-gradient(90deg, rgba(212,175,55,0.15) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }}
    />
  );
};
