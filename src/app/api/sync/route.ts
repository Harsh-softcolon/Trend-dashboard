import { syncTrends } from "@/lib/sync";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const results = await syncTrends();
    return NextResponse.json(results);
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: "Failed to sync trends" }, { status: 500 });
  }
}
