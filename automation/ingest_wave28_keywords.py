#!/usr/bin/env python3
"""
Wave 28 Keywords Ingestion (IDs 1,241 to 1,290 - 50 Commercial BOFU Solutions):
- Cluster 1 (IDs 1,241–1,257, 17 solutions): Epistemic Uncertainty & OOD Calibration in Mission-Critical BFSI & Quantitative Trading
- Cluster 2 (IDs 1,258–1,274, 17 solutions): Neuromorphic Event-Based Vision & Spiking Neural Network (SNN) Sub-Millisecond Industrial Telemetry
- Cluster 3 (IDs 1,275–1,290, 16 solutions): Spacecraft Reaction Wheel Micro-Vibration & High-Precision Attitude Control Gyro Telemetry
"""

import json
from pathlib import Path

QUEUE_FILE = Path("/Users/krdeeksha/ELESIUM WEBSITE/automation/compact_keywords_queue.json")

def slugify(text: str) -> str:
    s = text.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    return s.strip('-')

import re

wave28_items = [
    # ----------------------------------------------------------------------------------
    # Cluster 1: Epistemic Uncertainty & OOD Calibration in BFSI & Trading (IDs 1,241–1,257, 17 items)
    # ----------------------------------------------------------------------------------
    (
        "dirichlet prior bayesian neural network epistemic uncertainty telemetry for algorithmic trading order execution",
        "BFSI & FinTech Engineering",
        "Quantitative Trading System Architects & Head of Execution Risk",
        "Schedule Bayesian Order Calibration Audit"
    ),
    (
        "conformal prediction non-conformity set coverage telemetry for automated loan underwriting default risk",
        "BFSI & FinTech Engineering",
        "Chief Credit Risk Officers & Automated Underwriting Directors",
        "Schedule Conformal Underwriting Audit"
    ),
    (
        "out of distribution mahalanobis latent distance feature drift telemetry for real-time credit card fraud rejection",
        "BFSI & FinTech Engineering",
        "Head of Enterprise Fraud Surveillance & Payment Compliance Leads",
        "Schedule Mahalanobis Fraud Gate Audit"
    ),
    (
        "temperature scaling logits calibration ECE telemetry for high-frequency market making execution limits",
        "BFSI & FinTech Engineering",
        "HFT Infrastructure Architects & Quantitative Compliance Officers",
        "Schedule High-Frequency Calibration Audit"
    ),
    (
        "monte carlo dropout epistemic variance telemetry for automated commercial insurance claims adjudication",
        "BFSI & FinTech Engineering",
        "Insurance Actuarial Directors & Claims Automation Engineers",
        "Schedule Actuarial Epistemic Variance Audit"
    ),
    (
        "deep ensemble predictive entropy telemetry for cross-border FX currency arbitrage limits",
        "BFSI & FinTech Engineering",
        "Global FX Trading Desks & Automated Liquidity Managers",
        "Schedule Deep Ensemble FX Limit Audit"
    ),
    (
        "selective classification abstention threshold telemetry for retail banking KYC facial verification",
        "BFSI & FinTech Engineering",
        "Digital Banking KYC Compliance Directors & Identity Verification Leads",
        "Schedule KYC Abstention Threshold Audit"
    ),
    (
        "matrix scaling multi-class probability calibration telemetry for automated trade settlement routing",
        "BFSI & FinTech Engineering",
        "Post-Trade Operations Directors & Clearing House Settlement Leads",
        "Schedule Settlement Probability Calibration Audit"
    ),
    (
        "energy-based out of distribution score telemetry for corporate debt covenant breach early warning",
        "BFSI & FinTech Engineering",
        "Corporate Debt Underwriters & Syndicated Loan Risk Officers",
        "Schedule Energy-Based Debt Telemetry Audit"
    ),
    (
        "inductive conformal anomaly detection p-value telemetry for dark pool liquidity block trading",
        "BFSI & FinTech Engineering",
        "Dark Pool Venue Operators & Block Trading Algorithmic Leads",
        "Schedule Dark Pool Conformal Audit"
    ),
    (
        "bayesian optimization hyperparameter calibration telemetry for credit risk scorecard stability",
        "BFSI & FinTech Engineering",
        "Credit Risk Analytics Heads & Model Governance Officers",
        "Schedule Scorecard Calibration Stability Audit"
    ),
    (
        "vector scaling probability calibration telemetry for automated invoice factoring risk assessment",
        "BFSI & FinTech Engineering",
        "Trade Finance Directors & Supply Chain Factoring Risk Leads",
        "Schedule Factoring Calibration Audit"
    ),
    (
        "evidential deep learning subjective logic opinion mass telemetry for private equity buyout underwriting",
        "BFSI & FinTech Engineering",
        "Private Equity Quantitative Diligence Heads & Investment Directors",
        "Schedule Evidential Diligence Telemetry Audit"
    ),
    (
        "split-conformal quantile regression telemetry for real estate mortgage automated valuation",
        "BFSI & FinTech Engineering",
        "Mortgage Valuation Directors & Real Estate Risk Analytics Heads",
        "Schedule Conformal Valuation Audit"
    ),
    (
        "deep kernel learning gaussian process epistemic covariance telemetry for commodities futures risk limits",
        "BFSI & FinTech Engineering",
        "Commodities Risk Directors & Derivatives Trading Systems Heads",
        "Schedule Deep Kernel Risk Limit Audit"
    ),
    (
        "normalized maximum softmax probability calibration telemetry for automated cross-border remittance compliance",
        "BFSI & FinTech Engineering",
        "Cross-Border Remittance Compliance Heads & AML Risk Directors",
        "Schedule Remittance Probability Calibration Audit"
    ),
    (
        "variational inference latent space uncertainty telemetry for syndicated loan syndication pricing",
        "BFSI & FinTech Engineering",
        "Syndicated Finance Structuring Heads & Capital Markets Risk Leads",
        "Schedule Loan Syndication Uncertainty Audit"
    ),

    # ----------------------------------------------------------------------------------
    # Cluster 2: Neuromorphic Event-Based Vision & SNN Telemetry (IDs 1,258–1,274, 17 items)
    # ----------------------------------------------------------------------------------
    (
        "dynamic vision sensor DVS asynchronous micro-second pixel event stream telemetry for high-speed industrial sorting",
        "Semiconductors & Nanotechnology",
        "Industrial Automation Vision Architects & High-Speed Sorting Leads",
        "Schedule DVS Asynchronous Stream Audit"
    ),
    (
        "spiking neural network LIF membrane potential threshold telemetry for edge robotics",
        "Semiconductors & Nanotechnology",
        "Edge Robotics Systems Engineers & Neuromorphic Chip Architects",
        "Schedule SNN Membrane Threshold Audit"
    ),
    (
        "neuromorphic event-based optical flow telemetry for high-speed automated drone obstacle avoidance",
        "Semiconductors & Nanotechnology",
        "Autonomous UAV Perception Leads & Neuromorphic Navigation Engineers",
        "Schedule Neuromorphic Optical Flow Audit"
    ),
    (
        "asynchronous neuromorphic visual sensor timestamp jitter telemetry for semiconductor wire bonding inspection",
        "Semiconductors & Nanotechnology",
        "Semiconductor Packaging Inspection Leads & Advanced Packaging Directors",
        "Schedule Wire Bonding Telemetry Audit"
    ),
    (
        "spiking neural network STDP weight update telemetry for neuromorphic edge processors",
        "Semiconductors & Nanotechnology",
        "Neuromorphic Silicon Designers & Embedded AI Edge Engineers",
        "Schedule STDP Plasticity Telemetry Audit"
    ),
    (
        "neuromorphic temporal contrast event sensor micro-second latency telemetry for automated ballistic trajectory tracking",
        "Semiconductors & Nanotechnology",
        "Defense Optical Telemetry Engineers & Ballistic Tracking Leads",
        "Schedule Temporal Contrast Telemetry Audit"
    ),
    (
        "event-driven spiking convolutional network inter-spike interval telemetry for ultra-low power vibration anomaly detection",
        "Semiconductors & Nanotechnology",
        "Industrial Predictive Maintenance Heads & Ultra-Low-Power IoT Leads",
        "Schedule Spiking Vibration Telemetry Audit"
    ),
    (
        "neuromorphic bio-inspired silicon retina polarity change event rate telemetry for high-speed rail pantograph arc monitoring",
        "Semiconductors & Nanotechnology",
        "High-Speed Rail Electrical Infrastructure Directors & Pantograph Telemetry Leads",
        "Schedule Silicon Retina Arc Telemetry Audit"
    ),
    (
        "neuromorphic event camera rolling shutter artifact suppression telemetry for turbine blade inspection",
        "Semiconductors & Nanotechnology",
        "Gas Turbine Non-Destructive Testing Leads & Power Generation Inspection Heads",
        "Schedule Event Camera Turbine Audit"
    ),
    (
        "event-based asynchronous sensor fusion spatial-temporal neighborhood density filter telemetry for micro-part defect detection",
        "Semiconductors & Nanotechnology",
        "Precision Micro-Manufacturing Inspection Directors & Optical Quality Leads",
        "Schedule Spatio-Temporal Filter Audit"
    ),
    (
        "neuromorphic tactile sensor array sub-millisecond shear force spike rate telemetry for robotic precision grasping",
        "Semiconductors & Nanotechnology",
        "Surgical Robotics Systems Engineers & Precision Manipulation Leads",
        "Schedule Tactile Spike Telemetry Audit"
    ),
    (
        "neuromorphic spiking processor on-chip synapsetime constant thermal drift telemetry for edge industrial controllers",
        "Semiconductors & Nanotechnology",
        "Industrial Embedded Systems Architects & Harsh-Environment Silicon Leads",
        "Schedule Synapse Thermal Drift Audit"
    ),
    (
        "event-based HDR visual sensor contrast threshold drift telemetry for molten metal laser welding",
        "Semiconductors & Nanotechnology",
        "Automated Laser Welding Process Engineers & Metallurgical Quality Leads",
        "Schedule HDR Event Sensor Audit"
    ),
    (
        "neuromorphic spike-based continuous-time state estimation telemetry for AGV localization",
        "Semiconductors & Nanotechnology",
        "Automated Guided Vehicle Fleet Architects & Intralogistics Robotics Leads",
        "Schedule Spike State Estimation Audit"
    ),
    (
        "event-based neuromorphic stereo vision disparity map calculation telemetry for automated packaging conveyor lines",
        "Semiconductors & Nanotechnology",
        "Packaging Automation Systems Engineers & High-Throughput Sorting Leads",
        "Schedule Neuromorphic Stereo Disparity Audit"
    ),
    (
        "neuromorphic asynchronous event graph convolution telemetry for real-time power grid transient fault isolation",
        "Semiconductors & Nanotechnology",
        "Smart Grid Protection Engineers & Power Utility Automation Directors",
        "Schedule Event Graph Power Fault Audit"
    ),
    (
        "spiking neural network energy per synaptic operation SOP picojoule telemetry for wearable medical telemetry monitors",
        "Semiconductors & Nanotechnology",
        "Biomedical Implantable Device Engineers & Low-Power Medical Wearable Leads",
        "Schedule Synaptic Energy Telemetry Audit"
    ),

    # ----------------------------------------------------------------------------------
    # Cluster 3: Spacecraft Reaction Wheel & Attitude Gyro Telemetry (IDs 1,275–1,290, 16 items)
    # ----------------------------------------------------------------------------------
    (
        "spacecraft reaction wheel magnetic bearing micro-vibration piezo-electric accelerometer telemetry for optical payload jitter suppression",
        "Avionics & Aerospace Engineering",
        "Satellite Optical Payload Isolation Leads & Spacecraft ADCS Architects",
        "Schedule Reaction Wheel Jitter Telemetry Audit"
    ),
    (
        "high-precision fiber-optic gyroscope FOG ARW drift telemetry for geostationary satellite pointing",
        "Avionics & Aerospace Engineering",
        "Geostationary Satellite Guidance Leads & Inertial Navigation System Architects",
        "Schedule Fiber-Optic Gyro Drift Audit"
    ),
    (
        "star tracker celestial catalog quaternions attitude determination covariance telemetry for deep-space observatory slew maneuvers",
        "Avionics & Aerospace Engineering",
        "Deep Space Flight Dynamics Engineers & Star Tracker Calibration Leads",
        "Schedule Star Tracker Covariance Audit"
    ),
    (
        "spacecraft momentum wheel flywheel dynamic unbalance laser displacement sensor telemetry for reaction wheel assembly balance",
        "Avionics & Aerospace Engineering",
        "Satellite Mechanisms Dynamicists & Spacecraft Momentum Wheel Leads",
        "Schedule Momentum Wheel Dynamic Balance Audit"
    ),
    (
        "control moment gyroscope CMG gimbal angular rate resolver telemetry for agile satellite rapid retargeting maneuvers",
        "Avionics & Aerospace Engineering",
        "Agile Earth Observation Satellite GNC Directors & CMG Subsystem Leads",
        "Schedule CMG Angular Rate Resolver Audit"
    ),
    (
        "satellite magnetic torquer rod dipole moment geomagnetic field cancellation telemetry for reaction wheel momentum desaturation",
        "Avionics & Aerospace Engineering",
        "Low Earth Orbit Satellite Attitude Control Engineers & Magnetic Actuator Leads",
        "Schedule Magnetic Torquer Desaturation Audit"
    ),
    (
        "spacecraft sun sensor multi-junction photodiode coarse sun acquisition vector telemetry for safe mode recovery",
        "Avionics & Aerospace Engineering",
        "Spacecraft Operations Flight Controllers & Fault Detection Isolation Recovery Leads",
        "Schedule Sun Sensor Acquisition Audit"
    ),
    (
        "spacecraft optical payload line-of-sight piezo-ceramic FSM closed-loop tilt telemetry",
        "Avionics & Aerospace Engineering",
        "Spaceborne Laser Communications Leads & Optical Pointing Mechanism Engineers",
        "Schedule Fast Steering Mirror Closed-Loop Audit"
    ),
    (
        "satellite thruster cold gas pulse modulation MIB telemetry for reaction wheel momentum offloading",
        "Avionics & Aerospace Engineering",
        "Spacecraft Propulsion Subsystem Leads & Satellite Orbit Stationkeeping Engineers",
        "Schedule Cold Gas Pulse Impulse Audit"
    ),
    (
        "spacecraft monolithic quartz pendulum flexure accelerometer telemetry for micro-gravity orbital acceleration monitoring",
        "Avionics & Aerospace Engineering",
        "Orbital Microgravity Science Leads & Precision Spacecraft Accelerometer Engineers",
        "Schedule Quartz Flexure Accelerometer Audit"
    ),
    (
        "satellite attitude determination UKF innovation covariance telemetry for sensor fault isolation",
        "Avionics & Aerospace Engineering",
        "Satellite Attitude Estimation Leads & Autonomous Spacecraft Navigation Architects",
        "Schedule UKF Innovation Covariance Audit"
    ),
    (
        "spacecraft reaction wheel lubrication elastohydrodynamic film thickness capacitive sensor telemetry for lifetime degradation",
        "Avionics & Aerospace Engineering",
        "Space Tribology Specialists & Reaction Wheel Reliability Engineers",
        "Schedule Elastohydrodynamic Lubrication Audit"
    ),
    (
        "satellite earth sensor infrared horizon scanner chord length deviation telemetry for roll and pitch attitude stabilization",
        "Avionics & Aerospace Engineering",
        "Satellite Earth Horizon Scanner Engineers & Spacecraft Stabilization Leads",
        "Schedule Horizon Scanner Chord Deviation Audit"
    ),
    (
        "spacecraft active vibration isolation hexapod stewart platform voice-coil actuator stroke telemetry for payload stabilization",
        "Avionics & Aerospace Engineering",
        "Spacecraft Active Vibration Control Engineers & Optical Bench Isolation Leads",
        "Schedule Hexapod Stewart Platform Audit"
    ),
    (
        "satellite rate gyro scale factor thermal compensation bridge circuit telemetry for polar orbit eclipse transitions",
        "Avionics & Aerospace Engineering",
        "Polar Orbit Satellite Inertial Sensor Engineers & Thermal Control Leads",
        "Schedule Gyro Scale Factor Compensation Audit"
    ),
    (
        "spacecraft star tracker baffle stray sunlight attenuation ratio telemetry for high-albedo planetary pointing",
        "Avionics & Aerospace Engineering",
        "Optical Sensor Stray Light Analysts & Spacecraft Attitude Determination Leads",
        "Schedule Star Tracker Baffle Attenuation Audit"
    )
]

