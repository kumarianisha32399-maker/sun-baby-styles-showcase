export default function Rating({ value = 0, reviews, size = "sm" }) {
  const stars = [1, 2, 3, 4, 5];
  const cls = size === "lg" ? "text-base" : "text-xs";
  return (
    <span className={`inline-flex items-center gap-1 ${cls}`}>
      <span className="text-sunshine" aria-hidden="true">
        {stars.map((s) => (
          <span key={s}>{value >= s - 0.25 ? "★" : value >= s - 0.75 ? "⯪" : "☆"}</span>
        ))}
      </span>
      <span className="font-semibold text-foreground">{value.toFixed(1)}</span>
      {reviews != null && (
        <span className="text-muted-foreground">({reviews})</span>
      )}
    </span>
  );
}
