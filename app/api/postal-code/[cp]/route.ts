import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export interface PostalCodeResult {
  cp: string;
  municipio: string;
  provincia: string;
  distrito: string | null;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ cp: string }> }
) {
  const { cp } = await params;

  if (!/^\d{5}$/.test(cp)) {
    return NextResponse.json(
      { error: "El código postal debe tener 5 dígitos." },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("postal")
    .select("id, provincia, distrito")
    .eq("id", Number(cp))
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "CP no encontrado." },
      { status: 404 }
    );
  }

  const result: PostalCodeResult = {
    cp: String(data.id),
    municipio: data.provincia ?? "",
    provincia: data.provincia ?? "",
    distrito: data.distrito ?? null,
  };

  return NextResponse.json(result);
}