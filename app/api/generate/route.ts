import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");
  return new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey });
}

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    if (!input?.trim()) {
      return NextResponse.json({ error: "Input is required." }, { status: 400 });
    }

    const client = getClient();

    const systemPrompt = `You are an expert contract analysis and legal document AI. Given a partnership agreement (NDA, MSA, JV Agreement, etc.), extract and summarize:

1. PARTIES: Who are the contracting parties?
2. EFFECTIVE DATE & TERM: Start date, duration, renewal terms
3. JURISDICTION & GOVERNING LAW: Which laws apply?
4. KEY OBLIGATIONS: What must each party do?
5. INTELLECTUAL PROPERTY: Who owns what?
6. REVENUE SHARE / FINANCIAL TERMS: How is money split?
7. CONFIDENTIALITY: What's covered, what's excluded, duration?
8. TERMINATION: How can either party exit? Notice periods?
9. LIABILITY: Caps, exclusions, indemnification?
10. EXCLUSIVITY CLAUSES: Any non-compete or exclusive arrangements?
11. RED FLAG ANALYSIS: Identify risky clauses (auto-renewal traps, unlimited liability, unusual termination windows, missing cure periods)
12. RISK SCORE: Overall contract risk rating (Low/Medium/High) with explanation
13. OBLIGATION CALENDAR: Key upcoming deadlines and deliverables
14. PLAIN-ENGLISH SUMMARY: 2-3 paragraph summary a non-lawyer can understand
15. Q&A: Anticipate 3-5 common questions about this agreement

Format as structured markdown. Be thorough and flag anything unusual.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input },
      ],
      temperature: 0.3,
      max_tokens: 2500,
    });

    const result = completion.choices[0]?.message?.content || "No result generated.";
    return NextResponse.json({ result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
