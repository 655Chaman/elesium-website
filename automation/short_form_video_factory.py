#!/usr/bin/env python3
"""
short_form_video_factory.py
=============================================================================
Stage 9.2: Short-Form Video SEO Factory for Elesium.

Produces high-converting 30-second vertical short-form video scripts grounded in:
1. Chad Michael Avatar Consistency Lock & Second-by-Second Structure
2. Edward Sturm Descript Video SEO Model (Module 12)
3. Google Video Search indexing optimization (Spoken keyword in 0-3s, verbatim transcript in description)
4. Google Search Central compliant VideoObject JSON-LD Schema

Covers the Top 10 High-Lever BOFU Solutions and the Enterprise AI ROI Calculator.
=============================================================================
"""

import os
import sys
import json
import argparse
from pathlib import Path
from typing import Dict, Any, List

BASE_DIR = Path(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SCRIPTS_DIR = BASE_DIR / "automation" / "video_scripts"
FRONTEND_DATA_FILE = BASE_DIR / "frontend" / "src" / "data" / "videoMasterclasses.ts"

AVATAR_CONSISTENCY_RECIPE = """# 3-Prompt Avatar Consistency Lock Recipe (Chad Michael Framework)

### Prompt 1: Persona & Character Definition (The Anchor Sheet)
"Ultra-realistic portrait photography of a 32-year-old South Asian male enterprise AI systems architect, short clean fade haircut, minimalist matte-black crewneck sweater, focused authoritative demeanor, seated at a modern dark concrete desk with soft ambient blue edge lighting, studio 85mm f/1.8 lens, shallow depth of field, 8k resolution, raw photo."

### Prompt 2: Multi-Angle Spatial Headshots
"Same character from Prompt 1: Generate 4 coherent camera angles maintaining identical facial bone structure, skin tone, and hairline:
1. Front-facing eye-level direct to camera (medium close-up)
2. 45-degree angle looking slightly off-camera toward an unseen monitor
3. Over-the-shoulder view with modern terminal code visible on display
4. Side profile with subtle rim lighting from workstation display"

### Prompt 3: LoRA / Seed Lock for Video Rendering
"Lock facial identity mesh with 0.85 face weight. Animate speech phonemes from audio transcript with natural micro-blinking, subtle head tilt on key technical terms, and zero facial jitter. Wardrobe remains matte-black throughout all scenes."
"""

# Master catalog of 11 short-form video specifications
VIDEO_SPECIFICATIONS: List[Dict[str, Any]] = [
    {
        "id": "sfv-1",
        "slug": "ai-automation-agency-for-logistics",
        "keyword": "AI automation agency for logistics",
        "key_benefit": "Autonomous Fleet Dispatch & ERP Synchronization",
        "industry": "Logistics & Supply Chain",
        "target_persona": "Logistics Directors & Fleet VP",
        "youtube_id": "LgX9n2101a",
        "hero_image": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
        "timecodes": [
            {
                "time": "00:00 - 00:03",
                "seconds": 0,
                "title": "Exact Spoken Keyword Hook",
                "visual": "Pattern Interrupt Close-Up: Avatar looks directly into camera with intense focus, terminal backdrop.",
                "voiceover": "Searching for an AI automation agency for logistics that actually delivers production code?",
                "caption": "AI AUTOMATION AGENCY FOR LOGISTICS // ZERO WRAPPERS"
            },
            {
                "time": "00:03 - 00:08",
                "seconds": 3,
                "title": "Operational Friction Point",
                "visual": "Cutaway B-Roll: Red error console, timeout latency alert over legacy dispatch dashboard, split spreadsheets.",
                "voiceover": "Your dispatchers are drowning in manual WhatsApp messages, split Excel sheets, and TMS sync failures that delay departures by 4 hours.",
                "caption": "MANUAL DISPATCH TRAPS = 4-HOUR DEPARTURE DELAYS"
            },
            {
                "time": "00:08 - 00:18",
                "seconds": 8,
                "title": "Deterministic Architecture Mechanism",
                "visual": "Rapid Cutaways (every 2.5s): LangGraph state machine flow diagram -> FastAPI ingestion gateway -> Private VPC terminal.",
                "voiceover": "Elesium engineers deterministic LangGraph state machines in your private VPC. Our FastAPI ingestion pipeline reconciles telematics, driver hours, and SAP S/4HANA in sub-200 milliseconds.",
                "caption": "FASTAPI + LANGGRAPH IN SOVEREIGN PRIVATE VPC"
            },
            {
                "time": "00:18 - 00:26",
                "seconds": 18,
                "title": "Quantitative Case Study Metrics",
                "visual": "Proof B-Roll: Production dashboard showing operational hours saved, idle time reduction, and verified fuel savings.",
                "voiceover": "Across 450 fleet assets, we cut transit idle time by 34%, eliminated 98% of scheduling errors, and delivered ₹18.4 Lakhs in audited monthly fuel savings.",
                "caption": "₹18.4L MONTHLY SAVINGS // 98% ERROR REDUCTION"
            },
            {
                "time": "00:26 - 00:30",
                "seconds": 26,
                "title": "Frictionless Conversion Action",
                "visual": "Avatar Call-to-Action: Direct gaze with on-screen WhatsApp QR code and tap indicator.",
                "voiceover": "Schedule your sovereign logistics architecture audit at elesium.online.",
                "caption": "SCHEDULE ARCHITECTURE AUDIT // ELESIUM.ONLINE"
            }
        ],
        "roi_metrics": [
            {"label": "Execution Latency", "value": "<200ms", "detail": "Sub-second ERP sync", "color": "#00D7FF"},
            {"label": "Monthly Savings", "value": "₹18.4L", "detail": "Audited fuel & idle cut", "color": "#10C387"},
            {"label": "Scheduling Errors", "value": "-98%", "detail": "Deterministic state graph", "color": "#C387FF"},
            {"label": "Production SLA", "value": "99.9%", "detail": "Sovereign VPC boundary", "color": "#FBBF24"}
        ],
        "architecture_stages": [
            {
                "stage": "Stage 01",
                "name": "Sovereign Telematics Ingestion",
                "bullets": [
                    "High-throughput GPS and driver duty log streaming via FastAPI",
                    "Mutual TLS 1.3 encryption across all fleet sensor nodes",
                    "Automated schema validation against Indian DPDP Act 2023 guidelines"
                ],
                "techStack": "FastAPI • Redis Streams • Pydantic v2 • TLS 1.3"
            },
            {
                "stage": "Stage 02",
                "name": "Deterministic LangGraph Dispatch Core",
                "bullets": [
                    "Finite state machine enforcing driver rest constraints and fuel limits",
                    "Continuous traveling-salesman re-optimization on traffic alerts",
                    "Zero LLM hallucination: strict programmatic validation gates"
                ],
                "techStack": "LangGraph • Python 3.12 • PostgreSQL • Private VPC"
            },
            {
                "stage": "Stage 03",
                "name": "Bidirectional SAP & Driver Push",
                "bullets": [
                    "Transactional two-phase commit writeback to SAP S/4HANA",
                    "Real-time driver push via dedicated Android telematics app",
                    "Immutable cryptographic audit trail for every load decision"
                ],
                "techStack": "SAP OData RFC • WebSockets • Kafka • OpenTelemetry"
            }
        ]
    },
    {
        "id": "sfv-2",
        "slug": "autonomous-dispatch-software-for-freight-carriers",
        "keyword": "autonomous dispatch software for freight carriers",
        "key_benefit": "Real-Time Telematics & Dynamic Route Planning",
        "industry": "Freight & Linehaul Transportation",
        "target_persona": "Fleet Operations Executives",
        "youtube_id": "FrT8m1920b",
        "hero_image": "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
        "timecodes": [
            {
                "time": "00:00 - 00:03",
                "seconds": 0,
                "title": "Exact Spoken Keyword Hook",
                "visual": "Pattern Interrupt: Split screen showing highway linehaul truck and frozen dispatch control console.",
                "voiceover": "Stop relying on legacy autonomous dispatch software for freight carriers that crashes on peak load.",
                "caption": "AUTONOMOUS DISPATCH SOFTWARE FOR FREIGHT CARRIERS"
            },
            {
                "time": "00:03 - 00:08",
                "seconds": 3,
                "title": "Operational Friction Point",
                "visual": "Red blinking alert over Google Maps route with massive congestion delay.",
                "voiceover": "When unexpected highway jams or driver cancellations hit, rule-based dispatch tools freeze, leaving trucks empty and dispatchers scrambling.",
                "caption": "EMPTY BACKHAULS & BROKEN DISPATCH RULES"
            },
            {
                "time": "00:08 - 00:18",
                "seconds": 8,
                "title": "Deterministic Architecture Mechanism",
                "visual": "LangGraph state machine graph cycling through live GIS coordinates and re-dispatching drivers.",
                "voiceover": "Elesium deploys deterministic multi-agent state machines connecting GPS telematics, driver duty logs, and carrier rate engines in an air-gapped private VPC.",
                "caption": "DETERMINISTIC MULTI-AGENT TELEMATICS // PRIVATE VPC"
            },
            {
                "time": "00:18 - 00:26",
                "seconds": 18,
                "title": "Quantitative Case Study Metrics",
                "visual": "Metrics graph climbing: Latency drops to 1.9s, backhaul load rate reaches 92%.",
                "voiceover": "We achieve 1.9-second recalculation latency, increase backhaul utilization by 42%, and slash carrier deadhead miles by 28%.",
                "caption": "1.9s RECALCULATION // 42% BACKHAUL BOOST"
            },
            {
                "time": "00:26 - 00:30",
                "seconds": 26,
                "title": "Frictionless Conversion Action",
                "visual": "Avatar points to link overlay with glowing cyan CTA.",
                "voiceover": "Deploy autonomous carrier dispatch with guaranteed 90-day ROI at elesium.online.",
                "caption": "BOOK FREIGHT AUDIT // ELESIUM.ONLINE"
            }
        ],
        "roi_metrics": [
            {"label": "Recalculation", "value": "1.9s", "detail": "Dynamic highway rerouting", "color": "#00D7FF"},
            {"label": "Backhaul Boost", "value": "+42%", "detail": "Zero empty return trips", "color": "#10C387"},
            {"label": "Deadhead Miles", "value": "-28%", "detail": "Eliminated unbilled miles", "color": "#C387FF"},
            {"label": "System SLA", "value": "99.8%", "detail": "Private VPC cluster", "color": "#FBBF24"}
        ],
        "architecture_stages": [
            {
                "stage": "Stage 01",
                "name": "Live Telemetry & Toll Gateway",
                "bullets": [
                    "Millisecond GPS position polling and toll RFID event ingestion",
                    "Dynamic weather and municipal freight restriction feeds",
                    "Automated driver electronic logging device (ELD) verification"
                ],
                "techStack": "FastAPI • Kafka • MQTT Broker • Redis"
            },
            {
                "stage": "Stage 02",
                "name": "Multi-Agent Drayage Matching Engine",
                "bullets": [
                    "Dynamic load matching prioritizing high-margin freight corridors",
                    "Real-time driver fatigue monitoring with automated swap suggestions",
                    "Deterministic mathematical graph solving with hard delivery windows"
                ],
                "techStack": "LangGraph • NumPy • PuLP • Python 3.12"
            },
            {
                "stage": "Stage 03",
                "name": "Bidirectional TMS Integration",
                "bullets": [
                    "Real-time OData writeback to McLeod, MercuryGate, and SAP TMS",
                    "Instant automated SMS and WhatsApp dispatches to drivers",
                    "Complete audit logging with GPS trace verification"
                ],
                "techStack": "SAP TMS • Twilio • PostgreSQL • OpenTelemetry"
            }
        ]
    },
    {
        "id": "sfv-3",
        "slug": "deterministic-warehouse-automation-for-3pl-providers",
        "keyword": "deterministic warehouse automation for 3PL providers",
        "key_benefit": "WMS State Machines & Inventory Accuracy",
        "industry": "Warehousing & 3PL Logistics",
        "target_persona": "3PL Managing Directors & Warehouse COOs",
        "youtube_id": "Wh3L9402c",
        "hero_image": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
        "timecodes": [
            {
                "time": "00:00 - 00:03",
                "seconds": 0,
                "title": "Exact Spoken Keyword Hook",
                "visual": "Close-up: Industrial robotic barcode scanner scanning a pallet with green laser reflection.",
                "voiceover": "This is deterministic warehouse automation for 3PL providers built for zero inventory drift.",
                "caption": "DETERMINISTIC WAREHOUSE AUTOMATION FOR 3PL PROVIDERS"
            },
            {
                "time": "00:03 - 00:08",
                "seconds": 3,
                "title": "Operational Friction Point",
                "visual": "Frustrated warehouse supervisor staring at inventory discrepancy screen with missing cartons.",
                "voiceover": "Barcode scanner mismatches, fragmented WMS databases, and lost SKUs cost 3PL providers lakhs in SLA penalties every quarter.",
                "caption": "LOST SKUs & RECURRENT SLA PENALTIES"
            },
            {
                "time": "00:08 - 00:18",
                "seconds": 8,
                "title": "Deterministic Architecture Mechanism",
                "visual": "3D isometric warehouse model highlighting optimal pick-paths, connected to terminal code.",
                "voiceover": "Our LangGraph state machine orchestrates inbound put-away, barcode verification, and outbound pick-paths with strict ACID transactional guarantees on private cloud hardware.",
                "caption": "ACID STATE MACHINE // PRIVATE CLOUD WMS"
            },
            {
                "time": "00:18 - 00:26",
                "seconds": 18,
                "title": "Quantitative Case Study Metrics",
                "visual": "Dashboard display showing 99.98% inventory accuracy and 61% faster pick times.",
                "voiceover": "Clients achieve 99.98% inventory accuracy, reduce pick-and-pack cycle times by 61%, and recover ₹22 Lakhs in lost stock discrepancies.",
                "caption": "99.98% ACCURACY // 61% FASTER PICKING"
            },
            {
                "time": "00:26 - 00:30",
                "seconds": 26,
                "title": "Frictionless Conversion Action",
                "visual": "Avatar with clean whitepaper mockup and URL overlay.",
                "voiceover": "Audit your 3PL warehouse automation architecture today at elesium.online.",
                "caption": "AUDIT 3PL WAREHOUSE // ELESIUM.ONLINE"
            }
        ],
        "roi_metrics": [
            {"label": "Stock Accuracy", "value": "99.98%", "detail": "Zero inventory drift", "color": "#00D7FF"},
            {"label": "Pick Speed", "value": "61% Faster", "detail": "Optimized traveling-path", "color": "#10C387"},
            {"label": "Discrepancy Cut", "value": "₹22L/qtr", "detail": "Eliminated lost stock", "color": "#C387FF"},
            {"label": "System Uptime", "value": "99.95%", "detail": "On-premise edge fallback", "color": "#FBBF24"}
        ],
        "architecture_stages": [
            {
                "stage": "Stage 01",
                "name": "Inbound Barcode & RFID Stream",
                "bullets": [
                    "Sub-10ms optical scanner decoding and barcode checksum matching",
                    "Automated Pydantic schema validation for mixed SKU consignments",
                    "Cross-docking candidate identification before shelf allocation"
                ],
                "techStack": "Edge Python • Zebra Scanner SDK • Redis Streams"
            },
            {
                "stage": "Stage 02",
                "name": "ACID Put-Away & Pick State Machine",
                "bullets": [
                    "Multi-objective optimization balancing forklift battery and transit time",
                    "Strict transactional state locks preventing duplicate bin assignments",
                    "Dynamic slotting reconfiguration based on SKU seasonal velocity"
                ],
                "techStack": "LangGraph • Rust FFI • PostgreSQL • Asyncpg"
            },
            {
                "stage": "Stage 03",
                "name": "WMS & Shipping Carrier Gateway",
                "bullets": [
                    "Direct OData connector for Manhattan Associates and Blue Yonder",
                    "Automated bill-of-lading and hazardous material label generation",
                    "Immutable audit logs meeting ISO 9001 and DPDP Act standards"
                ],
                "techStack": "Manhattan API • Zebra ZPL • Kafka • Prometheus"
            }
        ]
    },
    {
        "id": "sfv-4",
        "slug": "fleet-route-optimization-agents-for-supply-chain-directors",
        "keyword": "fleet route optimization agents for supply chain directors",
        "key_benefit": "Multi-Depot Routing & Fuel Cost Elimination",
        "industry": "Supply Chain & Distribution",
        "target_persona": "Supply Chain Directors & Fleet Controllers",
        "youtube_id": "RtSc0192d",
        "hero_image": "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80",
        "timecodes": [
            {
                "time": "00:00 - 00:03",
                "seconds": 0,
                "title": "Exact Spoken Keyword Hook",
                "visual": "Aerial drone shot of supply chain distribution hub with trucks entering highway.",
                "voiceover": "Meet the fleet route optimization agents for supply chain directors who demand deterministic efficiency.",
                "caption": "FLEET ROUTE OPTIMIZATION AGENTS // SUPPLY CHAIN"
            },
            {
                "time": "00:03 - 00:08",
                "seconds": 3,
                "title": "Operational Friction Point",
                "visual": "Truck idling at toll barrier with fuel gauge visibly dropping.",
                "voiceover": "Static route planners ignore real-time municipal entry curfews, monsoon road closures, and live toll pricing, burning 25% excess diesel.",
                "caption": "25% FUEL BURNED ON UNOPTIMIZED STATIC ROUTES"
            },
            {
                "time": "00:08 - 00:18",
                "seconds": 8,
                "title": "Deterministic Architecture Mechanism",
                "visual": "Parallel compute nodes running route optimizations with sub-500ms execution timer.",
                "voiceover": "Elesium engineers parallel LangGraph agents analyzing live GIS layers, vehicle weight constraints, and customer delivery windows in sub-500ms API calls.",
                "caption": "PARALLEL GIS AGENTS // SUB-500MS API"
            },
            {
                "time": "00:18 - 00:26",
                "seconds": 18,
                "title": "Quantitative Case Study Metrics",
                "visual": "Quarterly savings chart displaying 19% fuel reduction and ₹31 Lakhs saved.",
                "voiceover": "Deployments yield a direct 19% fuel burn reduction, 99.4% on-time delivery rate, and ₹31 Lakhs in quarterly operating savings.",
                "caption": "19% FUEL REDUCTION // ₹31L QUARTERLY SAVED"
            },
            {
                "time": "00:26 - 00:30",
                "seconds": 26,
                "title": "Frictionless Conversion Action",
                "visual": "Avatar points to URL with scheduling calendar icon.",
                "voiceover": "Optimize your enterprise fleet routes with sovereign AI at elesium.online.",
                "caption": "OPTIMIZE FLEET ROUTES // ELESIUM.ONLINE"
            }
        ],
        "roi_metrics": [
            {"label": "Fuel Burn Cut", "value": "19%", "detail": "Direct diesel savings", "color": "#00D7FF"},
            {"label": "On-Time Rate", "value": "99.4%", "detail": "Guaranteed SLA windows", "color": "#10C387"},
            {"label": "Quarterly Savings", "value": "₹31L", "detail": "Audited fleet balance sheet", "color": "#C387FF"},
            {"label": "Route Latency", "value": "<500ms", "detail": "Sub-second multi-stop solver", "color": "#FBBF24"}
        ],
        "architecture_stages": [
            {
                "stage": "Stage 01",
                "name": "Live GIS & Curfew Ingestion",
                "bullets": [
                    "Continuous municipal truck entry curfew and no-entry zone indexing",
                    "Dynamic elevation and terrain gradient modeling for fuel efficiency",
                    "Live FASTag and toll price matrix optimization"
                ],
                "techStack": "FastAPI • OpenStreetMap GIS • PostGIS • Redis"
            },
            {
                "stage": "Stage 02",
                "name": "Parallel Multi-Depot CVRP Solver",
                "bullets": [
                    "LangGraph parallel nodes solving capacitated vehicle routing problem",
                    "Multi-compartment temperature constraints for cold chain cargo",
                    "Hard time-window validation with penalties for SLA breaches"
                ],
                "techStack": "LangGraph • OR-Tools • Python 3.12 • Ray Cluster"
            },
            {
                "stage": "Stage 03",
                "name": "Execution Telemetry Feedback Loop",
                "bullets": [
                    "Turn-by-turn re-routing triggers on driver geofence deviation",
                    "Real-time customer SMS tracking with sub-5 minute ETA fidelity",
                    "Consolidated quarterly fuel tax credit and ESG carbon audit reports"
                ],
                "techStack": "Kafka • WebSockets • PostgreSQL • Grafana"
            }
        ]
    },
    {
        "id": "sfv-5",
        "slug": "sub-200ms-ledger-reconciliation-agents-for-fintechs",
        "keyword": "sub-200ms ledger reconciliation agents for fintechs",
        "key_benefit": "Cryptographic Settlement & Zero Ledger Drift",
        "industry": "Fintech & Payments Infrastructure",
        "target_persona": "Fintech CTOs & Treasury Controllers",
        "youtube_id": "LdG8m203e",
        "hero_image": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
        "timecodes": [
            {
                "time": "00:00 - 00:03",
                "seconds": 0,
                "title": "Exact Spoken Keyword Hook",
                "visual": "High-speed digital transaction ledger counter spinning past millions with glowing cyan accents.",
                "voiceover": "Deploy sub-200ms ledger reconciliation agents for fintechs handling high-velocity transactions.",
                "caption": "SUB-200MS LEDGER RECONCILIATION AGENTS"
            },
            {
                "time": "00:03 - 00:08",
                "seconds": 3,
                "title": "Operational Friction Point",
                "visual": "Red ledger error indicating unmatched settlements and bank account drift.",
                "voiceover": "T+1 batch reconciliation scripts leave payment gateways blind to phantom payouts, duplicate settlements, and midnight balance drift.",
                "caption": "T+1 SETTLEMENT LAG // DANGEROUS PHANTOM PAYOUTS"
            },
            {
                "time": "00:08 - 00:18",
                "seconds": 8,
                "title": "Deterministic Architecture Mechanism",
                "visual": "Rust state engine hashing incoming UPI transactions and verifying balances in real-time.",
                "voiceover": "Elesium builds streaming event-driven agents on FastAPI and Rust-accelerated state engines, cross-matching core bank ledger hashes with UPI rails in sub-200 milliseconds.",
                "caption": "EVENT-DRIVEN STREAMING // SUB-200MS CRYPTO HASH"
            },
            {
                "time": "00:18 - 00:26",
                "seconds": 18,
                "title": "Quantitative Case Study Metrics",
                "visual": "Transaction throughput gauge showing 8 million daily transactions and 140ms latency.",
                "voiceover": "Processing 8 million daily transactions with 99.999% cryptographic reconciliation fidelity and zero phantom settlement leaks.",
                "caption": "8M DAILY TRANSACTIONS // ZERO SETTLEMENT LEAK"
            },
            {
                "time": "00:26 - 00:30",
                "seconds": 26,
                "title": "Frictionless Conversion Action",
                "visual": "Avatar with direct gaze and verified security badge.",
                "voiceover": "Eliminate fintech ledger drift forever at elesium.online.",
                "caption": "ZERO DRIFT AUDIT // ELESIUM.ONLINE"
            }
        ],
        "roi_metrics": [
            {"label": "Reconciliation", "value": "140ms", "detail": "Sub-200ms crypto hash match", "color": "#00D7FF"},
            {"label": "Daily Scale", "value": "8M Tx/day", "detail": "Zero queue bottlenecks", "color": "#10C387"},
            {"label": "Ledger Drift", "value": "0%", "detail": "No phantom payouts", "color": "#C387FF"},
            {"label": "Audit Speed", "value": "100x", "detail": "Real-time proof of reserves", "color": "#FBBF24"}
        ],
        "architecture_stages": [
            {
                "stage": "Stage 01",
                "name": "High-Throughput Payment Rails Gateway",
                "bullets": [
                    "Direct webhook ingestion from UPI, IMPS, NEFT, and payment gateway switches",
                    "Mutual TLS 1.3 with hardware security module (HSM) signature checks",
                    "Streaming zero-loss ingest via distributed Redis Streams"
                ],
                "techStack": "FastAPI • Rust Ingest • Redis Streams • HSM"
            },
            {
                "stage": "Stage 02",
                "name": "Cryptographic Reconciliation Engine",
                "bullets": [
                    "Double-entry bookkeeping state machine with automated balance assertions",
                    "SHA-256 transaction hash cross-verification across issuer and acquirer",
                    "Instant freeze on mismatched amount or timestamp anomalies"
                ],
                "techStack": "Rust State Engine • Python 3.12 • DuckDB • PostgreSQL"
            },
            {
                "stage": "Stage 03",
                "name": "Core Banking Writeback & RBI Compliance",
                "bullets": [
                    "Two-phase commit writeback to Finacle, TCS BaNCS, and core ledgers",
                    "Statutory daily settlement summary generation for RBI regulatory compliance",
                    "Real-time treasury dashboard with instant variance alerting"
                ],
                "techStack": "Finacle API • ISO 20022 XML • OpenTelemetry • Prometheus"
            }
        ]
    },
    {
        "id": "sfv-6",
        "slug": "aml-compliance-automation-software-for-private-banks",
        "keyword": "AML compliance automation software for private banks",
        "key_benefit": "Sanctions Screening & Real-Time SAR Generation",
        "industry": "Private Banking & Wealth Management",
        "target_persona": "Head of Financial Crime Compliance",
        "youtube_id": "Am7Bn394f",
        "hero_image": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
        "timecodes": [
            {
                "time": "00:00 - 00:03",
                "seconds": 0,
                "title": "Exact Spoken Keyword Hook",
                "visual": "Sleek bank vault interior transitioning into a high-security compliance terminal display.",
                "voiceover": "Here is the AML compliance automation software for private banks that eliminates false positives.",
                "caption": "AML COMPLIANCE AUTOMATION SOFTWARE // PRIVATE BANKS"
            },
            {
                "time": "00:03 - 00:08",
                "seconds": 3,
                "title": "Operational Friction Point",
                "visual": "Stack of unread suspicious activity reports piling up with urgent compliance audit warning.",
                "voiceover": "Compliance analysts waste 85% of their working hours manually investigating false sanctions alerts while regulatory audits threaten multi-crore fines.",
                "caption": "85% FALSE POSITIVES & THREAT OF RBI PENALTIES"
            },
            {
                "time": "00:08 - 00:18",
                "seconds": 8,
                "title": "Deterministic Architecture Mechanism",
                "visual": "Entity resolution graph linking beneficial owners and watchlists with cryptographic citations.",
                "voiceover": "Our deterministic agentic pipeline executes entity disambiguation against OFAC and RBI watchlists, synthesizing fully cited Suspicious Activity Reports in sovereign air-gapped clusters.",
                "caption": "AIR-GAPPED SANCTIONS SCREENING // SOVEREIGN CLUSTER"
            },
            {
                "time": "00:18 - 00:26",
                "seconds": 18,
                "title": "Quantitative Case Study Metrics",
                "visual": "Graph showing false alerts plunging 78% and SAR turnaround compressing from 6 hours to 4 minutes.",
                "voiceover": "Reduces false positive investigations by 78%, cuts SAR generation time from 6 hours to 4 minutes, and guarantees 100% DPDP Act compliance.",
                "caption": "78% FEWER FALSE ALERTS // 4-MIN SAR CREATION"
            },
            {
                "time": "00:26 - 00:30",
                "seconds": 26,
                "title": "Frictionless Conversion Action",
                "visual": "Avatar beside secure private banking lock graphic and CTA.",
                "voiceover": "Deploy sovereign AML compliance automation at elesium.online.",
                "caption": "SECURE PRIVATE BANKING // ELESIUM.ONLINE"
            }
        ],
        "roi_metrics": [
            {"label": "False Alerts", "value": "-78%", "detail": "Entity disambiguation", "color": "#00D7FF"},
            {"label": "SAR Creation", "value": "4 Mins", "detail": "Down from 6 hours", "color": "#10C387"},
            {"label": "Compliance SLA", "value": "100%", "detail": "DPDP & RBI compliant", "color": "#C387FF"},
            {"label": "Analyst Hours", "value": "850h/mo", "detail": "Reinvested into real risk", "color": "#FBBF24"}
        ],
        "architecture_stages": [
            {
                "stage": "Stage 01",
                "name": "Global Watchlist & Transaction Stream",
                "bullets": [
                    "Real-time sync of OFAC, UN, RBI, and Interpol sanctions feeds",
                    "Phonetic, transliteration, and alias matching across multi-lingual names",
                    "Transaction velocity tracking identifying rapid layering patterns"
                ],
                "techStack": "FastAPI • Elasticsearch • Milvus Vector DB • Kafka"
            },
            {
                "stage": "Stage 02",
                "name": "Deterministic Entity Resolution Graph",
                "bullets": [
                    "LangGraph agentic graph resolving ultimate beneficial ownership (UBO)",
                    "Cross-referencing corporate registry filings, MCA data, and Panama Papers",
                    "Strict confidence scoring preventing spurious false-positive alert generation"
                ],
                "techStack": "LangGraph • Neo4j Graph DB • Python 3.12 • Sovereign VPC"
            },
            {
                "stage": "Stage 03",
                "name": "Automated SAR Synthesis & Regulatory Filing",
                "bullets": [
                    "Deterministic drafting of Suspicious Transaction Reports (STRs) with line-item citations",
                    "Human-in-the-loop compliance officer sign-off portal with source-highlighting",
                    "Automated packaging conforming to FIU-IND electronic reporting standards"
                ],
                "techStack": "FIU-IND XML Gateway • Pydantic • React • PDFKit"
            }
        ]
    },
    {
        "id": "sfv-7",
        "slug": "deterministic-loan-underwriting-agents-for-bfsi",
        "keyword": "deterministic loan underwriting agents for BFSI",
        "key_benefit": "Sub-Second Credit Scoring & RBI Compliance",
        "industry": "BFSI & Lending Institutions",
        "target_persona": "Chief Risk Officers & Credit Heads",
        "youtube_id": "Bf9Ln481g",
        "hero_image": "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
        "timecodes": [
            {
                "time": "00:00 - 00:03",
                "seconds": 0,
                "title": "Exact Spoken Keyword Hook",
                "visual": "Executive credit appraisal memo being generated on screen in seconds.",
                "voiceover": "Why are Indian lenders switching to deterministic loan underwriting agents for BFSI?",
                "caption": "DETERMINISTIC LOAN UNDERWRITING AGENTS FOR BFSI"
            },
            {
                "time": "00:03 - 00:08",
                "seconds": 3,
                "title": "Operational Friction Point",
                "visual": "Stack of 120-page bank statements and GST tax returns with clock ticking 48 hours.",
                "voiceover": "Combing through 120-page bank statements, ITR filings, and GST returns takes credit analysts 48 hours per borrower, losing qualified deals to agile rivals.",
                "caption": "48-HOUR CREDIT DELAYS CAUSE 35% BORROWER DROPOFF"
            },
            {
                "time": "00:08 - 00:18",
                "seconds": 8,
                "title": "Deterministic Architecture Mechanism",
                "visual": "Vision-language parsing pipeline cross-referencing GST returns against banking ledger credits.",
                "voiceover": "Elesium's LangGraph cluster parses financial PDFs, cross-checks declared revenue against GST portal data, and computes debt-service coverage ratios deterministically.",
                "caption": "FINANCIAL VLM + LANGGRAPH // SOVEREIGN VPC"
            },
            {
                "time": "00:18 - 00:26",
                "seconds": 18,
                "title": "Quantitative Case Study Metrics",
                "visual": "Metrics reveal: 18-minute cycle time, 99.4% accuracy, 3.8x audited cash-flow ROI.",
                "voiceover": "Compresses underwriting turnaround from 48 hours to 18 minutes with 99.4% data extraction accuracy and a verified 3.8x 90-day ROI.",
                "caption": "48 HOURS DOWN TO 18 MINS // 3.8x CASH-FLOW ROI"
            },
            {
                "time": "00:26 - 00:30",
                "seconds": 26,
                "title": "Frictionless Conversion Action",
                "visual": "Avatar with direct gaze pointing to booking portal.",
                "voiceover": "Originate loans 3x faster with sovereign AI at elesium.online.",
                "caption": "BOOK UNDERWRITING AUDIT // ELESIUM.ONLINE"
            }
        ],
        "roi_metrics": [
            {"label": "Cycle Time", "value": "18 Mins", "detail": "Down from 48 hours", "color": "#00D7FF"},
            {"label": "Extraction Fidelity", "value": "99.4%", "detail": "Multi-page financial OCR", "color": "#10C387"},
            {"label": "Origination Boost", "value": "3.2x", "detail": "Without headcount add", "color": "#C387FF"},
            {"label": "Audited ROI", "value": "3.8x", "detail": "Delivered in 90 days", "color": "#FBBF24"}
        ],
        "architecture_stages": [
            {
                "stage": "Stage 01",
                "name": "Financial Document OCR Ingestion",
                "bullets": [
                    "High-throughput parallel OCR of 100+ page PDF packages",
                    "Custom Vision-Language extraction correcting noise, stamps, and rotation",
                    "Extraction of bank credits, debits, GST filings, and ITR schedules into typed schemas"
                ],
                "techStack": "FastAPI • LayoutLMv3 • PyMuPDF • Redis"
            },
            {
                "stage": "Stage 02",
                "name": "Deterministic Cross-Verification Triad",
                "bullets": [
                    "Cross-reconciliation of declared sales in GSTR-3B against actual bank deposits",
                    "Banking velocity analysis identifying circular transactions and inflated turnover",
                    "Automated debt service coverage ratio (DSCR) and current ratio calculation"
                ],
                "techStack": "LangGraph • DuckDB • Python 3.12 • PostgreSQL"
            },
            {
                "stage": "Stage 03",
                "name": "Institutional CAM Synthesis & LMS Sync",
                "bullets": [
                    "Deterministic generation of institutional Credit Appraisal Memos (CAMs)",
                    "Direct source-document bounding box linking for instant credit officer review",
                    "Two-phase commit writeback to FinnOne and core lending systems"
                ],
                "techStack": "FinnOne API • React Approval Portal • PDFKit • Sovereign VPC"
            }
        ]
    },
    {
        "id": "sfv-8",
        "slug": "predictive-maintenance-multi-agent-systems-for-manufacturing-plants",
        "keyword": "predictive maintenance multi-agent systems for manufacturing plants",
        "key_benefit": "Vibration Telemetry Analysis & Zero Unplanned Downtime",
        "industry": "Industrial Manufacturing & CNC Plants",
        "target_persona": "Plant Operations Directors & Chief Engineers",
        "youtube_id": "Mn8Kp103h",
        "hero_image": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
        "timecodes": [
            {
                "time": "00:00 - 00:03",
                "seconds": 0,
                "title": "Exact Spoken Keyword Hook",
                "visual": "Heavy industrial CNC spindle running at high speed with vibration overlay.",
                "voiceover": "Deploy predictive maintenance multi-agent systems for manufacturing plants before critical lines fail.",
                "caption": "PREDICTIVE MAINTENANCE MULTI-AGENT SYSTEMS"
            },
            {
                "time": "00:03 - 00:08",
                "seconds": 3,
                "title": "Operational Friction Point",
                "visual": "Red emergency stop flashing on factory floor with idle assembly conveyor.",
                "voiceover": "An unexpected CNC spindle seizure or boiler failure halts the entire line, costing up to ₹8 Lakhs per hour in unrecoverable factory downtime.",
                "caption": "UNEXPECTED SPINDLE FAILURE = ₹8L/HR FACTORY LOSS"
            },
            {
                "time": "00:08 - 00:18",
                "seconds": 8,
                "title": "Deterministic Architecture Mechanism",
                "visual": "Edge inference device mounted on factory machine analyzing vibration spectrum.",
                "voiceover": "Elesium deploys localized edge inference agents analyzing PLC telemetry, vibration frequency spikes, and acoustic sensors inside your on-premise industrial network.",
                "caption": "EDGE PLC TELEMETRY // LOCALIZED INFERENCE"
            },
            {
                "time": "00:18 - 00:26",
                "seconds": 18,
                "title": "Quantitative Case Study Metrics",
                "visual": "Plant manager dashboard showing 72-hour early anomaly notice and 84% downtime cut.",
                "voiceover": "Detects mechanical anomalies 72 hours before failure, cuts unplanned assembly downtime by 84%, and delivers 4.2x capital payback.",
                "caption": "72-HOUR ANOMALY NOTICE // 84% DOWNTIME CUT"
            },
            {
                "time": "00:26 - 00:30",
                "seconds": 26,
                "title": "Frictionless Conversion Action",
                "visual": "Avatar beside industrial plant blueprint with direct link.",
                "voiceover": "Protect your factory throughput with sovereign AI at elesium.online.",
                "caption": "PREVENT LINE DOWNTIME // ELESIUM.ONLINE"
            }
        ],
        "roi_metrics": [
            {"label": "Anomaly Warning", "value": "72 Hours", "detail": "Pre-failure bearing alert", "color": "#00D7FF"},
            {"label": "Downtime Cut", "value": "84%", "detail": "Near-zero line stoppages", "color": "#10C387"},
            {"label": "Capital Payback", "value": "4.2x", "detail": "Prevented line seizures", "color": "#C387FF"},
            {"label": "Sensor Sampling", "value": "10 kHz", "detail": "High-frequency edge FFT", "color": "#FBBF24"}
        ],
        "architecture_stages": [
            {
                "stage": "Stage 01",
                "name": "Edge SCADA & PLC Telemetry Ingestion",
                "bullets": [
                    "High-speed 10 kHz vibration, thermal, and acoustic telemetry capture",
                    "Direct Modbus TCP, OPC-UA, and MQTT protocol ingestion",
                    "Local ring buffer retaining high-resolution waveforms during anomaly spikes"
                ],
                "techStack": "Modbus TCP • OPC-UA • Edge C++ • Redis"
            },
            {
                "stage": "Stage 02",
                "name": "Harmonic Fast-Fourier Degradation Engine",
                "bullets": [
                    "Fast Fourier Transform (FFT) decomposing harmonics and bearing ball-pass frequencies",
                    "Edge neural classifier detecting micro-pitting, unbalance, and lubrication loss",
                    "Deterministic alarm thresholds preventing false-positive maintenance dispatches"
                ],
                "techStack": "TensorRT • SciPy • ONNX Runtime • Python 3.12"
            },
            {
                "stage": "Stage 03",
                "name": "Automated Work-Order & SAP PM Sync",
                "bullets": [
                    "Automatic generation of maintenance work orders inside SAP Plant Maintenance (PM)",
                    "Reserve required replacement parts in inventory before the scheduled shift",
                    "Dispatch mobile alerting to plant technicians with exact torque and repair steps"
                ],
                "techStack": "SAP PM OData • Twilio • PostgreSQL • Grafana"
            }
        ]
    },
    {
        "id": "sfv-9",
        "slug": "computer-vision-defect-inspection-agents-for-automotive-suppliers",
        "keyword": "computer vision defect inspection agents for automotive suppliers",
        "key_benefit": "Sub-Millimeter Surface Defect Classification",
        "industry": "Automotive & Precision Tier-1 Manufacturing",
        "target_persona": "Automotive Quality Assurance Directors",
        "youtube_id": "Cv9Mo204i",
        "hero_image": "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
        "timecodes": [
            {
                "time": "00:00 - 00:03",
                "seconds": 0,
                "title": "Exact Spoken Keyword Hook",
                "visual": "Precision automotive engine block passing beneath high-speed camera array with bounding box flashes.",
                "voiceover": "These are computer vision defect inspection agents for automotive suppliers targeting zero-defect manufacturing.",
                "caption": "COMPUTER VISION DEFECT INSPECTION AGENTS"
            },
            {
                "time": "00:03 - 00:08",
                "seconds": 3,
                "title": "Operational Friction Point",
                "visual": "Rejected pallet of parts returning from OEM automaker with high cost-chargeback stamp.",
                "voiceover": "Manual visual QC inspections miss microscopic weld fissures and micro-scratches under shift fatigue, triggering catastrophic OEM part rejections.",
                "caption": "FATIGUE MISSES DEFECTS // OEM REJECTIONS TRIGGERED"
            },
            {
                "time": "00:08 - 00:18",
                "seconds": 8,
                "title": "Deterministic Architecture Mechanism",
                "visual": "TensorRT vision model isolating 0.05mm porosity defect on live conveyor in 45 milliseconds.",
                "voiceover": "Elesium connects high-speed industrial gigabit cameras to edge TensorRT vision models, classifying surface defects at sub-millimeter precision in 45 milliseconds per part.",
                "caption": "45MS TENSORRT VISION // SUB-MILLIMETER QC"
            },
            {
                "time": "00:18 - 00:26",
                "seconds": 18,
                "title": "Quantitative Case Study Metrics",
                "visual": "Quality metrics showing defect escape rate below 0.002% and ₹14 Lakhs saved in monthly scrap.",
                "voiceover": "Reduces OEM defect escape rate to under 0.002%, eliminates ₹14 Lakhs in monthly scrap waste, and speeds line inspection by 300%.",
                "caption": "0.002% DEFECT ESCAPE // ₹14L SCRAP SAVED MONTHLY"
            },
            {
                "time": "00:26 - 00:30",
                "seconds": 26,
                "title": "Frictionless Conversion Action",
                "visual": "Avatar with automotive engineering diagram and CTA.",
                "voiceover": "Achieve zero-defect automotive production at elesium.online.",
                "caption": "INSPECT PRODUCTION LINE // ELESIUM.ONLINE"
            }
        ],
        "roi_metrics": [
            {"label": "Defect Escape", "value": "<0.002%", "detail": "Near-zero OEM defect return", "color": "#00D7FF"},
            {"label": "Inspection Speed", "value": "45ms", "detail": "Inline conveyor evaluation", "color": "#10C387"},
            {"label": "Monthly Scrap Cut", "value": "₹14L", "detail": "Immediate defect sorting", "color": "#C387FF"},
            {"label": "Throughput Boost", "value": "300%", "detail": "Triple line inspection speed", "color": "#FBBF24"}
        ],
        "architecture_stages": [
            {
                "stage": "Stage 01",
                "name": "High-Speed Optical Ingestion",
                "bullets": [
                    "Multi-angle Gigabit Ethernet (GigE) industrial camera synchronization",
                    "Strobe LED lighting control synced to conveyor encoder pulses",
                    "Sub-10ms raw image capture and hardware Bayer demosaicing"
                ],
                "techStack": "Basler GigE Cameras • GenICam SDK • C++ • CUDA"
            },
            {
                "stage": "Stage 02",
                "name": "TensorRT Sub-Millimeter Defect Classifier",
                "bullets": [
                    "Custom YOLOv10 and segmentation models quantized to FP8 precision",
                    "Classification of micro-cracks, porosity voids, and thread misalignments",
                    "Sub-45ms total pipeline latency from camera trigger to classification"
                ],
                "techStack": "TensorRT 10 • NVIDIA Jetson Orin • OpenCV • Python 3.12"
            },
            {
                "stage": "Stage 03",
                "name": "Pneumatic Rejection & Statistical Process Control",
                "bullets": [
                    "Sub-millisecond digital I/O trigger to pneumatic solenoid part ejector",
                    "Real-time Statistical Process Control (SPC) charting with Cp/Cpk trend calculation",
                    "Automatic feedback alert to upstream die-casting or stamping machines"
                ],
                "techStack": "Beckhoff PLC • OPC-UA • PostgreSQL • Grafana Dashboard"
            }
        ]
    },
    {
        "id": "sfv-10",
        "slug": "prior-authorization-automation-software-for-healthcare-ctos",
        "keyword": "prior authorization automation software for healthcare CTOs",
        "key_benefit": "Clinical Guidelines Verification & Sub-Hour Claims Decisioning",
        "industry": "Healthcare Systems & Clinical Providers",
        "target_persona": "Healthcare CTOs & Revenue Cycle VPs",
        "youtube_id": "Hc8Pz305j",
        "hero_image": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
        "timecodes": [
            {
                "time": "00:00 - 00:03",
                "seconds": 0,
                "title": "Exact Spoken Keyword Hook",
                "visual": "Modern hospital administration center with clinical EHR interface on screen.",
                "voiceover": "Experience prior authorization automation software for healthcare CTOs that clears claims in minutes.",
                "caption": "PRIOR AUTHORIZATION AUTOMATION SOFTWARE"
            },
            {
                "time": "00:03 - 00:08",
                "seconds": 3,
                "title": "Operational Friction Point",
                "visual": "Clinical nurse coordinator overwhelmed with paper fax stacks and payer phone hold music.",
                "voiceover": "Clinical staff burn 20 hours a week on telephone hold with insurance payers while delayed approvals postpone urgent surgical procedures.",
                "caption": "DELAYED SURGERIES & 20 HRS ON PAYER HOLD"
            },
            {
                "time": "00:08 - 00:18",
                "seconds": 8,
                "title": "Deterministic Architecture Mechanism",
                "visual": "Air-gapped clinical NLP engine cross-checking medical necessity against ICD-10 rules.",
                "voiceover": "Elesium's air-gapped HIPAA and DPDP compliant agents parse clinical notes, cross-reference ICD-10 medical necessity codes, and format payer submission packets autonomously.",
                "caption": "AIR-GAPPED CLINICAL PARSING // ICD-10 CHECKS"
            },
            {
                "time": "00:18 - 00:26",
                "seconds": 18,
                "title": "Quantitative Case Study Metrics",
                "visual": "Revenue cycle dashboard showing 42-minute turnaround and 81% reduction in denials.",
                "voiceover": "Slashes approval turnaround from 7 days to 42 minutes, cuts administrative denial appeals by 81%, and recovers ₹26 Lakhs in billing leakage.",
                "caption": "7 DAYS TO 42 MINS // 81% FEWER DENIALS"
            },
            {
                "time": "00:26 - 00:30",
                "seconds": 26,
                "title": "Frictionless Conversion Action",
                "visual": "Avatar with hospital network security badge and direct link.",
                "voiceover": "Automate clinical prior authorization securely at elesium.online.",
                "caption": "AUTOMATE HEALTHCARE // ELESIUM.ONLINE"
            }
        ],
        "roi_metrics": [
            {"label": "Approval Speed", "value": "42 Mins", "detail": "Down from 7-day delays", "color": "#00D7FF"},
            {"label": "Denial Appeals", "value": "-81%", "detail": "Pre-submission guideline check", "color": "#10C387"},
            {"label": "Billing Recovery", "value": "₹26L/mo", "detail": "Zero lost procedure revenue", "color": "#C387FF"},
            {"label": "Data Compliance", "value": "100%", "detail": "Air-gapped HIPAA & DPDP", "color": "#FBBF24"}
        ],
        "architecture_stages": [
            {
                "stage": "Stage 01",
                "name": "EHR & Clinical Note Parsing",
                "bullets": [
                    "HL7 FHIR API integration reading progress notes and physician orders",
                    "Air-gapped clinical NLP extracting diagnoses, lab values, and medication history",
                    "Automated de-identification and zero data retention outside hospital perimeter"
                ],
                "techStack": "FHIR REST API • PyMuPDF • Med-BERT • Redis"
            },
            {
                "stage": "Stage 02",
                "name": "Deterministic Medical Necessity Matcher",
                "bullets": [
                    "LangGraph agentic graph comparing clinical evidence to CMS and payer guidelines",
                    "Automated ICD-10 and CPT coding verification with clinical rule gates",
                    "Confidence scoring flagging edge cases for senior physician sign-off"
                ],
                "techStack": "LangGraph • Pydantic v2 • DuckDB • Sovereign VPC"
            },
            {
                "stage": "Stage 03",
                "name": "Payer EDI Dispatch & Real-Time Polling",
                "bullets": [
                    "Automated packaging and transmission of ANSI X12 278 authorization requests",
                    "Continuous automated polling of payer clearinghouses for approval status",
                    "Real-time EHR writeback updating scheduled procedure status"
                ],
                "techStack": "X12 278 EDI Gateway • REST Webhooks • PostgreSQL • Epic/Cerner API"
            }
        ]
    },
    {
        "id": "sfv-11",
        "slug": "enterprise-ai-roi-calculator",
        "keyword": "enterprise AI ROI calculator",
        "key_benefit": "Model Labor Savings & Capital Payback",
        "industry": "Enterprise Architecture & Financial Modeling",
        "target_persona": "Enterprise CFOs, CIOs & Digital Transformation VPs",
        "youtube_id": "Ro1C4196k",
        "hero_image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        "timecodes": [
            {
                "time": "00:00 - 00:03",
                "seconds": 0,
                "title": "Exact Spoken Keyword Hook",
                "visual": "Interactive ROI calculator tool on screen with dynamic slider adjustments in real-time.",
                "voiceover": "Use our free enterprise AI ROI calculator to see your exact 3-year savings.",
                "caption": "ENTERPRISE AI ROI CALCULATOR // 3-YEAR TCO MODEL"
            },
            {
                "time": "00:03 - 00:08",
                "seconds": 3,
                "title": "Operational Friction Point",
                "visual": "CFO looking over massive IT software budget filled with expensive, unused monthly SaaS seats.",
                "voiceover": "CXOs are tired of vague AI hype with zero balance-sheet accountability, paying millions for bloated SaaS seats with no verified business return.",
                "caption": "TIRED OF VAGUE HYPE & BLOATED SAAS SEATS"
            },
            {
                "time": "00:08 - 00:18",
                "seconds": 8,
                "title": "Deterministic Architecture Mechanism",
                "visual": "Calculator engine computing headcount, salary benchmarks, and sovereign VPC savings curves.",
                "voiceover": "The Elesium calculator models your team size, salary benchmarks, and error rates against sovereign VPC multi-agent pods with zero per-seat markup.",
                "caption": "DETERMINISTIC 3-YEAR TCO // ZERO PER-SEAT SEATS"
            },
            {
                "time": "00:18 - 00:26",
                "seconds": 18,
                "title": "Quantitative Case Study Metrics",
                "visual": "Summary card revealing ₹48 Lakhs annual savings, 4.1-month payback, and 3.8x net ROI.",
                "voiceover": "Identifies an average of ₹48 Lakhs in recoverable annual labor, models a 4.1-month capital payback, and yields 3.8x net ROI over 3 years.",
                "caption": "₹48L LABOR SAVED // 4.1-MONTH BREAKEVEN"
            },
            {
                "time": "00:26 - 00:30",
                "seconds": 26,
                "title": "Frictionless Conversion Action",
                "visual": "Avatar with direct pointer to URL: elesium.online/tools/enterprise-ai-roi-calculator.",
                "voiceover": "Calculate your enterprise AI payback right now at elesium.online/tools/enterprise-ai-roi-calculator.",
                "caption": "RUN ROI CALCULATOR // ELESIUM.ONLINE"
            }
        ],
        "roi_metrics": [
            {"label": "Annual Savings", "value": "₹48.6L", "detail": "Average team labor saved", "color": "#00D7FF"},
            {"label": "Payback Period", "value": "4.1 Mo", "detail": "Capital breakeven horizon", "color": "#10C387"},
            {"label": "3-Year Multiple", "value": "3.8x", "detail": "Net return on sovereign AI", "color": "#C387FF"},
            {"label": "SaaS Markup", "value": "0%", "detail": "Zero per-user monthly fees", "color": "#FBBF24"}
        ],
        "architecture_stages": [
            {
                "stage": "Stage 01",
                "name": "Team & Error Parameter Ingestion",
                "bullets": [
                    "Input validation for team FTE size, monthly compensation, and error rates",
                    "Industry sector benchmarking across Logistics, BFSI, Manufacturing, and Healthcare",
                    "Multi-currency support for INR (₹) and USD ($) capital budgeting"
                ],
                "techStack": "React • TypeScript • Tailwind CSS • Pydantic Math"
            },
            {
                "stage": "Stage 02",
                "name": "Deterministic TCO & Payback Engine",
                "bullets": [
                    "Mathematical modeling of Year 1 to Year 3 total cost of ownership (TCO)",
                    "Comparison of manual labor, legacy SaaS licensing, and sovereign VPC pods",
                    "Deterministic payback breakeven calculation down to fractional months"
                ],
                "techStack": "Financial Math Engine • Pure TypeScript • Zero External API Drift"
            },
            {
                "stage": "Stage 03",
                "name": "Executive Dossier & Boardroom Export",
                "bullets": [
                    "One-click CSV financial summary export formatted for CFOs and Controllers",
                    "Embeddable iframe snippet with responsive container query layout",
                    "Direct routing to WhatsApp Engineering Desk for sovereign VPC architecture scoping"
                ],
                "techStack": "CSV Generator • Iframe Embed API • WhatsApp Business API"
            }
        ]
    }
]

