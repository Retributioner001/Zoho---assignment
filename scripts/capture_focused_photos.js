const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const baseHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

// 1. Capture full CRM Console with taller viewport so both campus hero and student table are fully visible
const tallHtml = path.join(__dirname, '..', 'temp_tall_crm.html');
fs.writeFileSync(tallHtml, baseHtml, 'utf8');
execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--window-size=1440,1180',
  '--screenshot=' + path.join(__dirname, '..', 'assets', 'screenshots', 'crm_console.png'),
  'file:///' + tallHtml.replace(/\\/g, '/')
]);
if (fs.existsSync(tallHtml)) fs.unlinkSync(tallHtml);
console.log('Updated crm_console.png with 1440x1180 viewport');

// 2. Capture focused close-up of Student Directory with photos, search bar, and actions
const focusHtml = path.join(__dirname, '..', 'temp_focus_students.html');
const injectScroll = `
<script>
window.addEventListener("load", () => {
  const el = document.querySelector(".student-search-bar");
  if (el) el.scrollIntoView({ block: "start" });
});
</script></body>`;
fs.writeFileSync(focusHtml, baseHtml.replace('</body>', injectScroll), 'utf8');
execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--window-size=1440,750',
  '--screenshot=' + path.join(__dirname, '..', 'assets', 'screenshots', 'student_directory_photos.png'),
  'file:///' + focusHtml.replace(/\\/g, '/')
]);
if (fs.existsSync(focusHtml)) fs.unlinkSync(focusHtml);
console.log('Captured student_directory_photos.png');
