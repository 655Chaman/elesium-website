import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Brain,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  Database,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  simulateAgentMemoryDrift,
  AgentMemoryDriftInputs
} from '../calculator/agentMemoryDriftModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';

export default function EnterpriseAgentMemoryDriftSimulator() {
  // Inputs State
  const [monthlyMultiTurnSessions, setMonthlyMultiTurnSessions] = useState<number>(50000);
  const [avgTurnsPerSession, setAvgTurnsPerSession] = useState<number>(30);
  const [tokensPerTurnBaseline, setTokensPerTurnBaseline] = useState<number>(750);
  const [costPerMillionTokensUSD] = useState<number>(3.50);
  const [memoryRetentionWindowTurns] = useState<number>(40);

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: AgentMemoryDriftInputs = useMemo(() => ({
    monthlyMultiTurnSessions,
    avgTurnsPerSession,
    tokensPerTurnBaseline,
    costPerMillionTokensUSD,
    memoryRetentionWindowTurns
  }), [
    monthlyMultiTurnSessions,
    avgTurnsPerSession,
    tokensPerTurnBaseline,
    costPerMillionTokensUSD,
    memoryRetentionWindowTurns
  ]);

  const results = useMemo(() => {
    return simulateAgentMemoryDrift(inputs);
  }, [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-memory-drift-compression-simulator" width="100%" height="700" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>
<div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">
  Calculated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#06b6d4;text-decoration:underline;">Elesium Sovereign AI Architecture</a>
</div>`;

  const copyEmbedToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE AGENT LONG-HORIZON MEMORY DRIFT & CONTEXT COMPRESSION MEMO
Workload Profile: ${(inputs.monthlyMultiTurnSessions / 1000).toFixed(0)}k sessions/mo | ${inputs.avgTurnsPerSession} turns/session | ${inputs.tokensPerTurnBaseline} tokens/turn

ARCHITECTURAL COMPARISON:
1. Uncompressed Raw Context Accumulation (Naive FIFO):
   - Peak Active Tokens: ${results.uncompressedRaw.effectiveContextWindowTokens.toLocaleString()} | Attention Overhead: ${results.uncompressedRaw.retrievalLatencyOverheadMs}ms TTFT
   - Memory Drift / Forgetting: ${results.uncompressedRaw.memoryDriftOrAmnesiaPct}%
   - Annual Remediation & Token Expense: $${results.uncompressedRaw.annualizedTotalCostUSD.toLocaleString()}
2. Naive Sliding Window Recency Truncation:
   - Peak Active Tokens: ${results.slidingWindow.effectiveContextWindowTokens.toLocaleString()}
   - State Amnesia Failure Rate: ${results.slidingWindow.memoryDriftOrAmnesiaPct}% (>8 turns context dropped)
   - Annual Remediation & Token Expense: $${results.slidingWindow.annualizedTotalCostUSD.toLocaleString()}
3. Elesium Sovereign Hierarchical Memory & Delta Compression:
   - Context Compression Ratio: ${results.sovereignHierarchical.contextCompressionRatioPct}%
   - Semantic Recall Latency: ${results.sovereignHierarchical.retrievalLatencyOverheadMs}ms (in-memory semantic vector index)
   - Memory Retention Accuracy: ${results.sovereignHierarchical.multiTurnTaskSuccessPct}% [<0.05% memory drift]
   - Net Annualized Savings: $${results.annualCostSavingsUSD.toLocaleString()}

RECOMMENDATION: Deploy hierarchical episodic memory and topological DAG delta compression over uncompressed FIFO prompt accumulation for complex multi-turn enterprise agent workflows.`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  const faqs = [
    {
      q: 'What is "lost-in-the-middle" memory drift in multi-turn enterprise agents?',
      a: 'Frontier LLM context windows (128k to 2M tokens) exhibit non-uniform attention distribution. As conversational history accumulates linearly in the prompt, information placed in the middle turns suffers from severe attention degradation. In long-horizon enterprise workflows (e.g., procurement negotiations, multi-step code refactoring, or statutory compliance audits), the agent forgets initial user constraints, leading to a 30%+ reasoning failure rate.'
    },
    {
      q: 'Why does naive sliding window truncation fail in complex business workflows?',
      a: 'Sliding window memory naively discards any turns older than a fixed threshold (e.g., 6 to 10 turns). When a customer or agent refers back to an entity, constraint, or approval granted in turn 2, the agent exhibits total state amnesia. This forces frustrating user repetition, breaks deterministic workflows, and triggers expensive manual support triage.'
    },
    {
      q: 'How does Elesium achieve 92.4% context compression with sub-85ms semantic recall?',
      a: 'Elesium decouples working context into three architectural tiers: Working Memory (active step), Episodic Semantic Memory (hierarchically summarized vector embeddings stored in in-memory pgvector/Redis), and Procedural State Checkpoints (deterministic JSON DAGs). When older state is required, a sub-85ms vector similarity query injects only the exact relevant state delta, eliminating 92% of redundant context tokens.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      <Helmet>
        <title>Enterprise Autonomous Agent Memory Drift &amp; Long-Horizon Context Compression Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate and benchmark multi-turn autonomous agent memory drift and context compression. Compare raw FIFO context accumulation against sliding windows and sovereign hierarchical semantic memory with 92.4% compression and sub-85ms retrieval."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-memory-drift-compression-simulator" />
      </Helmet>

      {/* Hero Section */}
      <header className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800 bg-slate-950">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-6">
            <Brain className="w-4 h-4" />
            <span>Interactive Long-Horizon Memory &amp; Context Compression Lab</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Enterprise Autonomous Agent Memory Drift &amp; Context Compression Simulator
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Simulate and benchmark multi-turn agent memory retention. Contrast uncompressed FIFO prompt bloat against naive sliding window amnesia and sovereign hierarchical semantic memory with 92.4% context compression and sub-85ms state recall.
          </p>
        </div>
      </header>

      {/* Main Interactive Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Sliders Block */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Multi-Turn Session &amp; Memory Parameters</h2>
            </div>
            <button
              onClick={() => setIsEmbedOpen(true)}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 transition-colors"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Embed Widget</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Monthly Sessions Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-300">Monthly Multi-Turn Sessions</span>
                <span className="text-cyan-400 font-bold">{(monthlyMultiTurnSessions / 1000).toFixed(0)}k sessions</span>
              </div>
              <input
                type="range"
                min={10000}
                max={250000}
                step={10000}
                value={monthlyMultiTurnSessions}
                onChange={(e) => setMonthlyMultiTurnSessions(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Total complex agentic workflows executed across enterprise teams.
              </span>
            </div>

            {/* Average Turns Per Session Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-300">Interaction Depth (Turns/Session)</span>
                <span className="text-cyan-400 font-bold">{avgTurnsPerSession} turns</span>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                step={5}
                value={avgTurnsPerSession}
                onChange={(e) => setAvgTurnsPerSession(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Number of back-and-forth reasoning steps and tool calls per session.
              </span>
            </div>

            {/* Tokens Per Turn Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-300">Tokens Generated Per Turn</span>
                <span className="text-cyan-400 font-bold">{tokensPerTurnBaseline} tokens</span>
              </div>
              <input
                type="range"
                min={250}
                max={1500}
                step={50}
                value={tokensPerTurnBaseline}
                onChange={(e) => setTokensPerTurnBaseline(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Average prompt context and output payload generated in each turn.
              </span>
            </div>
          </div>
        </div>

        {/* Top Impact KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
            <span className="text-xs font-mono uppercase text-slate-400 block mb-1">Annual Savings</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              ${(results.annualCostSavingsUSD / 1000).toFixed(1)}k
            </span>
            <span className="text-xs text-slate-400 block mt-1">Tokens &amp; Triage Reruns</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-500"></div>
            <span className="text-xs font-mono uppercase text-slate-400 block mb-1">Context Compression</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
              {results.tokenCompressionPct}%
            </span>
            <span className="text-xs text-slate-400 block mt-1">Active Window Token Cut</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500"></div>
            <span className="text-xs font-mono uppercase text-slate-400 block mb-1">Drift Suppression</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">
              {results.driftSuppressionPct}%
            </span>
            <span className="text-xs text-slate-400 block mt-1">&lt;0.05% Error across 50+ Turns</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
            <span className="text-xs font-mono uppercase text-slate-400 block mb-1">Recall Latency</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
              {results.sovereignHierarchical.retrievalLatencyOverheadMs} ms
            </span>
            <span className="text-xs text-slate-400 block mt-1">In-Memory Semantic Recall</span>
          </div>
        </div>

        {/* 3-Tier Architecture Benchmark Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-8 shadow-2xl">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Multi-Turn Memory Architecture Comparison</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Context Window &amp; Attention Analysis</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Memory Architecture</th>
                  <th className="p-4">Compression Ratio</th>
                  <th className="p-4">Peak Active Tokens</th>
                  <th className="p-4">Attention / TTFT Latency</th>
                  <th className="p-4">Memory Drift / Amnesia</th>
                  <th className="p-4">Task Fidelity</th>
                  <th className="p-4">Annual Cost Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-semibold text-rose-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span>Uncompressed Raw Context (FIFO)</span>
                  </td>
                  <td className="p-4 text-slate-400">0.0%</td>
                  <td className="p-4 text-rose-400 font-bold">{results.uncompressedRaw.effectiveContextWindowTokens.toLocaleString()} tokens</td>
                  <td className="p-4 text-rose-400 font-bold">+{results.uncompressedRaw.retrievalLatencyOverheadMs} ms</td>
                  <td className="p-4 text-rose-400 font-bold">{results.uncompressedRaw.memoryDriftOrAmnesiaPct}% (High Drift)</td>
                  <td className="p-4 text-slate-300">{results.uncompressedRaw.multiTurnTaskSuccessPct}%</td>
                  <td className="p-4 text-rose-400 font-bold">${results.uncompressedRaw.annualizedTotalCostUSD.toLocaleString()}</td>
                </tr>

                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-semibold text-amber-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>Sliding Window Recency Truncation</span>
                  </td>
                  <td className="p-4 text-amber-400">{results.slidingWindow.contextCompressionRatioPct}%</td>
                  <td className="p-4 text-slate-300">{results.slidingWindow.effectiveContextWindowTokens.toLocaleString()} tokens</td>
                  <td className="p-4 text-slate-300">+{results.slidingWindow.retrievalLatencyOverheadMs} ms</td>
                  <td className="p-4 text-amber-400 font-bold">{results.slidingWindow.memoryDriftOrAmnesiaPct}% (Amnesia)</td>
                  <td className="p-4 text-amber-400">{results.slidingWindow.multiTurnTaskSuccessPct}%</td>
                  <td className="p-4 text-amber-400">${results.slidingWindow.annualizedTotalCostUSD.toLocaleString()}</td>
                </tr>

                <tr className="bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors border-l-2 border-cyan-400">
                  <td className="p-4 font-bold text-cyan-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Elesium Sovereign Hierarchical Memory</span>
                  </td>
                  <td className="p-4 text-emerald-400 font-bold">{results.sovereignHierarchical.contextCompressionRatioPct}%</td>
                  <td className="p-4 text-cyan-300 font-bold">{results.sovereignHierarchical.effectiveContextWindowTokens.toLocaleString()} tokens</td>
                  <td className="p-4 text-cyan-300 font-bold">+{results.sovereignHierarchical.retrievalLatencyOverheadMs} ms</td>
                  <td className="p-4 text-emerald-400 font-bold">&lt;0.05% (Zero Drift)</td>
                  <td className="p-4 text-emerald-400 font-bold">{results.sovereignHierarchical.multiTurnTaskSuccessPct}%</td>
                  <td className="p-4 text-emerald-400 font-bold">${results.sovereignHierarchical.annualizedTotalCostUSD.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Executive Memo Generator */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Executive Context Architecture &amp; FinOps Memo</span>
            </h3>
            <button
              onClick={copyExecutiveMemo}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors flex items-center gap-1.5"
            >
              {hasCopiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{hasCopiedMemo ? 'Memo Copied!' : 'Copy Executive Memo'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Generate an instant, mathematically verified architectural justification memo comparing hierarchical semantic memory against FIFO context accumulation:
          </p>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto select-all">
            <p className="text-cyan-400 mb-2 font-bold">ENTERPRISE AGENT LONG-HORIZON MEMORY DRIFT &amp; CONTEXT COMPRESSION MEMO</p>
            <p className="mb-2">Workload: {(inputs.monthlyMultiTurnSessions / 1000).toFixed(0)}k sessions/mo | Turns: {inputs.avgTurnsPerSession} | Tokens/Turn: {inputs.tokensPerTurnBaseline}</p>
            <p className="text-slate-400 mb-1">1. Uncompressed FIFO: {results.uncompressedRaw.effectiveContextWindowTokens.toLocaleString()} peak tokens | Drift: {results.uncompressedRaw.memoryDriftOrAmnesiaPct}% | Annual Loss: ${results.uncompressedRaw.annualizedTotalCostUSD.toLocaleString()}</p>
            <p className="text-amber-400 mb-1">2. Sliding Window: {results.slidingWindow.effectiveContextWindowTokens.toLocaleString()} tokens | Amnesia Rate: {results.slidingWindow.memoryDriftOrAmnesiaPct}% | Annual Loss: ${results.slidingWindow.annualizedTotalCostUSD.toLocaleString()}</p>
            <p className="text-emerald-400 mb-2">3. Elesium Sovereign Hierarchical: {results.sovereignHierarchical.contextCompressionRatioPct}% compression | {results.sovereignHierarchical.retrievalLatencyOverheadMs}ms recall | Task Success: {results.sovereignHierarchical.multiTurnTaskSuccessPct}% | Net Savings: ${results.annualCostSavingsUSD.toLocaleString()}</p>
            <p className="text-slate-400 font-semibold">RECOMMENDATION: Deploy hierarchical episodic memory and topological DAG delta compression over uncompressed FIFO prompt accumulation for complex multi-turn enterprise agent workflows.</p>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400" />
            <span>Frequently Asked Context Architecture &amp; Memory Questions</span>
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 flex items-center justify-between text-sm font-semibold text-slate-200 hover:text-cyan-400 bg-slate-950/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-cyan-400' : 'text-slate-400'}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-4 text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/20 border-t border-slate-800">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Card */}
        <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 rounded-2xl p-8 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Eliminate Memory Drift Across Multi-Turn Enterprise Agents
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Elesium architects sovereign hierarchical memory systems with sub-85ms semantic recall and 92.4% context compression for enterprise BFSI, aerospace, and sovereign defense infrastructure.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <ExpandableScreen>
                <ExpandableScreenTrigger className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/20 inline-flex items-center gap-2">
                  <span>Schedule Architecture Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </ExpandableScreenTrigger>
                <ExpandableScreenContent>
                  <MandateApplicationForm />
                </ExpandableScreenContent>
              </ExpandableScreen>
              <Link
                to="/solutions"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors border border-slate-700"
              >
                Explore All Sovereign Solutions
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEmbedOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Code className="w-5 h-5 text-cyan-400" />
              Embed This Memory Drift Simulator
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Copy and paste this snippet into your engineering documentation, intranet, or technical blog:
            </p>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-300 overflow-x-auto mb-4 select-all">
              {embedCode}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Watermarked to Elesium Sovereign Architecture</span>
              <button
                onClick={copyEmbedToClipboard}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                {hasCopiedEmbed ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{hasCopiedEmbed ? 'Code Copied!' : 'Copy Embed Snippet'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
