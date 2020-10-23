let gameName = "SPACE MINER";

let audio;


let musicHasBeenPlayed = false;


function toggleMusic() {
    if (audio.paused) {
        console.log("Playing music...");
        audio.play();


        document.getElementById("stopMusic").src = "images/sound_on.png";

    } else {
        console.log("Stopping music...");
        audio.pause();

        document.getElementById("stopMusic").src = "images/sound_off.png";

    }
}

function initMusic() {
    if (!musicHasBeenPlayed) {
        musicHasBeenPlayed = true;
        audio.play();
    }
}

(function (wavycanvas) {

    "use strict";

    var textcanvas, textctx, wavyctx, w, h, xoffset, palette;

    var init = function () {
        textcanvas = document.createElement("canvas");
        w = wavycanvas.width;
        h = wavycanvas.height;
        textctx = textcanvas.getContext("2d");
        wavyctx = wavycanvas.getContext("2d");
        xoffset = 0;

        document.getElementById("message").addEventListener("input", nameHasChanged, false);
        document.getElementById("play").addEventListener("click", randomizePalette, false);

        document.getElementById("stopMusic").addEventListener("click", toggleMusic, false);

        randomizePalette();
        setGameName();
        setPlayButtonVisible(false);

        document.body.addEventListener('click', initMusic, true);

        audio = document.getElementById("playAudio");

    };


    var username;

    var nameHasChanged = function () {
        var message = document.getElementById("message").value;

        if (message) {
            console.log("Showing button")
            setPlayButtonVisible(true);
        } else {
            console.log("Hiding button")
            setPlayButtonVisible(false);
        }

        username = message;

    }

    // Set if the play button is visible or not
    function setPlayButtonVisible(b) {
        if (b) {
            document.getElementById("play").style.display = "block";
        } else {
            document.getElementById("play").style.display = "none";
        }
    }

    var setGameName = function () {
        var message = gameName;
        textctx.font = "bold 100px impact";
        textcanvas.width = Math.floor(textctx.measureText(message).width) + w * 2;
        textcanvas.height = wavycanvas.height;
        textctx.fillStyle = "rgba(0, 0, 0, 0)";
        textctx.fillRect(0, 0, textcanvas.width, textcanvas.height);
        textctx.fillStyle = "#eeeeee";
        textctx.font = "bold 100px impact";
        textctx.fillText(message, w, 150);
    };

    var randomizePalette = function () {
        palette = [];
        var rx = Math.pow(2, Math.floor(Math.random() * 4) + 5); //factors of 256 will loop nice
        var gx = Math.pow(2, Math.floor(Math.random() * 4) + 5);
        var bx = Math.pow(2, Math.floor(Math.random() * 4) + 5);
        var i, r, g, b;
        for (i = 0; i < 512; i++) {
            r = Math.floor(128 + 128 * Math.sin(3.1415 * i / rx));
            g = Math.floor(128 + 128 * Math.sin(3.1415 * i / gx));
            b = Math.floor(128 + 128 * Math.sin(3.1415 * i / bx));
            palette.push([r, g, b]);
        }
    };

    var freq = 50;
    var amp = 5;
    var speed = 5;

    var drawWavyTitle = function () {
        var realxoffset = Math.floor(xoffset) % (textcanvas.width - w);
        var sourceData = textctx.getImageData(realxoffset, 0, w, h).data;
        var wavyData = wavyctx.createImageData(w, h);
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                var yoffset = Math.floor((amp * 2 * Math.sin(x / freq)) - amp);
                var point = (x + y * w) * 4;
                if (y + yoffset > 0 && y + yoffset < h) {
                    wavyData.data[point] = (sourceData[point + yoffset * w * 4] === 0) ?
                        wavyData.data[point + 2] :
                        palette[y % 255][0];
                    wavyData.data[point + 1] = (sourceData[point + yoffset * w * 4 + 1] === 0) ?
                        wavyData.data[point + 2] :
                        palette[y % 255][1];
                    wavyData.data[point + 2] = (sourceData[point + yoffset * w * 4 + 2] === 0) ?
                        wavyData.data[point + 2] :
                        palette[y % 255][2];
                    wavyData.data[point + 3] = 255; //opaque
                } else {
                    wavyData.data[point + 3] = 255;
                    /* default image data pixels are rgba(0,0,0,0)
                    so this will be (0,0,0,255) a.k.a. black */
                }
            }
        }
        wavyctx.putImageData(wavyData, 0, 0);
    };

    var timeStep = (1 / 60) * 1000;

    var update = function (delta) {
        var speed = 5;
        var step = ((delta * 60) / 1000) * speed;
        xoffset += step;
    };

    var currentTime = Date.now();

    var main = function () {
        var newTime = Date.now();
        var frameTime = newTime - currentTime;
        var delta;
        currentTime = newTime;

        while (frameTime > 0) {
            delta = Math.min(frameTime, timeStep);
            update(delta);
            frameTime -= delta;
        }

        drawWavyTitle();
        requestAnimationFrame(main);
    };

    init();
    main();
}(canvas));