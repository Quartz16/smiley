

class SmileyConfig {
    constructor(x, y, smileySize, eyeHeight, eyePadding, circleRadius, mouthPaddingX, mouthPaddingY, mouthHeight) {
        this.x = x;
        this.y = y;
        this.smileySize = smileySize;
        this.eyeHeight = eyeHeight;
        this.eyePadding = eyePadding;
        this.circleRadius = circleRadius;
        this.mouthPaddingX = mouthPaddingX;
        this.mouthPaddingY = mouthPaddingY;
        this.mouthHeight = mouthHeight;
    }


}

var currentConfig;
const smileys = {};
var smileyIndex = 0;
var mousedown = false;


function createLine(context, x1, y1, x2, y2) {
    console.log(x1 + ", " + y1 + " " + x2 + ", " + y2 );
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
    const ratioX = parseFloat(canvas.width) / parseFloat(oldCanvasWidth);
    const ratioY = parseFloat(canvas.height) / parseFloat(oldCanvasHeight);

    //redraw
    for (let i = 0; i < smileyIndex; i++) {
        var smiley = smileys[i];
        smileys[i].x *= parseFloat(ratioX);
        smileys[i].y *= parseFloat(ratioY);

        var changeRatio = (2.0*ratioX*ratioY) / (ratioX+ratioY) ;
        var changesize = parseFloat(smiley.smileySize) * parseFloat(changeRatio);
        console.log("rscs: " + changesize);
        changeSmileySize(changesize);
        var context = canvas.getContext("2d");
        drawSmiley(context, smiley.x, smiley.y, true);
    }
}

function initializeConfig() {
    currentConfig = new SmileyConfig(0, 0, 1, 40, 20, 80, 30, 8, 28);
}

function createConfig(x, y) {
    return new SmileyConfig(x, y, currentConfig.smileySize, currentConfig.eyeHeight, currentConfig.eyePadding, currentConfig.circleRadius, currentConfig.mouthPaddingX, currentConfig.mouthPaddingY, currentConfig.mouthHeight);

}

function drawSmiley(context, x, y, redraw) {
    var config = createConfig(x, y);
    
    if (!redraw) {
        smileys[smileyIndex] = config;
        smileyIndex++;
    }
    console.log(x + ", " + y + " " + config.eyePadding);
    const ep = config.eyePadding;
    const leftX = x - ep;
    const rightX = parseFloat(x) + parseFloat(ep);
    console.log("x: " + x + "ep: " + ep + "L: " + leftX + "R: " + rightX);
    createLine(context, leftX, y, leftX, y-config.eyeHeight);
    createLine(context, rightX, y, rightX, y-config.eyeHeight);
    let startX = parseFloat(x)-parseFloat(config.mouthPaddingX);
    let startY = parseFloat(y)+parseFloat(config.mouthPaddingY);
    let endX = parseFloat(x)+parseFloat(config.mouthPaddingX);
    let endY = parseFloat(y)+parseFloat(config.mouthPaddingY)+parseFloat(config.mouthHeight);
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

function minEyeHeight() {
    return Math.max(1, (currentConfig.circleRadius / 30));
}

function maxEyeHeight() {
    return currentConfig.circleRadius - currentConfig.eyePadding - 2;
}

function minEyePadding() {
    return Math.min(2* currentConfig.circleRadius - 2, Math.max(1, (currentConfig.eyeHeight / 10)));
}

function maxEyePadding() {
    return (currentConfig.circleRadius / 2) - 2;
}

function minCircleRadius() {
    var canvas = document.getElementById("canvas");

    return parseFloat(Math.max((Math.min(canvas.width, canvas.height)/60), (currentConfig.mouthPaddingY+currentConfig.mouthHeight+2), (currentConfig.eyePadding+2), (currentConfig.eyeHeight+2), (currentConfig.mouthPaddingX+2)));
}

function maxCircleRadius() {
    var canvas = document.getElementById("canvas");
    return parseFloat(Math.max(Math.min(canvas.width, canvas.height), 5)) / parseFloat(2.0);
}

function minMouthPaddingX() {
    return currentConfig.eyePadding + Math.max(currentConfig.circleRadius/50, 2); 
}

function maxMouthPaddingX() {
    return parseFloat(0.9) * parseFloat(currentConfig.circleRadius) - 2; 
}

function minMouthPaddingY() {
    return Math.max(currentConfig.circleRadius/50, 2); 
}

function maxMouthPaddingY() {
    return currentConfig.circleRadius - currentConfig.mouthHeight - 2; 
}


function minMouthHeight() {
    return Math.max(currentConfig.circleRadius/30, 2); 
}

function maxMouthHeight() {
    return currentConfig.circleRadius - currentConfig.mouthPaddingY - 2; 
}


function minSmileySize() {
    return parseFloat(minCircleRadius()) / parseFloat(currentConfig.circleRadius) * parseFloat(currentConfig.smileySize);
}

function maxSmileySize() {
    return parseFloat(maxCircleRadius()) / parseFloat(currentConfig.circleRadius) * parseFloat(currentConfig.smileySize);
}

function changeSmileySize(newSmileySizeString) {
    //don't want to do anything if the new size is 0, should be larger than that
    var newSmileySize = parseFloat(newSmileySizeString);
    console.log(newSmileySize);
    if (newSmileySize == 0) return;
    var oldSize = currentConfig.smileySize;
    var changeRatio = parseFloat(newSmileySize) / parseFloat(oldSize);
    
    console.log("RATIO" + changeRatio);
    //update all config values
    currentConfig.eyeHeight *= changeRatio;
    currentConfig.eyePadding *= changeRatio;
    currentConfig.circleRadius *= changeRatio;
    currentConfig.mouthPaddingX *= changeRatio;
    currentConfig.mouthPaddingY *= changeRatio;
    currentConfig.mouthHeight *= changeRatio;
    currentConfig.smileySize = newSmileySize;

    updateMaxMins();
}

function updateMaxMins() {
    var smileySize = document.getElementById("smileySizeRange");
    smileySize.min = minSmileySize();
    smileySize.max = maxSmileySize();
    var eyeHeight = document.getElementById("eyeHeightRange");
    eyeHeight.min = minEyeHeight();
    eyeHeight.max = maxEyeHeight();

    var eyePadding = document.getElementById("eyePaddingRange");
    eyePadding.min = minEyePadding();
    eyePadding.max = maxEyePadding();

    var circleRadius = document.getElementById("circleRadiusRange");
    circleRadius.min = minCircleRadius();
    circleRadius.max = maxCircleRadius();
    var mouthPaddingX = document.getElementById("mouthPaddingXRange");
    mouthPaddingX.min = minMouthPaddingX();
    mouthPaddingX.max = maxMouthPaddingX();

    var mouthPaddingY = document.getElementById("mouthPaddingYRange");
    mouthPaddingY.min = minMouthPaddingY();
    mouthPaddingY.max = maxMouthPaddingY();


    var mouthHeight = document.getElementById("mouthHeightRange");
    mouthHeight.min = minMouthHeight();
    mouthHeight.max = maxMouthHeight();


}
