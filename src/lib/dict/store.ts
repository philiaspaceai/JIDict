import Dexie, { type Table } from "dexie";

export interface TermRow {
  id?: number;
  expression: string;
  reading: string;
  score: number;
  glossary: string[];
  sequence: number;
  tags: string;
}

export interface TermMetaRow {
  id?: number;
  expression: string;
  source: string;
  mode: "freq" | "pitch" | "jlpt";
  value?: number;
  display?: string;
  reading?: string;
  positions?: number[];
  jlpt?: string;
}

export interface DictInfoRow {
  key: string;
  value: string;
}

export class DictDB extends Dexie {
  terms!: Table<TermRow, number>;
  termMeta!: Table<TermMetaRow, number>;
  dictInfo!: Table<DictInfoRow, string>;

  constructor(name = "jidict-dict") {
    super(name);
    this.version(1).stores({
      terms: "++id, expression, reading, [expression+reading]",
      termMeta: "++id, expression, source, mode, [expression+source]",
      dictInfo: "key",
    });
  }
}
