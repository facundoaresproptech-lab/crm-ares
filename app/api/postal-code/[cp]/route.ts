import { NextRequest, NextResponse } from "next/server";

export interface PostalCodeResult {
  cp: string;
  municipio: string;
  provincia: string;
  distrito: string | null;
}

/**
 * GET /api/postal-code/[cp]
 *
 * Looks up location data for a 5-digit Spanish postal code.
 * Queries the `postal_codes` table in the connected database.
 *
 * Expected table schema:
 *   cp        TEXT PRIMARY KEY
 *   municipio TEXT NOT NULL
 *   provincia TEXT NOT NULL
 *   distrito  TEXT
 *
 * Returns 404 when the CP is not found.
 * Returns 503 when the database is not yet configured.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ cp: string }> }
) {
  const { cp } = await params;

  // Validate: must be exactly 5 digits
  if (!/^\d{5}$/.test(cp)) {
    return NextResponse.json(
      { error: "El código postal debe tener 5 dígitos." },
      { status: 400 }
    );
  }

  // ── Database lookup ────────────────────────────────────────────────────────
  // When a database integration (e.g. Neon) is connected and the `postal_codes`
  // table is seeded, replace the block below with your preferred ORM / driver.
  //
  // Example with @neondatabase/serverless:
  //
  //   import { neon } from "@neondatabase/serverless";
  //   const sql = neon(process.env.DATABASE_URL!);
  //   const rows = await sql`
  //     SELECT cp, municipio, provincia, distrito
  //     FROM postal_codes
  //     WHERE cp = ${cp}
  //     LIMIT 1
  //   `;
  //   if (!rows.length) {
  //     return NextResponse.json({ error: "CP no encontrado." }, { status: 404 });
  //   }
  //   return NextResponse.json(rows[0] as PostalCodeResult);
  //
  // ──────────────────────────────────────────────────────────────────────────

  // No database connected yet — return 503 so the UI can handle the fallback.
  return NextResponse.json(
    {
      error:
        "Base de datos no configurada. Conéctate a una integración de base de datos y popula la tabla postal_codes.",
    },
    { status: 503 }
  );
}
