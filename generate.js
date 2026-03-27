const pptxgen = require('pptxgenjs');
const html2pptx = require('./html2pptx.js');
const path = require('path');

async function createPresentation() {
    console.log('Starting presentation generation...');
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'Gabriel Díaz Ramos';
    pptx.title = 'Introduction to Quantum Computing';

    const slidesDir = path.join(__dirname, 'slides');

    console.log('Generating Slide 1 (Title)...');
    await html2pptx(path.join(slidesDir, 'slide1.html'), pptx);

    console.log('Generating Slide 2 (Classical vs. Quantum)...');
    await html2pptx(path.join(slidesDir, 'slide2.html'), pptx);

    console.log('Generating Slide 3 (Core Concepts)...');
    await html2pptx(path.join(slidesDir, 'slide3.html'), pptx);

    console.log('Generating Slide 4 (Applications)...');
    await html2pptx(path.join(slidesDir, 'slide4.html'), pptx);

    // Save
    const outputDir = path.join(__dirname, 'generated_presentation');
    const fs = require('fs');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'quantum_computing_intro.pptx');
    await pptx.writeFile({ fileName: outputPath });
    console.log('Presentation created successfully at:', outputPath);
}

createPresentation().catch(console.error);
