// components/ui/EmptyState.tsx
interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon = "📭", title, description, action }: EmptyStateProps) {
  return (
    <div
      className="_b_radious6 _feed_inner_area"
      style={{
        padding: "48px 32px",
        textAlign: "center",
        color: "var(--muted-color)",
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--bs-body-color)", marginBottom: 8 }}>
        {title}
      </h3>
      {description && (
        <p style={{ fontSize: 14, marginBottom: action ? 24 : 0 }}>{description}</p>
      )}
      {action}
    </div>
  );
}