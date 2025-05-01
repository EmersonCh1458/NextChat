import { NextResponse } from "next/server";
import { GeminiAdapter } from "../../lib/gemini-adapter";

const adapter = new GeminiAdapter(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { prompt, image } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    const result = await adapter.send(prompt, { image });
    return NextResponse.json({ image: result });
  } catch (error) {
    console.error("[Gemini Error]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