def main():
    print(f"Loading existing queue from {QUEUE_FILE}...")
    with open(QUEUE_FILE, "r", encoding="utf-8") as f:
        queue = json.load(f)

    start_id = len(queue) + 1
    print(f"Current queue size: {len(queue)}. Next ID: {start_id}")

    added_count = 0
    for idx, (kw, hub_cat, persona, cta) in enumerate(wave28_items):
        item_id = start_id + idx
        slug = slugify(kw)
        
        # Verify no duplicate slugs
        if any(item["slug"] == slug for item in queue):
            print(f"WARNING: Slug {slug} already exists in queue! Skipping.")
            continue
            
        new_item = {
            "id": item_id,
            "keyword": kw,
            "slug": slug,
            "category": "Solutions",
            "hub_category": hub_cat,
            "target_persona": persona,
            "intent": "High-Lever BOFU",
            "search_volume_tier": "Low-Competition (0-50)",
            "moz_target_score": 97,
            "status": "PENDING",
            "primary_cta": cta
        }
        queue.append(new_item)
        added_count += 1

    with open(QUEUE_FILE, "w", encoding="utf-8") as f:
        json.dump(queue, f, indent=2, ensure_ascii=False)

    print(f"✅ Successfully added {added_count} new keywords to {QUEUE_FILE}. Total in queue: {len(queue)}")

if __name__ == "__main__":
    main()
