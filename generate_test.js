const fs = require('fs/promises');
const path = require('path');
const { spawnSync } = require('child_process');
const pptxgen = require('pptxgenjs');
const html2pptx = require('./.agents/skills/pptx-research/scripts/html2pptx.js');

const deck = [
  { label: 'Title', file: 'test_slide1.html', kind: 'title' },
  { label: 'Content', file: 'slide2.html', kind: 'content' },
  { label: 'Concepts', file: 'slide3.html', kind: 'content' },
  { label: 'Applications', file: 'slide4.html', kind: 'content' },
  { label: 'Acknowledgments', file: 'test_slide3_acks.html', kind: 'acknowledgments' }
];

async function ensureDeckIsValid(slidesDir) {
  if (deck.at(-1)?.kind !== 'acknowledgments') {
    throw new Error('pptx-research requires the last slide to be an Acknowledgments slide.');
  }

  await Promise.all(
    deck.map(async ({ file }) => {
      await fs.access(path.join(slidesDir, file));
    })
  );
}

function buildPresentation() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Gabriel Diaz Ramos';
  pptx.company = 'presentation_antigravity';
  pptx.subject = 'pptx-research skill validation deck';
  pptx.title = 'Introduction to Quantum Computing';
  pptx.lang = 'en-US';
  return pptx;
}

function generateThumbnails(pptxPath, outputDir) {
  const thumbnailScript = path.join(
    __dirname,
    '.agents',
    'skills',
    'pptx-research',
    'scripts',
    'thumbnail.py'
  );
  const prefix = path.join(outputDir, 'test_output');
  const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
  const result = spawnSync(pythonCmd, [thumbnailScript, pptxPath, prefix, '--cols', '4'], {
    cwd: __dirname,
    encoding: 'utf8'
  });

  if (result.error || result.status !== 0) {
    const detail = (
      result.error?.message ||
      result.stderr ||
      result.stdout ||
      `thumbnail command exited with status ${result.status}`
    ).trim();
    console.warn(`Thumbnail generation skipped: ${detail}`);
    return;
  }

  console.log(`Thumbnails created with prefix: ${prefix}`);
}

async function main() {
  const slidesDir = path.join(__dirname, 'slides');
  const outputDir = path.join(__dirname, 'generated_presentation');
  const outputPath = path.join(outputDir, 'test_output.pptx');

  await ensureDeckIsValid(slidesDir);
  await fs.mkdir(outputDir, { recursive: true });

  const pptx = buildPresentation();

  for (const slideSpec of deck) {
    const slidePath = path.join(slidesDir, slideSpec.file);
    console.log(`Generating ${slideSpec.label}: ${slideSpec.file}`);
    await html2pptx(slidePath, pptx);
  }

  await pptx.writeFile({ fileName: outputPath });
  console.log(`Presentation created: ${outputPath}`);

  generateThumbnails(outputPath, outputDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
