

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
    get(configID) {
        switch(configID) {
            case 0:
                return this.smileySize;
            case 1:
                return this.eyeHeight;
            case 2:
                return this.eyePadding;
            case 3:
                return this.circleRadius;
            case 4:
                return this.mouthPaddingX;
            case 5:
                return this.mouthPaddingY;
            case 6:
                return this.mouthHeight;
            default:
                return -1;

        }
    }
    set(configID, newValue) {
        switch(configID) {
            case 0:
                this.smileySize = newValue;
                break;
            case 1:
                this.eyeHeight = newValue;
                break;
            case 2:
                this.eyePadding = newValue;
                break;
            case 3:
                this.circleRadius = newValue;
                break;
            case 4:
                this.mouthPaddingX = newValue;
                break;
            case 5:
                this.mouthPaddingY = newValue;
                break;
            case 6:
                this.mouthHeight = newValue;
                break;

        }
    }

    minValue(configID) {
        switch(configID) {
            case 0:
                //smileySize
                return parseFloat(this.minValue(3)) / parseFloat(this.circleRadius) * parseFloat(this.smileySize);
            case 1:
                //eyeheight
                return Math.max(1, (this.circleRadius / 30));
            case 2:
                //eyepadding
                return Math.min(2* this.circleRadius - 2, Math.max(1, (this.eyeHeight / 10)));
            case 3:
                //circleradius
                var canvas = document.getElementById("canvas");
                return parseFloat(Math.max((Math.min(canvas.width, canvas.height)/60), (this.mouthPaddingY+this.mouthHeight+2), (this.eyePadding+2), (this.eyeHeight+2), (this.mouthPaddingX+2)));
            case 4:
                //mouthpaddingx
                return this.eyePadding + Math.max(this.circleRadius/50, 2); 
            case 5:
                //mouthpaddingY
                return Math.max(this.circleRadius/50, 2); 
            case 6:
                //mouthHeight
                return Math.max(this.circleRadius/30, 2); 


        }
    }

    maxValue(configID) {
        switch(configID) {
            case 0:
                //smileysize
                return parseFloat(this.maxValue(3)) / parseFloat(currentConfig.circleRadius) * parseFloat(this.smileySize);
            case 1:
                //eyeheight
                return this.circleRadius - this.eyePadding - 2;
            case 2:
                //eyepadding
                return (this.circleRadius / 2) - 2;
            case 3:
                //circleradius
                var canvas = document.getElementById("canvas");
                return parseFloat(Math.max(Math.min(canvas.width, canvas.height), 5)) / parseFloat(2.0);
            case 4:
                //mouthpaddingx
                return parseFloat(0.9) * parseFloat(this.circleRadius) - 2; 
            case 5:
                //mouthpaddingY
                return this.circleRadius - this.mouthHeight - 2; 
            case 6:
                //mouthheight
                return this.circleRadius - this.mouthPaddingY - 2; 

        }
    }
        


}

var currentConfig;
const smileys = [];
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
        drawSmiley(context, null, smiley.x, smiley.y, true);
    }
}

function initializeConfig() {
    currentConfig = new SmileyConfig(0, 0, 1, 40, 20, 80, 30, 8, 28);
}

function initializePreviewConfig(x, y, scale) {
    return new SmileyConfig(x, y,
        (currentConfig.smileySize * scale),
        (currentConfig.eyeHeight * scale),
        (currentConfig.eyePadding * scale),
        (currentConfig.circleRadius * scale),
        (currentConfig.mouthPaddingX * scale),
        (currentConfig.mouthPaddingY * scale),
        (currentConfig.mouthHeight * scale));


}

function createConfig(x, y) {
    return new SmileyConfig(x, y, currentConfig.smileySize, currentConfig.eyeHeight, currentConfig.eyePadding, currentConfig.circleRadius, currentConfig.mouthPaddingX, currentConfig.mouthPaddingY, currentConfig.mouthHeight);

}

function drawSmiley(context, config, x, y, redraw) {
    console.log("DRAWING SMILEY AT " + x + ", " + y);
    if (config == null) var config = createConfig(x, y);
    
    if (!redraw) {
        smileys[smileyIndex] = config;
        smileyIndex++;
    }
    console.log(x + ", " + y + " " + config.eyePadding);
    const ep = parseFloat(config.eyePadding);
    const leftX = parseFloat(x) - parseFloat(ep);
    const rightX = parseFloat(x) + parseFloat(ep);
    const topY = parseFloat(y) - parseFloat(config.eyeHeight);
    console.log("x: " + x + "ep: " + ep + "L: " + leftX + "R: " + rightX);
    createLine(context, leftX, parseFloat(y), leftX, topY);
    createLine(context, rightX, parseFloat(y), rightX, topY);
    let startX = parseFloat(x)-parseFloat(config.mouthPaddingX);
    let startY = parseFloat(y)+parseFloat(config.mouthPaddingY);
    let endX = parseFloat(x)+parseFloat(config.mouthPaddingX);
    let endY = parseFloat(y)+parseFloat(config.mouthPaddingY)+parseFloat(config.mouthHeight);
    createBezierCurve(context, startX, startY, startX, endY, endX, endY, endX, startY);
    createCircle(context, x, y, config.circleRadius);
}

