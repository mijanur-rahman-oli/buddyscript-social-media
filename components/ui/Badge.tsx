// components/ui/Badge.tsx
interface BadgeProps {
  count: number;
  max?: number;
}

export function Badge({ count, max = 99 }: BadgeProps) {
  if (count <= 0) return null;
  return (
    <span className="_counting" aria-label={`${count} notifications`}>
      {count > max ? `${max}+` : count}
    </span>
  );
}