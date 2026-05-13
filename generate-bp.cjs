const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, PageOrientation, LevelFormat,
        BorderStyle, WidthType, ShadingType, PageNumber, PageBreak,
        HeadingLevel } = require('docx');
const fs = require('fs');

// ======== FINANCIAL DATA ========
const SEED_AMOUNT = 3000000;
const PRE_MONEY = 22000000;
const EQUITY_PCT = (SEED_AMOUNT / (PRE_MONEY + SEED_AMOUNT) * 100).toFixed(2); // 12.00%
const POST_MONEY = PRE_MONEY + SEED_AMOUNT; // 25,000,000

// ======== STYLES ========
const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, bold: true, size: 32, font: "Georgia" })],
    spacing: { before: 240, after: 240 },
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, bold: true, size: 28, font: "Georgia" })],
    spacing: { before: 180, after: 120 },
  });
}

function h3(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 24, font: "Georgia" })],
    spacing: { before: 160, after: 80 },
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, font: "Calibri", ...opts })],
    spacing: { after: 120 },
    alignment: opts.align || AlignmentType.LEFT,
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    children: [new TextRun({ text, size: 22, font: "Calibri" })],
    spacing: { after: 80 },
  });
}

function thCell(text, width) {
  return new TableCell({
    borders: cellBorders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: "1A1A1A", type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({
      children: [new TextRun({ text, bold: true, color: "F0D78C", size: 20, font: "Calibri" })],
    })],
  });
}

function tdCell(text, width, opts = {}) {
  return new TableCell({
    borders: cellBorders,
    width: { size: width, type: WidthType.DXA },
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    children: [new Paragraph({
      children: [new TextRun({ text, size: 20, font: "Calibri", ...opts })],
    })],
  });
}

