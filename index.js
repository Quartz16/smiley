

class Settings {
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

var settings;

function initializeSettings() {
    settings = new Settings(10, 5, 20, 6, 2, 7);
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

function drawSmiley(x, y) {
    
    createLine(settings.context, x-settings.eyePadding, y, x-settings.eyePadding, y-settings.eyeHeight);
    createLine(settings.context, x+settings.eyePadding, y, x+settings.eyePadding, y-settings.eyeHeight);
    let startX = x-settings.mouthPaddingX;
    let startY = y+settings.mouthPaddingY;
    let endX = x+settings.mouthPaddingX;
    let endY = y+settings.mouthPaddingY+settings.mouthHeight;
    createBezierCurve(settings.context, startX, startY, startX, endY, endX, endY, endX, startY);
    createCircle(settings.context, x, y, settings.circleRadius);

}

function convertXYToCanvas(mouseX, mouseY, e) {
    var rect = settings.canvas.getBoundingClientRect();
    var scrollX = settings.canvas.scrollWidth / settings.canvas.width;
    var scrollY = settings.canvas.scrollHeight / settings.canvas.height;
    return {x: (mouseX-rect.left) / scrollX, y: (mouseY-rect.top) / scrollY};
}

function createSmiley(e) {
    let mouseX = e.clientX;
    let mouseY = e.clientY;

    var canvasCoords = convertXYToCanvas(mouseX, mouseY, e);
    drawSmiley(canvasCoords.x, canvasCoords.y);
}

