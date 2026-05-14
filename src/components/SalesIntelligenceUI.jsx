import { useState } from "react";
import { CheckCircle, Search, Zap, Mail, Copy, RotateCcw, ExternalLink, User, Linkedin } from "lucide-react";

export default function SalesIntelligenceAgent() {
  const [step, setStep] = useState("form");
  const [company, setCompany] = useState("");
  const [research, setResearch] = useState(null);
  const [synthesis, setSynthesis] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedExecutive, setSelectedExecutive] = useState(null);

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    if (!company.trim()) return;

    setLoading(true);
    setError("");
    setStep("research");

    try {
      const researchRes = await fetch("/api/research", {
        method: "POST",
        body: JSON.stringify({ company }),
      });
      const researchData = await researchRes.json();
      if (!researchRes.ok) throw new Error(researchData.error);
      setResearch(researchData);

      const synthesisRes = await fetch("/api/synthesis", {
        method: "POST",
        body: JSON.stringify({ research: researchData }),
      });
      const synthesisData = await synthesisRes.json();
      if (!synthesisRes.ok) throw new Error(synthesisData.error);
      setSynthesis(synthesisData);

      setStep("selectTarget");
    } catch (err) {
      setError(err.message);
      setStep("form");
      setLoading(false);
    }
  };

  const handleSelectExecutive = async (executive) => {
    setSelectedExecutive(executive);
    setStep("userInput");
  };

  const handleGenerateEmail = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const service = e.target.service.value;

    if (!name.trim() || !service.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const emailRes = await fetch("/api/generateEmail", {
        method: "POST",
        body: JSON.stringify({ 
          synthesis, 
          name, 
          service, 
          contactName: selectedExecutive.name,
          contactTitle: selectedExecutive.title,
          targetEmail: selectedExecutive.email,
        }),
      });
      const emailData = await emailRes.json();
      if (!emailRes.ok) throw new Error(emailData.error);
      setEmail(emailData.email);
      setStep("email");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetFlow = () => {
    setStep("form");
    setCompany("");
    setEmail("");
    setResearch(null);
    setSynthesis(null);
    setSelectedExecutive(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">SalesIntel</h1>
              <p className="text-sm text-slate-400">AI-Powered B2B Research & Pitch</p>
            </div>
          </div>
          <p className="text-slate-300 text-lg mt-4">
            Research any company, find executives, and generate personalized pitch emails.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-lg flex items-start gap-3 animate-in fade-in">
            <div className="w-5 h-5 rounded-full bg-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {step === "form" && (
          <div className="animate-in fade-in duration-500">
            <form onSubmit={handleCompanySubmit} className="space-y-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
                <label className="block text-sm font-medium text-slate-200 mb-3">
                  Company to research
                </label>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g., TechCorp Inc"
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !company.trim()}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                  >
                    Research
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: "📊", title: "5 Research Agents", desc: "Company, jobs, trends, social, execs" },
                  { icon: "👥", title: "Find Executives", desc: "Extract emails & LinkedIn" },
                  { icon: "✉️", title: "Personalized Emails", desc: "BD expert crafted pitches" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors"
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </form>
          </div>
        )}

        {step === "research" && (
          <div className="animate-in fade-in duration-500">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
              <div className="inline-block mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center animate-spin">
                  <div className="w-12 h-12 rounded-full bg-slate-800" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Researching {company}</h2>
              <p className="text-slate-400 mb-8">Gathering intelligence and finding executive contacts...</p>
              <div className="space-y-3 max-w-sm mx-auto">
                {["Company intel", "Job postings", "Industry trends", "Social signals", "Executive research", "Finding contacts"].map(
                  (step, i) => (
                    <div key={i} className="flex items-center gap-3 text-left">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                      <span className="text-sm text-slate-300">{step}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {step === "selectTarget" && synthesis && (
          <div className="animate-in fade-in duration-500">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Select target executive</h2>
                  <p className="text-sm text-slate-400">Found {synthesis.total_contacts_found} executives</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {synthesis.target_executives && synthesis.target_executives.length > 0 ? (
                synthesis.target_executives.map((executive, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectExecutive(executive)}
                    className="w-full text-left bg-white/5 border border-white/10 hover:border-white/30 rounded-xl p-5 transition-all hover:bg-white/10 active:scale-95"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">{executive.name}</h3>
                          <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-200 rounded-full">
                            Rank #{executive.rank}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            executive.outreach_readiness === "high" 
                              ? "bg-green-500/20 text-green-200" 
                              : executive.outreach_readiness === "medium"
                              ? "bg-amber-500/20 text-amber-200"
                              : "bg-slate-500/20 text-slate-200"
                          }`}>
                            {executive.outreach_readiness === "high" && "✓ Ready"}
                            {executive.outreach_readiness === "medium" && "⚠ Medium"}
                            {executive.outreach_readiness === "low" && "- Limited"}
                          </span>
                        </div>
                        <p className="text-slate-300 mb-3">{executive.title}</p>
                        <p className="text-sm text-slate-400 mb-3">{executive.why_target}</p>
                        <div className="flex items-center gap-4 flex-wrap">
                          {executive.email && (
                            <div className="flex items-center gap-2 text-sm text-green-300">
                              <Mail className="w-4 h-4" />
                              <span className="font-mono text-xs">{executive.email}</span>
                            </div>
                          )}
                          {executive.linkedin && (
                            <a
                              href={executive.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200"
                            >
                              <Linkedin className="w-4 h-4" />
                              <span>View profile</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-2xl font-bold text-slate-200">{executive.relevance_score}</div>
                        <p className="text-xs text-slate-400">relevance</p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                  <p className="text-slate-400">No executives found. Try another company.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {step === "userInput" && selectedExecutive && (
          <div className="animate-in fade-in duration-500">
            <form onSubmit={handleGenerateEmail} className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
                <p className="text-xs text-slate-400 mb-2">Sending to:</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {selectedExecutive.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{selectedExecutive.name}</p>
                    <p className="text-xs text-slate-400">{selectedExecutive.title}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Craft your pitch</h2>
                </div>

                <p className="text-slate-300 mb-8">Tell us about your service.</p>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Your name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Tim Ajuwon"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">What service do you offer?</label>
                    <textarea
                      name="service"
                      placeholder="e.g., AI-powered onboarding automation for engineering teams"
                      rows="3"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Mail className="w-5 h-5" />
                    {loading ? "Generating..." : "Generate Email"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep("selectTarget");
                      setSelectedExecutive(null);
                    }}
                    className="px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:border-white/40 transition-all"
                  >
                    Back
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {step === "email" && (
          <div className="animate-in fade-in duration-500 space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Your pitch email</h2>
                  <p className="text-sm text-slate-400">Ready to send to {selectedExecutive.name}</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/20 rounded-xl p-6 mb-6 font-mono text-sm text-slate-200 whitespace-pre-wrap max-h-96 overflow-y-auto">
                {email}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={copyToClipboard}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Copy className="w-5 h-5" />
                  {copied ? "Copied!" : "Copy"}
                </button>

                {selectedExecutive.email && (
                  <a
                    href={`mailto:${selectedExecutive.email}`}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Mail className="w-5 h-5" />
                    Send
                  </a>
                )}

                <button
                  onClick={resetFlow}
                  className="px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:border-white/40 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  New
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
