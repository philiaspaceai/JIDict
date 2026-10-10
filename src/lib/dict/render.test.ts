import { describe, expect, it, vi } from "vitest";
import fixtures from "@/lib/dict/fixtures.test.json";
import { renderGlossary, glossaryPreview } from "@/lib/dict/render";

const JIDICT_ENTRY = fixtures[0] as unknown;

describe("renderGlossary (Yomitan StructuredContentGenerator, verbatim)", () => {
  it("merender senses + tag data JIDict asli", () => {
    const { node } = renderGlossary(JIDICT_ENTRY);
    expect(node.querySelector('ol[data-sc-content="glossary"]')).not.toBeNull();
    expect(node.querySelectorAll('span[data-sc-class="tag"]').length).toBeGreaterThan(0);
    expect(node.textContent).toContain("anak hasil perkawinan campuran");
    expect(node.textContent).toContain("kata benda umum");
  });

  it("merender string polos", () => {
    const { node } = renderGlossary(["makan", "minum"]);
    expect(node.textContent).toContain("makan");
    expect(node.textContent).toContain("minum");
  });

  it("membuang tag tak dikenal (script)", () => {
    const { node } = renderGlossary([{ tag: "script", content: "evil()" }]);
    expect(node.querySelector("script")).toBeNull();
    expect(node.textContent).not.toContain("evil()");
  });

  it("drop envelope {type:'text'} seperti display-generator asli", () => {
    const { node } = renderGlossary([{ type: "text", text: "hilang" }]);
    expect(node.textContent).not.toContain("hilang");
  });

  it("link internal memicu navigasi (tanpa pindah halaman)", () => {
    const onNavigate = vi.fn();
    const { node } = renderGlossary(
      [{ tag: "a", href: "?query=%E7%B8%AB&wildcards=off", content: "縫" }],
      { onNavigate },
    );
    const a = node.querySelector("a");
    expect(a).not.toBeNull();
    a!.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(onNavigate).toHaveBeenCalledWith("縫");
  });

  it("link eksternal target blank", () => {
    const { node } = renderGlossary([
      { tag: "a", href: "https://github.com/philiaspaceai/JIDict-yomitan", content: "JIDict" },
    ]);
    const a = node.querySelector("a") as HTMLAnchorElement;
    expect(a.target).toBe("_blank");
    expect(a.rel).toContain("noopener");
  });
});

describe("glossaryPreview", () => {
  it("teks datar dari structured-content", () => {
    const t = glossaryPreview(JIDICT_ENTRY);
    expect(t).toContain("anak hasil perkawinan campuran");
    expect(t.length).toBeLessThanOrEqual(140);
  });
  it("string kosong untuk glossary kosong", () => {
    expect(glossaryPreview([])).toBe("");
    expect(glossaryPreview(null)).toBe("");
  });
});
