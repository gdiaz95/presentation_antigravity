const pptxgen = require('pptxgenjs');
const html2pptx = require('./html2pptx.js');
const path = require('path');

async function createPresentation() {
    console.log('Starting presentation generation...');
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'Antigravity';
    pptx.title = 'Introduction to Quantum Computing';

    const slidesDir = path.join(__dirname, 'slides');

    // Slide 1
    console.log('Generating Slide 1...');
    await html2pptx(path.join(slidesDir, 'slide1.html'), pptx);

    // Slide 2
    console.log('Generating Slide 2...');
    await html2pptx(path.join(slidesDir, 'slide2.html'), pptx);

    // Slide 3
    console.log('Generating Slide 3...');
    await html2pptx(path.join(slidesDir, 'slide3.html'), pptx);

    // Slide 4
    console.log('Generating Slide 4...');
    const { slide: slide4, placeholders } = await html2pptx(path.join(slidesDir, 'slide4.html'), pptx);

    if (placeholders && placeholders.length > 0) {
        console.log('Adding chart to Slide 4...');
        const chartData = [
            {
                name: "Classical Algorithms",
                labels: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6"],
                values: [10, 20, 30, 40, 50, 60] // Linear growth approx
            },
            {
                name: "Quantum Algorithms",
                labels: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6"],
                values: [2, 8, 32, 128, 512, 2048] // Exponential growth
            }
        ];

        slide4.addChart(pptx.charts.LINE, chartData, {
            ...placeholders[0],
            showTitle: true,
            title: 'Processing Power Over Time',
            showLegend: true,
            legendPos: 'b',
            showCatAxisTitle: true,
            catAxisTitle: 'Time',
            showValAxisTitle: true,
            valAxisTitle: 'Estimated Power',
            chartColors: ["B165FB", "40695B"], // Purple (Classical), Emerald (Quantum)
            lineSize: 3,
            lineSmooth: true
        });
    }

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
