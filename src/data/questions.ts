import type { Question, QuestionType, QuizConfig } from '../types'

// ============================================================
//  Metadata Kategori Soal
// ============================================================

export interface CategoryInfo {
  type: QuestionType
  name: string
  description: string
  badgeColor: string
  icon: string
  count: number
}

export const CATEGORIES: Record<QuestionType, CategoryInfo> = {
  rumus: {
    type: 'rumus',
    name: 'Rumus Pythagoras',
    description: 'Mencari panjang salah satu sisi segitiga siku-siku (a² + b² = c²)',
    badgeColor: 'gold',
    icon: '∑',
    count: 10,
  },
  tripel: {
    type: 'tripel',
    name: 'Tripel Pythagoras',
    description: 'Menentukan apakah 3 bilangan membentuk tripel Pythagoras',
    badgeColor: 'right',
    icon: '△',
    count: 10,
  },
  jenis: {
    type: 'jenis',
    name: 'Jenis Segitiga',
    description: 'Menentukan jenis segitiga: siku-siku, lancip, atau tumpul',
    badgeColor: 'gold',
    icon: '▷',
    count: 10,
  },
  istimewa: {
    type: 'istimewa',
    name: 'Segitiga Istimewa',
    description: 'Perbandingan sudut istimewa 45°-45°-90° dan 30°-60°-90°',
    badgeColor: 'right',
    icon: '✦',
    count: 10,
  },
  aplikasi: {
    type: 'aplikasi',
    name: 'Aplikasi Nyata',
    description: 'Penerapan teorema Pythagoras pada masalah kontekstual kehidupan sehari-hari',
    badgeColor: 'gold',
    icon: '◈',
    count: 10,
  },
}

// ============================================================
//  Default Configuration
// ============================================================

export const defaultQuizConfig: QuizConfig = {
  questionsPerRound: 15,
  defaultTimeLimit: 90,
  pointsPerCorrect: 10,
  bonusStreak: 2,
  shuffleQuestions: true,
  showLiveRanking: true,
  soundEffects: true,
}

// ============================================================
//  SVG Ilustrasi Helper
// ============================================================

