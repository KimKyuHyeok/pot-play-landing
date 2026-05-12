import { NextRequest, NextResponse } from "next/server";

const UPSTREAM = "https://pot-api.pot-play.com/api/v1/inquiry/landing";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const upstream = await fetch(UPSTREAM, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const resBody = await upstream.text();
    return new NextResponse(resBody, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
