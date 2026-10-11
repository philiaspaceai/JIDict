export interface Faq {
  q: string;
  a: string;
}

/** Satu sumber untuk tampilan FAQ + JSON-LD (harus selalu sama). */
export const FAQS: Faq[] = [
  {
    q: "Apakah JIDict gratis?",
    a: "Ya, JIDict gratis dan tanpa iklan. Kamus ini dikembangkan oleh Philia Space Community, komunitas belajar bahasa Jepang asal Indonesia yang bersifat non-profit.",
  },
  {
    q: "Apakah JIDict bisa dipakai offline?",
    a: "Bisa. Unduh data kamus sekali saat pertama dibuka (butuh internet), setelah itu seluruh 300.000+ entri bisa dicari tanpa koneksi internet.",
  },
  {
    q: "Apa itu pitch accent dan kenapa penting?",
    a: "Pitch accent adalah pola naik-turunnya nada tiap suku kata dalam bahasa Jepang. Salah pola bisa mengubah kesan kata bagi penutur asli. JIDict menampilkan grafik pitch-accent untuk tiap kosakata, seperti di kamus Yomitan.",
  },
  {
    q: "Berapa jumlah entri kamus JIDict?",
    a: "Lebih dari 300.000 entri Jepang–Indonesia berformat Yomitan Dictionary, mencakup kosakata JLPT N5 sampai N1, lengkap dengan frekuensi JPDB dan Youtube.",
  },
  {
    q: "Apakah JIDict tersedia di Android dan iPhone?",
    a: "Ya. JIDict adalah PWA (Progressive Web App) yang bisa dipasang langsung dari browser di Android, iPhone, maupun desktop, lalu berjalan seperti aplikasi asli.",
  },
  {
    q: "Dari mana data kamus JIDict berasal?",
    a: "Data kamus berasal dari proyek JIDict-yomitan oleh Utawnyan & Demonkzz, berlisensi CC BY-NC 4.0. Aplikasi JIDict sendiri bersifat open-source berlisensi GPL-3.0.",
  },
];
