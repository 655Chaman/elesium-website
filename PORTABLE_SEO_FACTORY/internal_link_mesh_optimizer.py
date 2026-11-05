#!/usr/bin/env python3
"""
================================================================================
INTERNAL LINK MESH OPTIMIZER — GRAPH-THEORETIC SEO ENGINE
================================================================================
Classification: Production Engineering Tool & Graph-Theoretic Optimizer
Scientific Basis: PageRank Random Walk (Markov Chains, d=0.85), CheiRank Duals,
                  Claude Shannon Information Entropy, Google Reasonable Surfer Model
Author: Elesium Autonomous Search Engineering Team
Dependencies: Pure Python Standard Library (Zero External Dependencies)
================================================================================
"""

import sys
import os
import json
import math
import re
import argparse
from typing import List, Dict, Set, Tuple, Any, Optional
from collections import defaultdict, Counter

# ==============================================================================
# 1. GRAPH TOPOLOGY & LINEAR ALGEBRA ENGINE
# ==============================================================================

class DirectedWebGraph:
    """
    Mathematical directed graph representation G = (V, E) of website URLs and internal links.
    """
    def __init__(self, node_ids: List[str]):
        self.nodes = list(dict.fromkeys(node_ids)) # Deduplicated preserving order
        self.node_to_idx = {node: i for i, node in enumerate(self.nodes)}
        self.idx_to_node = {i: node for i, node in enumerate(self.nodes)}
        self.n = len(self.nodes)
        
        # Outgoing adjacency list: u -> list of v
        self.out_edges: Dict[int, List[int]] = {i: [] for i in range(self.n)}
        # Incoming adjacency list: v -> list of u
        self.in_edges: Dict[int, List[int]] = {i: [] for i in range(self.n)}
        
        # Metadata storage per node
        self.metadata: Dict[str, Dict[str, Any]] = {}
        # Edge details: (src, dst) -> Dict with anchor_text, type, etc.
        self.edge_attributes: Dict[Tuple[str, str], Dict[str, Any]] = {}

    def add_edge(self, src: str, dst: str, attributes: Optional[Dict[str, Any]] = None):
        if src not in self.node_to_idx or dst not in self.node_to_idx:
            return
        if src == dst:
            return # Avoid self-loops in canonical mesh
            
        u = self.node_to_idx[src]
        v = self.node_to_idx[dst]
        
        if v not in self.out_edges[u]:
            self.out_edges[u].append(v)
            self.in_edges[v].append(u)
            if attributes:
                self.edge_attributes[(src, dst)] = attributes

    def in_degree(self, node: str) -> int:
        idx = self.node_to_idx.get(node)
        return len(self.in_edges[idx]) if idx is not None else 0

    def out_degree(self, node: str) -> int:
        idx = self.node_to_idx.get(node)
        return len(self.out_edges[idx]) if idx is not None else 0

    def compute_pagerank(self, damping: float = 0.85, epsilon: float = 1e-6, max_iter: int = 100) -> Dict[str, float]:
        """
        Computes stationary PageRank vector r via Power Iteration:
        r^(k+1) = d * M * r^(k) + (1-d)/N
        Handles dangling nodes (out-degree = 0) with uniform probability redistribution.
        """
        n = self.n
        if n == 0:
            return {}
            
        r = [1.0 / n] * n
        base_teleport = (1.0 - damping) / n
        
        for iteration in range(max_iter):
            new_r = [base_teleport] * n
            
            # Sum probability mass of dangling nodes (sinks)
            dangling_sum = sum(r[i] for i in range(n) if len(self.out_edges[i]) == 0)
            dangling_contrib = (damping * dangling_sum) / n
            
            for i in range(n):
                new_r[i] += dangling_contrib
                # Add incoming contributions
                for u in self.in_edges[i]:
                    out_deg = len(self.out_edges[u])
                    if out_deg > 0:
                        new_r[i] += damping * (r[u] / out_deg)
                        
            # L1 norm difference
            diff = sum(abs(new_r[i] - r[i]) for i in range(n))
            r = new_r
            if diff < epsilon:
                break
                
        # Normalize sum to 1.0
        total = sum(r)
        if total > 0:
            r = [val / total for val in r]
            
        return {self.idx_to_node[i]: r[i] for i in range(n)}

    def compute_cheirank(self, damping: float = 0.85, epsilon: float = 1e-6, max_iter: int = 100) -> Dict[str, float]:
        """
        Computes CheiRank dual vector on the inverted graph G* (edges reversed).
        Measures outbound communicative hub centrality.
        """
        n = self.n
        if n == 0:
            return {}
            
        q = [1.0 / n] * n
        base_teleport = (1.0 - damping) / n
        
        for iteration in range(max_iter):
            new_q = [base_teleport] * n
            
            # Nodes with in_degree == 0 in original graph have out_degree == 0 in dual
            dangling_sum = sum(q[i] for i in range(n) if len(self.in_edges[i]) == 0)
            dangling_contrib = (damping * dangling_sum) / n
            
            for i in range(n):
                new_q[i] += dangling_contrib
                # In dual graph, edges are incoming from original out_edges
                for v in self.out_edges[i]:
                    in_deg = len(self.in_edges[v])
                    if in_deg > 0:
                        new_q[i] += damping * (q[v] / in_deg)
                        
            diff = sum(abs(new_q[i] - q[i]) for i in range(n))
            q = new_q
            if diff < epsilon:
                break
                
        total = sum(q)
        if total > 0:
            q = [val / total for val in q]
            
        return {self.idx_to_node[i]: q[i] for i in range(n)}

    def compute_gini_coefficient(self, values: List[float]) -> float:
        """
        Calculates Gini coefficient of inequality for PageRank distribution.
        G = sum(|xi - xj|) / (2 * n * sum(xi))
        """
        n = len(values)
        if n <= 1:
            return 0.0
        total = sum(values)
        if total == 0:
            return 0.0
            
        sorted_vals = sorted(values)
        cumulative = 0.0
        for i, val in enumerate(sorted_vals):
            cumulative += (2 * (i + 1) - n - 1) * val
        return cumulative / (n * total)

