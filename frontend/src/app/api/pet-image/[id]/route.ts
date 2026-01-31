import { NextRequest, NextResponse } from 'next/server';

// Seeded PRNG (Mulberry32)
function mulberry32(seed: number): () => number {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Color palettes for pets
const PALETTES = [
  { body: '#FFB6C1', dark: '#FF69B4', bg: '#FFF0F5' }, // Pink
  { body: '#98D8C8', dark: '#4CAF50', bg: '#F0FFF4' }, // Mint
  { body: '#B8A9C9', dark: '#7B68EE', bg: '#F5F0FF' }, // Lavender
  { body: '#FFE4B5', dark: '#FFA500', bg: '#FFFAF0' }, // Peach
  { body: '#87CEEB', dark: '#4169E1', bg: '#F0F8FF' }, // Sky
  { body: '#DDA0DD', dark: '#BA55D3', bg: '#FFF0FF' }, // Plum
];

// Pet body masks (half, will be mirrored)
const BODIES = [
  // Round blob
  [[0,0,1,1,1],[0,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[0,1,1,1,1],[0,0,1,1,0]],
  // Cat-like
  [[1,0,0,1,1],[1,1,1,1,1],[0,1,1,1,1],[0,1,1,1,1],[0,1,1,1,1],[0,0,1,0,1]],
  // Bunny-like
  [[1,0,0,0,1],[1,0,0,1,1],[0,1,1,1,1],[0,1,1,1,1],[0,0,1,1,1],[0,0,1,0,1]],
];

function generatePetSvg(petId: string): string {
  const seed = hashString(petId);
  const random = mulberry32(seed);

  const bodyIdx = Math.floor(random() * BODIES.length);
  const paletteIdx = Math.floor(random() * PALETTES.length);
  const body = BODIES[bodyIdx];
  const palette = PALETTES[paletteIdx];

  const pixelSize = 16;
  const height = body.length;
  const width = body[0].length * 2 - 1;

  let rects = '';

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < body[y].length; x++) {
      if (body[y][x]) {
        rects += `<rect x="${x * pixelSize}" y="${y * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${palette.body}"/>`;
      }
    }
    // Mirror
    for (let x = body[y].length - 2; x >= 0; x--) {
      if (body[y][x]) {
        const mirrorX = (width - 1 - x) * pixelSize;
        rects += `<rect x="${mirrorX}" y="${y * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${palette.body}"/>`;
      }
    }
  }

  // Add eyes
  const eyeY = 2 * pixelSize + 4;
  rects += `<circle cx="${2 * pixelSize + 4}" cy="${eyeY}" r="4" fill="#000"/>`;
  rects += `<circle cx="${(width - 3) * pixelSize + 4}" cy="${eyeY}" r="4" fill="#000"/>`;

  // Add blush
  rects += `<circle cx="${1 * pixelSize + 8}" cy="${3 * pixelSize + 8}" r="6" fill="#FFB6C1" opacity="0.6"/>`;
  rects += `<circle cx="${(width - 2) * pixelSize + 8}" cy="${3 * pixelSize + 8}" r="6" fill="#FFB6C1" opacity="0.6"/>`;

  const svgWidth = width * pixelSize;
  const svgHeight = height * pixelSize;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="256" height="256">
  <rect width="100%" height="100%" fill="${palette.bg}"/>
  ${rects}
</svg>`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const svg = generatePetSvg(id);

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