def build_verbatim_transcript(video: Dict[str, Any]) -> str:
    """Builds a continuous, word-for-word verbatim transcript from the second-by-second voiceover cues."""
    lines = [tc["voiceover"] for tc in video["timecodes"]]
    return " ".join(lines)

def build_video_schema(video: Dict[str, Any], transcript: str) -> Dict[str, Any]:
    """Generates complete VideoObject Schema conforming to Google Search Central standards."""
    slug = video["slug"]
    keyword = video["keyword"]
    benefit = video["key_benefit"]
    title = f"{keyword.title()} — {benefit} | Elesium"
    description = (
        f"A 30-second technical architecture breakdown of {keyword} for enterprise leaders. "
        f"Covers operational friction, deterministic LangGraph state machines in sovereign private VPCs, "
        f"and audited balance-sheet ROI metrics."
    )

    return {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "@id": f"https://elesium.online/videos/{slug}#video",
        "name": title,
        "description": description,
        "thumbnailUrl": [
            f"https://elesium.online/video_thumbnails/{slug}.jpg",
            video["hero_image"],
            "https://elesium.online/og-image.png"
        ],
        "uploadDate": "2026-10-19T08:00:00Z",
        "duration": "PT30S",
        "contentUrl": f"https://elesium.online/videos/{slug}.mp4",
        "embedUrl": f"https://elesium.online/embed/videos/{slug}",
        "transcript": transcript,
        "publisher": {
            "@type": "Organization",
            "name": "Elesium",
            "url": "https://elesium.online",
            "logo": {
                "@type": "ImageObject",
                "url": "https://elesium.online/favicon.png"
            }
        },
        "hasPart": [
            {
                "@type": "Clip",
                "name": tc["title"],
                "startOffset": tc["seconds"],
                "endOffset": tc["seconds"] + (3 if idx == 0 else 5 if idx == 1 else 10 if idx == 2 else 8 if idx == 3 else 4),
                "url": f"https://elesium.online/videos/{slug}?t={tc['seconds']}"
            }
            for idx, tc in enumerate(video["timecodes"])
        ]
    }

