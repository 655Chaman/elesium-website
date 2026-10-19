#!/usr/bin/env python3
"""
generate_ph_visual_assets.py — Product Hunt 6-Slide Vector Gallery Asset Generator
==================================================================================
Framework: Edward Sturm Complete Masterclass (Module 11: Product Hunt Launch Visuals)
Target: Elesium Enterprise AI ROI Calculator
Exports production-ready vector SVG slides matching Product Hunt 1270x760 px and 240x240 px specs.
"""

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SLIDES_DIR = BASE_DIR / "automation" / "authority_assets" / "product_hunt" / "slides"
SLIDES_DIR.mkdir(parents=True, exist_ok=True)

def generate_svg_thumbnail():
    """Slide 0: 240x240 px High-Contrast Hex Glyph with Emerald Data Pulse"""
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0d12"/>
      <stop offset="100%" stop-color="#030407"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#065f46"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect width="240" height="240" rx="48" fill="url(#bgGrad)"/>
  <rect x="2" y="2" width="236" height="236" rx="46" fill="none" stroke="#ffffff" stroke-width="1" stroke-opacity="0.1"/>
  
  <!-- Outer Hexagon -->
  <polygon points="120,38 186,76 186,152 120,190 54,152 54,76" fill="none" stroke="#10b981" stroke-width="3" stroke-opacity="0.4" />
  
  <!-- Inner Hexagon Filled with Pulse -->
  <polygon points="120,54 172,84 172,144 120,174 68,144 68,84" fill="#061f18" stroke="url(#accentGrad)" stroke-width="4" filter="url(#glow)"/>
  
  <!-- Center E Monogram & Sigma Node -->
  <text x="120" y="132" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif" font-size="56" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="-1">E</text>
  <circle cx="120" cy="54" r="5" fill="#10b981" />
  <circle cx="172" cy="144" r="5" fill="#10b981" />
  <circle cx="68" cy="144" r="5" fill="#10b981" />
  <circle cx="120" cy="174" r="4" fill="#34d399" />