function clearScreen() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    //set smileys to nothing
    smileys.length = 0;
    smileyIndex = 0;
}

function drawPreview() { 
    var canvas = document.getElementById("canvas");
    var preview = document.getElementById("preview");
    var prev_context = preview.getContext("2d");
    preview.height = preview.width;

    prev_context.fillStyle="white";
    prev_context.fillRect(0, 0, preview.width, preview.height);
    prev_context.fillStyle="black";
    var canvasCoords = convertXYToCanvas(preview, (preview.width / 2), (preview.height / 2)); 

    const scale = preview.width / currentConfig.circleRadius / 2;
    

    var prev_config = initializePreviewConfig(canvasCoords.x, canvasCoords.y, scale);
    

    drawSmiley(prev_context, prev_config, (preview.width / 2), (preview.height/2), true); 
}

function convertXYToCanvas(canvas, mouseX, mouseY) {
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

    var canvasCoords = convertXYToCanvas(canvas, mouseX, mouseY);
    drawSmiley(context, null, canvasCoords.x, canvasCoords.y, false);
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
    smileySize.min = currentConfig.minValue(0);
    smileySize.max = currentConfig.maxValue(0);
    smileySize.value = currentConfig.smileySize;
    var smileySizeNum = document.getElementById("smileySizeNum");
    smileySizeNum.value = currentConfig.smileySize.toFixed(4);

    var eyeHeight = document.getElementById("eyeHeightRange");
    eyeHeight.min = currentConfig.minValue(1);
    eyeHeight.max = currentConfig.maxValue(1);
    eyeHeight.value = currentConfig.eyeHeight;
    var eyeHeightNum = document.getElementById("eyeHeightNum");
    eyeHeightNum.value = parseFloat(currentConfig.eyeHeight).toFixed(4);

    var eyePadding = document.getElementById("eyePaddingRange");
    eyePadding.min = currentConfig.minValue(2);
    eyePadding.max = currentConfig.maxValue(2);
    eyePadding.value = currentConfig.eyePadding;
    var eyePaddingNum = document.getElementById("eyePaddingNum");
    eyePaddingNum.value = parseFloat(currentConfig.eyePadding).toFixed(4);

    var circleRadius = document.getElementById("circleRadiusRange");
    circleRadius.min = currentConfig.minValue(3);
    circleRadius.max = currentConfig.maxValue(3);
    circleRadius.value = currentConfig.circleRadius;
    var circleRadiusNum = document.getElementById("circleRadiusNum");
    circleRadiusNum.value = parseFloat(currentConfig.circleRadius).toFixed(4);


    var mouthPaddingX = document.getElementById("mouthPaddingXRange");
    mouthPaddingX.min = currentConfig.minValue(4);
    mouthPaddingX.max = currentConfig.maxValue(4);
    mouthPaddingX.value = currentConfig.mouthPaddingX;
    var mouthPaddingXNum = document.getElementById("mouthPaddingXNum");
    mouthPaddingXNum.value = parseFloat(currentConfig.mouthPaddingX).toFixed(4);

    var mouthPaddingY = document.getElementById("mouthPaddingYRange");
    mouthPaddingY.min = currentConfig.minValue(5);
    mouthPaddingY.max = currentConfig.maxValue(5);
    mouthPaddingY.value = currentConfig.mouthPaddingY;
    var mouthPaddingYNum = document.getElementById("mouthPaddingYNum");
    mouthPaddingYNum.value = parseFloat(currentConfig.mouthPaddingY).toFixed(4);


    var mouthHeight = document.getElementById("mouthHeightRange");
    mouthHeight.min = currentConfig.minValue(6);
    mouthHeight.max = currentConfig.maxValue(6);
    mouthHeight.value = currentConfig.mouthHeight;
    var mouthHeightNum = document.getElementById("mouthHeightNum");
    mouthHeightNum.value = parseFloat(currentConfig.mouthHeight).toFixed(4);

    drawPreview();
}


function handleConfigText(e, textId, sliderId, configID) {
    var textbox = document.getElementById(textId);
    var text = textbox.value;

    var key = e.key;
    console.log("Key: " + key);
    if (key !== undefined) {
        console.log(typeof key);
        if (key == 'Backspace') {

            textbox.value = text.substring(0, text.length - 1);

        }
        if (key === 'Enter') {
            if ((parseFloat(text) >= currentConfig.minValue(configID)) && (parseFloat(text) <= currentConfig.maxValue(configID))) {
                currentConfig.set(configID, parseFloat(text));
                document.getElementById(sliderId).value = parseFloat(text);

                console.log("ENTER: " + text);
                updateMaxMins();
            }
        }
        else if (((e.which > 47) && (e.which <58)) || (key === '.')) {
            text = text + key;
        }
        else {
            e.preventDefault();
        }
    }
       

    //textbox.value = text;
}




