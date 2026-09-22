const fs = require('fs');
const content = fs.readFileSync('report_build.html', 'utf8');

console.log('HTML size:', (content.length / 1024).toFixed(1), 'KB');

const sections = content.split('<h1 class="section-title">');
console.log('Total sections:', sections.length - 1);
sections.slice(1).forEach((sec, i) => {
  const title = sec.split('</h1>')[0].replace(/<[^>]+>/g, '').trim();
  const len = sec.length;
  console.log(`Section ${i+1}: "${title}" (~${(len/1024).toFixed(1)} KB)`);
});