</svg>"""

def generate_svg_slide1():
    """Slide 1: Hero Value Prop (1270x760 px)"""
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1270 760" width="1270" height="760">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="50%" stop-color="#05080f"/>
      <stop offset="100%" stop-color="#020306"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#141c2b"/>
      <stop offset="100%" stop-color="#0d131f"/>
    </linearGradient>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#34d399"/>
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1270" height="760" fill="url(#bgGrad)"/>
  
  <!-- Subtle Grid -->
  <g stroke="#ffffff" stroke-width="1" stroke-opacity="0.03">
    <line x1="0" y1="190" x2="1270" y2="190"/>
    <line x1="0" y1="380" x2="1270" y2="380"/>
    <line x1="0" y1="570" x2="1270" y2="570"/>
    <line x1="317" y1="0" x2="317" y2="760"/>
    <line x1="635" y1="0" x2="635" y2="760"/>
    <line x1="952" y1="0" x2="952" y2="760"/>
  </g>
  
  <!-- Brand Header -->
  <g transform="translate(80, 70)">
    <rect width="36" height="36" rx="8" fill="#10b981"/>
    <text x="18" y="25" font-family="'Inter', sans-serif" font-size="20" font-weight="bold" fill="#000" text-anchor="middle">E</text>
    <text x="48" y="24" font-family="'Inter', sans-serif" font-size="16" font-weight="700" fill="#ffffff" letter-spacing="0.5">ELESIUM</text>
    <rect x="140" y="8" width="90" height="22" rx="4" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-opacity="0.3"/>
    <text x="185" y="23" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="600" fill="#34d399" text-anchor="middle">MICRO-SAAS</text>
  </g>
  
  <!-- Hero Copy -->
  <g transform="translate(80, 160)">
    <rect width="210" height="28" rx="14" fill="#ffffff" fill-opacity="0.05" stroke="#ffffff" stroke-opacity="0.1"/>
    <circle cx="16" cy="14" r="4" fill="#10b981"/>
    <text x="30" y="19" font-family="'JetBrains Mono', monospace" font-size="12" fill="#94a3b8">FREE PUBLIC TOOL</text>
    
    <text x="0" y="75" font-family="'Inter', sans-serif" font-size="44" font-weight="800" fill="#ffffff" letter-spacing="-1">
      Calculate True Enterprise AI ROI,
    </text>
    <text x="0" y="125" font-family="'Inter', sans-serif" font-size="44" font-weight="800" fill="url(#emeraldGrad)" letter-spacing="-1">
      Labor Savings & Payback in 60s
    </text>
    
    <text x="0" y="175" font-family="'Inter', sans-serif" font-size="18" fill="#94a3b8" font-weight="400">
      Model 3-Year TCO for deterministic multi-agent systems vs fragile Zapier SaaS wrappers.
    </text>
  </g>
  
  <!-- Metric Highlight Cards (3 Columns) -->
  <g transform="translate(80, 420)">
    <!-- Card 1 -->
    <g transform="translate(0, 0)">
      <rect width="340" height="220" rx="16" fill="url(#cardGrad)" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1.5"/>
      <text x="32" y="45" font-family="'JetBrains Mono', monospace" font-size="12" fill="#10b981" font-weight="600">NET ANNUAL SAVINGS</text>
      <text x="32" y="105" font-family="'Inter', sans-serif" font-size="44" font-weight="800" fill="#ffffff">₹18.4 Lakhs</text>
      <text x="32" y="132" font-family="'Inter', sans-serif" font-size="14" fill="#64748b">or $22,400+ USD / year</text>
      <rect x="32" y="155" width="276" height="35" rx="8" fill="#ffffff" fill-opacity="0.03"/>
      <text x="44" y="177" font-family="'Inter', sans-serif" font-size="12" fill="#94a3b8">Based on 12-person operations team</text>
    </g>
    
    <!-- Card 2 -->
    <g transform="translate(370, 0)">
      <rect width="340" height="220" rx="16" fill="url(#cardGrad)" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1.5"/>
      <text x="32" y="45" font-family="'JetBrains Mono', monospace" font-size="12" fill="#38bdf8" font-weight="600">PAYBACK HORIZON</text>
      <text x="32" y="105" font-family="'Inter', sans-serif" font-size="44" font-weight="800" fill="#ffffff">3.2 Months</text>
      <text x="32" y="132" font-family="'Inter', sans-serif" font-size="14" fill="#64748b">Cash-flow positive in Q1</text>
      <rect x="32" y="155" width="276" height="35" rx="8" fill="#ffffff" fill-opacity="0.03"/>
      <text x="44" y="177" font-family="'Inter', sans-serif" font-size="12" fill="#94a3b8">Fully depreciated capital costs</text>
    </g>
    
    <!-- Card 3 -->
    <g transform="translate(740, 0)">
      <rect width="370" height="220" rx="16" fill="url(#cardGrad)" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1.5"/>
      <text x="32" y="45" font-family="'JetBrains Mono', monospace" font-size="12" fill="#a855f7" font-weight="600">PROCESS ACCELERATION</text>
      <text x="32" y="105" font-family="'Inter', sans-serif" font-size="44" font-weight="800" fill="#ffffff">98% Error Cut</text>
      <text x="32" y="132" font-family="'Inter', sans-serif" font-size="14" fill="#64748b">1.9s latency vs 45 min manual</text>
      <rect x="32" y="155" width="306" height="35" rx="8" fill="#ffffff" fill-opacity="0.03"/>
      <text x="44" y="177" font-family="'Inter', sans-serif" font-size="12" fill="#94a3b8">DPDP Act 2023 &amp; SOC-2 compliant</text>
    </g>
  </g>
  
  <!-- Footer Bar -->
  <g transform="translate(80, 690)">
    <text x="0" y="18" font-family="'JetBrains Mono', monospace" font-size="13" fill="#64748b">elesium.online/tools/enterprise-ai-roi-calculator</text>
    <text x="1110" y="18" font-family="'Inter', sans-serif" font-size="13" font-weight="600" fill="#10b981" text-anchor="end">Slide 1 of 5</text>
  </g>
</svg>"""

