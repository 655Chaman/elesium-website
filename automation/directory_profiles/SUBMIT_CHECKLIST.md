# Elesium Directory Profiles — Submission Checklist

Follow these steps to publish and optimize Elesium's presence on the top three B2B directories.

## 1. Prioritization & Sign-Up URLs
Always prioritize **Clutch.co** first. For B2B engineering and AI agencies in India, Clutch has the highest domain authority and directly drives high-intent enterprise leads.
- **Clutch:** https://clutch.co/get-listed
- **GoodFirms:** https://www.goodfirms.co/add-company
- **G2:** https://sell.g2.com/

## 2. Step-by-Step Submission Sequence
### Phase 1: Clutch
1. Go to the Clutch "Get Listed" page and authenticate via LinkedIn.
2. Copy and paste all fields from `clutch_profile.md` exactly as formatted.
3. Add the Elesium logo (the `LOGO_NEW.png` high-res version).
4. Submit the profile for verification. Clutch may take 2-4 days to approve.

### Phase 2: GoodFirms
1. Create a vendor account on GoodFirms.
2. Fill in the specific percentage breakdowns from `goodfirms_profile.md`.
3. Upload at least 2 case studies using the provided templates to boost your initial algorithm ranking.
4. Submit the profile.

### Phase 3: G2
1. Claim your software/service listing on G2.
2. Since G2 is product-focused, position Elesium as an "AI Workflow Automation Platform."
3. Paste the feature list from `g2_profile.md` into your product capabilities.
4. Submit for review.

## 3. Getting Your First 3 Reviews in 30 Days
Your profiles are invisible without reviews. Follow this playbook:
1. **Identify 3 Champions:** Select three past or current clients who have seen a hard ROI (e.g., from the BFSI, SaaS, or Manufacturing case studies).
2. **Pre-Wire the Ask:** Call or WhatsApp them first. "Hey, we're launching our Clutch profile to scale. Would you be open to doing a quick 10-minute phone interview with them to review us?"
3. **Send the Template:** Immediately follow up with the email template provided in the markdown files containing the direct review link.
4. **Follow Up:** Clutch requires the reviewer to authenticate via LinkedIn to prevent fraud. Remind them of this so they aren't surprised.

## 4. Embed the Clutch Badge on the Elesium Website
1. Once your Clutch profile is approved and has at least one review, log in to your Clutch dashboard.
2. Navigate to the "Widgets" section.
3. Copy the script tag provided.
4. Update `automation/directory_profiles/clutch_badge_integration.tsx` by replacing the `TODO` comment with the actual script `src` URL.
5. Import and mount this component in `frontend/src/components/sections/Footer.tsx` or `About.tsx` to instantly build trust with site visitors.