/** Segitiga siku-siku standar dengan label sisi */
function svgTriangle(a: string, b: string, c: string, scale = 1) {
  const W = Math.round(200 * scale), H = Math.round(150 * scale)
  const px = 20, py = H - 20
  const qx = W - 20, qy = H - 20
  const rx = 20, ry = 20
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
  <defs><marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#0F172A" opacity=".4"/></marker></defs>
  <!-- Triangle -->
  <polygon points="${px},${py} ${qx},${qy} ${rx},${ry}" fill="#FFFFFF" stroke="#0F172A" stroke-width="2"/>
  <!-- Right angle box -->
  <rect x="${px}" y="${py - 14}" width="14" height="14" fill="none" stroke="#C9A227" stroke-width="1.5"/>
  <!-- Side labels -->
  <text x="${(px + qx) / 2}" y="${py + 16}" text-anchor="middle" font-size="13" fill="#0F172A" font-family="Inter,sans-serif" font-weight="600">${b}</text>
  <text x="${rx - 16}" y="${(py + ry) / 2}" text-anchor="middle" font-size="13" fill="#0F172A" font-family="Inter,sans-serif" font-weight="600">${a}</text>
  <text x="${(qx + rx) / 2 + 12}" y="${(py + ry) / 2 - 4}" text-anchor="middle" font-size="13" fill="#C9A227" font-family="Inter,sans-serif" font-weight="700">${c}</text>
  <!-- Label c small -->
  <text x="${(qx + rx) / 2 + 14}" y="${(py + ry) / 2 + 10}" text-anchor="middle" font-size="9" fill="#C9A227" font-family="Inter,sans-serif">(cari)</text>
</svg>`
}

/** Persegi panjang dengan diagonal */
function svgRectDiagonal(w: string, h: string, d: string) {
  return `<svg viewBox="0 0 220 150" width="220" height="150" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
  <rect x="20" y="20" width="180" height="110" fill="#FFFFFF" stroke="#0F172A" stroke-width="2"/>
  <line x1="20" y1="20" x2="200" y2="130" stroke="#C9A227" stroke-width="2" stroke-dasharray="6,3"/>
  <text x="110" y="142" text-anchor="middle" font-size="12" fill="#0F172A" font-family="Inter,sans-serif" font-weight="600">${w}</text>
  <text x="210" y="80" text-anchor="start" font-size="12" fill="#0F172A" font-family="Inter,sans-serif" font-weight="600">${h}</text>
  <text x="85" y="75" text-anchor="middle" font-size="12" fill="#C9A227" font-family="Inter,sans-serif" font-weight="700">${d} ?</text>
</svg>`
}

/** Tangga sandar ke dinding */
function svgLadder(base: string, height: string, ladder: string) {
  return `<svg viewBox="0 0 200 180" width="200" height="180" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
  <!-- Ground -->
  <line x1="10" y1="160" x2="190" y2="160" stroke="#0F172A" stroke-width="2.5"/>
  <!-- Wall -->
  <line x1="40" y1="160" x2="40" y2="15" stroke="#0F172A" stroke-width="2.5"/>
  <!-- Ladder -->
  <line x1="40" y1="40" x2="150" y2="160" stroke="#C9A227" stroke-width="3" stroke-linecap="round"/>
  <!-- Rungs -->
  <line x1="53" y1="51" x2="68" y2="66" stroke="#C9A227" stroke-width="1.5" opacity=".5"/>
  <line x1="74" y1="74" x2="89" y2="89" stroke="#C9A227" stroke-width="1.5" opacity=".5"/>
  <line x1="95" y1="97" x2="110" y2="112" stroke="#C9A227" stroke-width="1.5" opacity=".5"/>
  <line x1="116" y1="120" x2="131" y2="135" stroke="#C9A227" stroke-width="1.5" opacity=".5"/>
  <!-- Right angle at wall/ground -->
  <rect x="40" y="145" width="14" height="14" fill="none" stroke="#C9A227" stroke-width="1.5"/>
  <!-- Labels -->
  <text x="25" y="105" text-anchor="middle" font-size="11" fill="#0F172A" font-family="Inter,sans-serif" font-weight="600">${height}</text>
  <text x="98" y="175" text-anchor="middle" font-size="11" fill="#0F172A" font-family="Inter,sans-serif" font-weight="600">${base}</text>
  <text x="105" y="90" text-anchor="middle" font-size="11" fill="#C9A227" font-family="Inter,sans-serif" font-weight="700">${ladder} ?</text>
</svg>`
}

/** Kapal berlayar (koordinat) */
function svgShip(north: string, east: string, dist: string) {
  return `<svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
  <!-- Grid lines -->
  <line x1="40" y1="10" x2="40" y2="180" stroke="#E0DDD8" stroke-width="1" stroke-dasharray="4,4"/>
  <line x1="10" y1="160" x2="180" y2="160" stroke="#E0DDD8" stroke-width="1" stroke-dasharray="4,4"/>
  <!-- North path -->
  <line x1="40" y1="160" x2="40" y2="40" stroke="#2E7D5B" stroke-width="2.5" marker-end="url(#ga)"/>
  <!-- East path -->
  <line x1="40" y1="40" x2="160" y2="40" stroke="#2E7D5B" stroke-width="2.5" marker-end="url(#ga)"/>
  <!-- Hypotenuse -->
  <line x1="40" y1="160" x2="160" y2="40" stroke="#C9A227" stroke-width="2.5" stroke-dasharray="7,4"/>
  <!-- Right angle -->
  <rect x="40" y="40" width="14" height="14" fill="none" stroke="#C9A227" stroke-width="1.5"/>
  <!-- Arrow marker -->
  <defs><marker id="ga" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto"><polygon points="0,0 7,3.5 0,7" fill="#2E7D5B"/></marker></defs>
  <!-- Labels -->
  <text x="24" y="105" text-anchor="middle" font-size="11" fill="#0F172A" font-family="Inter,sans-serif" font-weight="600">${north}</text>
  <text x="102" y="54" text-anchor="middle" font-size="11" fill="#0F172A" font-family="Inter,sans-serif" font-weight="600">${east}</text>
  <text x="115" y="115" text-anchor="middle" font-size="11" fill="#C9A227" font-family="Inter,sans-serif" font-weight="700">${dist} ?</text>
  <!-- Points -->
  <circle cx="40" cy="160" r="4" fill="#0F172A"/>
  <circle cx="40" cy="40" r="4" fill="#2E7D5B"/>
  <circle cx="160" cy="40" r="4" fill="#C9A227"/>
  <text x="50" y="175" font-size="9" fill="#0F172A" font-family="Inter,sans-serif">Start</text>
</svg>`
}

/** Persegi dengan diagonal — untuk soal diagonal persegi */
function svgSquareDiag(side: string) {
  return `<svg viewBox="0 0 180 180" width="180" height="180" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
  <rect x="20" y="20" width="140" height="140" fill="#FFFFFF" stroke="#0F172A" stroke-width="2"/>
  <line x1="20" y1="20" x2="160" y2="160" stroke="#C9A227" stroke-width="2" stroke-dasharray="6,3"/>
  <line x1="160" y1="20" x2="20" y2="160" stroke="#C9A227" stroke-width="2" stroke-dasharray="6,3" opacity=".3"/>
  <text x="90" y="175" text-anchor="middle" font-size="12" fill="#0F172A" font-family="Inter,sans-serif" font-weight="600">${side}</text>
  <text x="3" y="95" text-anchor="middle" font-size="12" fill="#0F172A" font-family="Inter,sans-serif" font-weight="600">${side}</text>
  <text x="98" y="82" text-anchor="middle" font-size="11" fill="#C9A227" font-family="Inter,sans-serif" font-weight="700">d = ?</text>
</svg>`
}

/** Segitiga dengan label mencari sisi tegak */
function svgTriangleFindLeg(hyp: string, knownLeg: string, unknownLabel: string) {
  return `<svg viewBox="0 0 200 150" width="200" height="150" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
  <polygon points="20,130 180,130 20,20" fill="#FFFFFF" stroke="#0F172A" stroke-width="2"/>
  <rect x="20" y="116" width="14" height="14" fill="none" stroke="#C9A227" stroke-width="1.5"/>
  <text x="100" y="145" text-anchor="middle" font-size="13" fill="#0F172A" font-family="Inter,sans-serif" font-weight="600">${knownLeg}</text>
  <text x="4" y="80" text-anchor="middle" font-size="13" fill="#C9A227" font-family="Inter,sans-serif" font-weight="700">${unknownLabel} ?</text>
  <text x="118" y="72" text-anchor="middle" font-size="13" fill="#0F172A" font-family="Inter,sans-serif" font-weight="600">${hyp}</text>
  <text x="120" y="86" text-anchor="middle" font-size="9" fill="#0F172A" opacity=".5" font-family="Inter,sans-serif">(miring)</text>
</svg>`
}

/** Tiga jenis segitiga visual untuk soal jenis */
function svgTriangleType(a: number, b: number, c: number) {
  // Hitung jenis: c adalah sisi terbesar
  const sides = [a, b, c].sort((x, y) => x - y)
  const [s1, s2, s3] = sides
  // Susun koordinat kira-kira
  const scale = 120 / s3
  const bx = Math.round(s2 * scale)
  // Cosine rule to find angle: cos C = (a²+b²-c²)/(2ab)
  const cosC = (s1 * s1 + s2 * s2 - s3 * s3) / (2 * s1 * s2)
  const hApprox = Math.round(s1 * scale * Math.sqrt(1 - Math.min(1, cosC * cosC)))
  const dxApprox = Math.round(s1 * scale * cosC)
  const W = Math.max(bx + 40, 200)
  const H = Math.max(hApprox + 50, 120)
  const px = 20, py = H - 20
  const qx = px + bx, qy = H - 20
  const rx = px + dxApprox, ry = py - hApprox
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
  <polygon points="${px},${py} ${qx},${qy} ${rx},${ry}" fill="#FFFFFF" stroke="#0F172A" stroke-width="2"/>
  <text x="${(px + qx) / 2}" y="${py + 14}" text-anchor="middle" font-size="11" fill="#0F172A" font-family="Inter,sans-serif" font-weight="600">${s2}</text>
  <text x="${(px + rx) / 2 - 8}" y="${(py + ry) / 2}" text-anchor="middle" font-size="11" fill="#0F172A" font-family="Inter,sans-serif" font-weight="600">${s1}</text>
  <text x="${(qx + rx) / 2 + 8}" y="${(qy + ry) / 2}" text-anchor="middle" font-size="11" fill="#C9A227" font-family="Inter,sans-serif" font-weight="700">${s3}</text>
</svg>`
}

// ============================================================
//  50 Soal Bank Soal Pythagoras (5 Kategori × 10 Soal)
// ============================================================