def generate_svg_slide2():
    """Slide 2: The Problem: Brittle Wrappers vs Deterministic AI (1270x760 px)"""
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1270 760" width="1270" height="760">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0c14"/>
      <stop offset="100%" stop-color="#030408"/>
    </linearGradient>
  </defs>
  <rect width="1270" height="760" fill="url(#bgGrad)"/>
  
  <!-- Title -->
  <g transform="translate(80, 70)">
    <rect width="170" height="26" rx="13" fill="#ef4444" fill-opacity="0.1" stroke="#ef4444" stroke-opacity="0.3"/>
    <circle cx="14" cy="13" r="4" fill="#ef4444"/>
    <text x="26" y="17" font-family="'JetBrains Mono', monospace" font-size="11" fill="#f87171" font-weight="600">THE BRITTLE PARADOX</text>
    
    <text x="0" y="65" font-family="'Inter', sans-serif" font-size="38" font-weight="800" fill="#ffffff" letter-spacing="-0.5">
      Why 80% of Enterprise AI Fails to Deliver ROI
    </text>
    <text x="0" y="100" font-family="'Inter', sans-serif" font-size="17" fill="#94a3b8">
      Low-code wrappers and generic chat interfaces collapse under volume and format drift.
    </text>
  </g>
  
  <!-- Comparison Split Screen -->
  <g transform="translate(80, 210)">
    <!-- Column 1: Generic AI Wrappers (Red) -->
    <rect width="530" height="460" rx="16" fill="#140f12" stroke="#ef4444" stroke-opacity="0.2" stroke-width="1.5"/>
    <g transform="translate(35, 35)">
      <rect width="110" height="24" rx="4" fill="#ef4444" fill-opacity="0.2"/>
      <text x="55" y="16" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#f87171" text-anchor="middle">LEGACY SAAS</text>
      <text x="0" y="65" font-family="'Inter', sans-serif" font-size="24" font-weight="700" fill="#ffffff">Low-Code &amp; Generic Wrappers</text>
      
      <!-- Bullet 1 -->
      <g transform="translate(0, 105)">
        <text x="0" y="0" font-family="'Inter', sans-serif" font-size="16" fill="#ef4444" font-weight="bold">✗</text>
        <text x="24" y="0" font-family="'Inter', sans-serif" font-size="15" font-weight="600" fill="#ffffff">Stochastic Non-Determinism</text>
        <text x="24" y="24" font-family="'Inter', sans-serif" font-size="13" fill="#94a3b8">Hallucinates when processing unexpected invoice layouts.</text>
      </g>
      
      <!-- Bullet 2 -->
      <g transform="translate(0, 185)">
        <text x="0" y="0" font-family="'Inter', sans-serif" font-size="16" fill="#ef4444" font-weight="bold">✗</text>
        <text x="24" y="0" font-family="'Inter', sans-serif" font-size="15" font-weight="600" fill="#ffffff">Runaway Per-Token SaaS Taxes</text>
        <text x="24" y="24" font-family="'Inter', sans-serif" font-size="13" fill="#94a3b8">Cumulative subscription fees balloon with transaction volume.</text>
      </g>
      
      <!-- Bullet 3 -->
      <g transform="translate(0, 265)">
        <text x="0" y="0" font-family="'Inter', sans-serif" font-size="16" fill="#ef4444" font-weight="bold">✗</text>
        <text x="24" y="0" font-family="'Inter', sans-serif" font-size="15" font-weight="600" fill="#ffffff">DPDP Act &amp; Data Leakage Risk</text>
        <text x="24" y="24" font-family="'Inter', sans-serif" font-size="13" fill="#94a3b8">Corporate data routed to external multi-tenant LLM endpoints.</text>
      </g>
    </g>
    
    <!-- Column 2: Elesium Deterministic Architecture (Emerald) -->
    <g transform="translate(580, 0)">
      <rect width="530" height="460" rx="16" fill="#0c1714" stroke="#10b981" stroke-opacity="0.3" stroke-width="1.5"/>
      <g transform="translate(35, 35)">
        <rect width="130" height="24" rx="4" fill="#10b981" fill-opacity="0.2"/>
        <text x="65" y="16" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#34d399" text-anchor="middle">ELESIUM SOVEREIGN</text>
        <text x="0" y="65" font-family="'Inter', sans-serif" font-size="24" font-weight="700" fill="#ffffff">Deterministic Agentic DAGs</text>
        
        <!-- Bullet 1 -->
        <g transform="translate(0, 105)">
          <text x="0" y="0" font-family="'Inter', sans-serif" font-size="16" fill="#10b981" font-weight="bold">✓</text>
          <text x="24" y="0" font-family="'Inter', sans-serif" font-size="15" font-weight="600" fill="#ffffff">LangGraph Finite State Machines</text>
          <text x="24" y="24" font-family="'Inter', sans-serif" font-size="13" fill="#94a3b8">Deterministic recovery loops with guaranteed execution bounds.</text>
        </g>
        
        <!-- Bullet 2 -->
        <g transform="translate(0, 185)">
          <text x="0" y="0" font-family="'Inter', sans-serif" font-size="16" fill="#10b981" font-weight="bold">✓</text>
          <text x="24" y="0" font-family="'Inter', sans-serif" font-size="15" font-weight="600" fill="#ffffff">Flat-Fee Private VPC Hosting</text>
          <text x="24" y="24" font-family="'Inter', sans-serif" font-size="13" fill="#94a3b8">Cost drops per transaction as scale doubles; zero seat taxes.</text>
        </g>
        
        <!-- Bullet 3 -->
        <g transform="translate(0, 265)">
          <text x="0" y="0" font-family="'Inter', sans-serif" font-size="16" fill="#10b981" font-weight="bold">✓</text>
          <text x="24" y="0" font-family="'Inter', sans-serif" font-size="15" font-weight="600" fill="#ffffff">Air-Gapped Sovereign Isolation</text>
          <text x="24" y="24" font-family="'Inter', sans-serif" font-size="13" fill="#94a3b8">Complete DPDP Act 2023 &amp; RBI compliance; data never leaves VPC.</text>
        </g>
      </g>
    </g>
  </g>
  
  <!-- Footer -->
  <g transform="translate(80, 715)">
    <text x="0" y="0" font-family="'JetBrains Mono', monospace" font-size="13" fill="#64748b">elesium.online/solutions</text>
    <text x="1110" y="0" font-family="'Inter', sans-serif" font-size="13" font-weight="600" fill="#10b981" text-anchor="end">Slide 2 of 5</text>
  </g>
