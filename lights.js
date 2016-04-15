var IMAGE_PATH = "images/";
var IMAGE_SIZE = 128;
var THUMB_SIZE = 48;
var MARGIN_SMALL = 4;
var MARGIN = 12;
var MARGIN_LARGE = 24;
var ANIMATION_START_DELAY = 500;

var lights = [
    ["If the light is red,", "DO NOT go!", "red.png"],
    ["If it is  yellow,", "HOLD on a bit longer!", "yellow.png"],
    ["If it is green,", "you may go! :)", "green.png"]
].map(function (element) {
    return {firstPart: element[0], secondPart: element[1], image: IMAGE_PATH + element[2]};
});

var page = new tabris.Page({
    title: "Traffic lights",
    topLevel: true
});

var detailsParent = new tabris.Composite({
    positionX: 0, top: MARGIN_LARGE
}).appendTo(page);

var detailView = createLightsDetail(detailsParent, lights[2], ANIMATION_START_DELAY);

new tabris.Composite({
    layoutData: {left: 0, top: [detailsParent, MARGIN], right: 0, height: 96}
}).on("resize", function (widget, bounds) {
    this.children().dispose();
    var thumbsize = Math.min(64, bounds.width / lights.length - MARGIN);
    lights.forEach(function (lights, index) {
        AnimateInFromTop(createLightsThumb(widget, lights, thumbsize), index);
    });
}).appendTo(page);

module.exports = page;

function AnimateInFromTop(widget, index) {
    widget.set({
        opacity: 0.0,
        transform: {translationY: THUMB_SIZE / 2}
    });
    widget.animate({
        opacity: 1.0,
        transform: {translationY: 0}
    }, {
        delay: index * 100 + 800 + ANIMATION_START_DELAY,
        duration: 200,
        easing: "linear"
    });
}

function animateInFromRight(widget, delay) {
    widget.set({
        opacity: 0.0,
        transform: {translationY: 32}
    });
    widget.animate({
        opacity: 1.0,
        transform: {translationY: 0}
    }, {
        duration: 500,
        delay: delay,
        easing: "ease-in-out"
    });
}

function animateInScaleUp(widget, delay) {
    widget.set("opacity", 0.0);
    widget.animate({
        opacity: 1.0,
        transform: {scaleX: 1.0, scaleY: 1.0}
    }, {
        delay: delay,
        duration: 400,
        easing: "ease-out"
    });
}

function animateOutLeftCreateCurrentLight(lights) {
    detailView.once("animationend", function () {
        detailView.dispose();
        detailView = createLightsDetail(detailsParent, lights, 0);
    }).animate({
        opacity: 0.0,
        transform: {translationX: 0}
    }, {
        duration: 500,
        easing: "ease-out"
    });
}

function createLightsDetail(parent, lights, delay) {
    var composite = new tabris.Composite({
        layoutData: {left: 0, right: 0, top: 0, height: IMAGE_SIZE + MARGIN_LARGE}
    }).appendTo(parent);
    var lightsImage = new tabris.ImageView({
        layoutData: {left: 0, top: 0, width: IMAGE_SIZE, height: IMAGE_SIZE},
        image: {src: lights.image, width: IMAGE_SIZE, height: IMAGE_SIZE},
        opacity: 0.0
    }).on("resize", function listener() {
        this.set("transform", {
            scaleX: 0.75,
            scaleY: 0.75
        });
        animateInScaleUp(this, delay);
    }).appendTo(composite);
    var nameTextView = new tabris.TextView({
        layoutData: {left: [lightsImage, MARGIN], top: 0},
        text: lights.firstPart + " " + lights.secondPart,
        font: "bold 18px"
    }).appendTo(composite);
    var professionTextView = new tabris.TextView({
        layoutData: {left: [lightsImage, MARGIN], top: [nameTextView, MARGIN]},
        text: "Get to know the traffic lights!"
    }).appendTo(composite);
    var companyTextView = new tabris.TextView({
        layoutData: {left: [lightsImage, MARGIN], top: [professionTextView, MARGIN_SMALL]},
        text: "Travel safe!"
    }).appendTo(composite);
    animateInFromRight(nameTextView, delay);
    animateInFromRight(professionTextView, 100 + delay);
    animateInFromRight(companyTextView, 200 + delay);
    return composite;
}

function createLightsThumb(parent, lights, thumbsize) {
    var font = (thumbsize < 48) ? "9px" : "12px";
    var composite = new tabris.Composite({
        layoutData: {left: ["prev()", MARGIN], top: 0}
    }).appendTo(parent);
    var lightsView = new tabris.ImageView({
        layoutData: {left: 0, top: 0, width: thumbsize, height: thumbsize},
        image: {src: lights.image, width: thumbsize, height: thumbsize},
        highlightOnTouch: true
    }).on("tap", function () {
        animateOutLeftCreateCurrentLight(lights);
    }).appendTo(composite);
    new tabris.TextView({
        alignment: "center",
        layoutData: {left: 0, top: lightsView, width: thumbsize},
        text: lights.firstPart,
        font: font
    }).appendTo(composite);
    return composite;
}
