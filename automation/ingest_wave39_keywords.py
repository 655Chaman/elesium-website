#!/usr/bin/env python3
"""
Ingests Wave 39 commercial keywords (IDs 1,791 to 1,840, 50 solutions)
into automation/compact_keywords_queue.json.
Adheres strictly to the Edward Sturm B2B plural persona format and Moz score 97 target.
"""

import json
from pathlib import Path

ROOT = Path("/Users/krdeeksha/ELESIUM WEBSITE")
QUEUE_PATH = ROOT / "automation" / "compact_keywords_queue.json"

KEYWORDS_WAVE39 = [
    # Cluster 1: ONDC Beckn Protocol, Retail Multi-Store & FMCG Inventory Telemetry (IDs 1791-1807, 17 items)
    {
        "id": 1791,
        "keyword": "ondc beckn protocol real time catalog synchronization telemetry for multi store retail chains",
        "slug": "ondc-beckn-protocol-real-time-catalog-synchronization-telemetry-for-multi-store-retail-chains",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Omnichannel Retail Directors & Chief Information Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule ONDC Beckn Catalog Sync Audit"
    },
    {
        "id": 1792,
        "keyword": "beckn on search sub 50ms multi buyer app broadcast telemetry for enterprise fmcg distributors",
        "slug": "beckn-on-search-sub-50ms-multi-buyer-app-broadcast-telemetry-for-enterprise-fmcg-distributors",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "FMCG Distribution VPs & Chief Digital Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Beckn On-Search Broadcast Audit"
    },
    {
        "id": 1793,
        "keyword": "distributed inventory stock reservation idempotency telemetry for ondc seller network participants",
        "slug": "distributed-inventory-stock-reservation-idempotency-telemetry-for-ondc-seller-network-participants",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "ONDC Seller Platform Architects & Engineering Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule ONDC Idempotent Reservation Audit"
    },
    {
        "id": 1794,
        "keyword": "sap s4hana retail omnichannel real time stock reconciliation telemetry for department store chains",
        "slug": "sap-s4hana-retail-omnichannel-real-time-stock-reconciliation-telemetry-for-department-store-chains",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Department Store CIOs & SAP Retail Operations Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule SAP S4HANA Retail Sync Audit"
    },
    {
        "id": 1795,
        "keyword": "hyperlocal dark store dead stock predictive liquidation telemetry for quick commerce operators",
        "slug": "hyperlocal-dark-store-dead-stock-predictive-liquidation-telemetry-for-quick-commerce-operators",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Quick Commerce Operations VPs & Category Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Dark Store Liquidation Audit"
    },
    {
        "id": 1796,
        "keyword": "redis bloom filter fast inventory membership verification telemetry for high throughput ecommerce flash sales",
        "slug": "redis-bloom-filter-fast-inventory-membership-verification-telemetry-for-high-throughput-ecommerce-flash-sales",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "E-Commerce Infrastructure Architects & High-Throughput System Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Redis Bloom Filter Flash Sale Audit"
    },
    {
        "id": 1797,
        "keyword": "multichannel b2b wholesale order fulfillment split routing telemetry for national logistics networks",
        "slug": "multichannel-b2b-wholesale-order-fulfillment-split-routing-telemetry-for-national-logistics-networks",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Supply Chain Network VPs & B2B Logistics Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule B2B Order Split Routing Audit"
    },
    {
        "id": 1798,
        "keyword": "retail pos barcode rfid autonomous inventory cross checking telemetry for supermarket franchisees",
        "slug": "retail-pos-barcode-rfid-autonomous-inventory-cross-checking-telemetry-for-supermarket-franchisees",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Supermarket Operations Heads & Regional Franchise Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule POS RFID Inventory Audit"
    },
    {
        "id": 1799,
        "keyword": "ondc logistics provider lsp beckn on track geo telemetry for last mile freight couriers",
        "slug": "ondc-logistics-provider-lsp-beckn-on-track-geo-telemetry-for-last-mile-freight-couriers",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Last-Mile Delivery Directors & Freight Network VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule ONDC LSP Beckn Tracking Audit"
    },
    {
        "id": 1800,
        "keyword": "automated return to origin rto reduction predictive risk telemetry for direct to consumer apparel brands",
        "slug": "automated-return-to-origin-rto-reduction-predictive-risk-telemetry-for-direct-to-consumer-apparel-brands",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "D2C Brand Founders & Supply Chain Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule D2C RTO Risk Reduction Audit"
    },
    {
        "id": 1801,
        "keyword": "fmcg trade promotion margin optimization telemetry for consumer goods category managers",
        "slug": "fmcg-trade-promotion-margin-optimization-telemetry-for-consumer-goods-category-managers",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "FMCG Category Managers & Commercial Strategy Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule FMCG Trade Promotion Audit"
    },
    {
        "id": 1802,
        "keyword": "enterprise warehouse slotting algorithmic relocation telemetry for regional fulfillment centers",
        "slug": "enterprise-warehouse-slotting-algorithmic-relocation-telemetry-for-regional-fulfillment-centers",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Fulfillment Center General Managers & Logistics Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Warehouse Slotting Audit"
    },
    {
        "id": 1803,
        "keyword": "ondc settlement and grievance resolution automation telemetry for retail marketplace aggregators",
        "slug": "ondc-settlement-and-grievance-resolution-automation-telemetry-for-retail-marketplace-aggregators",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Marketplace Operations Heads & Trust and Safety Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule ONDC Settlement Automation Audit"
    },
    {
        "id": 1804,
        "keyword": "pharmaceutical retail chain cold chain expiry auto quarantine telemetry for licensed pharmacy networks",
        "slug": "pharmaceutical-retail-chain-cold-chain-expiry-auto-quarantine-telemetry-for-licensed-pharmacy-networks",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Pharmacy Chain Compliance Officers & Quality Operations VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Pharmacy Cold Chain Quarantine Audit"
    },
    {
        "id": 1805,
        "keyword": "multi warehouse safety stock dynamic replenishment telemetry for modern trade retail chains",
        "slug": "multi-warehouse-safety-stock-dynamic-replenishment-telemetry-for-modern-trade-retail-chains",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Modern Trade Planning VPs & Inventory Control Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Safety Stock Dynamic Replenishment Audit"
    },
    {
        "id": 1806,
        "keyword": "retail inventory cycle count drone vision disparity telemetry for high bay logistics warehouses",
        "slug": "retail-inventory-cycle-count-drone-vision-disparity-telemetry-for-high-bay-logistics-warehouses",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "High-Bay Warehouse Operations VPs & Automation Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Drone Cycle Count Audit"
    },
    {
        "id": 1807,
        "keyword": "grocery retail fresh produce markdown algorithmic optimization telemetry for hypermarket chains",
        "slug": "grocery-retail-fresh-produce-markdown-algorithmic-optimization-telemetry-for-hypermarket-chains",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Hypermarket Merchandising VPs & Fresh Category Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Fresh Produce Markdown Audit"
    },

    # Cluster 2: Vernacular Voice Commerce, Quick-Commerce Dark Store & Dynamic Pricing Telemetry (IDs 1808-1824, 17 items)
    {
        "id": 1808,
        "keyword": "indic vernacular voice search intent extraction telemetry for tier 2 ecommerce platforms",
        "slug": "indic-vernacular-voice-search-intent-extraction-telemetry-for-tier-2-ecommerce-platforms",
        "category": "Solutions",
        "hub_category": "AI Agents & Autonomous Workflows",
        "target_persona": "E-Commerce Product VPs & Conversational AI Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Indic Voice Intent Extraction Audit"
    },
    {
        "id": 1809,
        "keyword": "hinglish conversational bot catalog browsing telemetry for social commerce merchants",
        "slug": "hinglish-conversational-bot-catalog-browsing-telemetry-for-social-commerce-merchants",
        "category": "Solutions",
        "hub_category": "AI Agents & Autonomous Workflows",
        "target_persona": "Social Commerce Growth Leads & Customer Experience VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Hinglish Bot Browsing Audit"
    },
    {
        "id": 1810,
        "keyword": "quick commerce sub 10 minute dispatch queue telemetry for urban micro fulfillment hubs",
        "slug": "quick-commerce-sub-10-minute-dispatch-queue-telemetry-for-urban-micro-fulfillment-hubs",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Micro-Fulfillment Hub Managers & Urban Logistics Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule 10-Minute Dispatch Queue Audit"
    },
    {
        "id": 1811,
        "keyword": "dynamic algorithmic shelf life pricing depreciation telemetry for packaged dairy distributors",
        "slug": "dynamic-algorithmic-shelf-life-pricing-depreciation-telemetry-for-packaged-dairy-distributors",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Dairy Brand Operations Heads & Perishable Category VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Dairy Shelf-Life Pricing Audit"
    },
    {
        "id": 1812,
        "keyword": "tamil and telugu vernacular voice ordering telemetry for regional quick commerce portals",
        "slug": "tamil-and-telugu-vernacular-voice-ordering-telemetry-for-regional-quick-commerce-portals",
        "category": "Solutions",
        "hub_category": "AI Agents & Autonomous Workflows",
        "target_persona": "Regional Quick Commerce Heads & Local Language Product Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Dravidian Voice Ordering Audit"
    },
    {
        "id": 1813,
        "keyword": "real time competitor scrape price elasticity adaptation telemetry for electronics retail marketplaces",
        "slug": "real-time-competitor-scrape-price-elasticity-adaptation-telemetry-for-electronics-retail-marketplaces",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Consumer Electronics Category Heads & Pricing Strategy VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Price Elasticity Adaptation Audit"
    },
    {
        "id": 1814,
        "keyword": "whatsapp commerce automated order booking and catalog checkout telemetry for smb retail merchants",
        "slug": "whatsapp-commerce-automated-order-booking-and-catalog-checkout-telemetry-for-smb-retail-merchants",
        "category": "Solutions",
        "hub_category": "AI Agents & Autonomous Workflows",
        "target_persona": "SMB Retail Aggregators & Omnichannel Merchant Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule WhatsApp Commerce Automation Audit"
    },
    {
        "id": 1815,
        "keyword": "hyperlocal surge delivery fee dynamic calculation telemetry for on demand grocery logistics",
        "slug": "hyperlocal-surge-delivery-fee-dynamic-calculation-telemetry-for-on-demand-grocery-logistics",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "On-Demand Grocery Operations VPs & Delivery Fleet Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Surge Delivery Calculation Audit"
    },
    {
        "id": 1816,
        "keyword": "retail stock phantom inventory detection anomaly telemetry for multi store pharmacy chains",
        "slug": "retail-stock-phantom-inventory-detection-anomaly-telemetry-for-multi-store-pharmacy-chains",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Pharmacy Retail Loss Prevention Heads & Inventory VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Phantom Inventory Anomaly Audit"
    },
    {
        "id": 1817,
        "keyword": "vernacular audio dialect transcription accuracy benchmarking telemetry for fintech call centers",
        "slug": "vernacular-audio-dialect-transcription-accuracy-benchmarking-telemetry-for-fintech-call-centers",
        "category": "Solutions",
        "hub_category": "AI Agents & Autonomous Workflows",
        "target_persona": "Fintech Customer Service Heads & Speech AI Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Vernacular Speech Benchmarking Audit"
    },
    {
        "id": 1818,
        "keyword": "ecommerce checkout address parsing and delivery pin code validation telemetry for tier 3 parcel couriers",
        "slug": "ecommerce-checkout-address-parsing-and-delivery-pin-code-validation-telemetry-for-tier-3-parcel-couriers",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Express Courier Operations Heads & Pin Code Logistics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Address Parsing Pin Code Audit"
    },
    {
        "id": 1819,
        "keyword": "retail omnichannel click and collect locker reservation telemetry for urban retail malls",
        "slug": "retail-omnichannel-click-and-collect-locker-reservation-telemetry-for-urban-retail-malls",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Mall Operations Directors & Omnichannel Customer Experience VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Click and Collect Locker Audit"
    },
    {
        "id": 1820,
        "keyword": "flash sale distributed cache thundering herd prevention telemetry for mega retail portal launches",
        "slug": "flash-sale-distributed-cache-thundering-herd-prevention-telemetry-for-mega-retail-portal-launches",
        "category": "Solutions",
        "hub_category": "AI Agents & Autonomous Workflows",
        "target_persona": "Chief Technology Officers & High-Scale Cloud Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cache Thundering Herd Prevention Audit"
    },
    {
        "id": 1821,
        "keyword": "bengali and marathi regional voice commerce intent classifier telemetry for rural agri input portals",
        "slug": "bengali-and-marathi-regional-voice-commerce-intent-classifier-telemetry-for-rural-agri-input-portals",
        "category": "Solutions",
        "hub_category": "AI Agents & Autonomous Workflows",
        "target_persona": "Agri-Tech Digital Heads & Rural Commerce Product Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Regional Agri Voice Classifier Audit"
    },
    {
        "id": 1822,
        "keyword": "dark store picker route optimization in store pathfinding telemetry for micro fulfillment centers",
        "slug": "dark-store-picker-route-optimization-in-store-pathfinding-telemetry-for-micro-fulfillment-centers",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Dark Store Operations VPs & Industrial Engineering Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Picker Route Pathfinding Audit"
    },
    {
        "id": 1823,
        "keyword": "instant upi payment intent failure auto recovery telemetry for high velocity retail checkouts",
        "slug": "instant-upi-payment-intent-failure-auto-recovery-telemetry-for-high-velocity-retail-checkouts",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Fintech Payment Engineering Heads & E-Commerce Checkout VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule UPI Checkout Auto-Recovery Audit"
    },
    {
        "id": 1824,
        "keyword": "retail loyalty points ledger balance cryptographic reconciliation telemetry for department store groups",
        "slug": "retail-loyalty-points-ledger-balance-cryptographic-reconciliation-telemetry-for-department-store-groups",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Retail Loyalty Program Heads & Chief Financial Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Loyalty Points Cryptographic Ledger Audit"
    },

    # Cluster 3: Indian Retail Supply Chain, GST Invoicing & Cold Chain Spoilage Telemetry (IDs 1825-1840, 16 items)
    {
        "id": 1825,
        "keyword": "indian gst rule 36 4 input tax credit automated supplier invoice reconciliation telemetry for retail corporations",
        "slug": "indian-gst-rule-36-4-input-tax-credit-automated-supplier-invoice-reconciliation-telemetry-for-retail-corporations",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Corporate Tax Directors & Chief Financial Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GST Rule 36(4) Reconciliation Audit"
    },
    {
        "id": 1826,
        "keyword": "fssai expiry date barcode visual verification telemetry for packaged food distribution warehouses",
        "slug": "fssai-expiry-date-barcode-visual-verification-telemetry-for-packaged-food-distribution-warehouses",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Food Safety Quality Heads & Distribution Warehouse VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule FSSAI Expiry Verification Audit"
    },
    {
        "id": 1827,
        "keyword": "lorawan reefer container temperature variance telemetry for interstate cold chain freight operators",
        "slug": "lorawan-reefer-container-temperature-variance-telemetry-for-interstate-cold-chain-freight-operators",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Cold Chain Logistics VPs & Fleet Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Reefer LoRaWAN Telemetry Audit"
    },
    {
        "id": 1828,
        "keyword": "gst e invoice irn validation json schema discrepancy telemetry for wholesale b2b distributors",
        "slug": "gst-e-invoice-irn-validation-json-schema-discrepancy-telemetry-for-wholesale-b2b-distributors",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Wholesale Finance Directors & B2B Billing Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GST E-Invoice IRN Audit"
    },
    {
        "id": 1829,
        "keyword": "interstate e way bill validity auto renewal telemetry for national logistics transport carriers",
        "slug": "interstate-e-way-bill-validity-auto-renewal-telemetry-for-national-logistics-transport-carriers",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Transport Fleet VPs & Logistics Compliance Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule E-Way Bill Auto-Renewal Audit"
    },
    {
        "id": 1830,
        "keyword": "perishable seafood cold store ammonia sensor telemetry for coastal aquaculture export terminals",
        "slug": "perishable-seafood-cold-store-ammonia-sensor-telemetry-for-coastal-aquaculture-export-terminals",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Aquaculture Export Heads & Cold Storage Terminal Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Seafood Cold Store Sensor Audit"
    },
    {
        "id": 1831,
        "keyword": "retail vendor consignment stock audit discrepancy telemetry for department store concessionaires",
        "slug": "retail-vendor-consignment-stock-audit-discrepancy-telemetry-for-department-store-concessionaires",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Concession Brand Heads & Retail Audit Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Consignment Stock Audit"
    },
    {
        "id": 1832,
        "keyword": "automated milk chilling center fat snf parity telemetry for cooperative dairy federations",
        "slug": "automated-milk-chilling-center-fat-snf-parity-telemetry-for-cooperative-dairy-federations",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Dairy Cooperative Managing Directors & Procurement Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Dairy Chilling Center Audit"
    },
    {
        "id": 1833,
        "keyword": "inter warehouse inventory rebalancing transit theft alert telemetry for jewelry retail networks",
        "slug": "inter-warehouse-inventory-rebalancing-transit-theft-alert-telemetry-for-jewelry-retail-networks",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Luxury Retail Security Directors & Operations Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Transit Asset Protection Audit"
    },
    {
        "id": 1834,
        "keyword": "retail pallet shrink wrap optical tear detection telemetry for automated sorting terminals",
        "slug": "retail-pallet-shrink-wrap-optical-tear-detection-telemetry-for-automated-sorting-terminals",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Sorting Terminal General Managers & Packaging Quality Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Pallet Optical Inspection Audit"
    },
    {
        "id": 1835,
        "keyword": "fast moving consumer goods dead on arrival consignment settlement telemetry for regional super stockists",
        "slug": "fast-moving-consumer-goods-dead-on-arrival-consignment-settlement-telemetry-for-regional-super-stockists",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Super Stockist Managing Directors & Commercial Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule FMCG Consignment Settlement Audit"
    },
    {
        "id": 1836,
        "keyword": "fmcg secondary sales force automation geo fence compliance telemetry for consumer brands",
        "slug": "fmcg-secondary-sales-force-automation-geo-fence-compliance-telemetry-for-consumer-brands",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "National Sales Heads & Commercial Operations VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Sales Force Geo-Fence Audit"
    },
    {
        "id": 1837,
        "keyword": "hvac temperature excursion shelf stability telemetry for national vaccine distribution depots",
        "slug": "hvac-temperature-excursion-shelf-stability-telemetry-for-national-vaccine-distribution-depots",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Vaccine Depot Quality Directors & Cold Chain Operations VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Vaccine Depot Excursion Audit"
    },
    {
        "id": 1838,
        "keyword": "retail automated markdown reconciliation to tally prime telemetry for retail enterprise accountants",
        "slug": "retail-automated-markdown-reconciliation-to-tally-prime-telemetry-for-retail-enterprise-accountants",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Chief Financial Officers & Retail Accounting Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Tally Prime Markdown Audit"
    },
    {
        "id": 1839,
        "keyword": "agricultural commodity mandi yard weighing bridge automation telemetry for state marketing boards",
        "slug": "agricultural-commodity-mandi-yard-weighing-bridge-automation-telemetry-for-state-marketing-boards",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Agricultural Marketing Board Directors & Procurement Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Mandi Weighing Bridge Automation Audit"
    },
    {
        "id": 1840,
        "keyword": "cold chain reefer truck diesel gen set fuel anomaly detection telemetry for interstate logistics carriers",
        "slug": "cold-chain-reefer-truck-diesel-gen-set-fuel-anomaly-detection-telemetry-for-interstate-logistics-carriers",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Fleet Maintenance VPs & Reefer Transport Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Reefer Fuel Anomaly Audit"
    }
]

def main():
    print("=" * 80)
    print("INGESTING WAVE 39 COMMERCIAL KEYWORDS (IDs 1,791 to 1,840)")
    print("=" * 80)

    if not QUEUE_PATH.exists():
        raise FileNotFoundError(f"Missing {QUEUE_PATH}")

    data = json.loads(QUEUE_PATH.read_text(encoding="utf-8"))
    existing_ids = {item["id"] for item in data}
    existing_slugs = {item["slug"] for item in data}

    added_count = 0
    for kw in KEYWORDS_WAVE39:
        if kw["id"] in existing_ids:
            print(f"⚠️ ID {kw['id']} already exists, skipping")
            continue
        if kw["slug"] in existing_slugs:
            print(f"⚠️ Slug '{kw['slug']}' already exists, skipping")
            continue
        data.append(kw)
        existing_ids.add(kw["id"])
        existing_slugs.add(kw["slug"])
        added_count += 1

    QUEUE_PATH.write_text(json.dumps(data, indent=4), encoding="utf-8")
    print(f"✅ Successfully ingested {added_count} new keywords into {QUEUE_PATH}")
    print(f"Total solutions now in queue: {len(data)}")
    print("=" * 80)

if __name__ == "__main__":
    main()