</svg>"""

def generate_svg_slide3():
    """Slide 3: Interactive Engine & TCO Breakdown (1270x760 px)"""
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1270 760" width="1270" height="760">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0d14"/>
      <stop offset="100%" stop-color="#04060a"/>
    </linearGradient>
  </defs>
  <rect width="1270" height="760" fill="url(#bgGrad)"/>
  
  <!-- Header -->
  <g transform="translate(80, 70)">
    <rect width="170" height="26" rx="13" fill="#38bdf8" fill-opacity="0.1" stroke="#38bdf8" stroke-opacity="0.3"/>
    <circle cx="14" cy="13" r="4" fill="#38bdf8"/>
    <text x="26" y="17" font-family="'JetBrains Mono', monospace" font-size="11" fill="#7dd3fc" font-weight="600">INTERACTIVE ENGINE</text>
    
    <text x="0" y="65" font-family="'Inter', sans-serif" font-size="38" font-weight="800" fill="#ffffff">
      Granular 3-Year Total Cost of Ownership (TCO)
    </text>
    <text x="0" y="100" font-family="'Inter', sans-serif" font-size="17" fill="#94a3b8">
      Real-time mathematical comparison between manual ops, legacy SaaS, and sovereign private VPCs.
    </text>
  </g>
  
  <!-- Mockup Calculator Container -->
  <g transform="translate(80, 200)">
    <rect width="1110" height="470" rx="16" fill="#111622" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5"/>
    
    <!-- Left Column: Sliders -->
    <g transform="translate(40, 40)">
      <text x="0" y="0" font-family="'JetBrains Mono', monospace" font-size="13" fill="#94a3b8" font-weight="600">INPUT PARAMETERS</text>
      
      <!-- Slider 1 -->
      <g transform="translate(0, 30)">
        <text x="0" y="0" font-family="'Inter', sans-serif" font-size="14" fill="#e2e8f0">Operations Team Size</text>
        <text x="440" y="0" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" fill="#34d399" text-anchor="end">12 Employees</text>
        <rect x="0" y="15" width="440" height="6" rx="3" fill="#1e293b"/>
        <rect x="0" y="15" width="130" height="6" rx="3" fill="#10b981"/>
        <circle cx="130" cy="18" r="8" fill="#ffffff" stroke="#10b981" stroke-width="2"/>
      </g>
      
      <!-- Slider 2 -->
      <g transform="translate(0, 95)">
        <text x="0" y="0" font-family="'Inter', sans-serif" font-size="14" fill="#e2e8f0">Average Monthly Salary</text>
        <text x="440" y="0" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" fill="#34d399" text-anchor="end">₹65,000 / mo</text>
        <rect x="0" y="15" width="440" height="6" rx="3" fill="#1e293b"/>
        <rect x="0" y="15" width="190" height="6" rx="3" fill="#10b981"/>
        <circle cx="190" cy="18" r="8" fill="#ffffff" stroke="#10b981" stroke-width="2"/>
      </g>
      
      <!-- Slider 3 -->
      <g transform="translate(0, 160)">
        <text x="0" y="0" font-family="'Inter', sans-serif" font-size="14" fill="#e2e8f0">Operational Error / Rework Rate</text>
        <text x="440" y="0" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" fill="#34d399" text-anchor="end">8.5% of Volume</text>
        <rect x="0" y="15" width="440" height="6" rx="3" fill="#1e293b"/>
        <rect x="0" y="15" width="160" height="6" rx="3" fill="#10b981"/>
        <circle cx="160" cy="18" r="8" fill="#ffffff" stroke="#10b981" stroke-width="2"/>
      </g>
      
      <!-- Industry Sector Pills -->
      <g transform="translate(0, 230)">
        <text x="0" y="0" font-family="'Inter', sans-serif" font-size="14" fill="#e2e8f0">Target Industry</text>
        <g transform="translate(0, 15)">
          <rect width="130" height="32" rx="6" fill="#10b981" fill-opacity="0.15" stroke="#10b981"/>
          <text x="65" y="21" font-family="'Inter', sans-serif" font-size="12" font-weight="600" fill="#34d399" text-anchor="middle">Logistics ERP</text>
          
          <rect x="140" width="130" height="32" rx="6" fill="#1e293b"/>
          <text x="205" y="21" font-family="'Inter', sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">BFSI Lending</text>
          
          <rect x="280" width="140" height="32" rx="6" fill="#1e293b"/>
          <text x="350" y="21" font-family="'Inter', sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">Manufacturing</text>
        </g>
      </g>
    </g>
    
    <!-- Divider -->
    <line x1="550" y1="30" x2="550" y2="440" stroke="#ffffff" stroke-opacity="0.08"/>
    
    <!-- Right Column: Visual Comparison Bars -->
    <g transform="translate(590, 40)">
      <text x="0" y="0" font-family="'JetBrains Mono', monospace" font-size="13" fill="#94a3b8" font-weight="600">3-YEAR FINANCIAL PROJECTION</text>
      
      <!-- Bar 1: Manual Ops -->
      <g transform="translate(0, 35)">
        <text x="0" y="0" font-family="'Inter', sans-serif" font-size="13" fill="#94a3b8">Status Quo Manual Spend (3-Yr)</text>
        <text x="480" y="0" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" fill="#ef4444" text-anchor="end">₹68.4 Lakhs</text>
        <rect x="0" y="10" width="480" height="24" rx="6" fill="#1e293b"/>
        <rect x="0" y="10" width="480" height="24" rx="6" fill="#ef4444" fill-opacity="0.8"/>
      </g>
      
      <!-- Bar 2: Legacy SaaS -->
      <g transform="translate(0, 95)">
        <text x="0" y="0" font-family="'Inter', sans-serif" font-size="13" fill="#94a3b8">Legacy SaaS &amp; Seat Licenses</text>
        <text x="480" y="0" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" fill="#f59e0b" text-anchor="end">₹42.6 Lakhs</text>
        <rect x="0" y="10" width="480" height="24" rx="6" fill="#1e293b"/>
        <rect x="0" y="10" width="300" height="24" rx="6" fill="#f59e0b" fill-opacity="0.8"/>
      </g>
      
      <!-- Bar 3: Elesium Sovereign -->
      <g transform="translate(0, 155)">
        <text x="0" y="0" font-family="'Inter', sans-serif" font-size="13" fill="#34d399" font-weight="600">Elesium Sovereign Private VPC</text>
        <text x="480" y="0" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" fill="#10b981" text-anchor="end">₹12.2 Lakhs</text>
        <rect x="0" y="10" width="480" height="24" rx="6" fill="#1e293b"/>
        <rect x="0" y="10" width="95" height="24" rx="6" fill="#10b981"/>
      </g>
      
      <!-- Callout Box -->
      <g transform="translate(0, 225)">
        <rect width="480" height="110" rx="12" fill="#10b981" fill-opacity="0.1" stroke="#10b981" stroke-opacity="0.3"/>
        <text x="24" y="35" font-family="'JetBrains Mono', monospace" font-size="12" fill="#34d399" font-weight="700">NET 3-YEAR CASH CONVERSION</text>
        <text x="24" y="70" font-family="'Inter', sans-serif" font-size="28" font-weight="800" fill="#ffffff">+₹56.2 Lakhs Saved</text>
        <text x="24" y="95" font-family="'Inter', sans-serif" font-size="12" fill="#94a3b8">4.6x ROI on deployed architecture capital</text>
      </g>
    </g>
  </g>
  
  <!-- Footer -->
  <g transform="translate(80, 715)">
    <text x="0" y="0" font-family="'JetBrains Mono', monospace" font-size="13" fill="#64748b">elesium.online/tools/enterprise-ai-roi-calculator</text>
    <text x="1110" y="0" font-family="'Inter', sans-serif" font-size="13" font-weight="600" fill="#10b981" text-anchor="end">Slide 3 of 5</text>
  </g>
</svg>"""

