

class Config {
    constructor(eyeHeight, eyePadding, circleRadius, mouthPaddingX, mouthPaddingY, mouthHeight) {
        this.eyeHeight = eyeHeight;
        this.eyePadding = eyePadding;
        this.circleRadius = circleRadius;
        this.mouthPaddingX = mouthPaddingX;
        this.mouthPaddingY = mouthPaddingY;
        this.mouthHeight = mouthHeight;
        this.canvas = document.getElementById("canvas");
        this.context = canvas.getContext("2d");
    }
}

var config;
const smileys = {};
var smileyIndex = 0;

function initializeConfig() {
    config = new Config(10, 5, 20, 6, 2, 7);
}

function createLine(context, x1, y1, x2, y2) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}

function createArc(context, x, y, radius, startAngle, endAngle) {
    context.beginPath();
    context.arc(x, y, radius, startAngle, endAngle);
    context.stroke();
}

function createCircle(context, x, y, radius) {
    createArc(context, x, y, radius, 0, 2 * Math.PI);
}

function createBezierCurve(context, startX, startY, x1, y1, x2, y2, x3, y3) { 
    context.beginPath();
    context.moveTo(startX, startY);
    context.bezierCurveTo(x1, y1, x2, y2, x3, y3);
    context.stroke();
}

function resizeAndDraw() {
    var oldCanvasWidth = config.canvas.width;
    var oldCanvasHeight = config.canvas.height;
    config.canvas.width = window.innerWidth;
    config.canvas.height = window.innerHeight;
    var ratioX = config.canvas.width / oldCanvasWidth;
    var ratioY = config.canvas.height / oldCanvasHeight;

    //redraw
    for (let i = 0; i < smileyIndex; i++) {
        var smiley = smileys[i];
        smileys[i].x *= ratioX;
        smileys[i].y *= ratioY;
        drawSmiley(smiley.x, smiley.y, true);
    }
}

function drawSmiley(x, y, redraw) {
    
    if (!redraw) {
        smileys[smileyIndex] = {x, y};
        smileyIndex++;
    }
    createLine(config.context, x-config.eyePadding, y, x-config.eyePadding, y-config.eyeHeight);
    createLine(config.context, x+config.eyePadding, y, x+config.eyePadding, y-config.eyeHeight);
    let startX = x-config.mouthPaddingX;
    let startY = y+config.mouthPaddingY;
    let endX = x+config.mouthPaddingX;
    let endY = y+config.mouthPaddingY+config.mouthHeight;
    createBezierCurve(config.context, startX, startY, startX, endY, endX, endY, endX, startY);
    createCircle(config.context, x, y, config.circleRadius);

}

function convertXYToCanvas(e, mouseX, mouseY) {
    var rect = config.canvas.getBoundingClientRect();
    var scrollX = config.canvas.scrollWidth / config.canvas.width;
    var scrollY = config.canvas.scrollHeight / config.canvas.height;
    return {x: (mouseX-rect.left) / scrollX, y: (mouseY-rect.top) / scrollY};
}

function createSmiley(e) {
    let mouseX = e.clientX;
    let mouseY = e.clientY;

    var canvasCoords = convertXYToCanvas(e, mouseX, mouseY);
    drawSmiley(canvasCoords.x, canvasCoords.y, false);
}

