"use client";
import { useState } from "react";

export default function PartnershipSummary() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      setResult(data.result || data.error || "No response received.");
    } catch {
      setResult("Error analyzing agreement. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white font-sans">
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center text-lg">📄</div>
          <div>
            <h1 className="font-semibold text-lg leading-tight">AI Partnership Summary</h1>
            <p className="text-xs text-gray-400">Extract key terms from agreements</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <section className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">
            Paste partnership agreement text (NDA, MSA, JV, etc.)
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"Paste the text of a partnership agreement, NDA, or MSA here. The AI will extract:\n- Parties involved\n- Term & termination clauses\n- IP ownership\n- Revenue share\n- Confidentiality obligations\n- Liability limits\n- Jurisdiction\n- Risk flags..."}
            className="w-full h-52 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Paste any partnership agreement text — AI extracts key terms, risks, and obligations.
            </p>
            <button
              onClick={handleGenerate}
              disabled={loading || !input.trim()}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
            >
              {loading ? "Analyzing..." : "Analyze Agreement"}
            </button>
          </div>
        </section>

        {loading && (
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">AI is analyzing the agreement...</p>
          </div>
        )}

        {result && !loading && (
          <section className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                {result}
              </pre>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs transition-colors"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={handleGenerate}
                className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-xs text-purple-300 transition-colors"
              >
                Re-analyze
              </button>
            </div>
          </section>
        )}

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
          {[
            { label: "Key clause extraction", icon: "📋" },
            { label: "Risk flagging", icon: "🚩" },
            { label: "Obligation calendar", icon: "📅" },
            { label: "Plain-English summary", icon: "💬" },
          ].map((f) => (
            <div key={f.label} className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
              <div className="text-xl mb-1">{f.icon}</div>
              <p className="text-xs text-gray-400">{f.label}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
