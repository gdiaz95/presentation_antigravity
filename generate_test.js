const pptxgen = require('pptxgenjs');
const html2pptx = require('./.agents/skills/pptx-research/scripts/html2pptx.js');
const path = require('path');

async function main() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = 'pptx-research skill test';
  pptx.author = 'Gabriel Díaz Ramos';

  const slidesDir = path.join(__dirname, 'slides');

  // Slide 1: Title
  await html2pptx(path.join(slidesDir, 'test_slide1.html'), pptx);

  // Slide 2: Content with bullets
  await html2pptx(path.join(slidesDir, 'test_slide2.html'), pptx);

  // Slide 3: Acknowledgments (mandatory last slide)
  await html2pptx(path.join(slidesDir, 'test_slide3_acks.html'), pptx);

  await pptx.writeFile({ fileName: 'test_output.pptx' });
  console.log('Done: test_output.pptx');
}

main().catch(err => { console.error(err); process.exit(1); });