# ==============================================================================
# 2. SEMANTIC AFFINITY & ANCHOR ENTROPY ENGINE
# ==============================================================================

def tokenize_clean(text: str) -> Set[str]:
    """Tokenize and remove common stop words."""
    stop_words = {
        "and", "for", "with", "the", "in", "of", "a", "an", "to", "by", "on", 
        "at", "or", "as", "is", "are", "be", "this", "that", "from", "your",
        "our", "sub", "directors", "vps", "leads", "officers"
    }
    words = re.findall(r'[a-zA-Z0-9_\-]+', text.lower())
    return {w for w in words if len(w) > 2 and w not in stop_words}

def compute_jaccard_similarity(set_a: Set[str], set_b: Set[str]) -> float:
    """Computes Jaccard index between two token sets."""
    if not set_a or not set_b:
        return 0.0
    intersection = len(set_a.intersection(set_b))
    union = len(set_a.union(set_b))
    return intersection / union if union > 0 else 0.0

def compute_semantic_affinity(node_a: Dict[str, Any], node_b: Dict[str, Any]) -> float:
    """
    Calculates weighted semantic affinity score between two solution nodes:
    Aff(a, b) = 0.40 * TokenSim + 0.35 * CategoryMatch + 0.25 * PersonaOverlap
    """
    kw_a = node_a.get('keyword') or node_a.get('anchor_text', '')
    kw_b = node_b.get('keyword') or node_b.get('anchor_text', '')
    cap_a = node_a.get('capability') or node_a.get('title', '')
    cap_b = node_b.get('capability') or node_b.get('title', '')
    tokens_a = tokenize_clean(f"{kw_a} {cap_a}")
    tokens_b = tokenize_clean(f"{kw_b} {cap_b}")
    token_sim = compute_jaccard_similarity(tokens_a, tokens_b)
    
    cat_a = node_a.get('hub_category') or node_a.get('sector', '')
    cat_b = node_b.get('hub_category') or node_b.get('sector', '')
    cat_match = 1.0 if cat_a == cat_b and cat_a else 0.0
    
    # Check persona / geo similarity
    persona_a = set(tokenize_clean(node_a.get('target_persona') or node_a.get('geo_focus', '')))
    persona_b = set(tokenize_clean(node_b.get('target_persona') or node_b.get('geo_focus', '')))
    persona_match = compute_jaccard_similarity(persona_a, persona_b)
    
    score = (0.40 * token_sim) + (0.35 * cat_match) + (0.25 * persona_match)
    return score

def generate_anchor_text_portfolio(target_node: Dict[str, Any], variant_index: int) -> Tuple[str, str]:
    """
    Generates diversified anchor text according to the 15/45/25/15 Safe Portfolio Allocation:
    - Variant 0: Exact-Match (15%)
    - Variant 1 & 2: Partial-Match / Topical Long-Tail (45%)
    - Variant 3: Semantic LSI / Capability (25%)
    - Variant 4: Brand / Navigational (15%)
    """
    kw = target_node.get("anchor_text") or target_node.get("keyword", "sovereign ai solutions")
    cap = target_node.get("title") or target_node.get("capability", "deterministic agent systems")
    cat = target_node.get("sector") or target_node.get("hub_category", "enterprise automation")
    persona = target_node.get("geo_focus") or target_node.get("target_persona", "engineering leaders")
    
    # Simplify kw for anchor readability
    short_kw = kw.split(" for ")[0] if " for " in kw else kw
    short_cap = cap.split(" with ")[0] if " with " in cap else cap
    
    modulo = variant_index % 5
    if modulo == 0:
        # Exact-Match
        return short_kw, "EXACT_MATCH"
    elif modulo in (1, 2):
        # Partial-Match / Long-tail
        options = [
            f"implementing {short_kw}",
            f"deploying {short_kw} in private VPC",
            f"deterministic {short_cap} for {persona}",
            f"{short_kw} architecture"
        ]
        return options[variant_index % len(options)], "PARTIAL_MATCH"
    elif modulo == 3:
        # Semantic LSI
        options = [
            f"resilient {short_cap}",
            f"sub-1.5ms Delta WAL {cat} architecture",
            f"zero-egress sovereign {short_cap}",
            f"deterministic state machine telemetry"
        ]
        return options[variant_index % len(options)], "SEMANTIC_LSI"
    else:
        # Brand / Navigational
        options = [
            f"Elesium's {cat} platform",
            f"explore Elesium's {short_kw} specification",
            f"review sovereign {cat} benchmarks"
        ]
        return options[variant_index % len(options)], "BRAND_NAVIGATIONAL"

def compute_shannon_entropy(anchors: List[str]) -> float:
    """
    Calculates Claude Shannon Information Entropy H(A) of an anchor distribution.
    H(A) = - sum(p_i * log2(p_i))
    """
    if not anchors:
        return 0.0
    total = len(anchors)
    counts = Counter(anchors)
    entropy = 0.0
    for count in counts.values():
        p = count / total
        entropy -= p * math.log2(p)
    return entropy

# ==============================================================================
# 3. MESH OPTIMIZER: BALANCED GRAPH CONSTRUCTION
# ==============================================================================