export const questions: Question[] = [

  // ============================================================
  // KATEGORI 1: RUMUS PYTHAGORAS — 10 Soal
  // ============================================================

  {
    id: 'r1',
    type: 'rumus',
    category: 'Rumus Pythagoras',
    text: 'Perhatikan segitiga siku-siku berikut. Jika sisi tegak a = 6 cm dan b = 8 cm, berapakah panjang hipotenusa c?',
    answer: '10',
    alternativeAnswers: ['10cm', '10 cm'],
    explanation: 'c² = a² + b² = 6² + 8² = 36 + 64 = 100 → c = √100 = 10 cm (Ini adalah Tripel Pythagoras 6-8-10)',
    difficulty: 'easy',
    timeLimit: 60,
    svgIllustration: svgTriangle('6 cm', '8 cm', 'c'),
    options: [
      { id: 'A', text: '10 cm' },
      { id: 'B', text: '12 cm' },
      { id: 'C', text: '14 cm' },
      { id: 'D', text: '7 cm' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'r2',
    type: 'rumus',
    category: 'Rumus Pythagoras',
    text: 'Segitiga siku-siku memiliki sisi miring (hipotenusa) 13 cm dan sisi tegak 5 cm. Berapakah panjang sisi tegak lainnya?',
    answer: '12',
    alternativeAnswers: ['12cm', '12 cm'],
    explanation: 'b² = c² − a² = 13² − 5² = 169 − 25 = 144 → b = √144 = 12 cm',
    difficulty: 'easy',
    timeLimit: 75,
    svgIllustration: svgTriangleFindLeg('13 cm', '5 cm', 'b'),
    options: [
      { id: 'A', text: '8 cm' },
      { id: 'B', text: '12 cm' },
      { id: 'C', text: '10 cm' },
      { id: 'D', text: '18 cm' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'r3',
    type: 'rumus',
    category: 'Rumus Pythagoras',
    text: 'Segitiga siku-siku memiliki sisi tegak 9 cm dan 12 cm. Berapakah panjang sisi miringnya?',
    answer: '15',
    alternativeAnswers: ['15cm', '15 cm'],
    explanation: 'c² = 9² + 12² = 81 + 144 = 225 → c = √225 = 15 cm (Tripel 9-12-15, kelipatan 3 dari 3-4-5)',
    difficulty: 'easy',
    timeLimit: 60,
    svgIllustration: svgTriangle('9 cm', '12 cm', 'c'),
    options: [
      { id: 'A', text: '15 cm' },
      { id: 'B', text: '21 cm' },
      { id: 'C', text: '18 cm' },
      { id: 'D', text: '16 cm' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'r4',
    type: 'rumus',
    category: 'Rumus Pythagoras',
    text: 'Hipotenusa sebuah segitiga siku-siku adalah 17 cm. Salah satu sisi tegaknya 8 cm. Berapakah sisi tegak lainnya?',
    answer: '15',
    alternativeAnswers: ['15cm', '15 cm'],
    explanation: 'b² = 17² − 8² = 289 − 64 = 225 → b = √225 = 15 cm',
    difficulty: 'medium',
    timeLimit: 90,
    svgIllustration: svgTriangleFindLeg('17 cm', '8 cm', 'b'),
    options: [
      { id: 'A', text: '13 cm' },
      { id: 'B', text: '15 cm' },
      { id: 'C', text: '9 cm' },
      { id: 'D', text: '25 cm' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'r5',
    type: 'rumus',
    category: 'Rumus Pythagoras',
    text: 'Segitiga siku-siku memiliki sisi tegak 5 cm dan 12 cm. Berapa panjang sisi miringnya?',
    answer: '13',
    alternativeAnswers: ['13cm', '13 cm'],
    explanation: 'c² = 5² + 12² = 25 + 144 = 169 → c = √169 = 13 cm',
    difficulty: 'easy',
    timeLimit: 60,
    svgIllustration: svgTriangle('5 cm', '12 cm', 'c'),
    options: [
      { id: 'A', text: '17 cm' },
      { id: 'B', text: '14 cm' },
      { id: 'C', text: '13 cm' },
      { id: 'D', text: '15 cm' },
    ],
    correctOptionId: 'C',
  },
  {
    id: 'r6',
    type: 'rumus',
    category: 'Rumus Pythagoras',
    text: 'Sisi tegak segitiga siku-siku adalah 4 cm dan 6 cm. Nyatakan panjang hipotenusanya dalam bentuk akar paling sederhana!',
    answer: '2√13',
    alternativeAnswers: ['2v13', '2akar13', '2 akar 13', '√52'],
    explanation: 'c² = 4² + 6² = 16 + 36 = 52 → c = √52 = √(4×13) = 2√13 cm',
    difficulty: 'hard',
    timeLimit: 90,
    svgIllustration: svgTriangle('4 cm', '6 cm', 'c'),
    options: [
      { id: 'A', text: '2√13 cm' },
      { id: 'B', text: '10 cm' },
      { id: 'C', text: '4√3 cm' },
      { id: 'D', text: '2√10 cm' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'r7',
    type: 'rumus',
    category: 'Rumus Pythagoras',
    text: 'Segitiga siku-siku memiliki sisi tegak 7 cm dan 24 cm. Berapa panjang hipotenusanya?',
    answer: '25',
    alternativeAnswers: ['25cm', '25 cm'],
    explanation: 'c² = 7² + 24² = 49 + 576 = 625 → c = √625 = 25 cm (Tripel 7-24-25)',
    difficulty: 'medium',
    timeLimit: 90,
    svgIllustration: svgTriangle('7 cm', '24 cm', 'c'),
    options: [
      { id: 'A', text: '31 cm' },
      { id: 'B', text: '26 cm' },
      { id: 'C', text: '25 cm' },
      { id: 'D', text: '28 cm' },
    ],
    correctOptionId: 'C',
  },
  {
    id: 'r8',
    type: 'rumus',
    category: 'Rumus Pythagoras',
    text: 'Sebuah segitiga siku-siku memiliki hipotenusa 26 cm dan salah satu sisinya 10 cm. Berapakah sisi ketiga segitiga tersebut?',
    answer: '24',
    alternativeAnswers: ['24cm', '24 cm'],
    explanation: 'b² = 26² − 10² = 676 − 100 = 576 → b = √576 = 24 cm (Tripel 10-24-26)',
    difficulty: 'medium',
    timeLimit: 90,
    svgIllustration: svgTriangleFindLeg('26 cm', '10 cm', 'b'),
    options: [
      { id: 'A', text: '20 cm' },
      { id: 'B', text: '22 cm' },
      { id: 'C', text: '24 cm' },
      { id: 'D', text: '28 cm' },
    ],
    correctOptionId: 'C',
  },
  {
    id: 'r9',
    type: 'rumus',
    category: 'Rumus Pythagoras',
    text: 'Diketahui segitiga siku-siku dengan sisi tegak p cm dan 40 cm, serta hipotenusa 41 cm. Tentukan nilai p!',
    answer: '9',
    alternativeAnswers: ['9cm', '9 cm'],
    explanation: 'p² = 41² − 40² = 1681 − 1600 = 81 → p = √81 = 9 cm (Tripel 9-40-41)',
    difficulty: 'hard',
    timeLimit: 90,
    svgIllustration: svgTriangleFindLeg('41 cm', '40 cm', 'p'),
    options: [
      { id: 'A', text: '7 cm' },
      { id: 'B', text: '8 cm' },
      { id: 'C', text: '9 cm' },
      { id: 'D', text: '11 cm' },
    ],
    correctOptionId: 'C',
  },
  {
    id: 'r10',
    type: 'rumus',
    category: 'Rumus Pythagoras',
    text: 'Diketahui segitiga ABC siku-siku di A. BC = 2x cm, AB = 12 cm, AC = 16 cm. Tentukan nilai x!',
    answer: '10',
    alternativeAnswers: ['x=10', '10cm'],
    explanation: 'BC² = AB² + AC² = 12² + 16² = 144 + 256 = 400 → BC = √400 = 20 cm. Jadi 2x = 20 → x = 10',
    difficulty: 'hard',
    timeLimit: 120,
    extraNote: 'BC adalah sisi miring (hipotenusa). AB = 12 cm, AC = 16 cm.',
    options: [
      { id: 'A', text: 'x = 8' },
      { id: 'B', text: 'x = 10' },
      { id: 'C', text: 'x = 12' },
      { id: 'D', text: 'x = 15' },
    ],
    correctOptionId: 'B',
  },

  // ============================================================
  // KATEGORI 2: TRIPEL PYTHAGORAS — 10 Soal
  // ============================================================

  {
    id: 't1',
    type: 'tripel',
    category: 'Tripel Pythagoras',
    text: 'Apakah (3, 4, 5) merupakan Tripel Pythagoras?',
    answer: 'ya',
    alternativeAnswers: ['yes', 'benar', 'y', 'iya'],
    explanation: '3² + 4² = 9 + 16 = 25 = 5² ✓ — Ini adalah Tripel Pythagoras primitif yang paling dasar.',
    difficulty: 'easy',
    timeLimit: 45,
    svgIllustration: svgTriangle('3', '4', '5'),
    options: [
      { id: 'A', text: 'Ya, Tripel Pythagoras' },
      { id: 'B', text: 'Bukan Tripel Pythagoras' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 't2',
    type: 'tripel',
    category: 'Tripel Pythagoras',
    text: 'Apakah (5, 12, 13) merupakan Tripel Pythagoras?',
    answer: 'ya',
    alternativeAnswers: ['yes', 'benar', 'y', 'iya'],
    explanation: '5² + 12² = 25 + 144 = 169 = 13² ✓ — Tripel Pythagoras primitif kedua yang umum.',
    difficulty: 'easy',
    timeLimit: 60,
    options: [
      { id: 'A', text: 'Ya, Tripel Pythagoras' },
      { id: 'B', text: 'Bukan Tripel Pythagoras' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 't3',
    type: 'tripel',
    category: 'Tripel Pythagoras',
    text: 'Apakah (4, 5, 6) merupakan Tripel Pythagoras?',
    answer: 'bukan',
    alternativeAnswers: ['no', 'tidak', 'salah', 'n'],
    explanation: '4² + 5² = 16 + 25 = 41 ≠ 36 (= 6²). Karena 41 ≠ 36, ini BUKAN Tripel Pythagoras.',
    difficulty: 'easy',
    timeLimit: 60,
    options: [
      { id: 'A', text: 'Ya, Tripel Pythagoras' },
      { id: 'B', text: 'Bukan Tripel Pythagoras' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 't4',
    type: 'tripel',
    category: 'Tripel Pythagoras',
    text: 'Apakah (6, 8, 10) merupakan Tripel Pythagoras?',
    answer: 'ya',
    alternativeAnswers: ['yes', 'benar', 'y', 'iya'],
    explanation: '6² + 8² = 36 + 64 = 100 = 10² ✓ — Ini adalah kelipatan 2 dari tripel (3, 4, 5).',
    difficulty: 'easy',
    timeLimit: 45,
    options: [
      { id: 'A', text: 'Ya, Tripel Pythagoras' },
      { id: 'B', text: 'Bukan Tripel Pythagoras' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 't5',
    type: 'tripel',
    category: 'Tripel Pythagoras',
    text: 'Apakah (7, 24, 25) merupakan Tripel Pythagoras?',
    answer: 'ya',
    alternativeAnswers: ['yes', 'benar', 'y', 'iya'],
    explanation: '7² + 24² = 49 + 576 = 625 = 25² ✓ — Tripel Pythagoras primitif yang jarang dikenal.',
    difficulty: 'medium',
    timeLimit: 75,
    options: [
      { id: 'A', text: 'Ya, Tripel Pythagoras' },
      { id: 'B', text: 'Bukan Tripel Pythagoras' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 't6',
    type: 'tripel',
    category: 'Tripel Pythagoras',
    text: 'Apakah (8, 15, 17) merupakan Tripel Pythagoras?',
    answer: 'ya',
    alternativeAnswers: ['yes', 'benar', 'y', 'iya'],
    explanation: '8² + 15² = 64 + 225 = 289 = 17² ✓ — Tripel Pythagoras primitif, sering muncul di olimpiade.',
    difficulty: 'medium',
    timeLimit: 75,
    options: [
      { id: 'A', text: 'Ya, Tripel Pythagoras' },
      { id: 'B', text: 'Bukan Tripel Pythagoras' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 't7',
    type: 'tripel',
    category: 'Tripel Pythagoras',
    text: 'Apakah (5, 6, 7) merupakan Tripel Pythagoras?',
    answer: 'bukan',
    alternativeAnswers: ['no', 'tidak', 'salah', 'n'],
    explanation: '5² + 6² = 25 + 36 = 61 ≠ 49 (= 7²). Bukan Tripel Pythagoras.',
    difficulty: 'easy',
    timeLimit: 60,
    options: [
      { id: 'A', text: 'Ya, Tripel Pythagoras' },
      { id: 'B', text: 'Bukan Tripel Pythagoras' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 't8',
    type: 'tripel',
    category: 'Tripel Pythagoras',
    text: 'Apakah (9, 40, 41) merupakan Tripel Pythagoras?',
    answer: 'ya',
    alternativeAnswers: ['yes', 'benar', 'y', 'iya'],
    explanation: '9² + 40² = 81 + 1600 = 1681 = 41² ✓ — Tripel Pythagoras primitif tingkat lanjut.',
    difficulty: 'hard',
    timeLimit: 90,
    options: [
      { id: 'A', text: 'Ya, Tripel Pythagoras' },
      { id: 'B', text: 'Bukan Tripel Pythagoras' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 't9',
    type: 'tripel',
    category: 'Tripel Pythagoras',
    text: 'Diketahui sebuah tripel Pythagoras dengan dua bilangan pertama 20 dan 21. Berapakah bilangan ketiga (sisi terpanjang)?',
    answer: '29',
    alternativeAnswers: ['29cm', '29 cm'],
    explanation: '20² + 21² = 400 + 441 = 841 = 29² → Sisi terpanjang = 29. (Tripel 20-21-29)',
    difficulty: 'hard',
    timeLimit: 90,
    extraNote: 'Carilah nilai c sehingga 20² + 21² = c²',
    options: [
      { id: 'A', text: '28' },
      { id: 'B', text: '29' },
      { id: 'C', text: '30' },
      { id: 'D', text: '31' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 't10',
    type: 'tripel',
    category: 'Tripel Pythagoras',
    text: 'Jika (a, b, c) adalah Tripel Pythagoras, apakah (2a, 2b, 2c) juga merupakan Tripel Pythagoras? Berikan contoh verifikasi dengan (3, 4, 5) → (6, 8, 10).',
    answer: 'ya',
    alternativeAnswers: ['yes', 'benar', 'y', 'iya', 'selalu'],
    explanation: '(2a)² + (2b)² = 4a² + 4b² = 4(a²+b²) = 4c² = (2c)². Jadi YA, setiap kelipatan bulat dari Tripel Pythagoras juga merupakan Tripel Pythagoras.',
    difficulty: 'hard',
    timeLimit: 120,
    extraNote: 'Verifikasi: 6² + 8² = 36 + 64 = 100 = 10² ✓',
    options: [
      { id: 'A', text: 'Ya, selalu merupakan Tripel Pythagoras' },
      { id: 'B', text: 'Tidak selalu' },
      { id: 'C', text: 'Hanya untuk kelipatan ganjil' },
      { id: 'D', text: 'Tergantung nilainya' },
    ],
    correctOptionId: 'A',
  },

  // ============================================================
  // KATEGORI 3: JENIS SEGITIGA — 10 Soal
  // ============================================================

  {
    id: 'j1',
    type: 'jenis',
    category: 'Jenis Segitiga',
    text: 'Perhatikan segitiga dengan sisi 3 cm, 4 cm, dan 5 cm. Jenis segitiga apa ini?',
    answer: 'siku-siku',
    alternativeAnswers: ['sikusiku', 'siku siku', 'siku'],
    explanation: 'c² = 5² = 25. a² + b² = 3² + 4² = 9 + 16 = 25. Karena c² = a² + b², segitiga ini SIKU-SIKU.',
    difficulty: 'easy',
    timeLimit: 60,
    svgIllustration: svgTriangleType(3, 4, 5),
    options: [
      { id: 'A', text: 'Siku-siku' },
      { id: 'B', text: 'Lancip' },
      { id: 'C', text: 'Tumpul' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'j2',
    type: 'jenis',
    category: 'Jenis Segitiga',
    text: 'Segitiga memiliki sisi 5 cm, 12 cm, dan 14 cm. Tentukan jenisnya!',
    answer: 'tumpul',
    alternativeAnswers: ['obtuse'],
    explanation: 'c² = 14² = 196. a² + b² = 5² + 12² = 25 + 144 = 169. Karena c² (196) > a² + b² (169), segitiga TUMPUL.',
    difficulty: 'medium',
    timeLimit: 75,
    svgIllustration: svgTriangleType(5, 12, 14),
    options: [
      { id: 'A', text: 'Siku-siku' },
      { id: 'B', text: 'Lancip' },
      { id: 'C', text: 'Tumpul' },
    ],
    correctOptionId: 'C',
  },
  {
    id: 'j3',
    type: 'jenis',
    category: 'Jenis Segitiga',
    text: 'Segitiga memiliki sisi 6 cm, 8 cm, dan 9 cm. Tentukan jenisnya!',
    answer: 'lancip',
    alternativeAnswers: ['acute', 'runcing'],
    explanation: 'c² = 9² = 81. a² + b² = 6² + 8² = 36 + 64 = 100. Karena c² (81) < a² + b² (100), segitiga LANCIP.',
    difficulty: 'medium',
    timeLimit: 75,
    svgIllustration: svgTriangleType(6, 8, 9),
    options: [
      { id: 'A', text: 'Siku-siku' },
      { id: 'B', text: 'Lancip' },
      { id: 'C', text: 'Tumpul' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'j4',
    type: 'jenis',
    category: 'Jenis Segitiga',
    text: 'Segitiga dengan sisi 7 cm, 24 cm, dan 25 cm. Tentukan jenisnya!',
    answer: 'siku-siku',
    alternativeAnswers: ['sikusiku', 'siku siku', 'siku'],
    explanation: 'c² = 25² = 625. a² + b² = 7² + 24² = 49 + 576 = 625. Karena c² = a² + b², segitiga SIKU-SIKU.',
    difficulty: 'easy',
    timeLimit: 60,
    options: [
      { id: 'A', text: 'Siku-siku' },
      { id: 'B', text: 'Lancip' },
      { id: 'C', text: 'Tumpul' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'j5',
    type: 'jenis',
    category: 'Jenis Segitiga',
    text: 'Segitiga dengan sisi 6 cm, 8 cm, dan 11 cm. Tentukan jenisnya!',
    answer: 'tumpul',
    alternativeAnswers: ['obtuse'],
    explanation: 'c² = 11² = 121. a² + b² = 6² + 8² = 36 + 64 = 100. Karena 121 > 100, segitiga TUMPUL.',
    difficulty: 'medium',
    timeLimit: 75,
    svgIllustration: svgTriangleType(6, 8, 11),
    options: [
      { id: 'A', text: 'Siku-siku' },
      { id: 'B', text: 'Lancip' },
      { id: 'C', text: 'Tumpul' },
    ],
    correctOptionId: 'C',
  },
  {
    id: 'j6',
    type: 'jenis',
    category: 'Jenis Segitiga',
    text: 'Segitiga dengan sisi 4 cm, 5 cm, dan 6 cm. Tentukan jenisnya!',
    answer: 'lancip',
    alternativeAnswers: ['acute', 'runcing'],
    explanation: 'c² = 6² = 36. a² + b² = 4² + 5² = 16 + 25 = 41. Karena 36 < 41, segitiga LANCIP.',
    difficulty: 'medium',
    timeLimit: 75,
    svgIllustration: svgTriangleType(4, 5, 6),
    options: [
      { id: 'A', text: 'Siku-siku' },
      { id: 'B', text: 'Lancip' },
      { id: 'C', text: 'Tumpul' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'j7',
    type: 'jenis',
    category: 'Jenis Segitiga',
    text: 'Segitiga dengan sisi 10 cm, 24 cm, dan 26 cm. Tentukan jenisnya!',
    answer: 'siku-siku',
    alternativeAnswers: ['sikusiku', 'siku siku', 'siku'],
    explanation: 'c² = 26² = 676. a² + b² = 10² + 24² = 100 + 576 = 676. Karena 676 = 676, segitiga SIKU-SIKU.',
    difficulty: 'medium',
    timeLimit: 75,
    options: [
      { id: 'A', text: 'Siku-siku' },
      { id: 'B', text: 'Lancip' },
      { id: 'C', text: 'Tumpul' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'j8',
    type: 'jenis',
    category: 'Jenis Segitiga',
    text: 'Segitiga dengan sisi 9 cm, 40 cm, dan 41 cm. Tentukan jenisnya!',
    answer: 'siku-siku',
    alternativeAnswers: ['sikusiku', 'siku siku', 'siku'],
    explanation: 'c² = 41² = 1681. a² + b² = 9² + 40² = 81 + 1600 = 1681. Karena 1681 = 1681, segitiga SIKU-SIKU.',
    difficulty: 'hard',
    timeLimit: 90,
    options: [
      { id: 'A', text: 'Siku-siku' },
      { id: 'B', text: 'Lancip' },
      { id: 'C', text: 'Tumpul' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'j9',
    type: 'jenis',
    category: 'Jenis Segitiga',
    text: 'Segitiga dengan sisi 5 cm, 7 cm, dan 9 cm. Tentukan jenisnya!',
    answer: 'tumpul',
    alternativeAnswers: ['obtuse'],
    explanation: 'c² = 9² = 81. a² + b² = 5² + 7² = 25 + 49 = 74. Karena 81 > 74, segitiga TUMPUL.',
    difficulty: 'medium',
    timeLimit: 75,
    svgIllustration: svgTriangleType(5, 7, 9),
    options: [
      { id: 'A', text: 'Siku-siku' },
      { id: 'B', text: 'Lancip' },
      { id: 'C', text: 'Tumpul' },
    ],
    correctOptionId: 'C',
  },
  {
    id: 'j10',
    type: 'jenis',
    category: 'Jenis Segitiga',
    text: 'Sebuah segitiga dengan sisi-sisi berturut-turut adalah (2n), (n²−1), dan (n²+1) untuk n = 3. Tentukan jenis segitiga tersebut!',
    answer: 'siku-siku',
    alternativeAnswers: ['sikusiku', 'siku siku', 'siku'],
    explanation: 'Untuk n=3: sisi = 6, 8, 10. Cek: 6²+8²=100=10². Ini adalah rumus umum Tripel Pythagoras: (2n, n²−1, n²+1). Segitiga SIKU-SIKU.',
    difficulty: 'hard',
    timeLimit: 120,
    extraNote: 'Substitusi n = 3: sisi = 2(3), (3²−1), (3²+1) = 6, 8, 10',
    options: [
      { id: 'A', text: 'Siku-siku' },
      { id: 'B', text: 'Lancip' },
      { id: 'C', text: 'Tumpul' },
      { id: 'D', text: 'Tidak bisa ditentukan' },
    ],
    correctOptionId: 'A',
  },

  // ============================================================
  // KATEGORI 4: SEGITIGA ISTIMEWA — 10 Soal
  // ============================================================

  {
    id: 'i1',
    type: 'istimewa',
    category: 'Segitiga Istimewa',
    text: 'Segitiga siku-siku sama kaki (45°-45°-90°) memiliki sisi tegak 5 cm. Berapakah panjang hipotenusanya?',
    answer: '5√2',
    alternativeAnswers: ['5v2', '5akar2', '5 akar 2', '5√2 cm'],
    explanation: 'Rasio 45°-45°-90°: sisi : sisi : hipotenusa = 1 : 1 : √2. Hipotenusa = 5 × √2 = 5√2 cm ≈ 7,07 cm',
    difficulty: 'easy',
    timeLimit: 75,
    extraNote: 'Perbandingan sisi sudut 45°-45°-90° = 1 : 1 : √2',
    options: [
      { id: 'A', text: '5√2 cm' },
      { id: 'B', text: '10 cm' },
      { id: 'C', text: '5√3 cm' },
      { id: 'D', text: '25 cm' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'i2',
    type: 'istimewa',
    category: 'Segitiga Istimewa',
    text: 'Pada segitiga 45°-45°-90°, sisi tegaknya 8 cm. Berapakah panjang hipotenusanya?',
    answer: '8√2',
    alternativeAnswers: ['8v2', '8akar2', '8 akar 2'],
    explanation: 'Hipotenusa = sisi × √2 = 8√2 cm ≈ 11,31 cm',
    difficulty: 'easy',
    timeLimit: 75,
    extraNote: 'Perbandingan 45°-45°-90° = a : a : a√2',
    options: [
      { id: 'A', text: '8√3 cm' },
      { id: 'B', text: '16 cm' },
      { id: 'C', text: '8√2 cm' },
      { id: 'D', text: '12 cm' },
    ],
    correctOptionId: 'C',
  },
  {
    id: 'i3',
    type: 'istimewa',
    category: 'Segitiga Istimewa',
    text: 'Pada segitiga 30°-60°-90°, sisi terpendek (depan sudut 30°) adalah 6 cm. Berapa panjang hipotenusanya?',
    answer: '12',
    alternativeAnswers: ['12cm', '12 cm'],
    explanation: 'Rasio 30°-60°-90°: a : a√3 : 2a. Hipotenusa = 2a = 2 × 6 = 12 cm',
    difficulty: 'medium',
    timeLimit: 90,
    extraNote: 'Perbandingan 30°-60°-90° = a : a√3 : 2a',
    options: [
      { id: 'A', text: '6√3 cm' },
      { id: 'B', text: '12 cm' },
      { id: 'C', text: '18 cm' },
      { id: 'D', text: '9 cm' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'i4',
    type: 'istimewa',
    category: 'Segitiga Istimewa',
    text: 'Pada segitiga 30°-60°-90°, sisi terpendek 4 cm. Berapakah panjang sisi di depan sudut 60°?',
    answer: '4√3',
    alternativeAnswers: ['4v3', '4akar3', '4 akar 3'],
    explanation: 'Sisi depan 60° = a√3 = 4√3 cm ≈ 6,93 cm',
    difficulty: 'medium',
    timeLimit: 90,
    extraNote: 'Perbandingan 30°-60°-90° = a : a√3 : 2a',
    options: [
      { id: 'A', text: '8 cm' },
      { id: 'B', text: '4√2 cm' },
      { id: 'C', text: '4√3 cm' },
      { id: 'D', text: '6 cm' },
    ],
    correctOptionId: 'C',
  },
  {
    id: 'i5',
    type: 'istimewa',
    category: 'Segitiga Istimewa',
    text: 'Pada segitiga 45°-45°-90°, hipotenusanya adalah 10√2 cm. Berapakah panjang sisi tegaknya?',
    answer: '10',
    alternativeAnswers: ['10cm', '10 cm'],
    explanation: 'Hipotenusa = a√2 = 10√2 → a = 10 cm. Kedua sisi tegak sama panjang = 10 cm.',
    difficulty: 'medium',
    timeLimit: 90,
    options: [
      { id: 'A', text: '10 cm' },
      { id: 'B', text: '5 cm' },
      { id: 'C', text: '20 cm' },
      { id: 'D', text: '10√2 cm' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'i6',
    type: 'istimewa',
    category: 'Segitiga Istimewa',
    text: 'Pada segitiga 30°-60°-90°, hipotenusa = 20 cm. Berapakah panjang sisi terpendeknya?',
    answer: '10',
    alternativeAnswers: ['10cm', '10 cm'],
    explanation: 'Hipotenusa = 2a → 20 = 2a → a = 10 cm (sisi terpendek, depan sudut 30°)',
    difficulty: 'easy',
    timeLimit: 75,
    options: [
      { id: 'A', text: '10 cm' },
      { id: 'B', text: '10√3 cm' },
      { id: 'C', text: '5 cm' },
      { id: 'D', text: '15 cm' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'i7',
    type: 'istimewa',
    category: 'Segitiga Istimewa',
    text: 'Pada segitiga 30°-60°-90° dengan hipotenusa 14 cm, berapakah panjang sisi di depan sudut 60°?',
    answer: '7√3',
    alternativeAnswers: ['7v3', '7akar3', '7 akar 3'],
    explanation: 'Hipotenusa = 2a = 14 → a = 7. Sisi depan 60° = a√3 = 7√3 cm ≈ 12,12 cm',
    difficulty: 'hard',
    timeLimit: 90,
    options: [
      { id: 'A', text: '7 cm' },
      { id: 'B', text: '14 cm' },
      { id: 'C', text: '7√2 cm' },
      { id: 'D', text: '7√3 cm' },
    ],
    correctOptionId: 'D',
  },
  {
    id: 'i8',
    type: 'istimewa',
    category: 'Segitiga Istimewa',
    text: 'Sebuah segitiga sama sisi memiliki sisi 12 cm. Berapakah tinggi segitiga tersebut?',
    answer: '6√3',
    alternativeAnswers: ['6v3', '6akar3', '6 akar 3'],
    explanation: 'Garis tinggi membagi segitiga sama sisi menjadi dua segitiga 30°-60°-90°. Setengah alas = 6 cm. Tinggi = 6√3 cm ≈ 10,39 cm',
    difficulty: 'hard',
    timeLimit: 120,
    extraNote: 'Garis tinggi segitiga sama sisi membentuk segitiga 30°-60°-90°.',
    options: [
      { id: 'A', text: '6 cm' },
      { id: 'B', text: '6√2 cm' },
      { id: 'C', text: '6√3 cm' },
      { id: 'D', text: '12√3 cm' },
    ],
    correctOptionId: 'C',
  },
  {
    id: 'i9',
    type: 'istimewa',
    category: 'Segitiga Istimewa',
    text: 'Pada segitiga 45°-45°-90°, diketahui hipotenusa = 6√2 cm. Berapakah luas segitiga tersebut?',
    answer: '18',
    alternativeAnswers: ['18cm2', '18 cm2', '18cm²', '18 cm²'],
    explanation: 'Hipotenusa = a√2 = 6√2 → a = 6 cm. Luas = ½ × a × a = ½ × 6 × 6 = 18 cm²',
    difficulty: 'hard',
    timeLimit: 120,
    extraNote: 'Luas = ½ × alas × tinggi. Pada segitiga 45°-45°-90°, alas = tinggi = a.',
    options: [
      { id: 'A', text: '12 cm²' },
      { id: 'B', text: '18 cm²' },
      { id: 'C', text: '24 cm²' },
      { id: 'D', text: '36 cm²' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'i10',
    type: 'istimewa',
    category: 'Segitiga Istimewa',
    text: 'Jika diagonal persegi = 10 cm, berapakah panjang sisi persegi tersebut?',
    answer: '5√2',
    alternativeAnswers: ['5v2', '5akar2', '5 akar 2'],
    explanation: 'Diagonal persegi membentuk dua segitiga 45°-45°-90°. Jika d = diagonal, s = sisi, maka d = s√2 → 10 = s√2 → s = 10/√2 = 5√2 cm',
    difficulty: 'hard',
    timeLimit: 120,
    svgIllustration: svgSquareDiag('s = ?'),
    extraNote: 'Diagonal = 10 cm. Cari sisi persegi.',
    options: [
      { id: 'A', text: '5 cm' },
      { id: 'B', text: '5√2 cm' },
      { id: 'C', text: '5√3 cm' },
      { id: 'D', text: '10√2 cm' },
    ],
    correctOptionId: 'B',
  },

  // ============================================================
  // KATEGORI 5: APLIKASI NYATA — 10 Soal
  // ============================================================

  {
    id: 'a1',
    type: 'aplikasi',
    category: 'Aplikasi Nyata',
    text: 'Sebuah tangga bersandar ke dinding. Kaki tangga berjarak 3 m dari dinding, tinggi yang dicapai adalah 4 m. Berapakah panjang tangga?',
    answer: '5',
    alternativeAnswers: ['5m', '5 m'],
    explanation: 'Panjang tangga = √(3² + 4²) = √(9 + 16) = √25 = 5 m',
    difficulty: 'easy',
    timeLimit: 60,
    svgIllustration: svgLadder('3 m', '4 m', '?'),
    options: [
      { id: 'A', text: '5 m' },
      { id: 'B', text: '7 m' },
      { id: 'C', text: '6 m' },
      { id: 'D', text: '4,5 m' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'a2',
    type: 'aplikasi',
    category: 'Aplikasi Nyata',
    text: 'Lapangan berbentuk persegi panjang berukuran 12 m × 5 m. Berapakah panjang lintasan diagonal lapangan?',
    answer: '13',
    alternativeAnswers: ['13m', '13 m'],
    explanation: 'Panjang diagonal = √(12² + 5²) = √(144 + 25) = √169 = 13 m',
    difficulty: 'easy',
    timeLimit: 60,
    svgIllustration: svgRectDiagonal('12 m', '5 m', 'd'),
    options: [
      { id: 'A', text: '17 m' },
      { id: 'B', text: '13 m' },
      { id: 'C', text: '15 m' },
      { id: 'D', text: '14 m' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'a3',
    type: 'aplikasi',
    category: 'Aplikasi Nyata',
    text: 'Tiang setinggi 12 m dipasangi kawat dari puncaknya ke tanah berjarak 9 m dari kaki tiang. Berapa panjang kawat?',
    answer: '15',
    alternativeAnswers: ['15m', '15 m'],
    explanation: 'Panjang kawat = √(12² + 9²) = √(144 + 81) = √225 = 15 m',
    difficulty: 'medium',
    timeLimit: 75,
    svgIllustration: svgLadder('9 m', '12 m', '?'),
    options: [
      { id: 'A', text: '21 m' },
      { id: 'B', text: '16 m' },
      { id: 'C', text: '15 m' },
      { id: 'D', text: '18 m' },
    ],
    correctOptionId: 'C',
  },
  {
    id: 'a4',
    type: 'aplikasi',
    category: 'Aplikasi Nyata',
    text: 'Kapal berlayar ke utara 8 km, lalu ke timur 15 km. Berapakah jarak terpendek kapal dari titik awal?',
    answer: '17',
    alternativeAnswers: ['17km', '17 km'],
    explanation: 'Jarak = √(8² + 15²) = √(64 + 225) = √289 = 17 km',
    difficulty: 'medium',
    timeLimit: 90,
    svgIllustration: svgShip('8 km', '15 km', 'd'),
    options: [
      { id: 'A', text: '23 km' },
      { id: 'B', text: '17 km' },
      { id: 'C', text: '19 km' },
      { id: 'D', text: '16 km' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'a5',
    type: 'aplikasi',
    category: 'Aplikasi Nyata',
    text: 'Layar TV berukuran 48 cm × 36 cm. Berapakah ukuran diagonal layar TV tersebut?',
    answer: '60',
    alternativeAnswers: ['60cm', '60 cm'],
    explanation: 'Diagonal = √(48² + 36²) = √(2304 + 1296) = √3600 = 60 cm',
    difficulty: 'medium',
    timeLimit: 90,
    svgIllustration: svgRectDiagonal('48 cm', '36 cm', 'd'),
    options: [
      { id: 'A', text: '84 cm' },
      { id: 'B', text: '50 cm' },
      { id: 'C', text: '60 cm' },
      { id: 'D', text: '72 cm' },
    ],
    correctOptionId: 'C',
  },
  {
    id: 'a6',
    type: 'aplikasi',
    category: 'Aplikasi Nyata',
    text: 'Lantai berbentuk persegi dengan sisi 8 m. Berapakah panjang diagonal lantai tersebut?',
    answer: '8√2',
    alternativeAnswers: ['8v2', '8akar2', '8 akar 2'],
    explanation: 'Diagonal persegi = sisi × √2 = 8√2 m ≈ 11,31 m',
    difficulty: 'hard',
    timeLimit: 90,
    svgIllustration: svgSquareDiag('8 m'),
    options: [
      { id: 'A', text: '8√2 m' },
      { id: 'B', text: '16 m' },
      { id: 'C', text: '8√3 m' },
      { id: 'D', text: '12 m' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'a7',
    type: 'aplikasi',
    category: 'Aplikasi Nyata',
    text: 'Seorang pejalan kaki berjalan 20 m ke arah timur, kemudian 21 m ke arah utara. Berapakah jarak pejalan kaki dari titik awal?',
    answer: '29',
    alternativeAnswers: ['29m', '29 m'],
    explanation: 'Jarak = √(20² + 21²) = √(400 + 441) = √841 = 29 m (Tripel 20-21-29)',
    difficulty: 'hard',
    timeLimit: 90,
    svgIllustration: svgShip('21 m', '20 m', 'd'),
    options: [
      { id: 'A', text: '41 m' },
      { id: 'B', text: '29 m' },
      { id: 'C', text: '31 m' },
      { id: 'D', text: '35 m' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'a8',
    type: 'aplikasi',
    category: 'Aplikasi Nyata',
    text: 'Sebuah tangga panjang 10 m bersandar ke dinding. Kaki tangga berjarak 6 m dari dinding. Seberapa tinggi ujung tangga dari tanah?',
    answer: '8',
    alternativeAnswers: ['8m', '8 m'],
    explanation: 'h² = 10² − 6² = 100 − 36 = 64 → h = √64 = 8 m',
    difficulty: 'medium',
    timeLimit: 75,
    svgIllustration: svgLadder('6 m', 'h = ?', '10 m'),
    options: [
      { id: 'A', text: '6 m' },
      { id: 'B', text: '7 m' },
      { id: 'C', text: '8 m' },
      { id: 'D', text: '9 m' },
    ],
    correctOptionId: 'C',
  },
  {
    id: 'a9',
    type: 'aplikasi',
    category: 'Aplikasi Nyata',
    text: 'Sebuah kolam renang berbentuk persegi panjang 30 m × 40 m. Berapakah jarak dari sudut A ke sudut C (diagonal kolam)?',
    answer: '50',
    alternativeAnswers: ['50m', '50 m'],
    explanation: 'Diagonal = √(30² + 40²) = √(900 + 1600) = √2500 = 50 m (Tripel 30-40-50, kelipatan 10 dari 3-4-5)',
    difficulty: 'hard',
    timeLimit: 90,
    svgIllustration: svgRectDiagonal('40 m', '30 m', 'AC'),
    options: [
      { id: 'A', text: '70 m' },
      { id: 'B', text: '45 m' },
      { id: 'C', text: '50 m' },
      { id: 'D', text: '55 m' },
    ],
    correctOptionId: 'C',
  },
  {
    id: 'a10',
    type: 'aplikasi',
    category: 'Aplikasi Nyata',
    text: 'Sebuah gedung dengan tinggi 24 m. Dari dasar gedung, seorang pemadam kebakaran merentangkan slang sejauh 7 m ke tanah secara horizontal dari tembok. Berapakah panjang slang dari titik di tanah ke puncak gedung?',
    answer: '25',
    alternativeAnswers: ['25m', '25 m'],
    explanation: 'Panjang slang = √(24² + 7²) = √(576 + 49) = √625 = 25 m (Tripel 7-24-25)',
    difficulty: 'hard',
    timeLimit: 120,
    extraNote: 'Tinggi gedung = 24 m (vertikal), jarak horizontal dari kaki gedung = 7 m.',
    svgIllustration: svgLadder('7 m', '24 m', '?'),
    options: [
      { id: 'A', text: '31 m' },
      { id: 'B', text: '25 m' },
      { id: 'C', text: '27 m' },
      { id: 'D', text: '30 m' },
    ],
    correctOptionId: 'B',
  },
]

// ============================================================
//  Alias backward compatibility
// ============================================================
export const sampleQuestions = questions

/**
 * Mengambil soal per kategori
 */
export function getQuestionsByType(type: QuestionType): Question[] {
  return questions.filter((q) => q.type === type)
}

/**
 * Memilih soal secara round-robin dari 5 kategori, lalu mengacak urutannya.
 */
export function selectRoundRobinQuestions(totalCount: number = 15): Question[] {
  const types: QuestionType[] = ['rumus', 'tripel', 'jenis', 'istimewa', 'aplikasi']
  const pools: Record<QuestionType, Question[]> = {
    rumus:    [...getQuestionsByType('rumus')].sort(() => Math.random() - 0.5),
    tripel:   [...getQuestionsByType('tripel')].sort(() => Math.random() - 0.5),
    jenis:    [...getQuestionsByType('jenis')].sort(() => Math.random() - 0.5),
    istimewa: [...getQuestionsByType('istimewa')].sort(() => Math.random() - 0.5),
    aplikasi: [...getQuestionsByType('aplikasi')].sort(() => Math.random() - 0.5),
  }

  const selected: Question[] = []
  let typeIdx = 0

  while (selected.length < totalCount) {
    const currentType = types[typeIdx % types.length]
    const pool = pools[currentType]
    if (pool.length > 0) selected.push(pool.shift()!)
    typeIdx++
    if (Object.values(pools).every((p) => p.length === 0)) break
  }

  return selected.sort(() => Math.random() - 0.5)
}

/**
 * Mendapatkan statistik bank soal
 */
export function getBankStats() {
  return {
    total: questions.length,
    byCategory: Object.fromEntries(
      Object.keys(CATEGORIES).map((k) => [k, getQuestionsByType(k as QuestionType).length])
    ),
    byDifficulty: {
      easy:   questions.filter((q) => q.difficulty === 'easy').length,
      medium: questions.filter((q) => q.difficulty === 'medium').length,
      hard:   questions.filter((q) => q.difficulty === 'hard').length,
    },
    withIllustration: questions.filter((q) => q.svgIllustration).length,
  }
}
