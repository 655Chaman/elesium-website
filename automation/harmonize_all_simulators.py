#!/usr/bin/env python3
"""
Harmonizes all simulator pages in frontend/src/components/pages/ to the
Elesium Home Page reference standard:
- Pure monochrome styling (dark luxury background, border-white/10, white buttons with black text)
- Zero blinking or pulsing animations
- WhatsApp-first conversion funnel with openWhatsApp + <WhatsAppModal />
- Consistent corner radii (rounded-3xl cards, rounded-2xl nested cards, rounded-full buttons)
"""

import os
import re
import glob

PAGES_DIR = os.path.abspath('frontend/src/components/pages')

def harmonize_file(path: str) -> bool:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Strip all blinking/pulse/bounce animations
    content = re.sub(r'\banimate-(?:ping|pulse|bounce)\b', '', content)

    # 2. Add useWhatsApp import if missing
    if 'useWhatsApp' not in content:
        # Try inserting after MandateApplicationForm or after ExitIntentMemoModal or after last import
        if "from '../features/WaitingListForm'" in content:
            content = re.sub(
                r"(import\s*\{[^}]*MandateApplicationForm[^}]*\}\s*from\s*['\"]\.\./features/WaitingListForm['\"];?)",
                r"\1\nimport { useWhatsApp } from '../../hooks/useWhatsApp';",
                content,
                count=1
            )
        elif "from '../cro/ExitIntentMemoModal'" in content:
            content = re.sub(
                r"(import\s*\{[^}]*ExitIntentMemoModal[^}]*\}\s*from\s*['\"]\.\./cro/ExitIntentMemoModal['\"];?)",
                r"\1\nimport { useWhatsApp } from '../../hooks/useWhatsApp';",
                content,
                count=1
            )
        else:
            # Insert after the last import line
            imports = list(re.finditer(r'^import\s+.*?;?\s*$', content, re.MULTILINE))
            if imports:
                last_import = imports[-1]
                pos = last_import.end()
                content = content[:pos] + "\nimport { useWhatsApp } from '../../hooks/useWhatsApp';" + content[pos:]

    # 3. Add const { openWhatsApp, WhatsAppModal } = useWhatsApp(); in component function
    if 'useWhatsApp()' not in content:
        content = re.sub(
            r'(export\s+default\s+function\s+[A-Za-z0-9_]+\s*\([^)]*\)\s*\{)',
            r'\1\n  const { openWhatsApp, WhatsAppModal } = useWhatsApp();',
            content,
            count=1
        )

    # 4. Add WhatsApp button in Hero action row if missing
    if 'openWhatsApp' in content and content.count('openWhatsApp') == 1:
        # Find hero action buttons container (looks for setIsEmbedOpen(true) or copyMemo / copyExecutiveMemo)
        embed_btn = re.search(r'(<button\s+onClick=\{\(\)\s*=>\s*setIsEmbedOpen\(true\)\}[^>]*>[\s\S]*?</button>)', content)
        if embed_btn:
            wa_hero_btn = """<button
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>\n              """
            content = content[:embed_btn.start()] + wa_hero_btn + content[embed_btn.start():]

    # 5. Conversion area CTA:
    # A) If file uses ExpandableScreen, insert WhatsApp CTA right before ExpandableScreen
    if '<ExpandableScreen' in content and 'Chat on WhatsApp' not in content:
        wa_expandable_btn = """<button
                    onClick={() => openWhatsApp()}
                    className="px-5 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Chat on WhatsApp</span>
                  </button>\n                """
        content = re.sub(
            r'(<ExpandableScreen>)',
            lambda m: wa_expandable_btn + m.group(1),
            content,
            count=1
        )

    # B) If file embeds MandateApplicationForm directly and doesn't have ExpandableScreen
    if '<ExpandableScreen' not in content and 'Direct Lead Architect Intake' not in content:
        card = """{/* Luxury Monochrome WhatsApp Conversion Card */}
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
        </div>\n\n        """
        # Find MandateApplicationForm and insert before it
        content = re.sub(
            r'(<MandateApplicationForm(?:\s+[^>]*)?/>)',
            lambda m: card + m.group(1),
            content,
            count=1
        )

    # 6. Mount <WhatsAppModal /> before closing element
    if '<WhatsAppModal' not in content:
        content = re.sub(
            r'(</(?:div|article|main)>|</>)(\s*\);\s*\}\s*)$',
            r'      <WhatsAppModal />\n    \1\2',
            content
        )

    # 7. Convert button corner styling from rounded-xl to rounded-full in buttons
    content = re.sub(r'(<button[^>]*className="[^"]*)\brounded-xl\b([^"]*"[^>]*>)', r'\1rounded-full\2', content)

    # 8. Sanitize aggressive gradients on ExpandableScreenTrigger
    content = re.sub(r'bg-gradient-to-r\s+from-[a-z0-9\-/]+\s+to-[a-z0-9\-/]+', 'border border-white/10 bg-white/5 hover:bg-white/10 text-gray-200', content)

    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    pages = sorted(glob.glob(os.path.join(PAGES_DIR, '*.tsx')))
    modified = 0
    for p in pages:
        name = os.path.basename(p)
        if name.startswith('Embed') or name in ['Navbar.tsx', 'Footer.tsx']:
            continue
        if harmonize_file(p):
            print(f"Harmonized: {name}")
            modified += 1

    print(f"\nTotal files processed and harmonized: {modified}")

if __name__ == '__main__':
    main()
