# blent — website production brief for Codex / Claude Code

## Platform
Existing repository is Vite + React. Deploy on **Netlify**, NOT Vercel. Use `npm run build`, publish `dist`. Keep the original Three.js liquid experiment on `main` unchanged until the new website is approved.

## Brand and messaging
Always lowercase blent. One plain, unmodified geometric sans wordmark (Plus Jakarta Sans or approved clean sans), no icon or invented custom letterform. Pearl #F7F5F2, ink #29213F, lilac #DDD5F3, ice #C7DFF4; citron #E5F6A6 is the signature CTA colour. Light, premium, technically credible, spacious. Avoid editorial serif fonts, excessive dark backdrops, and tiny misaligned buttons.

Purpose: "To make better chemistry the standard, not the exception."
Corporate positioning: "A new standard in industrial chemistry."
Industrial cleaning flagship: "Making clean, clean."
Support line: "Better chemistry starts here."
People promise: "Build brilliantly. Treat people well."
Value: "Built to a higher standard."
Vision and mission should remain carefully worded and be reviewed before publishing.
Avoid generic filler such as "a better way" and "A standard worth raising".

## Commercial priorities
Visitors need industrial cleaning solutions TODAY, so the homepage immediately explains high-performance water-based industrial cleaning formulations. Primary persistent CTA: "Discuss your application". Early secondary CTA: "Request technical information". Enquiry form plus confirmed direct contact email (set VITE_BLENT_CONTACT_EMAIL; never invent it).
Customer onboarding: Understand requirements → Define the test → blent-led Product testing → Review results → Plan adoption. Do not expose self-service sample requests yet. Technical resource forms request whitepapers or available testing information and DO NOT auto-publish confidential documents.

## Visual
Approved fluid forms are substantial, pouring/folding, sharp and holographic with pearl/lilac/ice and tiny citron. The coded SVG illustration is a placeholder and is NOT a true rendered 3D master; replace with approved production-grade PNGs and animation when available. No thin ribbons, generic bubbles, inflated tubes, or glass-chrome excess. The same material language should be used throughout. Motion must respect prefers-reduced-motion.

## Forms and security
Netlify Forms detect HTML statically, so maintain `public/__forms.html` and corresponding form names/fields in React. Enable Forms > Form detection in Netlify, then redeploy and verify submissions + notifications. Keep unpublished customer video pages and future portal private using real server-side access controls, not JS passwords. Impact calculator must have substantiated methodology before publication. Investor pages may exist without private material or false claims. No invented technical numbers, customer logos, approvals, certifications, claims.

## Quality and completion
Run `npm run build`, visually inspect desktop/mobile, test all links and form submissions after Netlify deploy, confirm contact email and privacy notice, and only then move to production domain.
