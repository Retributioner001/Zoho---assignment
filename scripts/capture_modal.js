const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const baseHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

// 1. Capture Student 360 modal
const modalHtml = path.join(__dirname, '..', 'temp_modal_view.html');
const inject1 = `
<script>
  if (typeof openStudent360Modal === "function") {
    openStudent360Modal(1);
  }
</script></body>`;
fs.writeFileSync(modalHtml, baseHtml.replace('</body>', inject1), 'utf8');
execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--window-size=1440,960',
  '--screenshot=' + path.resolve(__dirname, '..', 'assets', 'screenshots', 'student_360_modal.png'),
  'file:///' + modalHtml.replace(/\\/g, '/')
]);
if (fs.existsSync(modalHtml)) fs.unlinkSync(modalHtml);
console.log('Saved student_360_modal.png!');

// 2. Capture Parent Online Payment modal
const payHtml = path.join(__dirname, '..', 'temp_pay_view.html');
const inject2 = `
<script>
  if (typeof switchTab === "function") {
    switchTab("creator-portal");
    simulatePayFeeModal();
  }
</script></body>`;
fs.writeFileSync(payHtml, baseHtml.replace('</body>', inject2), 'utf8');
execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--window-size=1440,960',
  '--screenshot=' + path.resolve(__dirname, '..', 'assets', 'screenshots', 'parent_payment_modal.png'),
  'file:///' + payHtml.replace(/\\/g, '/')
]);
if (fs.existsSync(payHtml)) fs.unlinkSync(payHtml);
console.log('Saved parent_payment_modal.png!');