def generate_video_script_markdown(video: Dict[str, Any]) -> str:
    """Generates full production markdown document for Chad Michael avatar rendering and Video SEO."""
    keyword = video["keyword"]
    benefit = video["key_benefit"]
    slug = video["slug"]
    industry = video["industry"]
    persona = video["target_persona"]
    title = f"{keyword.title()} — {benefit} | Elesium"
    transcript = build_verbatim_transcript(video)
    schema = build_video_schema(video, transcript)

    # Build second-by-second markdown table
    table_rows = []
    for tc in video["timecodes"]:
        row = (
            f"| **{tc['time']}** | {tc['visual']} | *\"{tc['voiceover']}\"* | **{tc['caption']}** |"
        )
        table_rows.append(row)
    table_content = "\n".join(table_rows)

    # Format YouTube Shorts & TikTok metadata
    yt_description = f"""Watch this 30-second technical architecture breakdown of {keyword} for enterprise leaders.

FULL VERBATIM TRANSCRIPT:
{transcript}

KEY MOMENTS & TIMESTAMPS:
00:00 - {keyword} (Exact Spoken Hook)
00:03 - Enterprise Operational Friction
00:08 - Deterministic LangGraph & Sovereign VPC Architecture
00:18 - Audited Production Case Study Metrics
00:26 - Frictionless Architecture Audit Call-to-Action

DEPLOY SOVEREIGN ENTERPRISE AI:
Explore production solutions: https://elesium.online/solutions/{slug}
Interactive Architecture Video Vault: https://elesium.online/videos/{slug}
Direct Engineering Desk on WhatsApp: https://elesium.online/waitlist

#{keyword.replace(' ', '')} #LangGraph #FastAPI #PrivateVPC #EnterpriseAI #{industry.replace(' ', '').replace('&', '')} #Elesium"""

    return f"""# 30-Second Short-Form Video Script: {title}

**Target Keyword:** `{keyword}`  
**Key Benefit:** `{benefit}`  
**Target Duration:** Exactly 30.0 Seconds  
**Industry Vertical:** `{industry}`  
**Target Persona:** `{persona}`  
**Channel Format:** 9:16 Vertical Video (YouTube Shorts, TikTok, Instagram Reels, LinkedIn Video)  
**Conversion Destination:** Sovereign Architecture Audit (`https://elesium.online/solutions/{slug}`)  

---

## Second-by-Second Production Blueprint (Chad Michael Framework)

| Timecode | Visual Segment | Spoken Voiceover (High-Ticket Authority) | On-Screen Text Graphic |
| :--- | :--- | :--- | :--- |
{table_content}

---

## YouTube Shorts & TikTok SEO Metadata (Edward Sturm Descript Model)

### Video Title
`{title}`

### Description Box (Word-for-Word Transcript Indexed for Google Video Search)
```text
{yt_description}
```

### Video Tags & Entities
`{keyword}`, `{benefit}`, `LangGraph`, `FastAPI`, `Private VPC`, `Sovereign AI`, `DPDP Act 2023`, `Enterprise AI Automation`, `{industry}`, `Elesium`

---

## Chad Michael Avatar Consistency Lock

{AVATAR_CONSISTENCY_RECIPE}

---

## Embedded VideoObject Schema (Google Search Central Validated)

```json
{json.dumps(schema, indent=2)}
```
"""

