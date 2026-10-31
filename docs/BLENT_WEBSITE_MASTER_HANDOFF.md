# blent — website master handoff (31 October 2026)

**Status:** Approved strategic architecture + working page copy and creative-direction reference. Visual designs and image files are delivered separately in the file package `blent_complete_design_handoff_2026-10-31.zip`. Do not treat placeholder designs or portal concepts as production.

## GitHub and Netlify
- **Staging repository:** `ecassius/blent-working`, branch `chatgpt/blent-netlify-site`; current preview `blent-today.netlify.app`.
- **Deployment target:** Netlify, React + Vite, `npm run build`, publish `dist`.
- **Existing production website:** `blentgroup.com` has historically used `emily716/blent` (Next.js). **Do not overwrite production** or transfer domain until approved.
- Work in a new feature branch, present desktop/mobile screenshots against the design proof and open a PR. No surprise changes to the staging site without signoff.

## Brand statements — LOCKED
- Always lowercase **blent**, one plain geometric sans wordmark, **same silhouette** for every colourway.
- **Purpose:** To make better chemistry the standard, not the exception.
- **Positioning:** A new standard in industrial chemistry.
- **Industrial cleaning proposition:** Making clean, clean.
- **Culture:** Build brilliantly. Treat people well.
- **Value:** Built to a higher standard.
- **First product focus:** high-performance, water-based industrial cleaning formulations for demanding applications.
- **Primary CTA:** Discuss your application.
- **Secondary CTA:** Request technical information.
- A useful secondary brand phrase: Better chemistry starts here (not mandatory everywhere).
- Company story wider than cleaning, but cleaning is the early customer acquisition entry point.

## Visual direction
Light Pearl #F7F5F2, Ink Violet #29213F, Lilac #DDD5F3, Ice Blue #C7DFF4, Citron **#E5F6A6** primary action, pastel supporting tones for presentations. Plus Jakarta Sans or exact approved geometric sans. Signature: crisp photoreal pearlescent translucent fluid volumes—pouring, rounded, partially globular, folded, subtle lilac/ice/citron—NOT generic SVG waves, glass tubes, blurry bubbles or opaque plastic. Use approved transparent raster PNGs until a true 3D master exists. Fluid is hero; no decorative motif required in logo. Fast, subtle animation with reduced-motion fallback. Optically and mathematically centre all CTA text and arrows.

## Site map
```
/                         Customer-first homepage
/industrial-cleaning      Application fit, process, managed testing
/our-approach             Performance, considered chemistry, sourcing, quality
/results                  Evidence and validation methods (not unapproved claims)
/resources                Request whitepapers, tests, process guidance
/about                    Purpose, vision, mission, people culture
/investors                Wider platform ambition; enquiry only
/contact                  Customer application form and direct email
/privacy                  Required privacy/legal page
/portal                   FUTURE authenticated customer workspace
/portal/login             FUTURE authentication
/portal/trials            FUTURE org-scoped trial progress
/portal/documents         FUTURE private papers and reports
/portal/videos            FUTURE private client video landing pages
/portal/impact            FUTURE measured impact and validated calculator
```

## Page-by-page headline and content route
**Homepage:** Eyebrow INDUSTRIAL CLEANING CHEMISTRY. H1 **Making clean, clean.** Lead: “High-performance, water-based cleaning formulations developed for the demands of modern industry.” Both CTAs visible without scrolling. Follow with **Essential cleaning. Outdated chemistry.**, **Engineered for the demands of industry.**, **From challenge to real-world results.**, **Evidence for your process.**, and **A new standard in industrial chemistry.** Use the real fluid asset, not the current flat illustrated wave.

**Industrial cleaning:** H1 **Making clean, clean.** Application requirements / technical fit / performance first / managed product testing. Explain test ownership: customer shares requirements → blent defines test → blent tests → reviews evidence → plans next step. Do NOT promise self-service sample ordering.

**Our approach:** H1 **Chemistry, considered.** H2 **Built to a higher standard.** Three dimensions of “clean”: cleaning performance; more considered water-based chemistry; supply-chain sourcing ambitions. Four proof pillars: science, testing, sourcing, quality. Don't claim entirely circular or petrochemical-free now.

**Results & testing:** H1 **Evidence before adoption.** Framework: requirements → test design → evaluation → review. Show the difference between a hypothesis, application-specific observation and technically substantiated marketing claim. Require technical signoff for any metrics.

**Resources:** H1 **The detail behind the chemistry.** Cards: technical whitepaper, performance/testing, application guidance, managed trial process. Request-based gating; customer gives name/work email/company/resource/application. Material sent only after blent review, not public confidential downloads.

**About:** H1 **A new standard in industrial chemistry.** Purpose exact as above. Vision and mission were proposed, not definitively founder-approved: “An industrial future where exceptional performance and responsibility are no longer competing priorities” and “Develop and scale high-performance chemical formulations that replace hazardous conventional substances, starting with industrial cleaning…” Mark as WORKING for signoff. Culture: **Build brilliantly. Treat people well.**

**Investors:** H1 **A wider opportunity in chemistry.** Industrial cleaning first, potential wider platform. Direct investor/strategic partner enquiry. No unsupported commercial forecasts or financial claims.

**Contact:** H1 **Start with your cleaning challenge.** Work email, company, application, requirements and consent. Include direct email **hello@blentgroup.com** (present in the historic website; verify account). Use Netlify Forms static blueprint and tested submit/success/error behaviour.

**Future portal:** Concept header **Your trials. Your evidence. One place.** Private customer dashboard, scoped trials, documents, approved customer videos, progress stages and impact estimates. Secure login/storage/roles required before launch; no fake trial progress or JS-only passwords.

## Diagram assets in design handoff ZIP
`three-dimensions-of-clean.svg`,
`testing-framework.svg`,
`claims-evidence-ladder.svg`,
`application-fit.svg`,
`platform-path.svg`,
`impact-categories.svg`,
`customer-journey.svg`,
`resource-exchange.svg`,
`future-portal-architecture.svg`.
All are editable SVGs; no fabricated quantitative evidence.

## Technical claims NOT approved for publishing without review
Historical site contains “96% fewer VOCs”, “90%+ bio-derived”, “up to 10x longer lifespan”, “20–30 million tonnes”, “non-hazardous/non-toxic/non-carcinogenic/non-flammable”, “100% bio-derived by 2030”. Treat all as **technical/legal review items**; do not publish unsupported/unqualified claims as facts.

## Acceptance checklist
- Desktop at 1440 and mobile at 390 match approved design proofs; buyer understands offer and sees 2 CTAs immediately.
- Correct lowercase blent wordmark and citron CTA, aligned buttons, consistently applied palettes.
- Real transparent fluid image instead of current flat SVG; responsive sizes and no giant pixelated crop.
- All public pages, results resources, investor and enquiry form; protected future portal roadmap.
- Netlify forms work end-to-end; verified emails, privacy consent, spam protection, zero invented performance figures.
- Build passes; preview deployed; no production domain change before approval.
