let fonts = [];
let fontPaths = [];
let input;
let exportSVGButton;
let exportPNGButton;
let smallSizeButton;
let mediumSizeButton;
let largeSizeButton;
let sizeSlider;
let noiseOffset = 0;
let textValue = "";
let minFontSize = 24;
let maxFontSize = 40;
let baseSize = 24;
let yValue = [];
let density = [];
let leading = [];

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

    exportSVGButton = createButton('Export to SVG');
    exportSVGButton.position(input.x + input.width + 10, 10);
    exportSVGButton.mousePressed(exportToSVG);

    exportPNGButton = createButton('Export to PNG');
    exportPNGButton.position(exportSVGButton.x + exportSVGButton.width + 10, 10);
    exportPNGButton.mousePressed(exportToPNG);

    sizeSlider = createSlider(24, 400, 24);
    sizeSlider.position(10, 40);
    sizeSlider.input(() => baseSize = sizeSlider.value());

    smallSizeButton = createButton('Small (1*a to 1.1*a)');
    smallSizeButton.position(10, 70);
    smallSizeButton.mousePressed(() => setFontSizeRange(baseSize, 1.1 * baseSize));

    mediumSizeButton = createButton('Medium (1*a to 2*a)');
    mediumSizeButton.position(10, 100);
    mediumSizeButton.mousePressed(() => setFontSizeRange(baseSize, 2 * baseSize));

    largeSizeButton = createButton('Large (1*a to 3*a)');
    largeSizeButton.position(10, 130);
    largeSizeButton.mousePressed(() => setFontSizeRange(baseSize, 3 * baseSize));

    positionSlider = createSlider(0, 400, 40);
    positionSlider.position(10, 160);
    positionSlider.input(() => yValue = positionSlider.value());

    leadingSlider = createSlider(0, 200, 1);
    leadingSlider.position(10, 190);
    leadingSlider.input(() => leading = leadingSlider.value());

    densitySlider = createSlider(0, 10, 1);
    densitySlider.position(10, 220);
    densitySlider.input(() => density = densitySlider.value());
}

function setFontSizeRange(min, max) {
    minFontSize = min;
    maxFontSize = max;
}

function updateText() {
    textValue = input.value();
}

function draw() {
    background(255);
    textAlign(LEFT);
    let x = 10;
    let y = yValue;
    let lineHeight = leading; // Use max font size for line height

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

    noiseOffset += density / 1000; // Increment the noise offset for a new random pattern
}

function exportToSVG() {
    let svgGraphics = createGraphics(windowWidth, windowHeight, SVG); // Ensure the SVG context
    svgGraphics.background(255);
    svgGraphics.textAlign(LEFT);
    let x = 10;
    let y = yValue;
    let lineHeight = leading;

    for (let i = 0; i < textValue.length; i++) {
        let fontIndex = int(noise(noiseOffset + i) * fonts.length) % fonts.length;
        let fontSize = map(noise(noiseOffset + i + 100), 0, 1, minFontSize, maxFontSize);
        svgGraphics.textFont(fonts[fontIndex]);
        svgGraphics.textSize(fontSize);
        if (x + svgGraphics.textWidth(textValue[i]) > svgGraphics.width - 10) {
            x = 10;
            y += lineHeight;
        }
        svgGraphics.text(textValue[i], x, y);
        x += svgGraphics.textWidth(textValue[i]);
    }

    save(svgGraphics, 'randomized_text.svg');
}

function exportToPNG() {
    saveCanvas('randomized_text', 'png');
}
