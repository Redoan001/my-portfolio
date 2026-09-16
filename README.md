# MD Redoan Portfolio

A responsive single-page portfolio for video editor and motion graphics designer
MD Redoan. The site is built with React, TypeScript, Tailwind CSS, and Vite while
preserving the content, typography, colors, artwork, layout, and interactions of
the original portfolio.

## Features

- Responsive navigation with a keyboard-accessible mobile menu
- Animated hero typewriter, waving emoji, and scrolling client banner
- About and service sections with the original content and artwork
- Sixteen YouTube projects grouped into Reels, Social Media Ads, and
  Promotional Video
- Swipeable mobile portfolio carousels with Lucide navigation controls
- GSAP-powered button, service-card, and form-field interactions
- Staged scroll reveals, back-to-top control, and document click particles
- Web3Forms contact form with validation, submission feedback, timeout handling,
  duplicate-request prevention, and retry-safe errors
- Reduced-motion support and accessible labels, iframe titles, and live regions

## Technology

| Area | Package |
| --- | --- |
| UI | React 19 and React DOM 19 |
| Language | TypeScript 7 |
| Styling | Tailwind CSS 4 with custom component CSS |
| Build tooling | Vite 8 |
| Icons | Lucide React |
| Animation | GSAP 3 and CSS keyframes |
| Browser tests | Playwright |

The exact resolved dependency versions are recorded in `package-lock.json`.

## Requirements

- Node.js 22.12.0 or newer
- npm
- Google Chrome for the Playwright browser suite
- A Web3Forms access key for real contact-form delivery

## Getting started

Install the locked dependencies and start the local development server:

```sh
npm ci
npm run dev
```

The development server binds to `127.0.0.1`; Vite prints the complete local URL
when it starts. The root `index.html` loads the React entry point at
`src/main.tsx`.

## Environment configuration

Create a Web3Forms access key for the email that should receive portfolio leads.
Copy `.env.example` to `.env.local`, then add the key:

```dotenv
VITE_WEB3FORMS_ACCESS_KEY=your-web3forms-access-key
```

Restart the development server after editing the environment file. Local `.env`
files are ignored by Git, while `.env.example` documents the required variable.

Vite exposes variables prefixed with `VITE_` to browser code. A Web3Forms access
key is a public form key designed for client-side use; private API credentials
must never be stored in a `VITE_` variable.

For production, define `VITE_WEB3FORMS_ACCESS_KEY` in the hosting provider's
build environment before running `npm run build`.

## Contact form behavior

[`ContactForm.tsx`](src/components/ContactForm.tsx) submits JSON to
`https://api.web3forms.com/submit`. It sends the required name, email, phone, and
message fields, maps the form's `comment` field to the Web3Forms `message` field,
and uses the sender's email as `replyto`.

The form also:

- uses native required-field and email validation;
- includes a hidden bot-check field;
- disables repeated submissions while a request is active;
- aborts requests that exceed 15 seconds;
- accepts only a successful HTTP response containing `success: true`;
- preserves all entered values after a failure so the visitor can retry; and
- shows the portfolio email address without making a request when no key exists.

Automated tests intercept the Web3Forms endpoint and never send real leads. After
adding a production key, submit one manual test to confirm inbox delivery and the
Web3Forms account configuration.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server on `127.0.0.1` |
| `npm run typecheck` | Run TypeScript project checks without emitting files |
| `npm run build` | Type-check and create the production bundle in `dist/` |
| `npm run preview` | Preview the production build on `127.0.0.1` |
| `npm test` | Run the Playwright browser regression suite |

## Project structure

```text
.
├── index.html                     Vite HTML entry point and document metadata
├── public/
│   └── Favicon.png                Static favicon copied without bundling
├── src/
│   ├── main.tsx                   React root and global stylesheet import
│   ├── App.tsx                    Page composition and static content sections
│   ├── styles.css                 Tailwind theme, responsive styles, keyframes
│   ├── vite-env.d.ts              Typed Vite environment variable declaration
│   ├── assets/                    Original portfolio and social image assets
│   ├── components/
│   │   ├── Navigation.tsx         Desktop and mobile navigation
│   │   ├── Hero.tsx               Hero content and typewriter lifecycle
│   │   ├── Portfolio.tsx          Video categories and mobile carousels
│   │   ├── Contact.tsx            Contact details and social links
│   │   ├── ContactForm.tsx        Web3Forms request and feedback states
│   │   ├── BackToTop.tsx          Scroll-aware return control
│   │   └── ClickEffects.tsx       Document-wide ripple and particle effects
│   ├── data/
│   │   └── portfolio.ts           Navigation, services, and video metadata
│   └── hooks/
│       └── useSiteEffects.ts      GSAP effects and scroll-reveal lifecycle
├── tests/
│   └── portfolio.spec.ts          UI, responsive, animation, and form tests
├── playwright.config.ts           Chrome project and isolated test servers
├── vite.config.ts                 React, Tailwind, and relative-base config
├── tsconfig.json                  TypeScript project references
├── tsconfig.app.json              Browser application compiler settings
├── tsconfig.node.json             Tooling and test compiler settings
└── .env.example                   Web3Forms environment template
```

## Styling and responsive behavior

Tailwind provides layout, spacing, color, and responsive utilities in JSX and
through `@apply` in `src/styles.css`. Tailwind Preflight is intentionally omitted
because its reset changes the original browser typography, button sizing, form
line heights, and image alignment.

The design keeps the original custom breakpoints:

- At `900px` and below, navigation switches to the full-screen menu and the hero,
  service, portfolio, and contact layouts stack into one column.
- At `768px` and below, the Explore buttons stack.
- Below `768px`, portfolio grids become horizontal scroll-snap carousels.

The site retains the Inter font, `#ff4c31` accent, `#a9a9b3` muted text, black
background, original artwork, all external destinations, and all sixteen video
URLs. Motion preferences disable nonessential animations while keeping content
visible and controls usable.

## Testing

Run the full browser suite with:

```sh
npm test
```

Playwright runs 20 regression tests in installed Google Chrome. The suite covers:

- typography, colors, desktop grids, content, and all video URLs;
- mobile navigation, carousel controls, and boundary widths;
- typewriter timing, scroll reveals, click effects, hover/focus effects, and
  back-to-top behavior;
- native form validation, Web3Forms payloads, duplicate protection, success,
  service and network failures, retries, timeout handling, and missing-key
  behavior.

The test runner starts isolated Vite servers on ports `4173` and `4174` with a
test key and an empty key. It intercepts YouTube and Web3Forms requests, so tests
do not depend on remote videos or submit real messages. Ensure both ports are
available before running the suite.

For a complete local verification:

```sh
npm run typecheck
npm run build
npm test
```

## Production build and deployment

Create the optimized static bundle:

```sh
npm run build
```

The output is written to `dist/`. Deploy that directory to any static host.
`vite.config.ts` uses `base: './'`, so bundled assets work at a domain root or a
project subdirectory such as GitHub Pages.

The deployment platform must build the application and publish `dist/`; serving
the repository source directly will not run the React application.

## References

- [Web3Forms React guide](https://docs.web3forms.com/how-to-guides/js-frameworks/react-js)
- [Tailwind CSS with Vite](https://tailwindcss.com/docs/installation/using-vite)
- [Lucide React](https://lucide.dev/guide/react)
- [Vite guide](https://vite.dev/guide/)
