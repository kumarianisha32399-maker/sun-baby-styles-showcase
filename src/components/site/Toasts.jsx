import { useStore } from "@/store/StoreProvider";

const tones = {
  success: "bg-mint text-charcoal",
  info: "bg-sky text-charcoal",
  error: "bg-destructive text-destructive-foreground",
};

export default function Toasts() {
  const { toasts, dismissToast } = useStore();
  if (!toasts.length) return null;
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismissToast(t.id)}
          className={`pointer-events-auto animate-in slide-in-from-bottom-4 rounded-2xl px-4 py-3 text-left text-sm font-semibold shadow-lg ${tones[t.tone] || tones.success}`}
        >
          {t.message}
        </button>
      ))}
    </div>
  );
}
