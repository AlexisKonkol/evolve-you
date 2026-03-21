// Inline logo placeholder.
// The app previously referenced `@/assets/navo-logo.png`, but the binary asset
// isn't present in this repo. Using a `data:` URL keeps the UI unblocked.
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="g" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FF6B6B"/>
      <stop offset="1" stop-color="#FFB86B"/>
    </linearGradient>
  </defs>
  <rect x="6" y="6" width="52" height="52" rx="14" fill="url(#g)" opacity="0.14"/>
  <path
    d="M18 46V18h8l8 14 8-14h8v28h-8V33.5L34 46h-4L26 33.5V46h-8Z"
    fill="url(#g)"
  />
  <circle cx="50" cy="16" r="4" fill="#FF6B6B" opacity="0.35"/>
</svg>
`.trim();

const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export default dataUrl;

