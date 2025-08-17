import { NextResponse } from 'next/server.js';
import { generateCSV } from '@/shared/actions/generate-csv.ts';

export async function POST(request: Request) {
  const data = await request.json();
  const csvString = await generateCSV(data);

  return new NextResponse(csvString, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="pokemons.csv"`,
    },
  });
}
