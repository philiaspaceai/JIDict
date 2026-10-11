import { StructuredContentGenerator } from "@/vendor/yomitan/display/structured-content-generator.js";
import { PronunciationGenerator } from "@/vendor/yomitan/display/pronunciation-generator.js";
import { getKanaMorae } from "@/vendor/yomitan/language/ja/japanese.js";
import type { DictPronunciation } from "@/lib/search";

export interface RenderOptions {
  /** Dipanggil saat link internal ?query= diklik. */
  onNavigate?: (query: string) => void;
}

interface ContentManagerLike {
  prepareLink(node: HTMLAnchorElement, href: string, internal: boolean): void;
  loadMedia(path: string, dictionary: string, target: unknown): void;
  openMediaInTab(path: string, dictionary: string, window: Window): void;
}

/**
 * Adapter JIDict untuk StructuredContentGenerator Yomitan (verbatim).
 * Meniru perilaku DisplayContentManager.prepareLink asli:
 * eksternal → tab baru; internal ?query= → navigasi dalam app.
 */
class JIDictContentManager implements ContentManagerLike {
  private _onNavigate: ((query: string) => void) | undefined;

  constructor(onNavigate?: (query: string) => void) {
    this._onNavigate = onNavigate;
  }

  prepareLink(node: HTMLAnchorElement, href: string, internal: boolean): void {
    node.href = href;
    if (!internal) {
      node.target = "_blank";
      node.rel = "noreferrer noopener";
      return;
    }
    node.addEventListener("click", (e) => {
      e.preventDefault();
      try {
        const url = new URL(href, location.href);
        const q = url.searchParams.get("query");
        if (q) this._onNavigate?.(q);
      } catch {
        // href rusak — abaikan
      }
    });
  }

  loadMedia(): void {
    // JIDict tidak membundel media — tidak ada yang dimuat.
  }

  openMediaInTab(): void {
    // JIDict tidak membundel media.
  }
}

let generator: StructuredContentGenerator | null = null;
let pronunciationGenerator: PronunciationGenerator | null = null;

function getPronunciationGenerator(): PronunciationGenerator {
  if (!pronunciationGenerator) pronunciationGenerator = new PronunciationGenerator(document);
  return pronunciationGenerator;
}

function getGenerator(): StructuredContentGenerator {
  if (!generator) {
    // contentManager per-render diganti via cast karena generator menyimpan referensinya.
    generator = new StructuredContentGenerator(
      new JIDictContentManager() as unknown as never,
      document,
      window,
    );
  }
  return generator;
}

/** Render glossary mentah Yomitan menjadi HTMLElement (kelas + data-sc-* asli). */
export function renderGlossary(
  glossary: unknown,
  opts: RenderOptions = {},
): { node: HTMLElement } {
  const gen = getGenerator();
  // Ganti content manager agar onNavigate terbaru dipakai.
  (gen as unknown as { _contentManager: ContentManagerLike })._contentManager =
    new JIDictContentManager(opts.onNavigate);
  // Dispatch envelope glossary — mirror display-generator Yomitan
  // (_createTermDefinitionEntry: string → teks; {type:'structured-content'}
  // → entry.content; {type:'text'} dan lainnya → null/d drop).
  const items = (Array.isArray(glossary) ? glossary : []) as Array<unknown>;
  const content = items.flatMap((item) => {
    if (typeof item === "string") return [item];
    if (item && typeof item === "object") {
      const o = item as { type?: unknown; content?: unknown; tag?: unknown };
      if (o.type === "structured-content") return [o.content];
      if (typeof o.tag === "string") return [item];
    }
    return [];
  });
  const node = gen.createStructuredContent(content as never, "JIDict") as HTMLElement;
  node.classList.add("jidict-glossary");
  return { node };
}

/** Teks datar untuk pratinjau card (maks 140 karakter). */
export function glossaryPreview(glossary: unknown, maxLen = 140): string {
  const parts: string[] = [];
  const walk = (n: unknown): void => {
    if (typeof n === "string") {
      const t = n.trim();
      if (t) parts.push(t.replace(/\s+/g, " "));
      return;
    }
    if (Array.isArray(n)) {
      for (const x of n) walk(x);
      return;
    }
    if (n && typeof n === "object") {
      const o = n as Record<string, unknown>;
      if (typeof o.text === "string") {
        walk(o.text);
        return;
      }
      walk(o.content);
    }
  };
  walk(glossary);
  const joined = parts.join(" · ");
  return joined.length > maxLen ? `${joined.slice(0, maxLen - 1)}…` : joined;
}

/**
 * Render satu pola pitch-accent ala Yomitan (_createPronunciationPitchAccent):
 * teks mora + notasi [n] + grafik SVG, memakai PronunciationGenerator verbatim.
 * Struktur kontainer mengikuti template `pronunciation` templates-display.html.
 */
export function renderPronunciation(
  reading: string,
  pitch: Pick<DictPronunciation, "position" | "nasal" | "devoice">,
): { node: HTMLElement } {
  const gen = getPronunciationGenerator();
  const morae = getKanaMorae(reading);
  const { position, nasal, devoice } = pitch;

  const node = document.createElement("li");
  node.className = "pronunciation";
  node.dataset.pronunciationType = "pitch-accent";
  node.dataset.pitchAccentDownstepPosition = `${position}`;
  if (nasal.length > 0) node.dataset.nasalMoraPosition = nasal.join(" ");
  if (devoice.length > 0) node.dataset.devoiceMoraPosition = devoice.join(" ");
  node.dataset.tagCount = "0";

  const tagList = document.createElement("span");
  tagList.className = "pronunciation-tag-list tag-list";
  node.appendChild(tagList);

  const disambig = document.createElement("span");
  disambig.className = "pronunciation-disambiguation-list";
  node.appendChild(disambig);

  const repr = document.createElement("span");
  repr.className = "pronunciation-representation-list";
  node.appendChild(repr);

  const textContainer = document.createElement("span");
  textContainer.className = "pronunciation-text-container";
  textContainer.lang = "ja";
  textContainer.appendChild(gen.createPronunciationText(morae, position, nasal, devoice));
  repr.appendChild(textContainer);

  const downstepContainer = document.createElement("span");
  downstepContainer.className = "pronunciation-downstep-notation-container";
  downstepContainer.appendChild(gen.createPronunciationDownstepPosition(position));
  repr.appendChild(downstepContainer);

  const graphContainer = document.createElement("span");
  graphContainer.className = "pronunciation-graph-container";
  graphContainer.appendChild(gen.createPronunciationGraph(morae, position));
  repr.appendChild(graphContainer);

  return { node };
}
