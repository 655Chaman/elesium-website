import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import HeroSection from './components/sections/Hero'
import AgentIntro from './components/sections/AgentIntro'
import ActiveSignals from './components/sections/ActiveSignals'
import DownloadFooter from './components/layout/Footer'
import SmoothScroll from './components/ui/SmoothScroll'
import NoiseOverlay from './components/ui/NoiseOverlay'
import Preloader from './components/ui/Preloader'

// Lazy load heavy below-the-fold components and secondary pages
const FeatureExplorer = lazy(() => import('./components/sections/FeatureExplorer'))
const Solutions = lazy(() => import('./components/sections/Solutions'))
const AIAutomation = lazy(() => import('./components/pages/AIAutomation'))
const HowWeWork = lazy(() => import('./components/pages/HowWeWork'))
const Industries = lazy(() => import('./components/pages/Industries'))
const MarketSignals = lazy(() => import('./components/pages/MarketSignals'))
const Resources = lazy(() => import('./components/pages/Resources'))
const ResourceDetail = lazy(() => import('./components/pages/ResourceDetail'))
const Waitlist = lazy(() => import('./components/pages/Waitlist'))
const VideoMirror = lazy(() => import('./components/pages/VideoMirror'))
const SolutionsHub = lazy(() => import('./components/pages/SolutionsHub'))
const SolutionDetail = lazy(() => import('./components/pages/SolutionDetail'))
const EnterpriseRoiCalculator = lazy(() => import('./components/pages/EnterpriseRoiCalculator'))
const EmbedRoiCalculator = lazy(() => import('./components/pages/EmbedRoiCalculator'))
const MultiAgentLatencyEstimator = lazy(() => import('./components/pages/MultiAgentLatencyEstimator'))
const EmbedLatencyEstimator = lazy(() => import('./components/pages/EmbedLatencyEstimator'))
const CompareHub = lazy(() => import('./components/pages/CompareHub'))
const CompareDetail = lazy(() => import('./components/pages/CompareDetail'))
const AgenticArchitectureGrader = lazy(() => import('./components/pages/AgenticArchitectureGrader'))
const EmbedArchitectureGrader = lazy(() => import('./components/pages/EmbedArchitectureGrader'))
const MultiAgentTokenLeakageSimulator = lazy(() => import('./components/pages/MultiAgentTokenLeakageSimulator'))
const EmbedTokenLeakageSimulator = lazy(() => import('./components/pages/EmbedTokenLeakageSimulator'))
const DpdpStatutoryAuditSimulator = lazy(() => import('./components/pages/DpdpStatutoryAuditSimulator'))
const EmbedDpdpAuditSimulator = lazy(() => import('./components/pages/EmbedDpdpAuditSimulator'))
const EnterpriseGpuCostCalculator = lazy(() => import('./components/pages/EnterpriseGpuCostCalculator'))
const EmbedGpuCostCalculator = lazy(() => import('./components/pages/EmbedGpuCostCalculator'))
const EnterpriseVectorDbBenchmark = lazy(() => import('./components/pages/EnterpriseVectorDbBenchmark'))
const EmbedVectorDbBenchmark = lazy(() => import('./components/pages/EmbedVectorDbBenchmark'))
const EnterpriseKvCacheSimulator = lazy(() => import('./components/pages/EnterpriseKvCacheSimulator'))
const EmbedKvCacheSimulator = lazy(() => import('./components/pages/EmbedKvCacheSimulator'))
const EnterpriseAgentDeadlockVisualizer = lazy(() => import('./components/pages/EnterpriseAgentDeadlockVisualizer'))
const EmbedAgentDeadlockVisualizer = lazy(() => import('./components/pages/EmbedAgentDeadlockVisualizer'))
const EnterpriseVoiceAgentLatencySimulator = lazy(() => import('./components/pages/EnterpriseVoiceAgentLatencySimulator'))
const EmbedVoiceAgentLatencySimulator = lazy(() => import('./components/pages/EmbedVoiceAgentLatencySimulator'))
const EnterpriseGraphRagBenchmark = lazy(() => import('./components/pages/EnterpriseGraphRagBenchmark'))
const EmbedGraphRagBenchmark = lazy(() => import('./components/pages/EmbedGraphRagBenchmark'))
const EnterpriseEventSourcingSimulator = lazy(() => import('./components/pages/EnterpriseEventSourcingSimulator'))
const EmbedEventSourcingSimulator = lazy(() => import('./components/pages/EmbedEventSourcingSimulator'))
const EnterprisePromptFirewallSimulator = lazy(() => import('./components/pages/EnterprisePromptFirewallSimulator'))
const EmbedPromptFirewallSimulator = lazy(() => import('./components/pages/EmbedPromptFirewallSimulator'))
const EnterpriseSemanticCacheSimulator = lazy(() => import('./components/pages/EnterpriseSemanticCacheSimulator'))
const EmbedSemanticCacheSimulator = lazy(() => import('./components/pages/EmbedSemanticCacheSimulator'))
const EnterpriseModelRoutingSimulator = lazy(() => import('./components/pages/EnterpriseModelRoutingSimulator'))
const EmbedModelRoutingSimulator = lazy(() => import('./components/pages/EmbedModelRoutingSimulator'))
const EnterpriseStructuredOutputSimulator = lazy(() => import('./components/pages/EnterpriseStructuredOutputSimulator'))
const EmbedStructuredOutputSimulator = lazy(() => import('./components/pages/EmbedStructuredOutputSimulator'))
const EnterpriseAgentTracingSimulator = lazy(() => import('./components/pages/EnterpriseAgentTracingSimulator'))
const EmbedAgentTracingSimulator = lazy(() => import('./components/pages/EmbedAgentTracingSimulator'))
const EnterpriseAgentStateRollbackSimulator = lazy(() => import('./components/pages/EnterpriseAgentStateRollbackSimulator'))
const EmbedAgentStateRollbackSimulator = lazy(() => import('./components/pages/EmbedAgentStateRollbackSimulator'))
const EnterpriseAgentDynamicReplanningSimulator = lazy(() => import('./components/pages/EnterpriseAgentDynamicReplanningSimulator'))
const EmbedAgentDynamicReplanningSimulator = lazy(() => import('./components/pages/EmbedAgentDynamicReplanningSimulator'))
const EnterpriseAgentConsensusSimulator = lazy(() => import('./components/pages/EnterpriseAgentConsensusSimulator'))
const EmbedAgentConsensusSimulator = lazy(() => import('./components/pages/EmbedAgentConsensusSimulator'))
const EnterpriseAgentSandboxVerificationSimulator = lazy(() => import('./components/pages/EnterpriseAgentSandboxVerificationSimulator'))
const EmbedAgentSandboxVerificationSimulator = lazy(() => import('./components/pages/EmbedAgentSandboxVerificationSimulator'))
const EnterpriseAgentMemoryDriftSimulator = lazy(() => import('./components/pages/EnterpriseAgentMemoryDriftSimulator'))
const EmbedAgentMemoryDriftSimulator = lazy(() => import('./components/pages/EmbedAgentMemoryDriftSimulator'))
const EnterpriseAgentSelfHealingCanarySimulator = lazy(() => import('./components/pages/EnterpriseAgentSelfHealingCanarySimulator'))
const EmbedAgentSelfHealingCanarySimulator = lazy(() => import('./components/pages/EmbedAgentSelfHealingCanarySimulator'))
const EnterpriseAgentPromptOptimizerSimulator = lazy(() => import('./components/pages/EnterpriseAgentPromptOptimizerSimulator'))
const EmbedAgentPromptOptimizerSimulator = lazy(() => import('./components/pages/EmbedAgentPromptOptimizerSimulator'))
const EnterpriseAgentSpeculativeDecodingSimulator = lazy(() => import('./components/pages/EnterpriseAgentSpeculativeDecodingSimulator'))
const EmbedAgentSpeculativeDecodingSimulator = lazy(() => import('./components/pages/EmbedAgentSpeculativeDecodingSimulator'))
const EnterpriseAgentZkAttestationSimulator = lazy(() => import('./components/pages/EnterpriseAgentZkAttestationSimulator'))
const EmbedAgentZkAttestationSimulator = lazy(() => import('./components/pages/EmbedAgentZkAttestationSimulator'))
const EnterpriseAgentHomomorphicEnclaveSimulator = lazy(() => import('./components/pages/EnterpriseAgentHomomorphicEnclaveSimulator'))
const EmbedAgentHomomorphicEnclaveSimulator = lazy(() => import('./components/pages/EmbedAgentHomomorphicEnclaveSimulator'))
const EnterpriseAgentEpistemicOodSimulator = lazy(() => import('./components/pages/EnterpriseAgentEpistemicOodSimulator'))
const EmbedAgentEpistemicOodSimulator = lazy(() => import('./components/pages/EmbedAgentEpistemicOodSimulator'))
const EnterpriseAgentDifferentialPrivacySimulator = lazy(() => import('./components/pages/EnterpriseAgentDifferentialPrivacySimulator'))
const EmbedAgentDifferentialPrivacySimulator = lazy(() => import('./components/pages/EmbedAgentDifferentialPrivacySimulator'))
const EnterpriseAgentByzantineConsensusSimulator = lazy(() => import('./components/pages/EnterpriseAgentByzantineConsensusSimulator'))
const EmbedAgentByzantineConsensusSimulator = lazy(() => import('./components/pages/EmbedAgentByzantineConsensusSimulator'))
const EnterpriseAgentPostQuantumSimulator = lazy(() => import('./components/pages/EnterpriseAgentPostQuantumSimulator'))
const EmbedAgentPostQuantumSimulator = lazy(() => import('./components/pages/EmbedAgentPostQuantumSimulator'))
const EnterpriseAgentPhotonicComputeSimulator = lazy(() => import('./components/pages/EnterpriseAgentPhotonicComputeSimulator'))
const EmbedAgentPhotonicComputeSimulator = lazy(() => import('./components/pages/EmbedAgentPhotonicComputeSimulator'))
const EnterpriseAgentMemristorCrossbarSimulator = lazy(() => import('./components/pages/EnterpriseAgentMemristorCrossbarSimulator'))
const EmbedAgentMemristorCrossbarSimulator = lazy(() => import('./components/pages/EmbedAgentMemristorCrossbarSimulator'))