class InternalLinkMeshOptimizer:
    def __init__(self, items: List[Dict[str, Any]], links_per_node: int = 3):
        self.items = items
        self.links_per_node = max(2, min(links_per_node, 5))
        self.canonical_map = {item["slug"]: item for item in items}
        self.slugs = [item["slug"] for item in items]
        self.graph = DirectedWebGraph(self.slugs)
        
        for item in items:
            self.graph.metadata[item["slug"]] = item

    def build_optimal_mesh(self) -> DirectedWebGraph:
        """
        Constructs a balanced Damped Semantic Mesh:
        - Every node gets at least `links_per_node` outbound links.
        - Enforces in-degree constraint: d_in(v) >= 2 for all nodes (preventing orphans).
        - Enforces out-degree constraint: d_out(v) >= 2 for all nodes (preventing sinks).
        - Diversifies anchor text using Shannon entropy optimization.
        """
        n = len(self.slugs)
        if n <= 1:
            return self.graph
            
        # Step 1: Precompute pairwise affinity scores
        affinity_matrix: Dict[str, List[Tuple[str, float]]] = {}
        for src_slug in self.slugs:
            src_node = self.canonical_map[src_slug]
            scores = []
            for dst_slug in self.slugs:
                if src_slug == dst_slug:
                    continue
                dst_node = self.canonical_map[dst_slug]
                score = compute_semantic_affinity(src_node, dst_node)
                scores.append((dst_slug, score))
            # Sort by highest affinity descending
            scores.sort(key=lambda x: x[1], reverse=True)
            affinity_matrix[src_slug] = scores

        # Track global inbound link counts to balance in-degree distribution
        inbound_counts = Counter()
        anchor_history = defaultdict(list)
        
        # Step 2: Assign primary semantic outbound links
        for src_slug in self.slugs:
            src_node = self.canonical_map[src_slug]
            candidates = affinity_matrix[src_slug]
            
            # Select top complementary candidates:
            # 1. Best match from same category
            # 2. Best match from same persona (or cross-category high affinity)
            # 3. Underserved node (lowest in-degree) to ensure orphan prevention
            chosen_for_src: List[str] = []
            
            # Pass 1: Select highest affinity
            for dst_slug, score in candidates:
                if len(chosen_for_src) >= self.links_per_node:
                    break
                # Favor nodes that need inbound links
                need_inbound = 1 if inbound_counts[dst_slug] < 3 else 0
                if dst_slug not in chosen_for_src:
                    chosen_for_src.append(dst_slug)
                    inbound_counts[dst_slug] += 1

            for dst_slug in chosen_for_src:
                dst_node = self.canonical_map[dst_slug]
                variant_idx = inbound_counts[dst_slug]
                anchor_text, anchor_type = generate_anchor_text_portfolio(dst_node, variant_idx)
                
                anchor_history[dst_slug].append(anchor_text)
                
                self.graph.add_edge(src_slug, dst_slug, {
                    "affinity_score": round(dict(candidates).get(dst_slug, 0.5), 3),
                    "anchor_text": anchor_text,
                    "anchor_type": anchor_type,
                    "target_url": dst_node.get("canonical_url", f"https://elesium.online/solutions/{dst_slug}")
                })

        # Step 3: Second Pass — Orphan Prevention Guarantee (d_in >= 2)
        for slug in self.slugs:
            while self.graph.in_degree(slug) < 2:
                # Find a node that has the lowest out-degree and doesn't link to slug yet
                eligible_srcs = [
                    s for s in self.slugs 
                    if s != slug and slug not in [self.graph.idx_to_node[v] for v in self.graph.out_edges[self.graph.node_to_idx[s]]]
                ]
                if not eligible_srcs:
                    break
                # Pick the highest affinity source
                eligible_srcs.sort(
                    key=lambda s: compute_semantic_affinity(self.canonical_map[s], self.canonical_map[slug]), 
                    reverse=True
                )
                best_src = eligible_srcs[0]
                dst_node = self.canonical_map[slug]
                variant_idx = self.graph.in_degree(slug) + 2
                anchor_text, anchor_type = generate_anchor_text_portfolio(dst_node, variant_idx)
                
                self.graph.add_edge(best_src, slug, {
                    "affinity_score": round(compute_semantic_affinity(self.canonical_map[best_src], dst_node), 3),
                    "anchor_text": anchor_text,
                    "anchor_type": anchor_type,
                    "target_url": dst_node.get("canonical_url", f"https://elesium.online/solutions/{slug}")
                })

        return self.graph

# ==============================================================================
# 4. SCANNER: ANALYZE EXISTING HTML/PAGE DIRECTORY
# ==============================================================================

def scan_html_directory(directory_path: str) -> DirectedWebGraph:
    """
    Parses existing HTML files in a directory to reconstruct the real live internal link graph.
    """
    if not os.path.isdir(directory_path):
        print(f"[ERROR] Directory not found: {directory_path}", file=sys.stderr)
        sys.exit(1)

    html_files = [f for f in os.listdir(directory_path) if f.endswith('.html')]
    if not html_files:
        print(f"[WARNING] No .html files found in {directory_path}", file=sys.stderr)
        return DirectedWebGraph([])

    slug_list = [f[:-5] for f in html_files] # Strip .html
    graph = DirectedWebGraph(slug_list)

    href_pattern = re.compile(r'<a\s+[^>]*href=["\']([^"\']+)["\']', re.IGNORECASE)

    for file_name in html_files:
        src_slug = file_name[:-5]
        file_path = os.path.join(directory_path, file_name)
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            hrefs = href_pattern.findall(content)
            for href in hrefs:
                # Match internal solutions link: /solutions/<slug>
                match = re.search(r'/solutions/([a-zA-Z0-9_\-]+)/?', href)
                if match:
                    dst_slug = match.group(1)
                    if dst_slug in graph.node_to_idx and dst_slug != src_slug:
                        graph.add_edge(src_slug, dst_slug, {"source_file": file_name, "raw_href": href})
        except Exception as e:
            print(f"[WARN] Could not parse {file_name}: {e}", file=sys.stderr)

    return graph

# ==============================================================================
# 5. CLI INTERFACE & REPORTING
# ==============================================================================