def generate_all_scripts(output_dir: Path = SCRIPTS_DIR) -> List[Path]:
    """Generates all 11 short-form video scripts and outputs JSON manifest."""
    output_dir.mkdir(parents=True, exist_ok=True)
    generated_files = []
    manifest_records = []

    print(f"🎬 Generating 30-Second Short-Form Video Scripts in: {output_dir}")
    print("=" * 70)

    for video in VIDEO_SPECIFICATIONS:
        slug = video["slug"]
        file_path = output_dir / f"{slug}.md"
        content = generate_video_script_markdown(video)
        file_path.write_text(content, encoding="utf-8")
        generated_files.append(file_path)

        transcript = build_verbatim_transcript(video)
        schema = build_video_schema(video, transcript)

        manifest_records.append({
            "id": video["id"],
            "slug": video["slug"],
            "keyword": video["keyword"],
            "key_benefit": video["key_benefit"],
            "industry": video["industry"],
            "target_persona": video["target_persona"],
            "title": f"{video['keyword'].title()} — {video['key_benefit']} | Elesium",
            "duration": "0:30",
            "durationIso": "PT30S",
            "uploadDate": "2026-10-19T08:00:00Z",
            "youtubeId": video["youtube_id"],
            "heroImage": video["hero_image"],
            "transcript": transcript,
            "schema": schema,
            "timecodes": video["timecodes"],
            "roiMetrics": video["roi_metrics"],
            "architectureStages": video["architecture_stages"]
        })

        print(f"  [OK] Generated {file_path.name} ({video['keyword']})")

