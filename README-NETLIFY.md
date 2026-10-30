# blent website

Deployment target: **Netlify**. Source: `ecassius/blent-working`, branch `chatgpt/blent-netlify-site`. React / Vite.

## Netlify setup (once)
Connect this GitHub repository on Netlify using "Add new project → Import an existing project". Choose the branch or merge the pull request into main before production. Build command: `npm run build`. Publish directory: `dist`.

In Netlify > Forms, enable form detection and redeploy; configure email notifications. Verify both `blent-application-enquiry` and `blent-resource-request` forms. Set `VITE_BLENT_CONTACT_EMAIL` to the confirmed blent contact email and redeploy to activate the direct email link. Do not claim live form submissions until tested.

This release is a customer-first website foundation, not an authenticated customer portal. See CLAUDE.md for roadmap and brand restrictions.