def generate_svg_slide4():
    """Slide 4: Sovereign Architecture & DPDP Act Compliance (1270x760 px)"""
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1270 760" width="1270" height="760">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070c14"/>
      <stop offset="100%" stop-color="#020408"/>
    </linearGradient>
  </defs>
  <rect width="1270" height="760" fill="url(#bgGrad)"/>
  
  <g transform="translate(80, 70)">
    <rect width="190" height="26" rx="13" fill="#10b981" fill-opacity="0.1" stroke="#10b981" stroke-opacity="0.3"/>
    <circle cx="14" cy="13" r="4" fill="#10b981"/>
    <text x="26" y="17" font-family="'JetBrains Mono', monospace" font-size="11" fill="#34d399" font-weight="600">ZERO DATA RETENTION</text>
    
    <text x="0" y="65" font-family="'Inter', sans-serif" font-size="38" font-weight="800" fill="#ffffff">
      Air-Gapped Private VPCs &amp; DPDP Act 2023 Sovereignty
    </text>
    <text x="0" y="100" font-family="'Inter', sans-serif" font-size="17" fill="#94a3b8">
      Customer data never traverses third-party servers; deployed inside your AWS Mumbai or Azure India VPC.
    </text>
  </g>
  
  <!-- Architectural DAG Diagram -->
  <g transform="translate(80, 210)">
    <rect width="1110" height="460" rx="16" fill="#0d121c" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1.5"/>
    
    <!-- Step 1: Input -->
    <g transform="translate(60, 160)">
      <rect width="200" height="130" rx="12" fill="#1a2333" stroke="#38bdf8" stroke-opacity="0.4"/>
      <text x="100" y="40" font-family="'JetBrains Mono', monospace" font-size="11" fill="#38bdf8" text-anchor="middle">STEP 01: INGESTION</text>
      <text x="100" y="70" font-family="'Inter', sans-serif" font-size="15" font-weight="700" fill="#ffffff" text-anchor="middle">Unstructured Data</text>
      <text x="100" y="95" font-family="'Inter', sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">PDF, EDI 214, SCADA, EHR</text>
    </g>
    
    <!-- Arrow 1 -->
    <path d="M 270 225 L 340 225" stroke="#10b981" stroke-width="2" stroke-dasharray="4,4"/>
    <polygon points="340,221 348,225 340,229" fill="#10b981"/>
    
    <!-- Step 2: LangGraph DAG -->
    <g transform="translate(360, 110)">
      <rect width="380" height="230" rx="12" fill="#0b1e19" stroke="#10b981" stroke-opacity="0.6" stroke-width="2"/>
      <text x="190" y="40" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700" fill="#34d399" text-anchor="middle">PRIVATE AIR-GAPPED VPC</text>
      <text x="190" y="70" font-family="'Inter', sans-serif" font-size="18" font-weight="800" fill="#ffffff" text-anchor="middle">Deterministic State Machine</text>
      
      <rect x="30" y="100" width="140" height="45" rx="6" fill="#13382d"/>
      <text x="100" y="128" font-family="'JetBrains Mono', monospace" font-size="11" fill="#a7f3d0" text-anchor="middle">Pydantic Validator</text>
      
      <rect x="210" y="100" width="140" height="45" rx="6" fill="#13382d"/>
      <text x="280" y="128" font-family="'JetBrains Mono', monospace" font-size="11" fill="#a7f3d0" text-anchor="middle">Local DeepSeek LLM</text>
      
      <text x="190" y="185" font-family="'Inter', sans-serif" font-size="12" fill="#6ee7b7" text-anchor="middle">Sub-200ms Validation &amp; Error Self-Correction</text>
      <text x="190" y="205" font-family="'Inter', sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">Zero Data Retention (ZDR) Enforced</text>
    </g>
    
    <!-- Arrow 2 -->
    <path d="M 750 225 L 820 225" stroke="#10b981" stroke-width="2" stroke-dasharray="4,4"/>
    <polygon points="820,221 828,225 820,229" fill="#10b981"/>
    
    <!-- Step 3: Enterprise Integration -->
    <g transform="translate(840, 160)">
      <rect width="210" height="130" rx="12" fill="#1a2333" stroke="#a855f7" stroke-opacity="0.4"/>
      <text x="105" y="40" font-family="'JetBrains Mono', monospace" font-size="11" fill="#c084fc" text-anchor="middle">STEP 03: ERP LEDGER</text>
      <text x="105" y="70" font-family="'Inter', sans-serif" font-size="15" font-weight="700" fill="#ffffff" text-anchor="middle">Immediate Action</text>
      <text x="105" y="95" font-family="'Inter', sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">SAP S/4HANA, Core Banking</text>
    </g>
  </g>
  
  <g transform="translate(80, 715)">
    <text x="0" y="0" font-family="'JetBrains Mono', monospace" font-size="13" fill="#64748b">elesium.online/solutions</text>
    <text x="1110" y="0" font-family="'Inter', sans-serif" font-size="13" font-weight="600" fill="#10b981" text-anchor="end">Slide 4 of 5</text>
  </g>