import AIAutomationIndia from './components/pages/AIAutomationIndia'

function HomePage() {
    return (
        <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10"
        >
            <HeroSection />
            <AgentIntro />
            {/* Active Signals Ledger */}
            <ActiveSignals />
            {/* Lazy Loaded Sections */}
            <FeatureExplorer />
            <Solutions />
        </motion.div>
    )
}

function App() {
    const location = useLocation();
    const isEmbed = location.pathname.startsWith('/embed');

    // Since we're using React Router now, the Navbar and Footer are rendered once outside Routes
    // and we only animate the inner content changing.
    
    // Scroll to top on route change
    useEffect(() => {
        // Reset scroll position immediately on route change
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [location.pathname]);

    return (
        <div className="relative min-h-screen bg-white dark:bg-black transition-colors duration-300 flex flex-col">
            <SmoothScroll />
            <NoiseOverlay />
            {!location.pathname.startsWith('/resources') && !isEmbed && <Navbar />}

            <div className="flex-1 min-h-[100vh] flex flex-col relative">
                <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}>
                    <Suspense fallback={<Preloader />}>
                        <Routes location={location} key={location.pathname}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/how-we-work" element={<HowWeWork />} />
                            <Route path="/industries" element={<Navigate to="/markets" replace />} />
                            <Route path="/markets" element={<Industries />} />
                            <Route path="/signals" element={<MarketSignals />} />
                            <Route path="/signals/:slug" element={<MarketSignals />} />
                            <Route path="/resources" element={<Resources />} />
                            <Route path="/resources/:slug" element={<ResourceDetail />} />
                            <Route path="/ai-automation" element={<AIAutomation />} />
                            <Route path="/ai-automation-agency-india" element={<AIAutomationIndia />} />
                            <Route path="/videos" element={<VideoMirror />} />
                            <Route path="/videos/:slug" element={<VideoMirror />} />
                            <Route path="/waitlist" element={<Waitlist />} />
                            <Route path="/audit" element={<Waitlist />} />
                            <Route path="/book-audit" element={<Waitlist />} />
                            <Route path="/solutions" element={<SolutionsHub />} />
                            <Route path="/solutions/:slug" element={<SolutionDetail />} />
                            <Route path="/tools/enterprise-ai-roi-calculator" element={<EnterpriseRoiCalculator />} />
                            <Route path="/tools/roi-calculator" element={<Navigate to="/tools/enterprise-ai-roi-calculator" replace />} />
                            <Route path="/embed/roi-calculator" element={<EmbedRoiCalculator />} />
                            <Route path="/tools/multi-agent-latency-token-cost-estimator" element={<MultiAgentLatencyEstimator />} />
                            <Route path="/tools/latency-estimator" element={<Navigate to="/tools/multi-agent-latency-token-cost-estimator" replace />} />
                            <Route path="/embed/latency-estimator" element={<EmbedLatencyEstimator />} />
                            <Route path="/compare" element={<CompareHub />} />
                            <Route path="/compare/:slug" element={<CompareDetail />} />
                            <Route path="/tools/agentic-architecture-grader" element={<AgenticArchitectureGrader />} />
                            <Route path="/tools/architecture-grader" element={<Navigate to="/tools/agentic-architecture-grader" replace />} />
                            <Route path="/embed/architecture-grader" element={<EmbedArchitectureGrader />} />
                            <Route path="/tools/multi-agent-token-leakage-simulator" element={<MultiAgentTokenLeakageSimulator />} />
                            <Route path="/tools/token-leakage-simulator" element={<Navigate to="/tools/multi-agent-token-leakage-simulator" replace />} />
                            <Route path="/embed/token-leakage-simulator" element={<EmbedTokenLeakageSimulator />} />
                            <Route path="/tools/dpdp-act-2023-audit-simulator" element={<DpdpStatutoryAuditSimulator />} />
                            <Route path="/tools/dpdp-audit-simulator" element={<Navigate to="/tools/dpdp-act-2023-audit-simulator" replace />} />
                            <Route path="/embed/dpdp-audit-simulator" element={<EmbedDpdpAuditSimulator />} />
                            <Route path="/tools/enterprise-gpu-finops-cost-calculator" element={<EnterpriseGpuCostCalculator />} />
                            <Route path="/tools/gpu-cost-calculator" element={<Navigate to="/tools/enterprise-gpu-finops-cost-calculator" replace />} />
                            <Route path="/embed/gpu-cost-calculator" element={<EmbedGpuCostCalculator />} />
                            <Route path="/tools/enterprise-vector-db-latency-benchmark" element={<EnterpriseVectorDbBenchmark />} />
                            <Route path="/tools/vector-db-benchmark" element={<Navigate to="/tools/enterprise-vector-db-latency-benchmark" replace />} />
                            <Route path="/embed/vector-db-benchmark" element={<EmbedVectorDbBenchmark />} />
                            <Route path="/tools/enterprise-llm-context-kv-cache-simulator" element={<EnterpriseKvCacheSimulator />} />
                            <Route path="/tools/kv-cache-simulator" element={<Navigate to="/tools/enterprise-llm-context-kv-cache-simulator" replace />} />
                            <Route path="/embed/kv-cache-simulator" element={<EmbedKvCacheSimulator />} />
                            <Route path="/tools/enterprise-multi-agent-deadlock-circuit-breaker-visualizer" element={<EnterpriseAgentDeadlockVisualizer />} />
                            <Route path="/tools/agent-deadlock-visualizer" element={<Navigate to="/tools/enterprise-multi-agent-deadlock-circuit-breaker-visualizer" replace />} />
                            <Route path="/embed/agent-deadlock-visualizer" element={<EmbedAgentDeadlockVisualizer />} />
                            <Route path="/tools/enterprise-voice-agent-latency-simulator" element={<EnterpriseVoiceAgentLatencySimulator />} />
                            <Route path="/tools/voice-agent-latency-simulator" element={<Navigate to="/tools/enterprise-voice-agent-latency-simulator" replace />} />
                            <Route path="/embed/voice-agent-latency-simulator" element={<EmbedVoiceAgentLatencySimulator />} />
                            <Route path="/tools/enterprise-graphrag-memory-benchmark" element={<EnterpriseGraphRagBenchmark />} />
                            <Route path="/tools/graphrag-benchmark" element={<Navigate to="/tools/enterprise-graphrag-memory-benchmark" replace />} />
                            <Route path="/embed/graphrag-memory-benchmark" element={<EmbedGraphRagBenchmark />} />
                            <Route path="/tools/enterprise-event-sourcing-audit-simulator" element={<EnterpriseEventSourcingSimulator />} />
                            <Route path="/tools/event-sourcing-simulator" element={<Navigate to="/tools/enterprise-event-sourcing-audit-simulator" replace />} />
                            <Route path="/embed/event-sourcing-audit-simulator" element={<EmbedEventSourcingSimulator />} />
                            <Route path="/tools/enterprise-prompt-injection-firewall-simulator" element={<EnterprisePromptFirewallSimulator />} />
                            <Route path="/tools/prompt-injection-firewall-simulator" element={<Navigate to="/tools/enterprise-prompt-injection-firewall-simulator" replace />} />
                            <Route path="/embed/prompt-injection-firewall-simulator" element={<EmbedPromptFirewallSimulator />} />
                            <Route path="/tools/enterprise-semantic-cache-simulator" element={<EnterpriseSemanticCacheSimulator />} />
                            <Route path="/tools/semantic-cache-simulator" element={<Navigate to="/tools/enterprise-semantic-cache-simulator" replace />} />
                            <Route path="/embed/semantic-cache-simulator" element={<EmbedSemanticCacheSimulator />} />
                            <Route path="/tools/enterprise-model-routing-cost-arbitrage-simulator" element={<EnterpriseModelRoutingSimulator />} />
                            <Route path="/tools/model-routing-cost-arbitrage-simulator" element={<Navigate to="/tools/enterprise-model-routing-cost-arbitrage-simulator" replace />} />
                            <Route path="/embed/model-routing-cost-arbitrage-simulator" element={<EmbedModelRoutingSimulator />} />
                            <Route path="/tools/enterprise-structured-output-latency-simulator" element={<EnterpriseStructuredOutputSimulator />} />
                            <Route path="/tools/structured-output-latency-simulator" element={<Navigate to="/tools/enterprise-structured-output-latency-simulator" replace />} />
                            <Route path="/embed/structured-output-latency-simulator" element={<EmbedStructuredOutputSimulator />} />
                            <Route path="/tools/enterprise-agent-tracing-opentelemetry-simulator" element={<EnterpriseAgentTracingSimulator />} />
                            <Route path="/tools/agent-tracing-opentelemetry-simulator" element={<Navigate to="/tools/enterprise-agent-tracing-opentelemetry-simulator" replace />} />
                            <Route path="/embed/agent-tracing-opentelemetry-simulator" element={<EmbedAgentTracingSimulator />} />
                            <Route path="/tools/enterprise-agent-state-snapshot-rollback-simulator" element={<EnterpriseAgentStateRollbackSimulator />} />
                            <Route path="/tools/agent-state-snapshot-rollback-simulator" element={<Navigate to="/tools/enterprise-agent-state-snapshot-rollback-simulator" replace />} />
                            <Route path="/embed/agent-state-snapshot-rollback-simulator" element={<EmbedAgentStateRollbackSimulator />} />
                            <Route path="/tools/enterprise-agent-dynamic-replanning-simulator" element={<EnterpriseAgentDynamicReplanningSimulator />} />
                            <Route path="/tools/agent-dynamic-replanning-simulator" element={<Navigate to="/tools/enterprise-agent-dynamic-replanning-simulator" replace />} />
                            <Route path="/embed/agent-dynamic-replanning-simulator" element={<EmbedAgentDynamicReplanningSimulator />} />
                            <Route path="/tools/enterprise-agent-consensus-byzantine-fault-simulator" element={<EnterpriseAgentConsensusSimulator />} />
                            <Route path="/tools/agent-consensus-byzantine-fault-simulator" element={<Navigate to="/tools/enterprise-agent-consensus-byzantine-fault-simulator" replace />} />
                            <Route path="/embed/agent-consensus-byzantine-fault-simulator" element={<EmbedAgentConsensusSimulator />} />
                            <Route path="/tools/enterprise-agent-sandbox-formal-verification-simulator" element={<EnterpriseAgentSandboxVerificationSimulator />} />
                            <Route path="/tools/agent-sandbox-formal-verification-simulator" element={<Navigate to="/tools/enterprise-agent-sandbox-formal-verification-simulator" replace />} />
                            <Route path="/embed/agent-sandbox-formal-verification-simulator" element={<EmbedAgentSandboxVerificationSimulator />} />
                            <Route path="/tools/enterprise-agent-memory-drift-compression-simulator" element={<EnterpriseAgentMemoryDriftSimulator />} />
                            <Route path="/tools/agent-memory-drift-compression-simulator" element={<Navigate to="/tools/enterprise-agent-memory-drift-compression-simulator" replace />} />
                            <Route path="/embed/agent-memory-drift-compression-simulator" element={<EmbedAgentMemoryDriftSimulator />} />
                            <Route path="/tools/enterprise-agent-self-healing-canary-simulator" element={<EnterpriseAgentSelfHealingCanarySimulator />} />
                            <Route path="/tools/agent-self-healing-canary-simulator" element={<Navigate to="/tools/enterprise-agent-self-healing-canary-simulator" replace />} />
                            <Route path="/embed/agent-self-healing-canary-simulator" element={<EmbedAgentSelfHealingCanarySimulator />} />
                            <Route path="/tools/enterprise-agent-prompt-optimizer-simulator" element={<EnterpriseAgentPromptOptimizerSimulator />} />
                            <Route path="/tools/agent-prompt-optimizer-simulator" element={<Navigate to="/tools/enterprise-agent-prompt-optimizer-simulator" replace />} />
                            <Route path="/embed/agent-prompt-optimizer-simulator" element={<EmbedAgentPromptOptimizerSimulator />} />
                            <Route path="/tools/enterprise-agent-speculative-decoding-simulator" element={<EnterpriseAgentSpeculativeDecodingSimulator />} />
                            <Route path="/tools/agent-speculative-decoding-simulator" element={<Navigate to="/tools/enterprise-agent-speculative-decoding-simulator" replace />} />
                            <Route path="/embed/agent-speculative-decoding-simulator" element={<EmbedAgentSpeculativeDecodingSimulator />} />
                            <Route path="/tools/enterprise-agent-zk-attestation-simulator" element={<EnterpriseAgentZkAttestationSimulator />} />
                            <Route path="/tools/agent-zk-attestation-simulator" element={<Navigate to="/tools/enterprise-agent-zk-attestation-simulator" replace />} />
                            <Route path="/embed/agent-zk-attestation-simulator" element={<EmbedAgentZkAttestationSimulator />} />
                            <Route path="/tools/enterprise-agent-homomorphic-enclave-simulator" element={<EnterpriseAgentHomomorphicEnclaveSimulator />} />
                            <Route path="/tools/agent-homomorphic-enclave-simulator" element={<Navigate to="/tools/enterprise-agent-homomorphic-enclave-simulator" replace />} />
                            <Route path="/embed/agent-homomorphic-enclave-simulator" element={<EmbedAgentHomomorphicEnclaveSimulator />} />
                            <Route path="/tools/enterprise-agent-epistemic-ood-simulator" element={<EnterpriseAgentEpistemicOodSimulator />} />
                            <Route path="/tools/agent-epistemic-ood-simulator" element={<Navigate to="/tools/enterprise-agent-epistemic-ood-simulator" replace />} />
                            <Route path="/embed/agent-epistemic-ood-simulator" element={<EmbedAgentEpistemicOodSimulator />} />
                            <Route path="/tools/enterprise-agent-differential-privacy-simulator" element={<EnterpriseAgentDifferentialPrivacySimulator />} />
                            <Route path="/tools/agent-differential-privacy-simulator" element={<Navigate to="/tools/enterprise-agent-differential-privacy-simulator" replace />} />
                            <Route path="/embed/agent-differential-privacy-simulator" element={<EmbedAgentDifferentialPrivacySimulator />} />
                            <Route path="/tools/enterprise-agent-byzantine-consensus-simulator" element={<EnterpriseAgentByzantineConsensusSimulator />} />
                            <Route path="/tools/agent-byzantine-consensus-simulator" element={<Navigate to="/tools/enterprise-agent-byzantine-consensus-simulator" replace />} />
                            <Route path="/embed/agent-byzantine-consensus-simulator" element={<EmbedAgentByzantineConsensusSimulator />} />
                            <Route path="/tools/enterprise-agent-post-quantum-simulator" element={<EnterpriseAgentPostQuantumSimulator />} />
                            <Route path="/tools/agent-post-quantum-simulator" element={<Navigate to="/tools/enterprise-agent-post-quantum-simulator" replace />} />
                            <Route path="/embed/agent-post-quantum-simulator" element={<EmbedAgentPostQuantumSimulator />} />
                            <Route path="/tools/enterprise-agent-photonic-compute-simulator" element={<EnterpriseAgentPhotonicComputeSimulator />} />
                            <Route path="/tools/agent-photonic-compute-simulator" element={<Navigate to="/tools/enterprise-agent-photonic-compute-simulator" replace />} />
                            <Route path="/embed/agent-photonic-compute-simulator" element={<EmbedAgentPhotonicComputeSimulator />} />
                            <Route path="/tools/enterprise-agent-memristor-crossbar-simulator" element={<EnterpriseAgentMemristorCrossbarSimulator />} />
                            <Route path="/tools/agent-memristor-crossbar-simulator" element={<Navigate to="/tools/enterprise-agent-memristor-crossbar-simulator" replace />} />
                            <Route path="/embed/agent-memristor-crossbar-simulator" element={<EmbedAgentMemristorCrossbarSimulator />} />
                        </Routes>
                    </Suspense>
                </AnimatePresence>
            </div>

            {!isEmbed && <DownloadFooter />}
        </div>
    )
}

export default App
