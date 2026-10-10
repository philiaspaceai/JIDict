import Image from "next/image";

export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <Image src="/mascots/5.png" alt="" width={120} height={120} />
      <h1 className="text-lg font-bold">Offline</h1>
      <p className="text-sm text-[var(--muted-foreground)]">
        Data sudah tersimpan. Buka halaman yang pernah dibuka.
      </p>
      <a href="/" className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white">
        Kembali
      </a>
    </div>
  );
}