</svg>"""

def generate_svg_slide5():
    """Slide 5: Executive Memo Export for Boardroom Approval (1270x760 px)"""
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1270 760" width="1270" height="760">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0c14"/>
      <stop offset="100%" stop-color="#030408"/>
    </linearGradient>
  </defs>
  <rect width="1270" height="760" fill="url(#bgGrad)"/>
  
  <g transform="translate(80, 70)">
    <rect width="170" height="26" rx="13" fill="#a855f7" fill-opacity="0.1" stroke="#a855f7" stroke-opacity="0.3"/>
    <circle cx="14" cy="13" r="4" fill="#a855f7"/>
    <text x="26" y="17" font-family="'JetBrains Mono', monospace" font-size="11" fill="#c084fc" font-weight="600">CFO INVESTMENT MEMO</text>
    
    <text x="0" y="65" font-family="'Inter', sans-serif" font-size="38" font-weight="800" fill="#ffffff">
      One-Click Boardroom Investment Memo Export
    </text>
    <text x="0" y="100" font-family="'Inter', sans-serif" font-size="17" fill="#94a3b8">
      Download or share an unassailable financial business case ready for executive committee sign-off.
    </text>
  </g>
  
  <!-- Memo Card Container -->
  <g transform="translate(80, 200)">
    <rect width="1110" height="470" rx="16" fill="#121824" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5"/>
    
    <!-- Mock Document Paper -->
    <g transform="translate(180, 40)">
      <rect width="750" height="390" rx="8" fill="#ffffff" filter="drop-shadow(0px 8px 24px rgba(0,0,0,0.5))"/>
      
      <!-- Memo Header -->
      <g transform="translate(50, 40)">
        <text x="0" y="0" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#64748b" letter-spacing="1">EXECUTIVE COMMITTEE MEMO</text>
        <text x="0" y="28" font-family="'Inter', sans-serif" font-size="20" font-weight="800" fill="#0f172a">Capital Allocation for Sovereign AI Automation</text>
        <line x1="0" y1="45" x2="650" y2="45" stroke="#e2e8f0" stroke-width="1.5"/>
      </g>
      
      <!-- Memo Table -->
      <g transform="translate(50, 115)">
        <rect width="650" height="30" fill="#f8fafc"/>
        <text x="15" y="20" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#475569">FINANCIAL VARIABLE</text>
        <text x="320" y="20" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#475569">STATUS QUO</text>
        <text x="490" y="20" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#10b981">ELESIUM SOVEREIGN</text>
        
        <text x="15" y="60" font-family="'Inter', sans-serif" font-size="13" fill="#334155">Year 1 Net Operational Spend</text>
        <text x="320" y="60" font-family="'JetBrains Mono', monospace" font-size="13" fill="#ef4444">₹22.8 Lakhs</text>
        <text x="490" y="60" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="700" fill="#10b981">₹4.4 Lakhs</text>
        
        <text x="15" y="95" font-family="'Inter', sans-serif" font-size="13" fill="#334155">Analyst Error Cost Overhead</text>
        <text x="320" y="95" font-family="'JetBrains Mono', monospace" font-size="13" fill="#ef4444">₹6.2 Lakhs / yr</text>
        <text x="490" y="95" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="700" fill="#10b981">₹0.1 Lakhs / yr (-98%)</text>
        
        <text x="15" y="130" font-family="'Inter', sans-serif" font-size="13" fill="#334155">Capital Payback Horizon</text>
        <text x="320" y="130" font-family="'JetBrains Mono', monospace" font-size="13" fill="#64748b">Never (recurring)</text>
        <text x="490" y="130" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="700" fill="#10b981">3.2 Months</text>
        
        <line x1="0" y1="150" x2="650" y2="150" stroke="#0f172a" stroke-width="1.5"/>
        <text x="15" y="180" font-family="'Inter', sans-serif" font-size="14" font-weight="800" fill="#0f172a">NET ANNUAL CASH SAVINGS</text>
        <text x="490" y="180" font-family="'JetBrains Mono', monospace" font-size="18" font-weight="800" fill="#059669">₹18.4 Lakhs / yr</text>
      </g>
      
      <!-- Signature Line -->
      <g transform="translate(50, 335)">
        <text x="0" y="0" font-family="'Inter', sans-serif" font-size="11" fill="#64748b">Verified &amp; Certified by: Chaman Shah, Principal AI Systems Architect</text>
      </g>
    </g>
  </g>
  
  <g transform="translate(80, 715)">
    <text x="0" y="0" font-family="'JetBrains Mono', monospace" font-size="13" fill="#64748b">elesium.online/tools/enterprise-ai-roi-calculator</text>
    <text x="1110" y="0" font-family="'Inter', sans-serif" font-size="13" font-weight="600" fill="#10b981" text-anchor="end">Slide 5 of 5</text>
  </g>
</svg>"""

def main():
    slides = [
        ("ph_thumbnail_glyph.svg", generate_svg_thumbnail()),
        ("ph_slide_1_hero.svg", generate_svg_slide1()),
        ("ph_slide_2_problem.svg", generate_svg_slide2()),
        ("ph_slide_3_calculator.svg", generate_svg_slide3()),
        ("ph_slide_4_architecture.svg", generate_svg_slide4()),
        ("ph_slide_5_memo.svg", generate_svg_slide5()),
    ]
    
    print(f"Generating {len(slides)} Product Hunt SVG vector assets into {SLIDES_DIR}...")
    for filename, content in slides:
        path = SLIDES_DIR / filename
        path.write_text(content, encoding="utf-8")
        print(f"  ✓ Created: {path.name} ({len(content)} bytes)")
        
    print("\n✓ 100% All Product Hunt Visual Gallery Slides Generated Successfully.")

if __name__ == "__main__":
    main()