def sync_frontend_data(output_file: Path = FRONTEND_DATA_FILE):
    """Synchronizes videoMasterclasses.ts in frontend with the deep masterclasses and all short-form videos."""
    short_entries = []
    for v in VIDEO_SPECIFICATIONS:
        transcript = build_verbatim_transcript(v)
        title = f"{v['keyword'].title()} — {v['key_benefit']} | Elesium"
        
        # Build keyMoments matching the 5 second-by-second stages
        km_list = [
            {
                "time": tc["time"].split(" - ")[0],
                "seconds": tc["seconds"],
                "title": tc["title"],
                "description": tc["voiceover"]
            }
            for tc in v["timecodes"]
        ]
        
        summary = (
            f"A 30-second technical architecture breakdown of {v['keyword']} for enterprise leaders. "
            f"Covers operational friction, deterministic LangGraph state machines in sovereign private VPCs, "
            f"and audited balance-sheet ROI metrics."
        )

        entry = {
            "id": v["id"],
            "slug": v["slug"],
            "title": title,
            "youtubeId": v["youtube_id"],
            "duration": "0:30",
            "durationIso": "PT30S",
            "uploadDate": "2026-10-19T08:00:00+05:30",
            "industry": v["industry"],
            "category": "30s Short-Form Breakdown",
            "videoType": "short",
            "keyword": v["keyword"],
            "keyBenefit": v["key_benefit"],
            "heroImage": v["hero_image"],
            "targetPersona": v["target_persona"],
            "executiveSummary": summary,
            "roiMetrics": v["roi_metrics"],
            "keyMoments": km_list,
            "architectureStages": v["architecture_stages"],
            "timecodes": v["timecodes"],
            "fullTranscript": transcript
        }
        short_entries.append(entry)

    ts_head = """export interface KeyMoment {
    time: string;
    seconds: number;
    title: string;
    description: string;
}

export interface ArchitectureStage {
    stage: string;
    name: string;
    bullets: string[];
    techStack: string;
}

export interface RoiMetric {
    label: string;
    value: string;
    detail: string;
    color: string;
}

export interface VideoTimecode {
    time: string;
    seconds: number;
    title: string;
    visual: string;
    voiceover: string;
    caption: string;
}

export interface VideoMasterclass {
    id: string;
    slug: string;
    title: string;
    youtubeId: string;
    duration: string;
    durationIso: string;
    uploadDate: string;
    industry: string;
    category: string;
    executiveSummary: string;
    roiMetrics: RoiMetric[];
    keyMoments: KeyMoment[];
    architectureStages: ArchitectureStage[];
    fullTranscript: string;
    videoType?: 'short' | 'masterclass';
    keyword?: string;
    keyBenefit?: string;
    heroImage?: string;
    targetPersona?: string;
    timecodes?: VideoTimecode[];
}

export const videoMasterclasses: VideoMasterclass[] = [
    {
        id: "vm-1",
        slug: "enterprise-ai-automation-india-2026",
        title: "Enterprise AI Automation in India: Architecting Deterministic Multi-Agent Systems in Sovereign VPCs",
        youtubeId: "dQw4w9WgXcQ",
        duration: "24:18",
        durationIso: "PT24M18S",
        uploadDate: "2026-03-15T09:00:00+05:30",
        industry: "Enterprise Engineering & BFSI",
        category: "System Architecture",
        videoType: "masterclass",
        heroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
        executiveSummary: "A comprehensive architectural teardown of how Indian enterprises are moving away from fragile prompt wrappers and monolithic RPA bots toward deterministic, multi-agent state machines deployed inside private, zero-retention cloud VPCs. This session covers state reconciliation, DPDP Act 2023 compliance, and achieving balance sheet cash-flow ROI in 90 days.",
        roiMetrics: [
            { label: "Turnaround Cut", value: "65%", detail: "From 48h to 18 mins", color: "#00D7FF" },
            { label: "Audited ROI", value: "3.8x", detail: "Delivered in 90 days", color: "#10C387" },
            { label: "Data Leakage", value: "0%", detail: "Sovereign VPC boundary", color: "#C387FF" },
            { label: "Production SLA", value: "99.9%", detail: "Deterministic LangGraph", color: "#FBBF24" }
        ],
        keyMoments: [
            { time: "00:00", seconds: 0, title: "The Enterprise AI Trap: Why Prompt Wrappers Fail", description: "Why probabilistic chat tools create compounding errors when exposed to enterprise ERPs and accounting databases." },
            { time: "04:12", seconds: 252, title: "Deterministic State Machines vs Autonomous Drifting", description: "How LangGraph DAGs enforce hard contractual guardrails and human-in-the-loop exception routing." },
            { time: "09:45", seconds: 585, title: "Sovereign VPC Deployments & India DPDP Act 2023", description: "Architecting zero-retention inference pipelines with on-premise embeddings and private model weights." },
            { time: "16:30", seconds: 990, title: "Legacy Core Integration: SAP S/4HANA & Core Banking", description: "Live execution hooks bridging modern agentic protocols with legacy SOAP, REST, and SQL architectures." },
            { time: "21:05", seconds: 1265, title: "Calculating the 90-Day Cash-Flow Velocity ROI", description: "How CXOs structure capital allocation to achieve 3x–5x net return on engineering investment." }
        ],
        architectureStages: [
            {
                stage: "Stage 01",
                name: "Sovereign Ingestion Gateway",
                bullets: [
                    "Multi-tenant API Gateway with TLS 1.3 mutual authentication",
                    "Vision-Language parsing of unstructured financial & legal PDFs",
                    "DPDP Act 2023 compliance filter with automated PII tokenization"
                ],
                techStack: "FastAPI • PyMuPDF • Private VLM • Redis"
            },
            {
                stage: "Stage 02",
                name: "Deterministic LangGraph Core",
                bullets: [
                    "Stateful directed acyclic graph (DAG) enforcing rule gates",
                    "Parallel execution agents for cross-statement verification",
                    "Confidence threshold scoring with automated fallback triggers"
                ],
                techStack: "LangGraph • Python 3.12 • Llama 3 70B • Pinecone"
            },
            {
                stage: "Stage 03",
                name: "Enterprise ERP & Database Sync",
                bullets: [
                    "Transactional ACID writeback to SAP S/4HANA & SQL backends",
                    "Immutable audit logging with hash-chained execution logs",
                    "Real-time webhook notifications to executive Slack / Teams"
                ],
                techStack: "SAP OData APIs • PostgreSQL • Kafka • OpenTelemetry"
            }
        ],
        fullTranscript: `[00:00] Welcome to the Elesium Systems Architecture Masterclass. Today, we are breaking down why 90% of enterprise AI projects fail to transition from pilot to production, and the exact architectural blueprint Indian enterprises are deploying to achieve deterministic, cash-flow positive returns.

[01:15] In 2024 and 2025, the market was flooded with prompt wrappers—companies claiming to solve enterprise workflows simply by feeding thousands of tokens into an OpenAI or Anthropic API. But in an enterprise environment—whether you are an NBFC underwriting loans, a manufacturing firm ordering raw materials through SAP, or an insurer handling claims—probabilistic drift is catastrophic. A 98% accuracy rate sounds impressive to a marketer, but to a Chief Risk Officer, a 2% failure rate across 50,000 monthly transactions means 1,000 corrupted entries, compliance penalties, and direct capital loss.

[04:12] This brings us to the core distinction: Probabilistic Generative Models versus Deterministic State Machines. At Elesium, we do not let LLMs make unbound execution decisions. Instead, we use frameworks like LangGraph to construct deterministic state machines. The language model acts merely as a localized parsing or translation node, while the transitions between states, the validation gates, and the business logic are strictly enforced by code.

[07:30] Let's look at the sovereign infrastructure layer. Under India's Digital Personal Data Protection (DPDP) Act of 2023 and RBI data localization directives, sending raw customer financial statements or medical records to third-party public clouds outside Indian borders violates compliance. Our architecture isolates the entire inference pipeline inside a sovereign VPC on AWS Mumbai (ap-south-1) or Azure Central India. Weights are self-hosted or accessed via enterprise zero-data-retention agreements, ensuring that not a single byte of proprietary data leaves the client perimeter.

[12:45] Next is legacy integration. Enterprises do not operate on clean greenfield tech stacks. They run on SAP S/4HANA, Oracle ERP, AS400 mainframes, and on-premise PostgreSQL databases. An agent that cannot reliably read and write to these systems is useless. We build asynchronous event-driven pipelines using Apache Kafka and FastAPI, exposing standardized REST and OData adapters that reconcile transactions with two-phase commit protocols.

[17:20] Finally, let us discuss balance-sheet ROI. When we sit down with managing directors and CFOs, we do not speak about 'hours saved' in the abstract. We map our systems directly to gross margin expansion and working capital recovery. In our BFSI deployments, compressing underwriting turnaround from 48 hours to 18 minutes tripled origination throughput without adding a single headcount, delivering a 3.8x cash-flow ROI within 90 days.

[22:40] If your enterprise is preparing to transition from experimental AI prototypes to sovereign, production-grade agentic infrastructure, review our verified case studies on GoodFirms and Clutch, or schedule an architectural audit with our engineering team at elesium.online.`
    },
    {
        id: "vm-2",
        slug: "langgraph-vs-n8n-enterprise-agents",
        title: "LangGraph vs n8n for Enterprise AI Workflows: Deterministic State Management & Production SLAs",
        youtubeId: "vN93nS1647",
        duration: "18:42",
        durationIso: "PT18M42S",
        uploadDate: "2026-03-20T11:30:00+05:30",
        industry: "Enterprise Software & SaaS",
        category: "Framework Comparison",
        videoType: "masterclass",
        heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        executiveSummary: "A technical comparison between low-code workflow automation tools (n8n, Zapier) and programmatic agentic orchestration frameworks (LangGraph, AutoGen). We analyze error recovery, state persistence, schema verification, and where each framework belongs in a mission-critical enterprise stack.",
        roiMetrics: [
            { label: "Error Recovery", value: "99.9%", detail: "Zero-loss state persistence", color: "#00D7FF" },
            { label: "Execution Latency", value: "<450ms", detail: "Direct Python runtime", color: "#10C387" },
            { label: "Code Ownership", value: "100%", detail: "Zero vendor lock-in", color: "#C387FF" },
            { label: "Cost Efficiency", value: "4.5x", detail: "Compared to per-step SaaS", color: "#FBBF24" }
        ],
        keyMoments: [
            { time: "00:00", seconds: 0, title: "The Low-Code Ceiling: When n8n Hits Enterprise Limits", description: "Why visual DAG builders break under complex multi-branch conditional loops and high-throughput data volumes." },
            { time: "03:50", seconds: 230, title: "LangGraph Architecture: Cycles, State, and Memory", description: "Deep dive into state schemas, checkpointing to PostgreSQL, and resuming execution from failed nodes." },
            { time: "08:15", seconds: 495, title: "Handling Asynchronous Human-in-the-Loop Interrupts", description: "Pausing agent execution cleanly while awaiting senior compliance officer review without thread blocking." },
            { time: "13:20", seconds: 800, title: "Benchmarking Cost and Infrastructure Footprint", description: "Comparing managed low-code licensing costs against private Kubernetes deployments." },
            { time: "16:40", seconds: 1000, title: "The Hybrid Enterprise Strategy", description: "Using n8n for rapid internal utility automation while reserving LangGraph for core revenue-generating systems." }
        ],
        architectureStages: [
            {
                stage: "Stage 01",
                name: "Event & Webhook Routing",
                bullets: [
                    "High-concurrency webhook ingestion with payload schema validation",
                    "HMAC signature verification and rate-limiting middleware",
                    "Persistent queueing in Redis Streams for guaranteed delivery"
                ],
                techStack: "FastAPI • Redis Streams • Pydantic v2"
            },
            {
                stage: "Stage 02",
                name: "Stateful Agentic Graph",
                bullets: [
                    "Cyclical graph execution with state checkpointing to PostgreSQL",
                    "Dynamic tool-calling with semantic retry and exponential backoff",
                    "Strict typing on all inter-agent messages and state transitions"
                ],
                techStack: "LangGraph • PostgreSQL (Asyncpg) • Python 3.12"
            },
            {
                stage: "Stage 03",
                name: "Observability & Alerting",
                bullets: [
                    "Distributed tracing capturing exact token usage and latency",
                    "Real-time LangSmith / OpenTelemetry telemetry exporter",
                    "Automated Slack alerting on anomaly thresholds"
                ],
                techStack: "OpenTelemetry • Prometheus • Grafana • Slack API"
            }
        ],
        fullTranscript: `[00:00] Today we are resolving one of the most contentious debates among enterprise technical architects: Should you build your business workflows with visual automation engines like n8n, or should you deploy programmatic code-first frameworks like LangGraph?

[01:30] Let's be fair: n8n is fantastic for linear automation. If you need to watch a webhook, format a payload, and update HubSpot or Airtable, n8n provides rapid prototyping and clean visual observability. But when you move to mission-critical revenue operations—where an agent must read financial statements, cross-examine multiple databases, recover from partial failures, and handle cyclical loops—visual tools hit an architectural wall.

[05:10] The primary advantage of LangGraph is cyclical execution and stateful checkpointing. Traditional DAGs are linear: node A leads to node B, which leads to node C. But agentic reasoning is iterative. An agent generates a response, validates it against a business rule, realizes there is an inconsistency, and must loop back to re-query the database. LangGraph models workflows as graphs with cycles, persisting state into PostgreSQL after every node execution. If a server restarts midway through a transaction, LangGraph resumes exactly where it stopped.

[10:45] Furthermore, consider the Human-in-the-Loop requirement. In regulated enterprise workflows, you cannot allow an AI system to disburse a 50 Lakh Rupee loan or reorder 20,000 manufacturing components autonomously without human signoff. LangGraph provides native interrupt capabilities: the agent pauses, persists its complete state to the database, emits a review payload to an executive dashboard, and waits. Once the executive approves, execution resumes seamlessly.

[15:30] At Elesium, we take a disciplined hybrid approach. We utilize low-code tools for lightweight internal office utilities, but for core enterprise workflows that impact client revenue and balance-sheet integrity, we exclusively engineer deterministic LangGraph architectures backed by production SLAs.`
    },
    {
        id: "vm-3",
        slug: "bfsi-autonomous-loan-underwriting",
        title: "Autonomous Loan Underwriting Architecture: Processing 100-Page Financial Documents in 18 Minutes",
        youtubeId: "p9s487k211",
        duration: "21:05",
        durationIso: "PT21M05S",
        uploadDate: "2026-03-25T14:00:00+05:30",
        industry: "BFSI & Non-Banking Financial Corporations",
        category: "Case Study & Engineering Breakdown",
        videoType: "masterclass",
        heroImage: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
        executiveSummary: "A technical breakdown of Elesium's production loan underwriting pipeline deployed for an Indian NBFC. Learn how custom Vision-Language extraction models and multi-agent reconciliation cross-verify GST returns, bank statements, and ITR filings to auto-generate Credit Appraisal Memos (CAMs) with audited accuracy.",
        roiMetrics: [
            { label: "Cycle Time", value: "18 Mins", detail: "Down from 48 hours", color: "#00D7FF" },
            { label: "Analyst Hours", value: "12,000h", detail: "Recovered monthly", color: "#10C387" },
            { label: "Accuracy", value: "99.4%", detail: "Field extraction fidelity", color: "#C387FF" },
            { label: "Origination Growth", value: "3x", detail: "Without headcount increase", color: "#FBBF24" }
        ],
        keyMoments: [
            { time: "00:00", seconds: 0, title: "The Underwriting Bottleneck in Indian Lending", description: "Why manual credit appraisal reviews cap loan book expansion and cause severe operational drag." },
            { time: "03:40", seconds: 220, title: "Vision-Language Document Parsing for Complex PDFs", description: "Extracting tabular data from scanned, rotated, and multi-column bank statements with sub-millimeter precision." },
            { time: "08:10", seconds: 490, title: "Deterministic Triad: GST vs Bank Statements vs ITR", description: "Algorithmic cross-verification detecting circular transactions and revenue inflation." },
            { time: "14:15", seconds: 855, title: "Auto-Generating the Comprehensive CAM Report", description: "Synthesizing debt-service coverage ratios (DSCR), leverage ratios, and risk scorecards." },
            { time: "18:30", seconds: 1110, title: "Compliance, Audit Trails, and RBI Regulations", description: "Full transparency and explainability logs ensuring complete regulatory auditability." }
        ],
        architectureStages: [
            {
                stage: "Stage 01",
                name: "Document Ingestion & OCR",
                bullets: [
                    "High-throughput parallel ingestion of 100+ page PDF packages",
                    "Custom VLM OCR correcting perspective, noise, and scan skew",
                    "Structured JSON extraction conforming to strict Pydantic schemas"
                ],
                techStack: "Python • LayoutLMv3 • PyPDF • RabbitMQ"
            },
            {
                stage: "Stage 02",
                name: "Multi-Source Fraud & Audit Engine",
                bullets: [
                    "Cross-reconciliation of declared revenue against GSTR-2A/3B returns",
                    "Banking velocity analysis identifying circular fund routing",
                    "Automated negative list and litigation database screening"
                ],
                techStack: "LangGraph • DuckDB • Scikit-Learn • PostgreSQL"
            },
            {
                stage: "Stage 03",
                name: "CAM Synthesis & Sign-off UI",
                bullets: [
                    "Deterministic generation of institutional Credit Appraisal Memos",
                    "DSCR, Current Ratio, and working capital gap calculations",
                    "Human-in-the-loop executive approval portal with source highlighting"
                ],
                techStack: "React • TailwindCSS • PDFKit • Sovereign VPC"
            }
        ],
        fullTranscript: `[00:00] In commercial lending, speed is the ultimate competitive advantage. When an SME or mid-market enterprise requests a 5 Crore Rupee credit facility, the NBFC or private bank that delivers a verified sanction letter first wins the deal. Yet across India, credit analysts remain bogged down manually combing through 100-page bank statements, balance sheets, and GST filings.

[02:15] In this technical case study, we examine the architecture Elesium engineered for an institutional lending client. Their credit team was spending 48 hours per application simply compiling raw financial inputs into a Credit Appraisal Memo (CAM).

[05:40] Step one is robust ingestion. Financial PDFs in India are notoriously messy—scanned at low resolutions, stamped with watermarks, or formatted in non-standard tabular grids. We deployed a multi-stage Vision-Language extraction pipeline that segments documents into bounding-box coordinates, normalizes rotations, and outputs strongly typed Pydantic models with 99.4% precision.

[09:20] Step two is the cross-verification audit triad. Credit risk is not assessed from a single document. Our LangGraph agent cluster cross-examines three distinct data streams: bank statement credits, GST revenue declarations (GSTR-1 and GSTR-3B), and filed Income Tax Returns (ITR). If a borrower claims 20 Crores in annual revenue, but banking credits only reflect 12 Crores, the reconciliation engine immediately flags the circular transaction pattern and highlights the discrepancy in red.

[15:10] Step three is automated CAM generation. Once cross-validation passes, the system calculates critical debt ratios—Debt Service Coverage Ratio (DSCR), Interest Coverage Ratio, and Maximum Permissible Bank Finance (MPBF)—outputting an executive-ready CAM complete with source document annotations. The credit manager does not have to hunt for numbers; every figure in the memo links directly to the highlighted bounding box in the original bank statement.

[19:00] The outcome: underwriting turnaround was compressed from 48 hours to just 18 minutes. The client recovered 12,000 analyst hours every month, expanded originations by 300% without hiring, and achieved an audited 3.8x cash-flow ROI in the first quarter of deployment.`
    },
    {
        id: "vm-4",
        slug: "ai-automation-cost-india-2026-pricing",
        title: "Enterprise AI Automation Cost in India Explained: 30-Second Architectural Breakdown",
        youtubeId: "dQw4w9WgXcQ",
        duration: "0:30",
        durationIso: "PT30S",
        uploadDate: "2026-10-10T08:00:00+05:30",
        industry: "Enterprise AI & Systems Architecture",
        category: "Pricing & Architectural Economics",
        videoType: "short",
        heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        executiveSummary: "An architectural breakdown of AI automation cost in India for enterprises, comparing pilot sprints, multi-agent suites, and dedicated engineering pods with a hard 90-day cash-flow ROI guarantee.",
        roiMetrics: [
            { label: "Audited ROI", value: "3.5x", detail: "Guaranteed in 90 days", color: "#00D7FF" },
            { label: "Pilot Sprint", value: "₹1.5L - ₹3.5L", detail: "14-day delivery", color: "#10C387" },
            { label: "Data Leakage", value: "0%", detail: "Private sovereign VPC", color: "#C387FF" },
            { label: "Production SLA", value: "99.9%", detail: "Deterministic LangGraph", color: "#FBBF24" }
        ],
        keyMoments: [
            { time: "00:00", seconds: 0, title: "Stop Paying ₹15L for Fragile Wrappers", description: "Why basic Zapier and webhook wrappers break under enterprise API volumes and cause severe operational failure." },
            { time: "00:03", seconds: 3, title: "Legacy Agency Billable Traps vs Deterministic Architecture", description: "How traditional IT agencies quote 4 months of billables when probabilistic workflows fail in production." },
            { time: "00:08", seconds: 8, title: "Deterministic LangGraph Pods in Private VPC", description: "Deploying sovereign multi-agent state machines in private cloud VPCs with zero data retention and DPDP Act compliance." },
            { time: "00:18", seconds: 18, title: "Hard 90-Day Cash-Flow Positive ROI", description: "BFSI and manufacturing enterprises hitting cash-flow positive ROI in under 90 days, guaranteed by production SLAs." },
            { time: "00:26", seconds: 26, title: "Direct WhatsApp AI Engineering Desk", description: "Connecting directly with an AI systems engineer on WhatsApp (+91 8317329312) for an architectural audit." }
        ],
        architectureStages: [
            {
                stage: "Stage 01",
                name: "Private Cloud & Sovereign VPC Ingestion",
                bullets: [
                    "Zero data retention guarantees complying with DPDP Act 2023",
                    "TLS 1.3 encrypted API gateways and enterprise identity verification",
                    "Sovereign AWS Mumbai (ap-south-1) and private VPC network boundaries"
                ],
                techStack: "FastAPI • Redis • AWS ap-south-1 • DPDP Compliance Filter"
            },
            {
                stage: "Stage 02",
                name: "Deterministic LangGraph Execution Pod",
                bullets: [
                    "Stateful cyclical DAG execution preventing probabilistic drift",
                    "Sub-200ms node execution with automatic checkpoint recovery",
                    "Strict Pydantic schema validation on all inter-agent messages"
                ],
                techStack: "LangGraph • Python 3.12 • Llama 3 • PostgreSQL Checkpointing"
            },
            {
                stage: "Stage 03",
                name: "Legacy ERP & Enterprise DB Connectors",
                bullets: [
                    "ACID-compliant writeback to SAP S/4HANA and core databases",
                    "Two-phase commit transaction reconciliation protocols",
                    "Real-time OpenTelemetry distributed tracing and audit logs"
                ],
                techStack: "SAP RFC / OData • PostgreSQL • Apache Kafka • OpenTelemetry"
            }
        ],
        fullTranscript: `[00:00] Stop paying ₹15 Lakhs for Zapier workflows that break on high API volumes. Legacy Indian agencies sell wrappers. When your ERP fails, they quote 4 months of billables.

[00:08] Elesium builds deterministic multi-agent pods in your private cloud with zero data retention. BFSI and manufacturing clients hit cash-flow positive ROI in under 90 days. Guaranteed by SLA.

[00:26] Tap the link to speak directly with an AI systems engineer on WhatsApp.`
    },
"""
    # Format the short_entries JSON and inject
    shorts_ts = json.dumps(short_entries, indent=4)
    # Remove outer brackets to append into videoMasterclasses array
    inner_shorts = shorts_ts[1:-1].strip()
    ts_tail = (
        inner_shorts + "\n];\n\n"
        "export const shortFormVideos: VideoMasterclass[] = videoMasterclasses.filter(v => v.videoType === 'short' || v.duration === '0:30' || v.duration === '00:30');\n"
        "export const deepMasterclasses: VideoMasterclass[] = videoMasterclasses.filter(v => v.videoType === 'masterclass' || v.duration !== '0:30');\n\n"
        "export function getVideoBySlug(slug: string): VideoMasterclass | undefined {\n"
        "    return videoMasterclasses.find(v => v.slug === slug);\n"
        "}\n"
    )
    full_ts_code = ts_head + ts_tail
    total_count = 4 + len(short_entries)
    output_file.parent.mkdir(parents=True, exist_ok=True)
    output_file.write_text(full_ts_code, encoding="utf-8")
    print(f"  [OK] Synchronized Frontend Data -> {output_file.name} ({total_count} total videos)")

