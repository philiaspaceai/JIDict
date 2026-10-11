/** Logo JIDict sadar-tema tanpa kedip: aset dipilih oleh CSS (.dark),
 * bukan oleh resolvedTheme yang masih undefined di render pertama. */
export function BrandLogo({ width, height }: { width: number; height: number }) {
  return (
    <div
      role="img"
      aria-label="JIDict"
      className="brand-logo"
      style={{ width, height }}
    />
  );
}
