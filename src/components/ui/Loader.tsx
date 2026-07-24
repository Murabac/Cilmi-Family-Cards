"use client";

export function Loader({ label = "Loading family…" }: { label?: string }) {
  return (
    <div className="flex h-[100dvh] w-full flex-col items-center justify-center gap-5 bg-[#1B3A4B]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="CILMI"
        className="h-16 w-16 rounded-full object-cover ring-2 ring-[#E8A838]/40"
      />
      <p className="text-sm font-bold text-[#8FA8B5]">{label}</p>
    </div>
  );
}

export function StatusPanel({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex h-[100dvh] items-center justify-center bg-[#1B3A4B] p-6">
      <div className="max-w-sm rounded-3xl bg-[#F0E6D6] p-6 text-center shadow-lg">
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-[#1B3A4B]">
          {title}
        </h1>
        <p className="mt-2 text-sm text-[#5A7180]">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 rounded-full bg-[#E07A3D] px-5 py-2.5 text-sm font-bold text-[#F0E6D6]"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
