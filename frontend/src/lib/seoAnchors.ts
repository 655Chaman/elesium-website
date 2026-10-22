export const ORDERED_CATEGORIES = [
    "Enterprise Infrastructure",
    "Industrial Manufacturing",
    "BFSI & Underwriting",
    "Logistics & Supply Chain",
    "Enterprise Foundation Model Inference & DeepSeek Serving Clusters",
    "ERP Integration",
    "Enterprise Cybersecurity & Cloud Infrastructure",
    "Healthcare & Regulated Systems",
    "AI Agents & Autonomous Workflows",
    "Healthcare AI",
    "Energy & Utilities",
    "Renewable Energy & Power Grid"
];

export const ROTATING_ANCHORS = [
    "Enterprise AI automation agency in India",
    "Sovereign AI engineering pod Bengaluru",
    "Indian enterprise multi-agent architectures",
    "BFSI & logistics AI automation India",
    "DPDP Act 2023 compliant enterprise systems"
];

export function getRotatingAnchorText(categoryName?: string): string {
    const cat = (categoryName || '').trim();
    let idx = ORDERED_CATEGORIES.indexOf(cat);
    if (idx === -1) {
        const catLower = cat.toLowerCase();
        if (["infrastructure", "industrial", "manufacturing"].some(k => catLower.includes(k))) {
            idx = 0;
        } else if (["logistics", "supply chain", "erp", "deepseek", "foundation"].some(k => catLower.includes(k))) {
            idx = 3;
        } else if (["security", "cyber", "agent", "workflow"].some(k => catLower.includes(k))) {
            idx = 6;
        } else if (["bfsi", "fintech", "banking", "health", "energy", "utility"].some(k => catLower.includes(k))) {
            idx = 9;
        } else {
            idx = 12;
        }
    }

    if (idx <= 2) {
        return ROTATING_ANCHORS[0];
    } else if (idx <= 5) {
        return ROTATING_ANCHORS[1];
    } else if (idx <= 8) {
        return ROTATING_ANCHORS[2];
    } else if (idx <= 11) {
        return ROTATING_ANCHORS[3];
    } else {
        return ROTATING_ANCHORS[4];
    }
}
