// app/api/lumi-chat/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "This endpoint only accepts POST requests" },
    { status: 405 }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { reply: "I did not receive any valid messages." },
        { status: 400 }
      );
    }

    console.log("Groq key:", process.env.GROQ_API_KEY ? 'SET' : 'MISSING');
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('GROQ_API_KEY environment variable is not set');
      return NextResponse.json(
        { reply: "Groq API key is missing on the server." },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      return NextResponse.json(
        { 
          reply: "Lumi could not reach her thinking engine just now.",
          debug: `Status: ${response.status}, Error: ${errorText.substring(0, 100)}`
        },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "I am here with you, but I could not form a reply this time.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Lumi API error:', error);
    return NextResponse.json(
      { reply: "Something went wrong while I was thinking about your question." },
      { status: 500 }
    );
  }
}