def generate_all_scripts(output_dir: Path = SCRIPTS_DIR) -> List[Path]:
    """Generates all 11 short-form video scripts, outputs JSON manifest, and syncs frontend data."""
    output_dir.mkdir(parents=True, exist_ok=True)
    generated_files = []
    manifest_records = []

    print(f"🎬 Generating 30-Second Short-Form Video Scripts in: {output_dir}")
    print("=" * 70)

    for video in VIDEO_SPECIFICATIONS:
        slug = video["slug"]
        file_path = output_dir / f"{slug}.md"
        content = generate_video_script_markdown(video)
        file_path.write_text(content, encoding="utf-8")
        generated_files.append(file_path)

        transcript = build_verbatim_transcript(video)
        schema = build_video_schema(video, transcript)

        manifest_records.append({
            "id": video["id"],
            "slug": video["slug"],
            "keyword": video["keyword"],
            "key_benefit": video["key_benefit"],
            "industry": video["industry"],
            "target_persona": video["target_persona"],
            "title": f"{video['keyword'].title()} — {video['key_benefit']} | Elesium",
            "duration": "0:30",
            "durationIso": "PT30S",
            "uploadDate": "2026-10-19T08:00:00Z",
            "youtubeId": video["youtube_id"],
            "heroImage": video["hero_image"],
            "transcript": transcript,
            "schema": schema,
            "timecodes": video["timecodes"],
            "roiMetrics": video["roi_metrics"],
            "architectureStages": video["architecture_stages"]
        })

        print(f"  [OK] Generated {file_path.name} ({video['keyword']})")

    manifest_file = output_dir / "video_manifest.json"
    manifest_file.write_text(json.dumps(manifest_records, indent=2), encoding="utf-8")
    print(f"  [OK] Exported Master Video Manifest -> {manifest_file.name}")
    
    # Synchronize frontend video data
    sync_frontend_data()

    print("=" * 70)
    print(f"✨ Successfully generated {len(generated_files)} video assets and synced frontend data.")
    return generated_files

