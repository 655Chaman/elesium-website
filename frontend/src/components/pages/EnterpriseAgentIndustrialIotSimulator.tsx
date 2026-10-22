import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Factory,
  Cpu,
  Copy,
  Check,
  ChevronDown,
  Code,
  X,
  Sliders,
  Sparkles,
  Server,
  Layers,
  ShieldCheck,
  Coins
} from 'lucide-react';
import {
  calculateIndustrialIot,
  IndustrialIotInputs,
  FieldbusProtocol,
  EdgeComputePlatform,
  AnomalyDetectionModel
} from '../calculator/agentIndustrialIotModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentIndustrialIotSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [connectedPlcCount, setConnectedPlcCount] = useState<number>(32);
  const [fieldbusProtocol, setFieldbusProtocol] = useState<FieldbusProtocol>('opc_ua');
  const [samplingFrequencyHz, setSamplingFrequencyHz] = useState<number>(100);
  const [edgeComputePlatform, setEdgeComputePlatform] = useState<EdgeComputePlatform>('nvidia_jetson_agx');
  const [dataBufferingHours, setDataBufferingHours] = useState<number>(24);
  const [anomalyDetectionModel, setAnomalyDetectionModel] = useState<AnomalyDetectionModel>('temporal_autoencoder');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: IndustrialIotInputs = useMemo(() => ({
    connectedPlcCount,
    fieldbusProtocol,
    samplingFrequencyHz,
    edgeComputePlatform,
    dataBufferingHours,
    anomalyDetectionModel,
    currency
  }), [
    connectedPlcCount,
    fieldbusProtocol,
    samplingFrequencyHz,
    edgeComputePlatform,
    dataBufferingHours,
    anomalyDetectionModel,
    currency
  ]);

  const results = useMemo(() => {
    return calculateIndustrialIot(inputs);
  }, [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-industrial-iot-opc-ua-simulator" width="100%" height="720" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>
<div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">
  Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#10b981;text-decoration:underline;">Elesium Sovereign Industrial IoT</a>
</div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE EDGE INDUSTRIAL IOT & OPC-UA AUDIT MEMO
Generated via Elesium Simulator (https://elesium.online/tools/enterprise-agent-industrial-iot-opc-ua-simulator)

PLANT OT & PROTOCOL CONFIGURATION:
- Connected PLCs / CNC Machines: ${connectedPlcCount} Units
- Fieldbus Protocol: ${fieldbusProtocol.toUpperCase()}
- Sensor Sampling Frequency: ${samplingFrequencyHz} Hz
- Edge Compute Platform: ${edgeComputePlatform.replace(/_/g, ' ').toUpperCase()}
- Anomaly Detection Model: ${anomalyDetectionModel.replace(/_/g, ' ').toUpperCase()}
- Local Data Buffering: ${dataBufferingHours} Hours (Air-Gapped)

LATENCY & SHOPFLOOR BENCHMARKS:
- Edge P99 Deterministic Latency: ${results.edgeP99LatencyMs} ms
- Uplink Bandwidth Consumed: ${results.bandwidthConsumedKbps} Kbps
- Anomaly Detection Precision: ${results.anomalyDetectionAccuracyPct}%
- Unplanned Downtime Reduction: ${results.unplannedDowntimeReductionPct}%
- Est. Annual Scrap Reduction: ${currency === 'INR' ? '₹' : '$'}${results.annualScrapCostSavings.toLocaleString()}
- Est. Annual Tooling Life Extension: ${currency === 'INR' ? '₹' : '$'}${results.annualToolingConservation.toLocaleString()}

STATUS & CLASSIFICATION:
${results.statusClassification}
Note: ${results.recommendationNote}
`;
    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  // Generate SVG latency curve
  const svgData = useMemo(() => {
    const width = 640;
    const height = 180;
    const trace = results.latencyTrace;
    if (!trace || trace.length === 0) return { path: '', rawPoints: [] };

    const maxLatency = Math.max(60, results.edgeP99LatencyMs * 1.5);
    const points: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.edgeLatencyMs / maxLatency) * (height * 0.78) - 12;
      return [x, Math.max(10, Math.min(height - 10, y))];
    });

    const d = points.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');
    return { path: d, rawPoints: trace };
  }, [results.latencyTrace, results.edgeP99LatencyMs]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      <Helmet>
        <title>Enterprise Agent Edge Industrial IoT &amp; OPC-UA Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate edge Industrial IoT protocol translation (OPC-UA, Profinet, EtherCAT, Modbus), determinism latency, vibration FFT anomaly detection, and downtime reduction for smart manufacturing."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-industrial-iot-opc-ua-simulator" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono tracking-wide uppercase">
            <Factory className="w-3.5 h-3.5" />
            <span>Industrial IoT &amp; OPC-UA Telemetry</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Enterprise Agent Industrial IoT &amp; OPC-UA Latency Simulator
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Benchmark edge protocol translation across Siemens, Fanuc, and Allen-Bradley PLCs, sub-50ms deterministic closed-loop inference, and scrap reduction across Indian smart factories.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
              onClick={() => setIsEmbedOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
            >
              <Code className="w-4 h-4 text-emerald-400" />
              <span>Embed Calculator</span>
            </button>
            <button
              onClick={copyExecutiveMemo}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white transition-colors shadow-lg shadow-emerald-600/20"
            >
              {hasCopiedMemo ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{hasCopiedMemo ? 'Memo Copied!' : 'Copy Executive Audit Memo'}</span>
            </button>
          </div>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold tracking-wide uppercase text-white font-mono">Shopfloor Parameters</h2>
              </div>
              <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-[10px] font-mono">
                <button
                  onClick={() => setCurrency('INR')}
                  className={`px-2 py-0.5 rounded ${currency === 'INR' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
                >
                  INR (₹)
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-2 py-0.5 rounded ${currency === 'USD' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
                >
                  USD ($)
                </button>
              </div>
            </div>

            {/* Slider 1: Connected PLCs */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Connected PLCs &amp; CNC Cells</span>
                <span className="text-emerald-400 font-mono font-bold">{connectedPlcCount} Machines</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={connectedPlcCount}
                onChange={(e) => setConnectedPlcCount(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 Cell (Pilot)</span>
                <span>100 Cells (Full Assembly Corridor)</span>
              </div>
            </div>

            {/* Slider 2: Sampling Frequency */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Sensor Sampling Frequency</span>
                <span className="text-emerald-400 font-mono font-bold">{samplingFrequencyHz} Hz</span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={samplingFrequencyHz}
                onChange={(e) => setSamplingFrequencyHz(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10 Hz (Thermal/Pressure)</span>
                <span>1,000 Hz (Acoustic/Vibration FFT)</span>
              </div>
            </div>

            {/* Dropdown 1: Fieldbus Protocol */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium block">Industrial Fieldbus Protocol</label>
              <select
                value={fieldbusProtocol}
                onChange={(e) => setFieldbusProtocol(e.target.value as FieldbusProtocol)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="opc_ua">OPC-UA (Unified Architecture TCP Binary)</option>
                <option value="profinet">Profinet (Industrial Real-Time Ethernet)</option>
                <option value="ethercat">EtherCAT (Sub-Millisecond Synchronous Fieldbus)</option>
                <option value="modbus_tcp">Modbus TCP (Legacy Fieldbus Serial-over-IP)</option>
              </select>
            </div>

            {/* Dropdown 2: Edge Compute Node */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium block">Edge Gateway Compute Node</label>
              <select
                value={edgeComputePlatform}
                onChange={(e) => setEdgeComputePlatform(e.target.value as EdgeComputePlatform)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="nvidia_jetson_agx">NVIDIA Jetson AGX Orin (Edge GPU + TensorRT)</option>
                <option value="industrial_x86_ipc">Industrial x86 IPC (Intel Core i7 DIN-Rail)</option>
                <option value="server_grade_edge">Server-Grade Edge (1U Dual Xeon / EPYC)</option>
                <option value="raspberry_pi_cm4">Raspberry Pi CM4 (Low-Cost Edge Micro)</option>
              </select>
            </div>

            {/* Dropdown 3: Anomaly Detection Model */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium block">Anomaly Detection Architecture</label>
              <select
                value={anomalyDetectionModel}
                onChange={(e) => setAnomalyDetectionModel(e.target.value as AnomalyDetectionModel)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="temporal_autoencoder">Temporal Autoencoder (LSTM/Transformer 99.1% Acc)</option>
                <option value="spectral_fft_threshold">Spectral FFT Peak Threshold (97.4% Acc)</option>
                <option value="isolation_forest">Isolation Forest Anomaly Classifier (95.8% Acc)</option>
                <option value="raw_threshold">Raw PLC Limit Thresholding (84.5% Acc)</option>
              </select>
            </div>

            {/* Slider 3: Local Buffering Hours */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Local Air-Gapped Data Buffer</span>
                <span className="text-emerald-400 font-mono font-bold">{dataBufferingHours} Hours</span>
              </div>
              <input
                type="range"
                min="1"
                max="72"
                step="1"
                value={dataBufferingHours}
                onChange={(e) => setDataBufferingHours(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 Hour (Live Sync)</span>
                <span>72 Hours (Air-Gapped Autonomous)</span>
              </div>
            </div>
          </div>

          {/* Results Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
                <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Edge P99 Latency</div>
                <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
                  {results.edgeP99LatencyMs} <span className="text-xs font-normal">ms</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Closed-loop cycle</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
                <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Downtime Cut</div>
                <div className="text-2xl font-extrabold text-indigo-400 font-mono mt-1">
                  {results.unplannedDowntimeReductionPct}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Spindle protection</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
                <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Uplink Bandwidth</div>
                <div className="text-2xl font-extrabold text-purple-400 font-mono mt-1">
                  {results.bandwidthConsumedKbps} <span className="text-xs font-normal">Kbps</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">85% compression</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
                <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Detection Acc</div>
                <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
                  {results.anomalyDetectionAccuracyPct}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Tool wear precision</div>
              </div>
            </div>

            {/* Latency Visualization Card */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide font-mono uppercase">
                    Edge P99 Latency vs. Machine Fleet Scale
                  </h3>
                  <p className="text-xs text-slate-400">
                    Cycle response progression across 1 to {connectedPlcCount} PLCs over {fieldbusProtocol.toUpperCase()}
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {fieldbusProtocol.toUpperCase()}
                </span>
              </div>

              <div className="pt-4">
                <svg viewBox="0 0 640 180" className="w-full h-44 overflow-visible">
                  <defs>
                    <linearGradient id="iotAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  <line x1="0" y1="45" x2="640" y2="45" stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1="0" y1="90" x2="640" y2="90" stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1="0" y1="135" x2="640" y2="135" stroke="#1e293b" strokeDasharray="3 3" />
                  
                  <path
                    d={`${svgData.path} L 640 180 L 0 180 Z`}
                    fill="url(#iotAreaGradient)"
                  />
                  <path
                    d={svgData.path}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-800">
                <span>Scale: 1 Machine</span>
                <span>Midpoint: {Math.round(connectedPlcCount / 2)} Machines</span>
                <span>Max: {connectedPlcCount} Machines ({results.edgeP99LatencyMs}ms P99)</span>
              </div>
            </div>

            {/* Economic Impact Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <Coins className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-wider font-bold">Annual Scrap Cost Cut</span>
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">
                  {currency === 'INR' ? '₹' : '$'}{(results.annualScrapCostSavings / (currency === 'INR' ? 100000 : 1)).toFixed(2)} {currency === 'INR' ? 'Lakhs' : ''}
                </div>
                <p className="text-xs text-slate-400">
                  By detecting spindle drift and tool wear before dimensional out-of-tolerance occurs.
                </p>
              </div>

              <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-2xl p-5 space-y-2">
                <div className="flex items-center space-x-2 text-indigo-400">
                  <Cpu className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-wider font-bold">Tooling Life Extension</span>
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">
                  {currency === 'INR' ? '₹' : '$'}{(results.annualToolingConservation / (currency === 'INR' ? 100000 : 1)).toFixed(2)} {currency === 'INR' ? 'Lakhs' : ''}
                </div>
                <p className="text-xs text-slate-400">
                  Dynamic tool offset adjustments conserve insert life across CNC cutting cycles.
                </p>
              </div>
            </div>

            {/* Architectural Status Banner */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-mono uppercase tracking-wider font-bold text-white">
                  Classification: <span className="text-emerald-400">{results.statusClassification}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {results.recommendationNote}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Engineering Analysis Sections */}
        <div className="border-t border-slate-800/80 pt-12 space-y-10">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Industrial AI &amp; Deterministic OT/IT Convergence
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Why traditional cloud architectures fail on factory shopfloors, and how deterministic edge multi-agent swarms achieve sub-50ms closed-loop control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white font-mono uppercase">OPC-UA Standardization</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Normalizes Siemens, Fanuc, and Allen-Bradley signals into a unified semantic information model with built-in encryption and certificate authorization.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 w-fit">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white font-mono uppercase">Air-Gapped Reliability</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Industrial PCs process anomalies locally on the plant LAN. Machine protection never relies on external WAN links or public cloud availability.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 w-fit">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white font-mono uppercase">Closed-Loop ERP Sync</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Autonomous agents write verified scrap tallies and equipment health metrics directly into SAP S/4HANA without manual paper tally logs.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="border-t border-slate-800/80 pt-12 space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-white font-mono uppercase">
            Frequently Asked Questions (Industrial IoT &amp; OPC-UA Telemetry)
          </h2>
          <div className="space-y-3">
            {[
              {
                q: 'What is OPC-UA and why is it preferred over Modbus for industrial AI?',
                a: 'OPC-UA (Open Platform Communications Unified Architecture) is a secure, platform-independent industrial protocol that provides typed object-oriented data models, X.509 cryptographic encryption, and pub/sub capabilities. Unlike legacy Modbus (which transmits raw unencrypted 16-bit registers), OPC-UA provides rich semantic context for AI agents.'
              },
              {
                q: 'How does edge computing prevent shopfloor line shutdowns during internet outages?',
                a: 'By deploying local industrial PCs (NVIDIA Jetson / x86 IPCs) on the shopfloor LAN, model inference and emergency safety stops execute locally with sub-50ms latency. If the factory WAN connection drops, edge agents buffer telemetry on SSDs and maintain 100% autonomous operation.'
              },
              {
                q: 'What sensor modalities are required for predictive CNC spindle maintenance?',
                a: 'High-frequency triaxial accelerometers (measuring bearing vibration up to 10kHz), infrared thermocouples (monitoring bearing temperature), and Hall-effect current sensors (measuring spindle drive load current). Combined with FFT spectral analysis, these sensors reveal bearing spalling 30 to 70 hours before seizure.'
              },
              {
                q: 'How does the architecture integrate with SAP S/4HANA and MES?',
                a: 'The edge gateway normalizes raw telemetry into clean JSON events that publish to an enterprise message broker (Kafka or MQTT). Upstream integration microservices invoke SAP BAPI or OData endpoints to automatically post scrap batches, update machine status codes, and schedule maintenance orders.'
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left text-sm font-medium text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-emerald-400' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise Mandate Application Form */}
        <div className="border-t border-slate-800/80 pt-12">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Deploy Sovereign Industrial Multi-Agent Systems
            </h2>
            <p className="text-sm text-slate-400">
              Apply for an architectural mandate to deploy air-gapped Industrial IoT gateways, deterministic OPC-UA closed-loop control, and predictive maintenance for your manufacturing facilities.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            {/* Luxury Monochrome WhatsApp Conversion Card */}
        <div className="my-10 p-6 sm:p-8 rounded-3xl border border-white/10 bg-white/[0.02] text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-xs font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Direct Lead Architect Intake</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
            Ready to Lock These Simulation Benchmarks in Production?
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
            Connect directly with our Principal Systems Architect on WhatsApp. We provide a tailored 1-page feasibility memorandum and deterministic VPC architecture blueprint.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => openWhatsApp()}
              className="px-6 py-3 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Chat on WhatsApp with Lead Architect</span>
            </button>
          </div>
        </div>

        <MandateApplicationForm />
          </div>
        </div>
      </div>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono uppercase">Embed Industrial IoT Simulator</h3>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Paste this responsive iframe snippet into your documentation, plant operations portal, or intranet:
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 break-all select-all">
              {embedCode}
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
              >
                Close
              </button>
              <button
                onClick={copyEmbedCode}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-xs text-white font-medium hover:bg-emerald-500 inline-flex items-center space-x-1.5"
              >
                {hasCopiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{hasCopiedEmbed ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Intent Modal for CRO */}
      <ExitIntentMemoModal
        toolName="Industrial IoT &amp; OPC-UA Simulator"
        simulatedMetrics={[
          { label: 'Edge P99 Latency', value: `${results.edgeP99LatencyMs} ms` },
          { label: 'Downtime Cut', value: `${results.unplannedDowntimeReductionPct}%` },
          { label: 'Est. Annual Scrap Cut', value: `${currency === 'INR' ? '₹' : '$'}${(results.annualScrapCostSavings / 100000).toFixed(2)} Lakhs` },
          { label: 'Detection Accuracy', value: `${results.anomalyDetectionAccuracyPct}%` }
        ]}
      />
          <WhatsAppModal />
    </div>
  );
}
