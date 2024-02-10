

class SmileyConfig {
    constructor(x, y, eyeHeight, eyePadding, circleRadius, mouthPaddingX, mouthPaddingY, mouthHeight) {
        this.x = x;
        this.y = y;
        this.eyeHeight = eyeHeight;
        this.eyePadding = eyePadding;
        this.circleRadius = circleRadius;
        this.mouthPaddingX = mouthPaddingX;
        this.mouthPaddingY = mouthPaddingY;
        this.mouthHeight = mouthHeight;
    }
}

const smileys = {};
var smileyIndex = 0;
var mousedown = false;


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
    var canvas = document.getElementById("canvas");
    var oldCanvasWidth = canvas.width;
    var oldCanvasHeight = canvas.height;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ratioX = canvas.width / oldCanvasWidth;
    var ratioY = canvas.height / oldCanvasHeight;

    //redraw
    for (let i = 0; i < smileyIndex; i++) {
        var smiley = smileys[i];
        smileys[i].x *= ratioX;
        smileys[i].y *= ratioY;
        var context = canvas.getContext("2d");
        drawSmiley(context, smiley.x, smiley.y, true);
    }
}

function initializeConfig(x, y) {
    return new SmileyConfig(x, y, 10, 5, 20, 6, 2, 7);
}

function drawSmiley(context, x, y, redraw) {
    var config = initializeConfig(x, y);
    
    if (!redraw) {
        smileys[smileyIndex] = config;
        smileyIndex++;
    }
    createLine(context, x-config.eyePadding, y, x-config.eyePadding, y-config.eyeHeight);
    createLine(context, x+config.eyePadding, y, x+config.eyePadding, y-config.eyeHeight);
    let startX = x-config.mouthPaddingX;
    let startY = y+config.mouthPaddingY;
    let endX = x+config.mouthPaddingX;
    let endY = y+config.mouthPaddingY+config.mouthHeight;
    createBezierCurve(context, startX, startY, startX, endY, endX, endY, endX, startY);
    createCircle(context, x, y, config.circleRadius);

}

function convertXYToCanvas(e, canvas, mouseX, mouseY) {
    var rect = canvas.getBoundingClientRect();
    var scrollX = canvas.scrollWidth / canvas.width;
    var scrollY = canvas.scrollHeight / canvas.height;
    return {x: (mouseX-rect.left) / scrollX, y: (mouseY-rect.top) / scrollY};
}


function createSmiley(e) {
    let mouseX = e.clientX;
    let mouseY = e.clientY;

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    var canvasCoords = convertXYToCanvas(e, canvas, mouseX, mouseY);
    drawSmiley(context, canvasCoords.x, canvasCoords.y, false);
}

