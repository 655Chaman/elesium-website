import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateIndustrialIot,
  IndustrialIotInputs,
  FieldbusProtocol,
  EdgeComputePlatform,
  AnomalyDetectionModel
} from '../calculator/agentIndustrialIotModel';
import { Factory, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentIndustrialIotSimulator() {
  const [connectedPlcCount, setConnectedPlcCount] = useState<number>(32);
  const [fieldbusProtocol, setFieldbusProtocol] = useState<FieldbusProtocol>('opc_ua');
  const [samplingFrequencyHz, setSamplingFrequencyHz] = useState<number>(100);
  const [edgeComputePlatform, setEdgeComputePlatform] = useState<EdgeComputePlatform>('nvidia_jetson_agx');
  const [anomalyDetectionModel, setAnomalyDetectionModel] = useState<AnomalyDetectionModel>('temporal_autoencoder');

  const inputs: IndustrialIotInputs = useMemo(() => ({
    connectedPlcCount,
    fieldbusProtocol,
    samplingFrequencyHz,
    edgeComputePlatform,
    dataBufferingHours: 24,
    anomalyDetectionModel,
    currency: 'INR'
  }), [
    connectedPlcCount,
    fieldbusProtocol,
    samplingFrequencyHz,
    edgeComputePlatform,
    anomalyDetectionModel
  ]);

  const results = useMemo(() => {
    return calculateIndustrialIot(inputs);
  }, [inputs]);

  // Generate SVG latency curve
  const svgData = useMemo(() => {
    const width = 340;
    const height = 90;
    const trace = results.latencyTrace;
    if (!trace || trace.length === 0) return { path: '', rawPoints: [] };

    const maxLatency = Math.max(60, results.edgeP99LatencyMs * 1.5);
    const points: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.edgeLatencyMs / maxLatency) * (height * 0.75) - 8;
      return [x, Math.max(5, Math.min(height - 5, y))];
    });

    const d = points.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');
    return { path: d, rawPoints: trace };
  }, [results.latencyTrace, results.edgeP99LatencyMs]);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 sm:p-6 font-sans">
      <Helmet>
        <title>Industrial IoT &amp; OPC-UA Latency Simulator | Elesium Embed</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-industrial-iot-opc-ua-simulator" />
      </Helmet>

      <div className="max-w-xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Factory className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white">Edge Industrial IoT &amp; OPC-UA Simulator</h1>
              <p className="text-[10px] text-slate-400">Deterministic Shopfloor Multi-Agent Protocol Gateway</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-300 bg-emerald-950/40 font-mono">
            OPC-UA v1.05
          </span>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Connected PLCs</span>
              <span className="text-emerald-400 font-mono">{connectedPlcCount} units</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={connectedPlcCount}
              onChange={(e) => setConnectedPlcCount(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Sampling Frequency</span>
              <span className="text-emerald-400 font-mono">{samplingFrequencyHz} Hz</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={samplingFrequencyHz}
              onChange={(e) => setSamplingFrequencyHz(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 text-[11px]">Fieldbus Protocol</label>
            <select
              value={fieldbusProtocol}
              onChange={(e) => setFieldbusProtocol(e.target.value as FieldbusProtocol)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
            >
              <option value="opc_ua">OPC-UA (TCP Binary)</option>
              <option value="profinet">Profinet Industrial Ethernet</option>
              <option value="ethercat">EtherCAT Real-Time Bus</option>
              <option value="modbus_tcp">Modbus TCP (Legacy)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 text-[11px]">Edge Compute Node</label>
            <select
              value={edgeComputePlatform}
              onChange={(e) => setEdgeComputePlatform(e.target.value as EdgeComputePlatform)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
            >
              <option value="nvidia_jetson_agx">NVIDIA Jetson AGX Orin</option>
              <option value="industrial_x86_ipc">Industrial x86 IPC (Advantech)</option>
              <option value="server_grade_edge">Server-Grade Edge (1U Rack)</option>
              <option value="raspberry_pi_cm4">Raspberry Pi CM4 (Low-Cost)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 text-[11px]">Inference Model</label>
            <select
              value={anomalyDetectionModel}
              onChange={(e) => setAnomalyDetectionModel(e.target.value as AnomalyDetectionModel)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
            >
              <option value="temporal_autoencoder">Temporal CNN-Autoencoder</option>
              <option value="isolation_forest_onnx">Isolation Forest (INT8 ONNX)</option>
              <option value="graph_neural_network">Spatial Graph NN (GNN)</option>
              <option value="kalman_filter_hybrid">Physics-Informed Kalman</option>
            </select>
          </div>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg text-center">
            <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Edge P99 Latency</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5 font-mono">{results.edgeP99LatencyMs}ms</div>
            <div className="text-[9px] text-slate-500">Deterministic loop</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg text-center">
            <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Downtime Cut</div>
            <div className="text-base font-bold text-indigo-400 mt-0.5 font-mono">{results.unplannedDowntimeReductionPct}%</div>
            <div className="text-[9px] text-slate-500">avoided outages</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg text-center">
            <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Accuracy</div>
            <div className="text-base font-bold text-amber-400 mt-0.5 font-mono">{results.anomalyDetectionAccuracyPct}%</div>
            <div className="text-[9px] text-slate-500">spindle wear detect</div>
          </div>
        </div>

        {/* SVG Latency Curve */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-lg p-3">
          <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1.5">
            <span className="font-mono">EDGE P99 LATENCY VS PLC SCALE (1 TO {connectedPlcCount} PLCS)</span>
            <span className="text-emerald-400 font-mono">P99 {results.edgeP99LatencyMs}ms</span>
          </div>
          <svg viewBox="0 0 340 90" className="w-full h-20 overflow-visible">
            <defs>
              <linearGradient id="embedIotGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d={`${svgData.path} L 340 90 L 0 90 Z`}
              fill="url(#embedIotGradient)"
            />
            <path
              d={svgData.path}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Annual Savings Callout */}
        <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-lg p-2.5 flex items-center justify-between text-xs">
          <div>
            <div className="text-[10px] text-emerald-400 font-mono font-medium">ESTIMATED ANNUAL SCRAP SAVINGS</div>
            <div className="text-sm font-bold text-white font-mono">
              ₹{(results.annualScrapCostSavings / 100000).toFixed(2)} Lakhs / year
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {results.bandwidthConsumedKbps} Kbps Bandwidth
          </span>
        </div>

        {/* Watermark & Backlink */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Industrial IoT &amp; OPC-UA Simulator</span>
          <a
            href="https://elesium.online/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            Powered by Elesium Enterprise AI
            <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