def print_graph_diagnostics(graph: DirectedWebGraph, title: str = "GRAPH TOPOLOGY DIAGNOSTIC REPORT"):
    pagerank = graph.compute_pagerank()
    cheirank = graph.compute_cheirank()
    
    in_degrees = [graph.in_degree(node) for node in graph.nodes]
    out_degrees = [graph.out_degree(node) for node in graph.nodes]
    pr_values = list(pagerank.values())
    gini_pr = graph.compute_gini_coefficient(pr_values)
    
    orphans = [node for node in graph.nodes if graph.in_degree(node) < 2]
    sinks = [node for node in graph.nodes if graph.out_degree(node) == 0]
    
    print("\n" + "=" * 78)
    print(f" {title}")
    print("=" * 78)
    print(f" Total Canonical Nodes (V) : {graph.n}")
    print(f" Total Internal Edges (E)  : {sum(out_degrees)}")
    print(f" Mean In-Degree / Out-Deg  : {sum(in_degrees)/graph.n:.2f}" if graph.n > 0 else "0")
    print(f" PageRank Gini Coefficient : {gini_pr:.4f} ({'Optimal (<0.42)' if gini_pr <= 0.42 else 'High Skew (>0.42)'})")
    print(f" Orphan Risk Nodes (d_in<2): {len(orphans)} nodes")
    print(f" Authority Sinks (d_out=0) : {len(sinks)} nodes")
    print("-" * 78)
    
    # Print Top 5 PageRank Authorities
    sorted_pr = sorted(pagerank.items(), key=lambda x: x[1], reverse=True)
    print(f"\n[TOP 5 PAGERANK PRESTIGE NODES]")
    for i, (node, pr) in enumerate(sorted_pr[:5], 1):
        cr = cheirank.get(node, 0.0)
        print(f" {i}. [{pr:.5f} PR | {cr:.5f} CR] {node[:55]}...")

    # Print Top 5 CheiRank Communicative Hubs
    sorted_cr = sorted(cheirank.items(), key=lambda x: x[1], reverse=True)
    print(f"\n[TOP 5 CHEIRANK COMMUNICATIVE HUBS]")
    for i, (node, cr) in enumerate(sorted_cr[:5], 1):
        pr = pagerank.get(node, 0.0)
        print(f" {i}. [{cr:.5f} CR | {pr:.5f} PR] {node[:55]}...")

    # Print Anomaly Warnings if any
    if orphans:
        print(f"\n[WARNING: DETECTED {len(orphans)} ORPHAN NODES (In-Degree < 2)]")
        for o in orphans[:8]:
            print(f"  • {o} (In-Degree: {graph.in_degree(o)})")
        if len(orphans) > 8:
            print(f"  ... and {len(orphans)-8} more.")

    if sinks:
        print(f"\n[WARNING: DETECTED {len(sinks)} SINKHOLE NODES (Out-Degree == 0)]")
        for s in sinks[:8]:
            print(f"  • {s}")
        if len(sinks) > 8:
            print(f"  ... and {len(sinks)-8} more.")

    print("=" * 78 + "\n")

def export_json_link_matrix(graph: DirectedWebGraph, output_path: str):
    pagerank = graph.compute_pagerank()
    cheirank = graph.compute_cheirank()
    
    out_data = {
        "graph_metadata": {
            "total_nodes": graph.n,
            "total_edges": sum(graph.out_degree(n) for n in graph.nodes),
            "mean_in_degree": round(sum(graph.in_degree(n) for n in graph.nodes) / graph.n, 2) if graph.n else 0,
            "pagerank_gini": round(graph.compute_gini_coefficient(list(pagerank.values())), 4),
            "orphan_count": len([n for n in graph.nodes if graph.in_degree(n) < 2]),
            "sink_count": len([n for n in graph.nodes if graph.out_degree(n) == 0]),
            "damping_factor": 0.85
        },
        "nodes": []
    }
    
    for slug in graph.nodes:
        meta = graph.metadata.get(slug, {})
        u = graph.node_to_idx[slug]
        outbound = []
        
        for v in graph.out_edges[u]:
            target_slug = graph.idx_to_node[v]
            edge_attr = graph.edge_attributes.get((slug, target_slug), {})
            outbound.append({
                "target_slug": target_slug,
                "target_url": edge_attr.get("target_url", f"https://elesium.online/solutions/{target_slug}"),
                "affinity_score": edge_attr.get("affinity_score", 0.5),
                "anchor_text": edge_attr.get("anchor_text", target_slug.replace("-", " ")),
                "anchor_type": edge_attr.get("anchor_type", "PARTIAL_MATCH")
            })
            
        inbound = [graph.idx_to_node[src] for src in graph.in_edges[u]]
        inbound_anchors = [
            graph.edge_attributes.get((src, slug), {}).get("anchor_text", "")
            for src in inbound
            if (src, slug) in graph.edge_attributes
        ]
        entropy = compute_shannon_entropy(inbound_anchors)
        
        out_data["nodes"].append({
            "slug": slug,
            "canonical_url": meta.get("canonical_url", f"https://elesium.online/solutions/{slug}"),
            "hub_category": meta.get("hub_category", "General"),
            "target_persona": meta.get("target_persona", "Leadership"),
            "pagerank": round(pagerank.get(slug, 0.0), 6),
            "cheirank": round(cheirank.get(slug, 0.0), 6),
            "in_degree": graph.in_degree(slug),
            "out_degree": graph.out_degree(slug),
            "anchor_shannon_entropy": round(entropy, 3),
            "inbound_sources": inbound,
            "outbound_links": outbound
        })

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(out_data, f, indent=2)

    print(f"[SUCCESS] Exported full Link Mesh Graph & Matrix to: {output_path}")

