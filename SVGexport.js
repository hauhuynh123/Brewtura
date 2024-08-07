function setup() {
    createCanvas(400, 400, SVG); // Create SVG canvas
    background(255);
    fill(0);
    textSize(32);
    text("Test SVG Export", 10, 50);
    save("test.svg"); // Save as SVG
}

function draw() {
    // No need to draw continuously
    noLoop();
}
