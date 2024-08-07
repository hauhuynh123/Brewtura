let fonts = [];
let fontPaths = [];
let input;
let exportButton;
let smallSizeButton;
let mediumSizeButton;
let largeSizeButton;
let sizeSlider;
let noiseOffset = 0;
let textValue = "";
let minFontSize = 24;
let maxFontSize = 40;
let baseSize = 24;

// INPUT FONT
function preload() {
    loadJSON('fonts.json', loadFonts);
}

function loadFonts(data) {
    fontPaths = data.fonts;
    for (let i = 0; i < fontPaths.length; i++) {
        fonts.push(loadFont(fontPaths[i]));
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    input = createInput();
    input.position(10, 10);
    input.input(updateText); // Update text on input

    exportButton = createButton('Build the Bridge');
    exportButton.position(input.x + input.width + 10, 10);
    exportButton.mousePressed(exportToSVG);

    sizeSlider = createSlider(24, 400, 24);
    sizeSlider.position(10, 40);
    sizeSlider.input(() => baseSize = sizeSlider.value());

    smallSizeButton = createButton('Only Weight');
    smallSizeButton.position(10, 70);
    smallSizeButton.mousePressed(() => setFontSizeRange(baseSize, 1.1 * baseSize)); // Range  of size

    mediumSizeButton = createButton('Weight and size');
    mediumSizeButton.position(10, 100);
    mediumSizeButton.mousePressed(() => setFontSizeRange(baseSize, 2 * baseSize)); // Range  of size


    largeSizeButton = createButton('Weight and size * 2');
    largeSizeButton.position(10, 130);
    largeSizeButton.mousePressed(() => setFontSizeRange(baseSize, 3 * baseSize)); // Range  of size

}

function setFontSizeRange(min, max) {
    minFontSize = min;
    maxFontSize = max;
}

function updateText() {
    textValue = input.value();
}

function updateNoise() {
    noiseOffset = 0;
}

function draw() {
    background(255);
    textAlign(LEFT);
    let x = 100;
    let y = windowHeight / 2; // Adjusted y position to accommodate buttons and slider
    let lineHeight = maxFontSize; // Use max font size for line height

    for (let i = 0; i < textValue.length; i++) {
        let fontIndex = int(noise(noiseOffset + i) * fonts.length) % fonts.length;
        let fontSize = map(noise(noiseOffset + i + 100), 0, 1, minFontSize, maxFontSize); // Random font size in the selected range
        textFont(fonts[fontIndex]);
        textSize(fontSize);
        if (x + textWidth(textValue[i]) > width - 10) { // Check if the text exceeds the canvas width
            x = 10; // Reset x to the start of the line
            y += lineHeight; // Move to the next line
        }
        text(textValue[i], x, y);
        x += textWidth(textValue[i]);
    }

    noiseOffset += 0.004; // Increment the noise offset for a new random pattern
}

function exportToSVG() {
    // Create SVG canvas
    let svgGraphics = createGraphics(windowWidth, windowHeight, SVG);
    svgGraphics.background(255);
    svgGraphics.textAlign(LEFT);
    let x = 10;
    let y = windowHeight / 2;
    let lineHeight = maxFontSize; // Use max font size for line height

    for (let i = 0; i < textValue.length; i++) {
        let fontIndex = int(noise(noiseOffset + i) * fonts.length) % fonts.length;
        let fontSize = map(noise(noiseOffset + i + 100), 0, 1, minFontSize, maxFontSize); // Random font size in the selected range
        textFont(fonts[fontIndex]);
        textSize(fontSize);
        if (x + textWidth(textValue[i]) > width - 10) { // Check if the text exceeds the canvas width
            x = 10; // Reset x to the start of the line
            y += lineHeight; // Move to the next line
        }
        svgGraphics.text(textValue[i], x, y);
        x += svgGraphics.textWidth(textValue[i]);
    }

    // Save the SVG
    save(svgGraphics, 'randomized_text.svg');
}
