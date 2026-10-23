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
const AuthorProfile = lazy(() => import('./components/pages/AuthorProfile'))
const RegionalCityHub = lazy(() => import('./components/pages/RegionalCityHub'))
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
const Glossary = lazy(() => import('./components/pages/Glossary'))
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
const EnterpriseAgentSnnSimulator = lazy(() => import('./components/pages/EnterpriseAgentSnnSimulator'))
const EmbedAgentSnnSimulator = lazy(() => import('./components/pages/EmbedAgentSnnSimulator'))
const EnterpriseAgentHsmSimulator = lazy(() => import('./components/pages/EnterpriseAgentHsmSimulator'))
const EmbedAgentHsmSimulator = lazy(() => import('./components/pages/EmbedAgentHsmSimulator'))
const EnterpriseAgentGraphConsensusSimulator = lazy(() => import('./components/pages/EnterpriseAgentGraphConsensusSimulator'))
const EmbedAgentGraphConsensusSimulator = lazy(() => import('./components/pages/EmbedAgentGraphConsensusSimulator'))
const EnterpriseAgentAbdmFhirSimulator = lazy(() => import('./components/pages/EnterpriseAgentAbdmFhirSimulator'))
const EmbedAgentAbdmFhirSimulator = lazy(() => import('./components/pages/EmbedAgentAbdmFhirSimulator'))
const EnterpriseAgentCfrPart11Simulator = lazy(() => import('./components/pages/EnterpriseAgentCfrPart11Simulator'))
const EmbedAgentCfrPart11Simulator = lazy(() => import('./components/pages/EmbedAgentCfrPart11Simulator'))
const EnterpriseAgentOndcRetailSimulator = lazy(() => import('./components/pages/EnterpriseAgentOndcRetailSimulator'))
const EmbedAgentOndcRetailSimulator = lazy(() => import('./components/pages/EmbedAgentOndcRetailSimulator'))
const EnterpriseAgentNemoGuardrailSimulator = lazy(() => import('./components/pages/EnterpriseAgentNemoGuardrailSimulator'))
const EmbedAgentNemoGuardrailSimulator = lazy(() => import('./components/pages/EmbedAgentNemoGuardrailSimulator'))
const EnterpriseAgentAiOpsSimulator = lazy(() => import('./components/pages/EnterpriseAgentAiOpsSimulator'))
const EmbedAgentAiOpsSimulator = lazy(() => import('./components/pages/EmbedAgentAiOpsSimulator'))
const EnterpriseAgentVectorShardingSimulator = lazy(() => import('./components/pages/EnterpriseAgentVectorShardingSimulator'))
const EmbedAgentVectorShardingSimulator = lazy(() => import('./components/pages/EmbedAgentVectorShardingSimulator'))
const EnterpriseAgentChunkedPrefillSimulator = lazy(() => import('./components/pages/EnterpriseAgentChunkedPrefillSimulator'))
const EmbedAgentChunkedPrefillSimulator = lazy(() => import('./components/pages/EmbedAgentChunkedPrefillSimulator'))
const EnterpriseAgentMcpToolRoutingSimulator = lazy(() => import('./components/pages/EnterpriseAgentMcpToolRoutingSimulator'))
const EmbedAgentMcpToolRoutingSimulator = lazy(() => import('./components/pages/EmbedAgentMcpToolRoutingSimulator'))
const EnterpriseAgentIndustrialIotSimulator = lazy(() => import('./components/pages/EnterpriseAgentIndustrialIotSimulator'))
const EmbedAgentIndustrialIotSimulator = lazy(() => import('./components/pages/EmbedAgentIndustrialIotSimulator'))
const EnterpriseAgentTallyErpSimulator = lazy(() => import('./components/pages/EnterpriseAgentTallyErpSimulator'))
const EmbedAgentTallyErpSimulator = lazy(() => import('./components/pages/EmbedAgentTallyErpSimulator'))
const EnterpriseAgentSmartContractSimulator = lazy(() => import('./components/pages/EnterpriseAgentSmartContractSimulator'))
const EmbedAgentSmartContractSimulator = lazy(() => import('./components/pages/EmbedAgentSmartContractSimulator'))
const EnterpriseAgentPagedAttentionSimulator = lazy(() => import('./components/pages/EnterpriseAgentPagedAttentionSimulator'))
const EmbedAgentPagedAttentionSimulator = lazy(() => import('./components/pages/EmbedAgentPagedAttentionSimulator'))
const EnterpriseAgentMedusaSpeculativeSimulator = lazy(() => import('./components/pages/EnterpriseAgentMedusaSpeculativeSimulator'))
const EmbedAgentMedusaSpeculativeSimulator = lazy(() => import('./components/pages/EmbedAgentMedusaSpeculativeSimulator'))
const EnterpriseAgentPtqQuantizationSimulator = lazy(() => import('./components/pages/EnterpriseAgentPtqQuantizationSimulator'))
const EmbedAgentPtqQuantizationSimulator = lazy(() => import('./components/pages/EmbedAgentPtqQuantizationSimulator'))
const EnterpriseAgentFlashDecodingSimulator = lazy(() => import('./components/pages/EnterpriseAgentFlashDecodingSimulator'))
const EmbedAgentFlashDecodingSimulator = lazy(() => import('./components/pages/EmbedAgentFlashDecodingSimulator'))
const EnterpriseAgentPrefixCachingSimulator = lazy(() => import('./components/pages/EnterpriseAgentPrefixCachingSimulator'))
const EmbedAgentPrefixCachingSimulator = lazy(() => import('./components/pages/EmbedAgentPrefixCachingSimulator'))
const EnterpriseAgentCrossAttentionSimulator = lazy(() => import('./components/pages/EnterpriseAgentCrossAttentionSimulator'))
const EmbedAgentCrossAttentionSimulator = lazy(() => import('./components/pages/EmbedAgentCrossAttentionSimulator'))
const EnterpriseAgentSlidingWindowSimulator = lazy(() => import('./components/pages/EnterpriseAgentSlidingWindowSimulator'))
const EmbedAgentSlidingWindowSimulator = lazy(() => import('./components/pages/EmbedAgentSlidingWindowSimulator'))
const EnterpriseAgentMultiLoraSimulator = lazy(() => import('./components/pages/EnterpriseAgentMultiLoraSimulator'))
const EmbedAgentMultiLoraSimulator = lazy(() => import('./components/pages/EmbedAgentMultiLoraSimulator'))
const EnterpriseAgentMixtureOfDepthsSimulator = lazy(() => import('./components/pages/EnterpriseAgentMixtureOfDepthsSimulator'))
const EmbedAgentMixtureOfDepthsSimulator = lazy(() => import('./components/pages/EmbedAgentMixtureOfDepthsSimulator'))
const EnterpriseAgentKvCacheCompactionSimulator = lazy(() => import('./components/pages/EnterpriseAgentKvCacheCompactionSimulator'))
const EmbedAgentKvCacheCompactionSimulator = lazy(() => import('./components/pages/EmbedAgentKvCacheCompactionSimulator'))
const EnterpriseAgentSpeculativeVerificationSimulator = lazy(() => import('./components/pages/EnterpriseAgentSpeculativeVerificationSimulator'))
const EmbedAgentSpeculativeVerificationSimulator = lazy(() => import('./components/pages/EmbedAgentSpeculativeVerificationSimulator'))
const EnterpriseAgentPrefillDecodeSimulator = lazy(() => import('./components/pages/EnterpriseAgentPrefillDecodeSimulator'))
const EmbedAgentPrefillDecodeSimulator = lazy(() => import('./components/pages/EmbedAgentPrefillDecodeSimulator'))
const EnterpriseAgentPipelineParallelismSimulator = lazy(() => import('./components/pages/EnterpriseAgentPipelineParallelismSimulator'))
const EmbedAgentPipelineParallelismSimulator = lazy(() => import('./components/pages/EmbedAgentPipelineParallelismSimulator'))
const EnterpriseAgentTensorParallelismSimulator = lazy(() => import('./components/pages/EnterpriseAgentTensorParallelismSimulator'))
const EmbedAgentTensorParallelismSimulator = lazy(() => import('./components/pages/EmbedAgentTensorParallelismSimulator'))
const EnterpriseAgentSequenceParallelismSimulator = lazy(() => import('./components/pages/EnterpriseAgentSequenceParallelismSimulator'))
const EmbedAgentSequenceParallelismSimulator = lazy(() => import('./components/pages/EmbedAgentSequenceParallelismSimulator'))
const EnterpriseAgentExpertParallelismSimulator = lazy(() => import('./components/pages/EnterpriseAgentExpertParallelismSimulator'))
const EmbedAgentExpertParallelismSimulator = lazy(() => import('./components/pages/EmbedAgentExpertParallelismSimulator'))
const EnterpriseAgentContextParallelismSimulator = lazy(() => import('./components/pages/EnterpriseAgentContextParallelismSimulator'))
const EmbedAgentContextParallelismSimulator = lazy(() => import('./components/pages/EmbedAgentContextParallelismSimulator'))
const EnterpriseAgent3DParallelismSimulator = lazy(() => import('./components/pages/EnterpriseAgent3DParallelismSimulator'))
const EmbedAgent3DParallelismSimulator = lazy(() => import('./components/pages/EmbedAgent3DParallelismSimulator'))
const EnterpriseAgentFp8MicroscalingSimulator = lazy(() => import('./components/pages/EnterpriseAgentFp8MicroscalingSimulator'))
const EmbedAgentFp8MicroscalingSimulator = lazy(() => import('./components/pages/EmbedAgentFp8MicroscalingSimulator'))
const EnterpriseAgentAsyncCheckpointingSimulator = lazy(() => import('./components/pages/EnterpriseAgentAsyncCheckpointingSimulator'))
const EmbedAgentAsyncCheckpointingSimulator = lazy(() => import('./components/pages/EmbedAgentAsyncCheckpointingSimulator'))
const EnterpriseAgentDisaggregatedPrefillSimulator = lazy(() => import('./components/pages/EnterpriseAgentDisaggregatedPrefillSimulator'))
const EmbedAgentDisaggregatedPrefillSimulator = lazy(() => import('./components/pages/EmbedAgentDisaggregatedPrefillSimulator'))
const EnterpriseAgentSpeculativeTreeSimulator = lazy(() => import('./components/pages/EnterpriseAgentSpeculativeTreeSimulator'))
const EmbedAgentSpeculativeTreeSimulator = lazy(() => import('./components/pages/EmbedAgentSpeculativeTreeSimulator'))
const EnterpriseAgentKvCacheEvictionSimulator = lazy(() => import('./components/pages/EnterpriseAgentKvCacheEvictionSimulator'))
const EmbedAgentKvCacheEvictionSimulator = lazy(() => import('./components/pages/EmbedAgentKvCacheEvictionSimulator'))
const EnterpriseAgentHierarchicalStoragePagingSimulator = lazy(() => import('./components/pages/EnterpriseAgentHierarchicalStoragePagingSimulator'))
const EmbedAgentHierarchicalStoragePagingSimulator = lazy(() => import('./components/pages/EmbedAgentHierarchicalStoragePagingSimulator'))
const EnterpriseAgentMlaLatentProjectionSimulator = lazy(() => import('./components/pages/EnterpriseAgentMlaLatentProjectionSimulator'))
const EmbedAgentMlaLatentProjectionSimulator = lazy(() => import('./components/pages/EmbedAgentMlaLatentProjectionSimulator'))
const EnterpriseAgentMtpSpeculativeDraftSimulator = lazy(() => import('./components/pages/EnterpriseAgentMtpSpeculativeDraftSimulator'))
const EmbedAgentMtpSpeculativeDraftSimulator = lazy(() => import('./components/pages/EmbedAgentMtpSpeculativeDraftSimulator'))
const EnterpriseAgentDualpipePipelineSimulator = lazy(() => import('./components/pages/EnterpriseAgentDualpipePipelineSimulator'))
const EmbedAgentDualpipePipelineSimulator = lazy(() => import('./components/pages/EmbedAgentDualpipePipelineSimulator'))
const EnterpriseAgentDeepseekUnifiedFabricSimulator = lazy(() => import('./components/pages/EnterpriseAgentDeepseekUnifiedFabricSimulator'))
const EmbedAgentDeepseekUnifiedFabricSimulator = lazy(() => import('./components/pages/EmbedAgentDeepseekUnifiedFabricSimulator'))

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
            {!isEmbed && <Navbar />}

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
                            <Route path="/enterprise-ai-bangalore" element={<RegionalCityHub forcedCityId="bangalore" />} />
                            <Route path="/enterprise-ai-mumbai" element={<RegionalCityHub forcedCityId="mumbai" />} />
                            <Route path="/enterprise-ai-delhi-ncr" element={<RegionalCityHub forcedCityId="delhi-ncr" />} />
                            <Route path="/enterprise-ai-pune" element={<RegionalCityHub forcedCityId="pune" />} />
                            <Route path="/videos" element={<VideoMirror />} />
                            <Route path="/videos/:slug" element={<VideoMirror />} />
                            <Route path="/waitlist" element={<Waitlist />} />
                            <Route path="/audit" element={<Waitlist />} />
                            <Route path="/book-audit" element={<Waitlist />} />
                            <Route path="/authors/chaman-shah" element={<AuthorProfile />} />
                            <Route path="/team/chaman-shah" element={<AuthorProfile />} />
                            <Route path="/team" element={<AuthorProfile />} />
                            <Route path="/author" element={<Navigate to="/authors/chaman-shah" replace />} />
                            <Route path="/chaman-shah" element={<Navigate to="/authors/chaman-shah" replace />} />
                            <Route path="/solutions" element={<SolutionsHub />} />
                            <Route path="/solutions/:slug" element={<SolutionDetail />} />
                            <Route path="/glossary" element={<Glossary />} />
                            <Route path="/tools/enterprise-ai-roi-calculator" element={<EnterpriseRoiCalculator />} />
                            <Route path="/tools/roi-calculator" element={<Navigate to="/tools/enterprise-ai-roi-calculator" replace />} />
                            <Route path="/embed/roi-calculator" element={<EmbedRoiCalculator />} />
                            <Route path="/tools/multi-agent-latency-token-cost-estimator" element={<MultiAgentLatencyEstimator />} />
                            <Route path="/tools/latency-estimator" element={<Navigate to="/tools/multi-agent-latency-token-cost-estimator" replace />} />
                            <Route path="/embed/latency-estimator" element={<EmbedLatencyEstimator />} />
                            <Route path="/compare" element={<CompareHub />} />
                            <Route path="/compare/elesium-vs-traditional-it-consultancies-tcs-infosys-wipro" element={<Navigate to="/compare/elesium-vs-traditional-it-consultancies" replace />} />
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
                            <Route path="/tools/enterprise-agent-snn-neuromorphic-simulator" element={<EnterpriseAgentSnnSimulator />} />
                            <Route path="/tools/agent-snn-neuromorphic-simulator" element={<Navigate to="/tools/enterprise-agent-snn-neuromorphic-simulator" replace />} />
                            <Route path="/embed/agent-snn-neuromorphic-simulator" element={<EmbedAgentSnnSimulator />} />
                            <Route path="/tools/enterprise-agent-hsm-pkcs11-simulator" element={<EnterpriseAgentHsmSimulator />} />
                            <Route path="/tools/agent-hsm-pkcs11-simulator" element={<Navigate to="/tools/enterprise-agent-hsm-pkcs11-simulator" replace />} />
                            <Route path="/embed/agent-hsm-pkcs11-simulator" element={<EmbedAgentHsmSimulator />} />
                            <Route path="/tools/enterprise-agent-graph-consensus-simulator" element={<EnterpriseAgentGraphConsensusSimulator />} />
                            <Route path="/tools/agent-graph-consensus-simulator" element={<Navigate to="/tools/enterprise-agent-graph-consensus-simulator" replace />} />
                            <Route path="/embed/agent-graph-consensus-simulator" element={<EmbedAgentGraphConsensusSimulator />} />
                            <Route path="/tools/enterprise-agent-abdm-fhir-privacy-simulator" element={<EnterpriseAgentAbdmFhirSimulator />} />
                            <Route path="/tools/agent-abdm-fhir-privacy-simulator" element={<Navigate to="/tools/enterprise-agent-abdm-fhir-privacy-simulator" replace />} />
                            <Route path="/embed/agent-abdm-fhir-privacy-simulator" element={<EmbedAgentAbdmFhirSimulator />} />
                            <Route path="/tools/enterprise-agent-cfr-part-11-validation-simulator" element={<EnterpriseAgentCfrPart11Simulator />} />
                            <Route path="/tools/agent-cfr-part-11-validation-simulator" element={<Navigate to="/tools/enterprise-agent-cfr-part-11-validation-simulator" replace />} />
                            <Route path="/embed/agent-cfr-part-11-validation-simulator" element={<EmbedAgentCfrPart11Simulator />} />
                            <Route path="/tools/enterprise-agent-ondc-retail-inventory-simulator" element={<EnterpriseAgentOndcRetailSimulator />} />
                            <Route path="/tools/agent-ondc-retail-inventory-simulator" element={<Navigate to="/tools/enterprise-agent-ondc-retail-inventory-simulator" replace />} />
                            <Route path="/embed/agent-ondc-retail-inventory-simulator" element={<EmbedAgentOndcRetailSimulator />} />
                            <Route path="/tools/enterprise-agent-nemo-guardrails-simulator" element={<EnterpriseAgentNemoGuardrailSimulator />} />
                            <Route path="/tools/agent-nemo-guardrails-simulator" element={<Navigate to="/tools/enterprise-agent-nemo-guardrails-simulator" replace />} />
                            <Route path="/embed/agent-nemo-guardrails-simulator" element={<EmbedAgentNemoGuardrailSimulator />} />
                            <Route path="/tools/enterprise-agent-aiops-incident-remediation-simulator" element={<EnterpriseAgentAiOpsSimulator />} />
                            <Route path="/tools/agent-aiops-incident-remediation-simulator" element={<Navigate to="/tools/enterprise-agent-aiops-incident-remediation-simulator" replace />} />
                            <Route path="/embed/agent-aiops-incident-remediation-simulator" element={<EmbedAgentAiOpsSimulator />} />
                            <Route path="/tools/enterprise-agent-vector-db-sharding-simulator" element={<EnterpriseAgentVectorShardingSimulator />} />
                            <Route path="/tools/agent-vector-db-sharding-simulator" element={<Navigate to="/tools/enterprise-agent-vector-db-sharding-simulator" replace />} />
                            <Route path="/embed/agent-vector-db-sharding-simulator" element={<EmbedAgentVectorShardingSimulator />} />
                            <Route path="/tools/enterprise-agent-chunked-prefill-radix-attention-simulator" element={<EnterpriseAgentChunkedPrefillSimulator />} />
                            <Route path="/tools/agent-chunked-prefill-radix-attention-simulator" element={<Navigate to="/tools/enterprise-agent-chunked-prefill-radix-attention-simulator" replace />} />
                            <Route path="/embed/agent-chunked-prefill-radix-attention-simulator" element={<EmbedAgentChunkedPrefillSimulator />} />
                            <Route path="/tools/enterprise-agent-mcp-tool-routing-simulator" element={<EnterpriseAgentMcpToolRoutingSimulator />} />
                            <Route path="/tools/agent-mcp-tool-routing-simulator" element={<Navigate to="/tools/enterprise-agent-mcp-tool-routing-simulator" replace />} />
                            <Route path="/embed/agent-mcp-tool-routing-simulator" element={<EmbedAgentMcpToolRoutingSimulator />} />
                            <Route path="/tools/enterprise-agent-industrial-iot-opc-ua-simulator" element={<EnterpriseAgentIndustrialIotSimulator />} />
                            <Route path="/tools/agent-industrial-iot-opc-ua-simulator" element={<Navigate to="/tools/enterprise-agent-industrial-iot-opc-ua-simulator" replace />} />
                            <Route path="/embed/agent-industrial-iot-opc-ua-simulator" element={<EmbedAgentIndustrialIotSimulator />} />
                            <Route path="/tools/enterprise-agent-tally-erp-xml-simulator" element={<EnterpriseAgentTallyErpSimulator />} />
                            <Route path="/tools/agent-tally-erp-xml-simulator" element={<Navigate to="/tools/enterprise-agent-tally-erp-xml-simulator" replace />} />
                            <Route path="/embed/agent-tally-erp-xml-simulator" element={<EmbedAgentTallyErpSimulator />} />
                            <Route path="/tools/enterprise-agent-smart-contract-formal-verification-simulator" element={<EnterpriseAgentSmartContractSimulator />} />
                            <Route path="/tools/agent-smart-contract-formal-verification-simulator" element={<Navigate to="/tools/enterprise-agent-smart-contract-formal-verification-simulator" replace />} />
                            <Route path="/embed/agent-smart-contract-formal-verification-simulator" element={<EmbedAgentSmartContractSimulator />} />
                            <Route path="/tools/enterprise-agent-pagedattention-cache-simulator" element={<EnterpriseAgentPagedAttentionSimulator />} />
                            <Route path="/tools/agent-pagedattention-cache-simulator" element={<Navigate to="/tools/enterprise-agent-pagedattention-cache-simulator" replace />} />
                            <Route path="/embed/agent-pagedattention-cache-simulator" element={<EmbedAgentPagedAttentionSimulator />} />
                            <Route path="/tools/enterprise-agent-medusa-speculative-tree-simulator" element={<EnterpriseAgentMedusaSpeculativeSimulator />} />
                            <Route path="/tools/agent-medusa-speculative-tree-simulator" element={<Navigate to="/tools/enterprise-agent-medusa-speculative-tree-simulator" replace />} />
                            <Route path="/embed/agent-medusa-speculative-tree-simulator" element={<EmbedAgentMedusaSpeculativeSimulator />} />
                            <Route path="/tools/enterprise-agent-ptq-quantization-perplexity-simulator" element={<EnterpriseAgentPtqQuantizationSimulator />} />
                            <Route path="/tools/agent-ptq-quantization-perplexity-simulator" element={<Navigate to="/tools/enterprise-agent-ptq-quantization-perplexity-simulator" replace />} />
                            <Route path="/embed/agent-ptq-quantization-perplexity-simulator" element={<EmbedAgentPtqQuantizationSimulator />} />
                            <Route path="/tools/enterprise-agent-flashdecoding-parallelism-simulator" element={<EnterpriseAgentFlashDecodingSimulator />} />
                            <Route path="/tools/agent-flashdecoding-parallelism-simulator" element={<Navigate to="/tools/enterprise-agent-flashdecoding-parallelism-simulator" replace />} />
                            <Route path="/embed/agent-flashdecoding-parallelism-simulator" element={<EmbedAgentFlashDecodingSimulator />} />
                            <Route path="/tools/enterprise-agent-kvcache-prefix-caching-simulator" element={<EnterpriseAgentPrefixCachingSimulator />} />
                            <Route path="/tools/agent-kvcache-prefix-caching-simulator" element={<Navigate to="/tools/enterprise-agent-kvcache-prefix-caching-simulator" replace />} />
                            <Route path="/embed/agent-kvcache-prefix-caching-simulator" element={<EmbedAgentPrefixCachingSimulator />} />
                            <Route path="/tools/enterprise-agent-chunked-cross-attention-simulator" element={<EnterpriseAgentCrossAttentionSimulator />} />
                            <Route path="/tools/agent-chunked-cross-attention-simulator" element={<Navigate to="/tools/enterprise-agent-chunked-cross-attention-simulator" replace />} />
                            <Route path="/embed/agent-chunked-cross-attention-simulator" element={<EmbedAgentCrossAttentionSimulator />} />
                            <Route path="/tools/enterprise-agent-sliding-window-attention-simulator" element={<EnterpriseAgentSlidingWindowSimulator />} />
                            <Route path="/tools/agent-sliding-window-attention-simulator" element={<Navigate to="/tools/enterprise-agent-sliding-window-attention-simulator" replace />} />
                            <Route path="/embed/agent-sliding-window-attention-simulator" element={<EmbedAgentSlidingWindowSimulator />} />
                            <Route path="/tools/enterprise-agent-multi-lora-routing-simulator" element={<EnterpriseAgentMultiLoraSimulator />} />
                            <Route path="/tools/agent-multi-lora-routing-simulator" element={<Navigate to="/tools/enterprise-agent-multi-lora-routing-simulator" replace />} />
                            <Route path="/embed/agent-multi-lora-routing-simulator" element={<EmbedAgentMultiLoraSimulator />} />
                            <Route path="/tools/enterprise-agent-mixture-of-depths-simulator" element={<EnterpriseAgentMixtureOfDepthsSimulator />} />
                            <Route path="/tools/agent-mixture-of-depths-simulator" element={<Navigate to="/tools/enterprise-agent-mixture-of-depths-simulator" replace />} />
                            <Route path="/embed/agent-mixture-of-depths-simulator" element={<EmbedAgentMixtureOfDepthsSimulator />} />
                            <Route path="/tools/enterprise-agent-kvcache-memory-compaction-simulator" element={<EnterpriseAgentKvCacheCompactionSimulator />} />
                            <Route path="/tools/agent-kvcache-memory-compaction-simulator" element={<Navigate to="/tools/enterprise-agent-kvcache-memory-compaction-simulator" replace />} />
                            <Route path="/embed/agent-kvcache-memory-compaction-simulator" element={<EmbedAgentKvCacheCompactionSimulator />} />
                            <Route path="/tools/enterprise-agent-speculative-verification-simulator" element={<EnterpriseAgentSpeculativeVerificationSimulator />} />
                            <Route path="/tools/agent-speculative-verification-simulator" element={<Navigate to="/tools/enterprise-agent-speculative-verification-simulator" replace />} />
                            <Route path="/embed/agent-speculative-verification-simulator" element={<EmbedAgentSpeculativeVerificationSimulator />} />
                            <Route path="/tools/enterprise-agent-prefill-decode-disaggregation-simulator" element={<EnterpriseAgentPrefillDecodeSimulator />} />
                            <Route path="/tools/agent-prefill-decode-disaggregation-simulator" element={<Navigate to="/tools/enterprise-agent-prefill-decode-disaggregation-simulator" replace />} />
                            <Route path="/embed/agent-prefill-decode-disaggregation-simulator" element={<EmbedAgentPrefillDecodeSimulator />} />
                            <Route path="/tools/enterprise-agent-pipeline-parallelism-simulator" element={<EnterpriseAgentPipelineParallelismSimulator />} />
                            <Route path="/tools/agent-pipeline-parallelism-simulator" element={<Navigate to="/tools/enterprise-agent-pipeline-parallelism-simulator" replace />} />
                            <Route path="/embed/agent-pipeline-parallelism-simulator" element={<EmbedAgentPipelineParallelismSimulator />} />
                            <Route path="/tools/enterprise-agent-tensor-parallelism-simulator" element={<EnterpriseAgentTensorParallelismSimulator />} />
                            <Route path="/tools/agent-tensor-parallelism-simulator" element={<Navigate to="/tools/enterprise-agent-tensor-parallelism-simulator" replace />} />
                            <Route path="/embed/agent-tensor-parallelism-simulator" element={<EmbedAgentTensorParallelismSimulator />} />
                            <Route path="/tools/enterprise-agent-sequence-parallelism-simulator" element={<EnterpriseAgentSequenceParallelismSimulator />} />
                            <Route path="/tools/agent-sequence-parallelism-simulator" element={<Navigate to="/tools/enterprise-agent-sequence-parallelism-simulator" replace />} />
                            <Route path="/embed/agent-sequence-parallelism-simulator" element={<EmbedAgentSequenceParallelismSimulator />} />
                            <Route path="/tools/enterprise-agent-expert-parallelism-simulator" element={<EnterpriseAgentExpertParallelismSimulator />} />
                            <Route path="/tools/agent-expert-parallelism-simulator" element={<Navigate to="/tools/enterprise-agent-expert-parallelism-simulator" replace />} />
                            <Route path="/embed/agent-expert-parallelism-simulator" element={<EmbedAgentExpertParallelismSimulator />} />
                            <Route path="/tools/enterprise-agent-context-parallelism-simulator" element={<EnterpriseAgentContextParallelismSimulator />} />
                            <Route path="/tools/agent-context-parallelism-simulator" element={<Navigate to="/tools/enterprise-agent-context-parallelism-simulator" replace />} />
                            <Route path="/embed/agent-context-parallelism-simulator" element={<EmbedAgentContextParallelismSimulator />} />
                            <Route path="/tools/enterprise-agent-3d-parallelism-simulator" element={<EnterpriseAgent3DParallelismSimulator />} />
                            <Route path="/tools/agent-3d-parallelism-simulator" element={<Navigate to="/tools/enterprise-agent-3d-parallelism-simulator" replace />} />
                            <Route path="/embed/agent-3d-parallelism-simulator" element={<EmbedAgent3DParallelismSimulator />} />
                            <Route path="/tools/enterprise-agent-fp8-microscaling-simulator" element={<EnterpriseAgentFp8MicroscalingSimulator />} />
                            <Route path="/tools/agent-fp8-microscaling-simulator" element={<Navigate to="/tools/enterprise-agent-fp8-microscaling-simulator" replace />} />
                            <Route path="/embed/agent-fp8-microscaling-simulator" element={<EmbedAgentFp8MicroscalingSimulator />} />
                            <Route path="/tools/enterprise-agent-async-checkpointing-simulator" element={<EnterpriseAgentAsyncCheckpointingSimulator />} />
                            <Route path="/tools/agent-async-checkpointing-simulator" element={<Navigate to="/tools/enterprise-agent-async-checkpointing-simulator" replace />} />
                            <Route path="/embed/agent-async-checkpointing-simulator" element={<EmbedAgentAsyncCheckpointingSimulator />} />
                            <Route path="/tools/enterprise-agent-disaggregated-prefill-simulator" element={<EnterpriseAgentDisaggregatedPrefillSimulator />} />
                            <Route path="/tools/agent-disaggregated-prefill-simulator" element={<Navigate to="/tools/enterprise-agent-disaggregated-prefill-simulator" replace />} />
                            <Route path="/embed/agent-disaggregated-prefill-simulator" element={<EmbedAgentDisaggregatedPrefillSimulator />} />
                            <Route path="/tools/enterprise-agent-speculative-tree-simulator" element={<EnterpriseAgentSpeculativeTreeSimulator />} />
                            <Route path="/tools/agent-speculative-tree-simulator" element={<Navigate to="/tools/enterprise-agent-speculative-tree-simulator" replace />} />
                            <Route path="/embed/agent-speculative-tree-simulator" element={<EmbedAgentSpeculativeTreeSimulator />} />
                            <Route path="/tools/enterprise-agent-kv-cache-eviction-simulator" element={<EnterpriseAgentKvCacheEvictionSimulator />} />
                            <Route path="/tools/agent-kv-cache-eviction-simulator" element={<Navigate to="/tools/enterprise-agent-kv-cache-eviction-simulator" replace />} />
                            <Route path="/embed/agent-kv-cache-eviction-simulator" element={<EmbedAgentKvCacheEvictionSimulator />} />
                            <Route path="/tools/enterprise-agent-hierarchical-storage-paging-simulator" element={<EnterpriseAgentHierarchicalStoragePagingSimulator />} />
                            <Route path="/tools/agent-hierarchical-storage-paging-simulator" element={<Navigate to="/tools/enterprise-agent-hierarchical-storage-paging-simulator" replace />} />
                            <Route path="/embed/agent-hierarchical-storage-paging-simulator" element={<EmbedAgentHierarchicalStoragePagingSimulator />} />
                            <Route path="/tools/enterprise-agent-mla-latent-projection-simulator" element={<EnterpriseAgentMlaLatentProjectionSimulator />} />
                            <Route path="/tools/agent-mla-latent-projection-simulator" element={<Navigate to="/tools/enterprise-agent-mla-latent-projection-simulator" replace />} />
                            <Route path="/embed/agent-mla-latent-projection-simulator" element={<EmbedAgentMlaLatentProjectionSimulator />} />
                            <Route path="/tools/enterprise-agent-mtp-speculative-draft-simulator" element={<EnterpriseAgentMtpSpeculativeDraftSimulator />} />
                            <Route path="/tools/agent-mtp-speculative-draft-simulator" element={<Navigate to="/tools/enterprise-agent-mtp-speculative-draft-simulator" replace />} />
                            <Route path="/embed/agent-mtp-speculative-draft-simulator" element={<EmbedAgentMtpSpeculativeDraftSimulator />} />
                            <Route path="/tools/enterprise-agent-dualpipe-pipeline-parallelism-simulator" element={<EnterpriseAgentDualpipePipelineSimulator />} />
                            <Route path="/tools/agent-dualpipe-pipeline-parallelism-simulator" element={<Navigate to="/tools/enterprise-agent-dualpipe-pipeline-parallelism-simulator" replace />} />
                            <Route path="/embed/agent-dualpipe-pipeline-parallelism-simulator" element={<EmbedAgentDualpipePipelineSimulator />} />
                            <Route path="/tools/enterprise-agent-deepseek-v3-serving-fabric-simulator" element={<EnterpriseAgentDeepseekUnifiedFabricSimulator />} />
                            <Route path="/tools/agent-deepseek-v3-serving-fabric-simulator" element={<Navigate to="/tools/enterprise-agent-deepseek-v3-serving-fabric-simulator" replace />} />
                            <Route path="/embed/agent-deepseek-v3-serving-fabric-simulator" element={<EmbedAgentDeepseekUnifiedFabricSimulator />} />
                        </Routes>
                    </Suspense>
                </AnimatePresence>
            </div>

            {!isEmbed && <DownloadFooter />}
        </div>
    )
}

export default App