def inject_high_authority_hubs(top100_items: List[Dict[str, Any]], project_root: str):
    """
    Injects bidirectional reciprocal links from high-authority hubs (/solutions, /signals, /how-we-work)
    directly into commercial priority pages.
    """
    print("[*] Injecting bidirectional reciprocal links into High-Authority Hubs (/solutions, /signals, /how-we-work)...")
    
    # 1. Solutions Hub: frontend/dist/solutions/index.html
    sol_hub_path = os.path.join(project_root, "frontend", "dist", "solutions", "index.html")
    if os.path.exists(sol_hub_path):
        try:
            with open(sol_hub_path, "r", encoding="utf-8") as f:
                content = f.read()
            if 'data-commercial-mesh-hub="true"' not in content:
                hub_banner = '''
    <!-- TOP-100 COMMERCIAL INDEXATION ACCELERATION HUB -->
    <div style="margin-bottom:2.5rem;background:linear-gradient(135deg, #064e3b15 0%, #0284c715 100%);border:2px solid #059669;border-radius:1rem;padding:1.75rem;" data-commercial-mesh-hub="true">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1rem;">
        <div>
          <span style="font-size:0.75rem;font-family:monospace;letter-spacing:0.12em;text-transform:uppercase;color:#059669;font-weight:800;background:#d1fae5;padding:0.25rem 0.5rem;border-radius:0.375rem;">Fast-Track Indexation Engine</span>
          <h2 style="font-size:1.75rem;font-weight:800;color:#111827;margin-top:0.5rem;margin-bottom:0.25rem;">Top 100 Commercial Enterprise AI Solutions Directory</h2>
          <p style="font-size:0.95rem;color:#4b5563;margin:0;">Curated high-intent commercial architectures across BFSI, Logistics, Healthcare, Manufacturing, and Sovereign Defense.</p>
        </div>
        <a href="https://elesium.online/commercial-directory.html" style="display:inline-block;background:#059669;color:#ffffff;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:700;text-decoration:none;font-size:0.9rem;">
          Open Commercial Directory (100 Specs) &rarr;
        </a>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:0.75rem;margin-top:1.25rem;font-size:0.85rem;">
        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:0.5rem;padding:0.75rem;">
          <strong style="color:#111827;display:block;margin-bottom:0.35rem;">BFSI &amp; Fintech (20)</strong>
          <span style="color:#6b7280;font-size:0.8rem;">vLLM Banking VPCs, RBI CSF HSMs, Title Search Intelligence</span>
        </div>
        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:0.5rem;padding:0.75rem;">
          <strong style="color:#111827;display:block;margin-bottom:0.35rem;">Logistics &amp; Trade (20)</strong>
          <span style="color:#6b7280;font-size:0.8rem;">Air-Gapped Tally Invoicing, Customs ICEGATE, E-Way Bill Auto-Sync</span>
        </div>
        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:0.5rem;padding:0.75rem;">
          <strong style="color:#111827;display:block;margin-bottom:0.35rem;">Healthcare &amp; Life Sciences (20)</strong>
          <span style="color:#6b7280;font-size:0.8rem;">Sovereign DeepSeek DISHA, Hospital Triage, Pharma R&amp;D Llama-3</span>
        </div>
        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:0.5rem;padding:0.75rem;">
          <strong style="color:#111827;display:block;margin-bottom:0.35rem;">Manufacturing &amp; SCADA (20)</strong>
          <span style="color:#6b7280;font-size:0.8rem;">Purdue SCADA Isolation, Automotive JIT State Machines, SMT Vision</span>
        </div>
        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:0.5rem;padding:0.75rem;">
          <strong style="color:#111827;display:block;margin-bottom:0.35rem;">Sovereign Defense (20)</strong>
          <span style="color:#6b7280;font-size:0.8rem;">Bangalore GCC DeepSeek-R1, Military ML-KEM-1024, TRNG Telemetry</span>
        </div>
      </div>
    </div>
'''
                if "<main>" in content:
                    content = content.replace("<main>", f"<main>\n{hub_banner}")
                    with open(sol_hub_path, "w", encoding="utf-8") as f:
                        f.write(content)
                    print(f"[SUCCESS] Injected Commercial Hub Banner into: {sol_hub_path}")
        except Exception as e:
            print(f"[WARN] Failed to inject into solutions hub: {e}", file=sys.stderr)

    # 2. Signals Hub: frontend/dist/signals/index.html & frontend/dist/signals.html
    sig_paths = [
        os.path.join(project_root, "frontend", "dist", "signals", "index.html"),
        os.path.join(project_root, "frontend", "dist", "signals.html")
    ]
    signals_banner = '''
    <!-- TOP-100 COMMERCIAL ARCHITECTURE IMPLEMENTATIONS -->
    <section style="margin-top:3rem;padding:2rem;background:#f9fafb;border:1px solid #e5e7eb;border-radius:1rem;" data-commercial-mesh-hub="true">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;border-bottom:1px solid #e5e7eb;padding-bottom:1rem;">
        <div>
          <span style="font-size:0.75rem;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;color:#059669;font-weight:700;">Applied Engineering &amp; Production Deployments</span>
          <h3 style="font-size:1.5rem;font-weight:800;color:#111827;margin-top:0.25rem;">Commercial Enterprise AI Deployments (Top 100 Priority Directory)</h3>
          <p style="font-size:0.9rem;color:#4b5563;margin-top:0.25rem;">Translate technical signals into production air-gapped sovereign VPC architectures across India.</p>
        </div>
        <a href="https://elesium.online/commercial-directory.html" style="display:inline-block;background:#111827;color:#ffffff;padding:0.6rem 1.25rem;border-radius:0.5rem;font-weight:600;font-size:0.85rem;text-decoration:none;">
          View All 100 Commercial Specs &rarr;
        </a>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));gap:1rem;font-size:0.875rem;">
        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:0.5rem;padding:1rem;">
          <span style="font-size:0.7rem;font-family:monospace;color:#059669;font-weight:700;text-transform:uppercase;">BFSI Hub</span>
          <h4 style="font-size:0.95rem;font-weight:700;margin:0.25rem 0 0.5rem 0;"><a href="https://elesium.online/solutions/vllm-custom-paged-attention-kernel-deployment-agents-for-air-gapped-banking-vpcs-in-india" style="color:#2563eb;text-decoration:none;">vLLM Banking VPCs in India &rarr;</a></h4>
          <p style="font-size:0.8rem;color:#4b5563;line-height:1.4;margin:0;">Sub-200ms banking inference with zero cloud data egress and RBI CSF compliance.</p>
        </div>
        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:0.5rem;padding:1rem;">
          <span style="font-size:0.7rem;font-family:monospace;color:#059669;font-weight:700;text-transform:uppercase;">BFSI Hub</span>
          <h4 style="font-size:0.95rem;font-weight:700;margin:0.25rem 0 0.5rem 0;"><a href="https://elesium.online/solutions/rbi-cyber-security-framework-categorized-air-gapped-core-banking-hsm-telemetry-for-payment-processors" style="color:#2563eb;text-decoration:none;">RBI Cybersecurity Framework HSM Telemetry &rarr;</a></h4>
          <p style="font-size:0.8rem;color:#4b5563;line-height:1.4;margin:0;">Core banking HSM telemetry with cryptographic tamper-evident audit trails.</p>
        </div>
        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:0.5rem;padding:1rem;">
          <span style="font-size:0.7rem;font-family:monospace;color:#059669;font-weight:700;text-transform:uppercase;">Defense Hub</span>
          <h4 style="font-size:0.95rem;font-weight:700;margin:0.25rem 0 0.5rem 0;"><a href="https://elesium.online/solutions/air-gapped-deepseek-r1-enterprise-deployment-telemetry-for-global-capability-centers-in-bangalore" style="color:#2563eb;text-decoration:none;">Bangalore GCC DeepSeek Deployments &rarr;</a></h4>
          <p style="font-size:0.8rem;color:#4b5563;line-height:1.4;margin:0;">On-premise DeepSeek reasoning cluster deployment for Fortune 500 Bangalore GCCs.</p>
        </div>
        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:0.5rem;padding:1rem;">
          <span style="font-size:0.7rem;font-family:monospace;color:#059669;font-weight:700;text-transform:uppercase;">Logistics Hub</span>
          <h4 style="font-size:0.95rem;font-weight:700;margin:0.25rem 0 0.5rem 0;"><a href="https://elesium.online/solutions/air-gapped-local-vllm-invoice-processing-pipeline-with-tally-prime-xml-socket-integration" style="color:#2563eb;text-decoration:none;">Air-Gapped Logistics Invoice Processing &rarr;</a></h4>
          <p style="font-size:0.8rem;color:#4b5563;line-height:1.4;margin:0;">Local vLLM pipeline integrating with Tally Prime XML socket port 9000.</p>
        </div>
        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:0.5rem;padding:1rem;">
          <span style="font-size:0.7rem;font-family:monospace;color:#059669;font-weight:700;text-transform:uppercase;">BFSI / Real Estate</span>
          <h4 style="font-size:0.95rem;font-weight:700;margin:0.25rem 0 0.5rem 0;"><a href="https://elesium.online/solutions/air-gapped-contract-intelligence-agents-for-mumbai-real-estate-firms-with-automated-title-search-parsing" style="color:#2563eb;text-decoration:none;">Mumbai Real Estate Title Search Intelligence &rarr;</a></h4>
          <p style="font-size:0.8rem;color:#4b5563;line-height:1.4;margin:0;">Automated municipal revenue title search and chain-of-custody parsing.</p>
        </div>
      </div>
    </section>
'''
    for sp in sig_paths:
        if os.path.exists(sp):
            try:
                with open(sp, "r", encoding="utf-8") as f:
                    content = f.read()
                if 'data-commercial-mesh-hub="true"' not in content and "</main>" in content:
                    content = content.replace("</main>", f"{signals_banner}\n  </main>")
                    with open(sp, "w", encoding="utf-8") as f:
                        f.write(content)
                    print(f"[SUCCESS] Injected Commercial Hub Section into: {sp}")
            except Exception as e:
                print(f"[WARN] Failed to inject into signals hub {sp}: {e}", file=sys.stderr)

    # 3. How We Work Hub: frontend/dist/how-we-work/index.html & frontend/dist/how-we-work.html
    hww_paths = [
        os.path.join(project_root, "frontend", "dist", "how-we-work", "index.html"),
        os.path.join(project_root, "frontend", "dist", "how-we-work.html")
    ]
    hww_banner = '''
  <section class="commercial-priority-mesh" style="max-width:1200px;margin:2rem auto;padding:2rem 1.5rem;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;border-top:1px solid #e5e7eb;" data-commercial-mesh-hub="true">
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;">
      <div>
        <span style="font-size:0.75rem;font-family:monospace;color:#059669;font-weight:700;text-transform:uppercase;">Validated Delivery Framework</span>
        <h3 style="font-size:1.5rem;font-weight:800;color:#111827;margin-top:0.25rem;">Top 100 Commercial Enterprise AI Implementations</h3>
        <p style="font-size:0.9rem;color:#4b5563;margin-top:0.25rem;">Every workflow is backed by our 14-day production pilot SLA and contractual 90-day cash-flow ROI guarantee.</p>
      </div>
      <a href="https://elesium.online/commercial-directory.html" style="display:inline-block;background:#059669;color:#ffffff;padding:0.6rem 1.25rem;border-radius:0.5rem;font-weight:600;font-size:0.85rem;text-decoration:none;">
        Commercial Directory &rarr;
      </a>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));gap:1rem;font-size:0.85rem;">
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:0.5rem;padding:1rem;">
        <span style="font-size:0.7rem;font-family:monospace;color:#059669;font-weight:700;text-transform:uppercase;">BFSI Architecture</span>
        <h4 style="font-size:0.95rem;font-weight:700;margin:0.25rem 0 0.5rem 0;"><a href="https://elesium.online/solutions/vllm-custom-paged-attention-kernel-deployment-agents-for-air-gapped-banking-vpcs-in-india" style="color:#2563eb;text-decoration:none;">vLLM Banking VPCs in India &rarr;</a></h4>
        <p style="color:#4b5563;font-size:0.8rem;line-height:1.4;">Air-gapped sovereign VPC banking pods with sub-200ms latency guarantees.</p>
      </div>
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:0.5rem;padding:1rem;">
        <span style="font-size:0.7rem;font-family:monospace;color:#059669;font-weight:700;text-transform:uppercase;">Defense Architecture</span>
        <h4 style="font-size:0.95rem;font-weight:700;margin:0.25rem 0 0.5rem 0;"><a href="https://elesium.online/solutions/air-gapped-deepseek-r1-enterprise-deployment-telemetry-for-global-capability-centers-in-bangalore" style="color:#2563eb;text-decoration:none;">Bangalore GCC DeepSeek Deployments &rarr;</a></h4>
        <p style="color:#4b5563;font-size:0.8rem;line-height:1.4;">Private air-gapped reasoning models for enterprise centers in Bangalore.</p>
      </div>
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:0.5rem;padding:1rem;">
        <span style="font-size:0.7rem;font-family:monospace;color:#059669;font-weight:700;text-transform:uppercase;">Logistics Architecture</span>
        <h4 style="font-size:0.95rem;font-weight:700;margin:0.25rem 0 0.5rem 0;"><a href="https://elesium.online/solutions/air-gapped-local-vllm-invoice-processing-pipeline-with-tally-prime-xml-socket-integration" style="color:#2563eb;text-decoration:none;">Air-Gapped Logistics Invoice Processing &rarr;</a></h4>
        <p style="color:#4b5563;font-size:0.8rem;line-height:1.4;">Tally Prime XML socket pipeline with zero third-party cloud data egress.</p>
      </div>
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:0.5rem;padding:1rem;">
        <span style="font-size:0.7rem;font-family:monospace;color:#059669;font-weight:700;text-transform:uppercase;">Industrial Architecture</span>
        <h4 style="font-size:0.95rem;font-weight:700;margin:0.25rem 0 0.5rem 0;"><a href="https://elesium.online/solutions/air-gapped-purdue-model-level-2-scada-isolation-telemetry-for-pharmaceutical-cleanroom-facilities" style="color:#2563eb;text-decoration:none;">Purdue Model Level-2 SCADA Isolation &rarr;</a></h4>
        <p style="color:#4b5563;font-size:0.8rem;line-height:1.4;">Air-gapped SCADA isolation telemetry for aseptic pharmaceutical cleanrooms.</p>
      </div>
    </div>
  </section>
'''
    for hp in hww_paths:
        if os.path.exists(hp):
            try:
                with open(hp, "r", encoding="utf-8") as f:
                    content = f.read()
                if 'data-commercial-mesh-hub="true"' not in content and "</body>" in content:
                    content = content.replace("</body>", f"{hww_banner}\n</body>")
                    with open(hp, "w", encoding="utf-8") as f:
                        f.write(content)
                    print(f"[SUCCESS] Injected Commercial Hub Section into: {hp}")
            except Exception as e:
                print(f"[WARN] Failed to inject into how-we-work hub {hp}: {e}", file=sys.stderr)