def main():
    parser = argparse.ArgumentParser(description="Short-Form Video SEO Factory for Elesium")
    parser.add_argument("--generate-all", action="store_true", help="Generate all 11 short-form video scripts and manifest")
    parser.add_argument("--sync-frontend", action="store_true", help="Synchronize frontend/src/data/videoMasterclasses.ts")
    parser.add_argument("--slug", type=str, help="Generate a single video script by slug")
    parser.add_argument("--list", action="store_true", help="List all supported video targets")
    args = parser.parse_args()

    if args.list:
        print("Available Short-Form Video Targets:")
        for idx, v in enumerate(VIDEO_SPECIFICATIONS, 1):
            print(f"  {idx:02d}. {v['slug']} -> {v['keyword']} ({v['key_benefit']})")
        return

    if args.sync_frontend:
        sync_frontend_data()
        return

    if args.slug:
        matching = [v for v in VIDEO_SPECIFICATIONS if v["slug"] == args.slug]
        if not matching:
            print(f"Error: Slug '{args.slug}' not found in specifications.")
            sys.exit(1)
        video = matching[0]
        SCRIPTS_DIR.mkdir(parents=True, exist_ok=True)
        file_path = SCRIPTS_DIR / f"{video['slug']}.md"
        content = generate_video_script_markdown(video)
        file_path.write_text(content, encoding="utf-8")
        print(f"Generated video script at {file_path}")
        return

    # Default to generate-all if no argument or if --generate-all passed
    generate_all_scripts()

if __name__ == "__main__":
    main()

