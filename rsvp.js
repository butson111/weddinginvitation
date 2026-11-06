// Paste your deployed Google Apps Script URL here to enable real collection.
const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbyNDdpORlqgdAg7EjUx0zLpZm2dHGsG_SWXYQiiMkwLCEFikKRdUAWrCUPlf_FG5biw/exec";
const form = document.getElementById('rsvpForm');
const steps = [...document.querySelectorAll('.step')];
const el = id => document.getElementById(id);
let current = 0;
function showStep(n) {
  current = n;
  steps.forEach(step => step.hidden = Number(step.dataset.step) !== n);
  el('progress').style.setProperty('--progress', `${Math.min(n+1,5)*20}%`);
  if (n === 1) el('confirmName').textContent = el('guestName').value.trim();
  if (n === 2) el('dearName').textContent = el('guestName').value.trim().split(/\s+/)[0];
}
function advance(n) {
  if (current === 0) {
    const valid = el('guestName').value.trim().length >= 2;
    el('nameError').textContent = valid ? '' : 'Please enter your full name.';
    if (!valid) { el('guestName').focus(); return; }
  }
  if (current === 2) {
    const valid = Boolean(form.querySelector('[name="attendance"]:checked'));
    el('attendanceError').textContent = valid ? '' : 'Please choose whether you can attend.';
    if (!valid) return;
  }
  showStep(n);
}
document.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', () => advance(Number(b.dataset.next))));
document.querySelectorAll('[data-back]').forEach(b => b.addEventListener('click', () => showStep(Number(b.dataset.back))));
el('guestName').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); advance(1); }});
form.addEventListener('submit', async e => {
  e.preventDefault();
  const error = el('submitError'); error.textContent = '';
  if (!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(RSVP_ENDPOINT)) {
    error.textContent = 'RSVP collection is not connected yet. The couple must add their Google Sheets connection before submissions can be sent.';
    return;
  }
  const button = el('submitButton');
  button.disabled = true; button.textContent = 'Sending your response…';
  const data = {name:el('guestName').value.trim(),attendance:form.elements.attendance.value,song:el('song').value.trim(),wishes:el('wishes').value.trim()};
  try {
    // Opaque response: a resolved fetch means the browser sent the request,
    // not that the server confirmed it saved to Sheets.
    await fetch(RSVP_ENDPOINT,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(data)});
    el('successTitle').textContent = data.attendance === 'Joyfully accepts' ? `See you there, ${data.name.split(/\s+/)[0]}!` : 'Thank you for letting us know!';
    showStep(5);
  } catch (_) {error.textContent = 'Your response could not be sent. Check your connection and try again.';}
  finally {button.disabled = false; button.textContent = 'Send my RSVP →';}
});
showStep(0);
