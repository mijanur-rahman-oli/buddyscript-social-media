// components/ui/Avatar.tsx
import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
}

const COLORS = [
  "#377DFF", "#6C63FF", "#0ACF83", "#FF6B6B",
  "#FFA500", "#E91E8C", "#00BCD4", "#9C27B0",
];

function colorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function Avatar({ src, name, size = 40, className = "" }: AvatarProps) {
  const initials = getInitials(name);
  const bg = colorFromName(name);
  const fontSize = Math.round(size * 0.38);

  const baseStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: "50%",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className={className}
        style={{ ...baseStyle, objectFit: "cover" }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{ ...baseStyle, background: bg, color: "#fff", fontWeight: 700, fontSize }}
      aria-label={name}
    >
      {initials}
    </div>
  );
}