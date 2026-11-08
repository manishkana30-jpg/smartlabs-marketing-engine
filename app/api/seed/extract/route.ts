import { NextRequest, NextResponse } from "next/server";
import { extractSeedFromUrl } from "@/lib/scrapers/extractor";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const result = await extractSeedFromUrl(url);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to extract seed from URL" },
      { status: 500 }
    );
  }
}

