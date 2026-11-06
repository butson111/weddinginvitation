// Paste your deployed Apps Script Web App URL (ending in /exec) here.
// The RSVP form itself runs inside Apps Script so Google Sheets can confirm saves.
const RSVP_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwDT7SIV1BrXZ74I1X5HgmrXhglqCs-j9kmo9JQRzc7jA6mQnBLPNlp7JiNIuNSaKNuUA/exec';

const statusText = document.getElementById('connectionStatus');
const launchButton = document.getElementById('openInvitation');
let destination = '';
try {
  const url = new URL(RSVP_WEB_APP_URL);
  if (url.protocol !== 'https:' || url.hostname !== 'script.google.com' ||
      !/^\/macros\/s\/[^/]+\/exec$/.test(url.pathname)) throw new Error('Invalid deployment URL');
  url.searchParams.set('bg', new URL('./images/rsvp-page.webp', location.href).href);
  url.searchParams.set('logo', new URL('./images/monoblack.png', location.href).href);
  url.searchParams.set('home', new URL('./index.html', location.href).href);
  destination = url.href;
} catch (_) { /* Not configured yet; keep launch button disabled. */ }
if (destination) {
  statusText.textContent = 'Opening your invitation…';
  launchButton.href = destination;
  launchButton.hidden = false;
  // Replace the page so guests arrive at the verified, Sheets-connected RSVP.
  setTimeout(() => { window.location.replace(destination); }, 350);
} else {
  statusText.textContent = 'Our RSVP guest-list connection is not ready yet. Please check back soon.';
  launchButton.hidden = true;
}