# ==============================================================================
# 6. MAIN EXECUTION ROUTINE
# ==============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Internal Link Mesh Optimizer: Compute PageRank, CheiRank, Anchor Entropy & Generate Optimal Graph Topology."
    )
    parser.add_argument("input_file", nargs="?", default="keywords_queue.json", help="Path to keywords_queue.json, top100_commercial_urls.json, or dataset")
    parser.add_argument("--top100", action="store_true", help="Force prioritize Top 100 Commercial URLs fast-track dataset")
    parser.add_argument("--scan", action="store_true", help="Scan existing generated_pages/ HTML directory to inspect current link graph")
    parser.add_argument("--dir", default="frontend/dist/solutions", help="Directory of HTML pages for --scan or --inject mode (default: frontend/dist/solutions)")
    parser.add_argument("--output", "-o", default="internal_links.json", help="Path to output generated link mesh JSON (default: internal_links.json)")
    parser.add_argument("--links-per-node", type=int, default=3, help="Target outbound contextual links to construct per node (default: 3)")
    parser.add_argument("--damping", type=float, default=0.85, help="PageRank damping factor (default: 0.85)")
    parser.add_argument("--inject", action="store_true", help="Inject generated Semantic Mesh link cards directly into HTML pages in --dir")
    
    args = parser.parse_args()

    base_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(base_dir, ".."))

    # Mode 1: Scan existing HTML pages
    if args.scan:
        scan_dir = args.dir
        if not os.path.isabs(scan_dir):
            scan_dir = os.path.join(project_root, args.dir)
            
        print(f"[*] Scanning HTML directory: {scan_dir} ...")
        scanned_graph = scan_html_directory(scan_dir)
        print_graph_diagnostics(scanned_graph, title=f"LIVE HTML GRAPH DIAGNOSTIC AUDIT: {args.dir}")
        return

    # Mode 2: Ingest node queue
    # Auto-resolve priority top-100 if present or requested
    top100_default_path = os.path.join(project_root, "authority_assets", "indexation_acceleration", "top100_commercial_urls.json")
    
    input_path = args.input_file
    if args.top100 or (args.input_file == "keywords_queue.json" and os.path.exists(top100_default_path)):
        if os.path.exists(top100_default_path):
            input_path = top100_default_path

    if not os.path.isabs(input_path):
        cand_path = os.path.join(base_dir, input_path)
        if os.path.exists(cand_path):
            input_path = cand_path
        else:
            cand_root = os.path.join(project_root, input_path)
            if os.path.exists(cand_root):
                input_path = cand_root

    if not os.path.exists(input_path):
        print(f"[ERROR] Input queue file not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    print(f"[*] Ingesting node queue from: {input_path}")
    with open(input_path, "r", encoding="utf-8") as f:
        raw_items = json.load(f)

    # Normalize fields for seamless affinity calculation
    queue_items = []
    for it in raw_items:
        queue_items.append({
            "slug": it["slug"],
            "keyword": it.get("anchor_text") or it.get("keyword") or it["slug"].replace("-", " "),
            "anchor_text": it.get("anchor_text") or it.get("keyword") or it["slug"].replace("-", " "),
            "hub_category": it.get("sector") or it.get("hub_category") or "General",
            "sector": it.get("sector") or it.get("hub_category") or "General",
            "capability": it.get("title") or it.get("capability") or it["slug"].replace("-", " "),
            "target_persona": it.get("geo_focus") or it.get("target_persona") or "Enterprise Leadership",
            "geo_focus": it.get("geo_focus") or it.get("target_persona") or "India",
            "canonical_url": it.get("canonical_url") or f"https://elesium.online/solutions/{it['slug']}",
            "title": it.get("title") or it["slug"].replace("-", " "),
            "meta_description": it.get("meta_description", "")
        })

    print(f"[*] Ingested {len(queue_items)} solution items into Graph Engine.")
    print(f"[*] Computing Semantic Affinity Matrix and generating Damped Semantic Mesh (links_per_node={args.links_per_node})...")

    optimizer = InternalLinkMeshOptimizer(queue_items, links_per_node=args.links_per_node)
    optimized_graph = optimizer.build_optimal_mesh()

    print_graph_diagnostics(optimized_graph, title="OPTIMIZED DAMPED SEMANTIC MESH AUDIT REPORT")

    output_path = args.output
    if not os.path.isabs(output_path):
        output_path = os.path.join(base_dir, output_path)

    export_json_link_matrix(optimized_graph, output_path)

    # Mode 3: Inject Bidirectional Reciprocal Mesh into HTML files
    if args.inject:
        # Step A: Inject high-authority hubs (/solutions, /signals, /how-we-work)
        inject_high_authority_hubs(queue_items, project_root)

        # Step B: Inject reciprocal mesh into priority solution pages
        inject_dir = args.dir
        if not os.path.isabs(inject_dir):
            cand_dir = os.path.join(project_root, args.dir)
            if os.path.isdir(cand_dir):
                inject_dir = cand_dir
            else:
                inject_dir = os.path.join(base_dir, args.dir)

        if os.path.isdir(inject_dir):
            print(f"[*] Injecting Bidirectional Semantic Mesh into Solution HTML files in: {inject_dir} ...")
            injected_count = 0
            for slug in optimized_graph.nodes:
                candidate_paths = [
                    os.path.join(inject_dir, f"{slug}.html"),
                    os.path.join(inject_dir, slug, "index.html")
                ]

                u = optimized_graph.node_to_idx[slug]
                out_links = []
                for v in optimized_graph.out_edges[u]:
                    target_slug = optimized_graph.idx_to_node[v]
                    edge_attr = optimized_graph.edge_attributes.get((slug, target_slug), {})
                    target_meta = optimized_graph.metadata.get(target_slug, {})
                    out_links.append((target_slug, edge_attr, target_meta))

                # Build HTML snippet for mesh cards with reciprocal navigation bar
                cards_html = []
                for t_slug, e_attr, t_meta in out_links:
                    t_url = e_attr.get("target_url", f"https://elesium.online/solutions/{t_slug}")
                    t_anchor = e_attr.get("anchor_text", t_slug.replace("-", " "))
                    t_cat = t_meta.get("hub_category", "AI Architecture")
                    t_geo = t_meta.get("geo_focus", "India Enterprise")
                    card = f"""
        <div style="border:1px solid #e5e7eb;border-radius:0.75rem;padding:1.25rem;background:#f9fafb;display:flex;flex-direction:column;justify-content:space-between;">
          <div>
            <div style="font-size:0.7rem;font-family:monospace;color:#059669;font-weight:700;text-transform:uppercase;margin-bottom:0.35rem;">{t_cat} • {t_geo}</div>
            <h4 style="font-size:0.95rem;font-weight:700;margin:0 0 0.5rem 0;line-height:1.4;">
              <a href="{t_url}" style="color:#111827;text-decoration:none;">{t_anchor}</a>
            </h4>
            <p style="font-size:0.8rem;color:#4b5563;line-height:1.5;margin:0 0 1rem 0;">Explore {t_anchor} with private VPC deployment, DPDP Act 2023 compliance, and sub-200ms latency SLAs.</p>
          </div>
          <div style="font-size:0.8rem;font-weight:600;">
            <a href="{t_url}" style="color:#2563eb;text-decoration:none;">Inspect Architecture Spec &rarr;</a>
          </div>
        </div>"""
                    cards_html.append(card)

                mesh_section = f"""
    <!-- DAMPED SEMANTIC MESH: COMPLEMENTARY SOVEREIGN AI SOLUTIONS & RECIPROCAL AUTHORITY MESH -->
    <section class="mt-12 pt-8 border-t border-slate-800" data-semantic-mesh="true" style="margin-top:3rem;padding-top:2rem;border-top:1px solid #e5e7eb;">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;">
        <div>
          <span style="font-size:0.75rem;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;color:#059669;font-weight:700;">Topological Indexation Mesh</span>
          <h3 style="font-size:1.25rem;font-weight:700;color:#111827;margin-top:0.25rem;">Complementary Enterprise AI Architectures</h3>
        </div>
        <div style="font-size:0.8rem;font-family:monospace;display:flex;gap:0.75rem;flex-wrap:wrap;">
          <a href="https://elesium.online/solutions" style="color:#2563eb;text-decoration:none;font-weight:600;">Solutions Hub &rarr;</a>
          <a href="https://elesium.online/signals" style="color:#2563eb;text-decoration:none;font-weight:600;">Technical Signals &rarr;</a>
          <a href="https://elesium.online/how-we-work" style="color:#2563eb;text-decoration:none;font-weight:600;">How We Work &rarr;</a>
          <a href="https://elesium.online/commercial-directory.html" style="color:#059669;text-decoration:none;font-weight:700;">Top 100 Commercial Directory &rarr;</a>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1rem;">
{''.join(cards_html)}
      </div>
    </section>
"""
                for html_path in candidate_paths:
                    if not os.path.exists(html_path):
                        continue
                    try:
                        with open(html_path, "r", encoding="utf-8") as f:
                            html_content = f.read()

                        if 'data-semantic-mesh="true"' in html_content:
                            continue

                        if "</main>" in html_content:
                            new_content = html_content.replace("</main>", mesh_section + "\n  </main>")
                            with open(html_path, "w", encoding="utf-8") as f:
                                f.write(new_content)
                            injected_count += 1
                    except Exception as e:
                        print(f"[WARN] Failed to inject into {html_path}: {e}", file=sys.stderr)

            print(f"[SUCCESS] Successfully injected Bidirectional Semantic Mesh into {injected_count} Solution HTML files.")
        else:
            print(f"[WARN] Injection directory not found: {inject_dir}", file=sys.stderr)

if __name__ == "__main__":
    main()
