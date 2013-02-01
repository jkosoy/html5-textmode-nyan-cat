///////////////////////////////////////////////////////////////////////////////////////////////////
// Globals
///////////////////////////////////////////////////////////////////////////////////////////////////

// This is our global textmode manager
var screenManager;

// The font that we will use
var sourceFont = new Image();
sourceFont.src = "font.png";


var lastUpdate;
var splosionsPx = [];

var text = "Nyan Nyan Nyan Nyan ";

///////////////////////////////////////////////////////////////////////////////////////////////////
// Initialisation
///////////////////////////////////////////////////////////////////////////////////////////////////

function init() {
    // Initialise the textmode library
    screenManager = new TextModeScreen(60, 25, "mainCanvas", sourceFont);
    
    // Call our main loop at 25fps
    setInterval(mainLoop, 1000 / 25);

    lastUpdate = new Date().getTime();
}


///////////////////////////////////////////////////////////////////////////////////////////////////
// The main loop
///////////////////////////////////////////////////////////////////////////////////////////////////

function mainLoop() {
    var now = new Date().getTime();
    var timeElapsed = now - lastUpdate;
    var needsNewSplosions = false;

    if(timeElapsed > 250) {

        lastUpdate = new Date().getTime();
        needsNewSplosions = true;

        // scroll text
        var textSplit = text.split("");
        var textChar = textSplit.shift();
        textSplit.push(textChar);
        text = textSplit.join("");
    }


    // solid blue
    var writePos = 0;
    for (y = 0; y < screenManager.charsHigh; y++) {
        for (x = 0; x < screenManager.charsWide; x++) {
            screenManager.charBuffer[writePos] = Math.random() * 255;
            screenManager.colourBuffer[writePos] = 0x11;
            writePos++;
        }
    }

    // 'splosions
    if(needsNewSplosions) {
        var numberOfSplosions = Math.floor(Math.random()*11);
        splosionsPx = [];

        for(i =0;i<numberOfSplosions;i++) {
            var px = Math.floor(Math.random()*(screenManager.charsHigh*screenManager.charsWide));
            splosionsPx.push(px);
        }
    }

    for(i=0;i<splosionsPx.length;i++) {
        screenManager.colourBuffer[splosionsPx[i]] = 0x1f; 
    }


    // rainbow
    var rainbow = [0x4c,0x64,0xef,0xa2,0x5d]
    y = 8;
    for(var i=0;i<rainbow.length;i++) {
        for(var j=0;j<2;j++) {
            var xCounter = 0;
            var offsetIndex = 0;

            for (x = 0; x < screenManager.charsWide-14; x++) {
                var offset = Math.round(Math.sin((x / 3) + now/80));

                var index = ((y+offset)*screenManager.charsWide)+x;
                screenManager.colourBuffer[index] = rainbow[i];


                xCounter++;
            }

            y++;
        }
    }


    var legCos = Math.round(Math.cos(now/100) - 0.25);
    var legSin = Math.round(Math.sin(now/100) - 0.25);

    var bodyCos = Math.round(Math.cos(now/100) - 0.25);
    var bodySin = Math.round(Math.sin(now/100) - 0.25);

    var headCos = Math.round(Math.cos(now/100) - 0.5);
    var headSin =  Math.round(Math.sin(now/100) - 0.5);

    printLeg(42+legCos,16+legSin);
    printLeg(34+legCos,16+legSin);
    printLeg(26+legCos,16+legSin);
    printLeg(20+legCos,16+legSin);
    printTail(12+bodyCos,11+bodySin);
    printCatBody(19+bodyCos,5+bodySin);
    printCatHead(42+headCos,8+headSin);

    // Shadow an area of the screen, draw an outlined box and write some text in it
    screenManager.processBox(screenManager.charsWide-23, 21, 22, 3, function(charId, colourId) { return [charId, colourId & 0x77]; });
    screenManager.printBox(screenManager.charsWide-23, 21, 22, 3, 0x7f);
    screenManager.print(screenManager.charsWide-22, 22,text, 0x7f);

    // Render the textmode screen to our canvas
    screenManager.presentToScreen();
}

function printCatBody(x,y) {
     screenManager.printBox(x+1, y, 26, 1, 0x00);
     screenManager.printBox(x, y+1, 28, 10, 0x00);
     screenManager.printBox(x+1, y+11, 26, 1, 0x00);


     screenManager.printBox(x+1, y+1, 26, 10, 0x77);


     screenManager.printBox(x+2, y+2, 24, 8, 0xdd);

     var spots = [
        [x+20,y+3],
        [x+12,y+4],
        [x+3,y+3],
        [x+11,y+8],
        [x+16,y+6],
        [x+6,y+6],
        [x+3,y+8],
        [x+12,y+4],
        [x+20,y+8],
     ]

     for(var i=0;i<spots.length;i++) {
        var spotX = spots[i][0];
        var spotY = spots[i][1];

        var index = (spotY*screenManager.charsWide)+spotX;
        screenManager.charBuffer[index] = Math.random() * 255;
        screenManager.colourBuffer[index] = 0xdc;
     }
}

function printTail(x,y) {
    var destination = x+7;
    var tip = x;
    var now = new Date().getTime();
    for (x;x<destination;x++) {
        var offset = -Math.round(Math.sin((x / 3) + now/80));

        for(var i=0;i<4;i++) {
            var dy = y+i;
            var index = ((dy+offset)*screenManager.charsWide)+x;
            if(i >0 && i<3 && x!=tip) screenManager.colourBuffer[index] = 0x77;
            else screenManager.colourBuffer[index] = 0x00;
         }

    }
}

// x,y is the cat's top left ear.
function printCatHead(x,y) {
    printEar(x,y);
    printEar(x+11,y);
    printFace(x-2,y+2);
}

function printLeg(x,y) {
    screenManager.printBox(x, y, 5, 3, 0x00);
    screenManager.printBox(x+1, y, 3, 2, 0x77);        
}

function printFace(x,y) {
    // background and border
    screenManager.printBox(x, y, 19, 5, 0x00);
    screenManager.printBox(x+1, y, 17, 5, 0x77);
    screenManager.printBox(x+1, y+5, 17, 1, 0x00);
    screenManager.printBox(x+2, y+5, 15, 1, 0x77);
    screenManager.printBox(x+1, y+6, 17, 1, 0x00);

    // eyes
    screenManager.printBox(x+4,y+1,1,1,0x00)
    screenManager.printBox(x+12,y+1,1,1,0x00)

    // cheeks
    screenManager.printBox(x+2,y+3,1,1,0xcc)
    screenManager.printBox(x+15,y+3,1,1,0xcc)

    // smile (sort of)
    screenManager.printBox(x+8,y+3,1,1,0x00);
    screenManager.printBox(x+5,y+4,9,1,0x00)

}

function printEar(x,y) {
    screenManager.printBox(x,y,4,1,0x00);
    screenManager.printBox(x-1,y+1,6,1,0x00);
    screenManager.printBox(x+1,y+1,3,1,0x77);
}