// ======== DOCUMENT ========
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Georgia" },
        paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Georgia" },
        paragraph: { spacing: { before: 180, after: 180 }, outlineLevel: 1 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        children: [new TextRun({ text: "SuperNomad \u00b7 Business Plan v3.1", size: 18, color: "888888", font: "Calibri" })],
        alignment: AlignmentType.RIGHT,
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        children: [
          new TextRun({ text: "Confidential \u00b7 Page ", size: 18, color: "888888", font: "Calibri" }),
          new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "888888", font: "Calibri" }),
        ],
        alignment: AlignmentType.RIGHT,
      })] })
    },
    children: [
      // ======== PAGE 1: COVER ========
      new Paragraph({ children: [new TextRun({ text: "SUPERNOMAD", bold: true, size: 56, font: "Georgia", color: "1A1A1A" })], alignment: AlignmentType.CENTER, spacing: { after: 120 } }),
      new Paragraph({ children: [new TextRun({ text: "Business Plan v3.1 \u2014 Comprehensive Edition", italics: true, size: 28, font: "Georgia", color: "555555" })], alignment: AlignmentType.CENTER, spacing: { after: 200 } }),
      new Paragraph({ children: [new TextRun({ text: "The Sovereign AI Operating System for Global Citizens", size: 24, font: "Calibri", color: "333333" })], alignment: AlignmentType.CENTER, spacing: { after: 400 } }),
      
      new Paragraph({ children: [new TextRun({ text: `Seed Round: \u20ac${SEED_AMOUNT.toLocaleString()}`, bold: true, size: 26, font: "Calibri", color: "1A1A1A" })], alignment: AlignmentType.CENTER, spacing: { after: 80 } }),
      new Paragraph({ children: [new TextRun({ text: `Equity Offered: ${EQUITY_PCT}%  \u00b7  Pre-Money Valuation: \u20ac${PRE_MONEY.toLocaleString()}  \u00b7  Post-Money Valuation: \u20ac${POST_MONEY.toLocaleString()}`, size: 22, font: "Calibri", color: "333333" })], alignment: AlignmentType.CENTER, spacing: { after: 200 } }),
      
      new Paragraph({ children: [new TextRun({ text: "Confidential \u00b7 2026", italics: true, size: 22, font: "Calibri", color: "888888" })], alignment: AlignmentType.CENTER }),
      new Paragraph({ children: [new PageBreak()] }),

      // ======== PAGE 2: FOUNDER STORY + EXECUTIVE SUMMARY ========
      h2("1. Founder Story"),
      body("The SuperNomad story didn\u2019t start in a boardroom; it started out of a shared sense of frustration that many of us know all too well."),
      body("In 2025, a few high-profile headlines acted as a massive wake-up call. We watched a world-famous social media personality get deported from the US simply because a visa date slipped through the cracks. Then, a legendary Finnish rally driver was hit with a staggering \u20ac5 million tax bill\u2014not for a lack of funds, but for a few overdue days he didn\u2019t even see coming."),
      body("As an expat, these stories hit close to home. I\u2019ve lived the reality of being in a foreign country and receiving \u201cservice\u201d that ranged from indifferent to nonexistent. I\u2019ve seen the scams that wait around every corner\u2014the fake visa websites, the \u201cinflated\u201d taxi fares, and the predatory sellers who see a traveler as nothing more than a target."),
      body("The truth is, the world is full of invisible tripwires. You don\u2019t think about them when you\u2019re booking a dream trip; you only realize they\u2019re there when it\u2019s already too late to prepare."),
      body("I realized that today\u2019s traveler doesn\u2019t just need a booking engine\u2014they need a shield. I wanted to build a platform that thinks ten steps ahead for the premium traveler, solving problems before they even surface. Whether it\u2019s ensuring your tax residency is bulletproof, your visa is valid, or your ground transport is vetted and safe, SuperNomad was born to bring back something that\u2019s become incredibly rare in travel: absolute reliability."),
      body("We\u2019re here to make sure that when you\u2019re out exploring the world, the only thing you have to focus on is the journey. We\u2019ll handle the rest."),

      h2("2. Executive Summary"),
      body("SuperNomad is a premium AI ecosystem for people whose life, work, and money move across borders. It is not just a travel app; it is an operational layer that combines personal context, verified data, local services, compliance intelligence, and agentic commerce into one trusted assistant experience."),
      body(`We are raising \u20ac${SEED_AMOUNT.toLocaleString()} in seed funding for ${EQUITY_PCT}% equity, valuing the company at a \u20ac${(PRE_MONEY/1000000).toFixed(2)}M pre-money / \u20ac${(POST_MONEY/1000000).toFixed(2)}M post-money. Capital deploys into product completion, B2B revenue activation, regulatory licensing, and a measured 18-month growth runway to Series A.`),

      h3("Round Structure"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4000, 5360],
        rows: [
          new TableRow({ children: [thCell("Item", 4000), thCell("Value", 5360)] }),
          new TableRow({ children: [tdCell("Seed amount", 4000, {bold:true}), tdCell(`\u20ac${SEED_AMOUNT.toLocaleString()}`, 5360, {bold:true})] }),
          new TableRow({ children: [tdCell("Equity offered", 4000, {bold:true}), tdCell(`${EQUITY_PCT}%`, 5360, {bold:true})] }),
          new TableRow({ children: [tdCell("Pre-money valuation", 4000, {bold:true}), tdCell(`\u20ac${PRE_MONEY.toLocaleString()}`, 5360, {bold:true})] }),
          new TableRow({ children: [tdCell("Post-money valuation", 4000, {bold:true}), tdCell(`\u20ac${POST_MONEY.toLocaleString()}`, 5360, {bold:true})] }),
          new TableRow({ children: [tdCell("Instrument", 4000, {bold:true}), tdCell("Priced equity (preferred) or SAFE w/ 20% discount", 5360)] }),
          new TableRow({ children: [tdCell("Runway", 4000, {bold:true}), tdCell("18\u201324 months to Series A", 5360)] }),
          new TableRow({ children: [tdCell("Target Series A", 4000, {bold:true}), tdCell("\u20ac10\u201315M at \u20ac40\u201360M pre-money (Q4 2027)", 5360)] }),
        ],
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ======== PAGE 3: PROBLEM + SOLUTION + AUDIENCE ========
      h2("3. The Problem"),
      body("Global citizens \u2014 business travelers, digital nomads, expats, and cross-border families \u2014 operate without an integrated trust layer. Visa overstays trigger deportation. Tax-day miscounts cost millions. Local scams target newcomers. Existing apps are siloed (booking \u2260 tax \u2260 safety \u2260 identity), reactive, and built for tourists, not residents-of-the-world."),
      body("The cost of a single mistake can exceed years of subscription revenue from any travel app on the market."),

      h2("4. The Solution \u2014 SuperNomad OS"),
      body("A sovereign AI operating system that anticipates, prevents, and resolves cross-border friction across six pillars:"),
      bullet("Compliance Intelligence \u2014 183-day tax detector, visa auto-matcher, ETIAS/EES tracking, day-purpose tagging."),
      bullet("Safety & Guardian \u2014 Threat Intelligence, Black Box Guardian (WORM evidence), Danger Gate, embassy directory for 130+ countries."),
      bullet("Identity & Trust \u2014 Snomad ID with AES-256-GCM zero-knowledge vault, Trust Pass verifications, family vault."),
      bullet("Concierge AI \u2014 Personalized agent with 3-layer memory, voice control, persona modes, agentic commerce (x402 + Stripe Issuing)."),
      bullet("Local Living \u2014 700+ coworking spaces, vetted clinics, premium directories, club reciprocity, transportation hub for 65+ cities."),
      bullet("B2B Layer \u2014 Corporate travel, duty-of-care, API gateway with 3-tier DB and SHA-256 auth."),

      h2("5. Audience & Monetization"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2200, 3580, 3580],
        rows: [
          new TableRow({ children: [thCell("Audience", 2200), thCell("High-Value Needs", 3580), thCell("Monetization Path", 3580)] }),
          new TableRow({ children: [tdCell("Business travelers", 2200, {bold:true}), tdCell("Itinerary changes, safety, receipts, loyalty, transport, executive support", 3580), tdCell("Premium subscription, corporate seats, transport/booking affiliate margin", 3580)] }),
          new TableRow({ children: [tdCell("Nomads / expats", 2200, {bold:true}), tdCell("Tax days, visa rules, housing, insurance, family logistics", 3580), tdCell("Premium tiers, concierge upgrades, vetted marketplace, relocation services", 3580)] }),
          new TableRow({ children: [tdCell("Global citizens / families", 2200, {bold:true}), tdCell("Safety, healthcare, schools, pets, embassies, documents, community", 3580), tdCell("Directory sponsorship, verified services, family add-ons, insurance/identity partnerships", 3580)] }),
          new TableRow({ children: [tdCell("Companies", 2200, {bold:true}), tdCell("Duty of care, approvals, billing, reporting, policy guardrails", 3580), tdCell("B2B SaaS seats, API packages, compliance reports, partner data products", 3580)] }),
        ],
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ======== PAGE 4: MARKET + MODEL ========
      h2("6. Market Opportunity"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3120, 3120, 3120],
        rows: [
          new TableRow({ children: [thCell("Segment", 3120), thCell("Size (2026)", 3120), thCell("SuperNomad SAM", 3120)] }),
          new TableRow({ children: [tdCell("Global business travel", 3120, {bold:true}), tdCell("$1.48 trillion", 3120), tdCell("$28B (premium tier)", 3120)] }),
          new TableRow({ children: [tdCell("Digital nomads worldwide", 3120, {bold:true}), tdCell("40M+ (35% YoY)", 3120), tdCell("$6.2B subscription + services", 3120)] }),
          new TableRow({ children: [tdCell("Cross-border expats", 3120, {bold:true}), tdCell("281M", 3120), tdCell("$4.8B directory + insurance", 3120)] }),
          new TableRow({ children: [tdCell("B2B duty-of-care", 3120, {bold:true}), tdCell("$12B", 3120), tdCell("$2.4B (SME + enterprise)", 3120)] }),
        ],
      }),

      h2("7. Business Model"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 2340, 2340, 2340],
        rows: [
          new TableRow({ children: [thCell("Tier", 2340), thCell("Price", 2340), thCell("Target", 2340), thCell("Value", 2340)] }),
          new TableRow({ children: [tdCell("Free", 2340, {bold:true}), tdCell("\u20ac0", 2340), tdCell("All users", 2340), tdCell("1,000 AI requests, basic tracking", 2340)] }),
          new TableRow({ children: [tdCell("Premium", 2340, {bold:true}), tdCell("\u20ac4.99/mo", 2340), tdCell("Individual nomads", 2340), tdCell("10,000 requests, concierge, safety", 2340)] }),
          new TableRow({ children: [tdCell("Sovereign", 2340, {bold:true}), tdCell("\u20ac29/mo", 2340), tdCell("High-net-worth", 2340), tdCell("Unlimited AI, white-glove support", 2340)] }),
          new TableRow({ children: [tdCell("Corporate", 2340, {bold:true}), tdCell("\u20ac49/seat/mo", 2340), tdCell("Companies", 2340), tdCell("Duty-of-care, approval flows, reporting", 2340)] }),
          new TableRow({ children: [tdCell("B2B API", 2340, {bold:true}), tdCell("\u20ac2k\u201325k/mo", 2340), tdCell("Insurers, banks, gov", 2340), tdCell("Anonymized data products, gateway access", 2340)] }),
        ],
      }),

      h2("8. Revenue Streams"),
      bullet("Subscription revenue (Free \u2192 Premium \u2192 Sovereign \u2192 Corporate)"),
      bullet("Affiliate margin: flights, hotels, eSIM, VPN, insurance, transportation (avg 6\u201314%)"),
      bullet("Marketplace commission: vetted services (avg 60% discount via group buying, 15% take rate)"),
      bullet("B2B API gateway: anonymized cross-border data for insurers, banks, governments"),
      bullet("Concierge upgrades: white-glove visa/tax review, jet charter coordination"),
      bullet("Directory sponsorship: verified clinics, coworking, legal, relocation partners"),

      new Paragraph({ children: [new PageBreak()] }),

      // ======== PAGE 5: FINANCIALS + USE OF FUNDS ========
      h2("9. Financial Projections (\u20ac)"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2400, 1392, 1392, 1392, 1392, 1392],
        rows: [
          new TableRow({ children: [thCell("Metric", 2400), thCell("Year 1", 1392), thCell("Year 2", 1392), thCell("Year 3", 1392), thCell("Year 4", 1392), thCell("Year 5", 1392)] }),
          new TableRow({ children: [tdCell("Paying users", 2400, {bold:true}), tdCell("12,000", 1392), tdCell("85,000", 1392), tdCell("320,000", 1392), tdCell("920,000", 1392), tdCell("2.1M", 1392)] }),
          new TableRow({ children: [tdCell("B2B contracts", 2400, {bold:true}), tdCell("8", 1392), tdCell("45", 1392), tdCell("180", 1392), tdCell("520", 1392), tdCell("1,400", 1392)] }),
          new TableRow({ children: [tdCell("ARR (\u20acM)", 2400, {bold:true}), tdCell("0.8", 1392), tdCell("6.2", 1392), tdCell("28", 1392), tdCell("95", 1392), tdCell("224", 1392)] }),
          new TableRow({ children: [tdCell("Gross margin", 2400, {bold:true}), tdCell("68%", 1392), tdCell("72%", 1392), tdCell("76%", 1392), tdCell("79%", 1392), tdCell("81%", 1392)] }),
          new TableRow({ children: [tdCell("EBITDA (\u20acM)", 2400, {bold:true}), tdCell("-1.8", 1392), tdCell("-0.5", 1392), tdCell("4.2", 1392), tdCell("22", 1392), tdCell("58", 1392)] }),
        ],
      }),

      h2("10. Use of Funds"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3120, 2080, 2080, 2080],
        rows: [
          new TableRow({ children: [thCell("Category", 3120), thCell("Allocation", 2080), thCell("% of Seed", 2080), thCell("Purpose", 2080)] }),
          new TableRow({ children: [tdCell("Engineering & Product", 3120, {bold:true}), tdCell("\u20ac1,200,000", 2080), tdCell("40%", 2080), tdCell("Complete backend, auth, payments, AI hardening", 2080)] }),
          new TableRow({ children: [tdCell("B2B Sales & Partnerships", 3120, {bold:true}), tdCell("\u20ac600,000", 2080), tdCell("20%", 2080), tdCell("Head of B2B, pilot contracts, API onboarding", 2080)] }),
          new TableRow({ children: [tdCell("Marketing & Growth", 3120, {bold:true}), tdCell("\u20ac500,000", 2080), tdCell("17%", 2080), tdCell("Content, events, influencer, paid acquisition", 2080)] }),
          new TableRow({ children: [tdCell("Regulatory & Compliance", 3120, {bold:true}), tdCell("\u20ac300,000", 2080), tdCell("10%", 2080), tdCell("GDPR audit, tax-counsel retainer, insurance licensing", 2080)] }),
          new TableRow({ children: [tdCell("Operations & Overhead", 3120, {bold:true}), tdCell("\u20ac100,000", 2080), tdCell("3%", 2080), tdCell("Legal, accounting, tooling", 2080)] }),
          new TableRow({ children: [tdCell("Working capital & buffer", 3120, {bold:true}), tdCell("\u20ac300,000", 2080), tdCell("10%", 2080), tdCell("Reserve for opportunistic moves", 2080)] }),
        ],
      }),

      h2("11. Why Now"),
      bullet("Remote work normalized \u2014 40M+ digital nomads, +35% YoY (MBO Partners 2025)."),
      bullet("Regulatory tightening \u2014 ETIAS (2026), EES, global tax-residency crackdowns."),
      bullet("AI agents matured \u2014 Gemini 3 Flash, x402 stablecoin rails, agentic commerce live."),
      bullet("Trust crisis \u2014 scams, deepfakes, identity theft demand a verified sovereign layer."),
      bullet("B2B duty-of-care liability \u2014 companies legally required to track employee location and risk."),

      h2("12. Competitive Moat"),
      bullet("Sovereign-by-design: AES-256-GCM client-side encryption, zero-knowledge architecture."),
      bullet("Cross-feature agentic orchestration (single event triggers checks across visa, tax, safety, calendar, payments)."),
      bullet("Evidence-First protocol \u2014 every UI value sourced from live state or named trusted source."),
      bullet("Recursive travel knowledge graph \u2014 gets smarter per user, per trip, per country."),
      bullet("13 localized languages with BCP-47 TTS native voice."),
      bullet("B2B API gateway already production-ready (3-tier DB, SHA-256 auth, OpenAPI spec)."),

      new Paragraph({ children: [new PageBreak()] }),

      // ======== PAGE 6: PRODUCT + ROADMAP + TEAM ========
      h2("13. Product & Traction"),
      bullet("Production-ready web + mobile (Capacitor) \u2014 80+ feature modules behind feature registry."),
      bullet("AI Concierge with 4 personality modes, voice control, mouth-tracked avatar."),
      bullet("Black Box Guardian (WORM evidence, acoustic detection, 48-hour locked records)."),
      bullet("Family Vault, Trust Pass, Snomad ID \u2014 all live."),
      bullet("B2B demo org (ACMEDEMO), corporate routes, approval workflows shipped."),
      bullet("Cinematic marketing site (Sovereign Cinema design language) at supernomad1.lovable.app."),

      h2("14. 18-Month Roadmap"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 7020],
        rows: [
          new TableRow({ children: [thCell("Phase", 2340), thCell("Milestone", 7020)] }),
          new TableRow({ children: [tdCell("Q3 2026", 2340, {bold:true}), tdCell("Seed close; backend hardening; auth launch; Stripe subscriptions", 7020)] }),
          new TableRow({ children: [tdCell("Q4 2026", 2340, {bold:true}), tdCell("First 10k paying users; B2B pilot (3 corporate clients); Threat Intelligence live feed", 7020)] }),
          new TableRow({ children: [tdCell("Q1 2027", 2340, {bold:true}), tdCell("100k users; API gateway public; marketplace v1; Concierge white-glove tier", 7020)] }),
          new TableRow({ children: [tdCell("Q2 2027", 2340, {bold:true}), tdCell("Series A close (\u20ac10\u201315M); enter US enterprise market", 7020)] }),
        ],
      }),

      h2("15. Team & Governance"),
      body("Founder-led, with planned hires post-seed: CTO, Head of B2B, Head of Compliance, 4 senior engineers, Head of Concierge Operations. Advisory board to include cross-border tax counsel, ex-insurance underwriter, and a former corporate travel executive."),

      h2("16. Key Risks & Mitigations"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4680, 4680],
        rows: [
          new TableRow({ children: [thCell("Risk", 4680), thCell("Mitigation", 4680)] }),
          new TableRow({ children: [tdCell("Regulatory (cross-border data)", 4680, {bold:true}), tdCell("GDPR Art. 17 compliant, zero-knowledge vault, regional data residency", 4680)] }),
          new TableRow({ children: [tdCell("AI hallucination liability", 4680, {bold:true}), tdCell("Evidence-First protocol, advisor disclaimer, source-of-truth gates", 4680)] }),
          new TableRow({ children: [tdCell("B2B sales cycle length", 4680, {bold:true}), tdCell("Self-serve API tier, demo org for instant POC", 4680)] }),
          new TableRow({ children: [tdCell("Concentration in EU", 4680, {bold:true}), tdCell("Multi-currency, 13 languages, US/APAC expansion plan in Y2", 4680)] }),
          new TableRow({ children: [tdCell("AI cost inflation", 4680, {bold:true}), tdCell("Hybrid search + 12-msg compression + TTL caching reduce token spend 60%", 4680)] }),
        ],
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ======== PAGE 7: EXIT + THE ASK ========
      h2("17. Exit Pathways"),
      bullet("Strategic acquisition: travel/insurance majors (Amex GBT, BCD, Allianz, AXA, Booking Holdings)."),
      bullet("Banking/identity: HSBC Premier, Revolut, Wise, Chime \u2014 global-citizen wallet adjacency."),
      bullet("AI majors building agentic commerce stacks (Stripe, Anthropic, Google)."),
      bullet("Comparable exits: Concur (acquired by SAP $8.3B), TripActions/Navan ($9.2B), Brex ($12.3B)."),

      h2("18. The Ask"),
      body(`\u20ac${SEED_AMOUNT.toLocaleString()} seed for ${EQUITY_PCT}% equity at a \u20ac${(PRE_MONEY/1000000).toFixed(2)}M pre-money valuation. Capital deploys over 18 months to reach \u20ac5M+ ARR run rate, 200k paying users, and Series A readiness at a 4\u20136\u00d7 step-up.`),
      body("Lead investors will receive a board seat, pro-rata rights, and quarterly board cadence with the founder."),

      // ======== PAGE 8: CLOSING ========
      new Paragraph({ children: [new PageBreak()] }),
      new Paragraph({ spacing: { before: 2000 } }),
      new Paragraph({ children: [new TextRun({ text: "Reliability is what today\u2019s traveler needs.", italics: true, size: 32, font: "Georgia", color: "555555" })], alignment: AlignmentType.CENTER, spacing: { after: 200 } }),
      new Paragraph({ children: [new TextRun({ text: "SuperNomad delivers.", bold: true, size: 40, font: "Georgia", color: "1A1A1A" })], alignment: AlignmentType.CENTER }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/mnt/documents/SuperNomad-BusinessPlan-v3.1.docx", buffer);
  console.log("Document saved to /mnt/documents/SuperNomad-BusinessPlan-v3.1.docx");
}).catch(err => {
  console.error("Error:", err);
});
