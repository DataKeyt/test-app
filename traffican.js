// This is your first fully working Tabris.js app. Feel free to alter as you please.
// Changes are saved automatically and are immediately available on your device.

var MARGIN = 8;

// Create a top-level page that contains our UI
var page = new tabris.Page({
    title: "Know your lights!",
    topLevel: true
});

// Create a button that animates your text
new tabris.Button({
    id: "animateButton",
    text: "STOP!",
    layoutData: {left: 135, right: 135, top: MARGIN}
}).on("select", function (button) {
    button.set("enabled", false);
    page.children("#red").first().once("animationend", function () {
        button.set("enabled", true);
    }).animate({
        opacity: 0.5,
        transform: {
            rotation: 360,
            scaleX: 10,
            scaleY: 10,
            translationX: 0,
            translationY: 0
        }
    }, {
        delay: 30,
        duration: 1000,
        repeat: 5,
        reverse: true,
        easing: "ease-out" // "linear", "ease-in", "ease-out", "ease-in-out"
    });
}).appendTo(page);

new tabris.TextView({
    id: "red",
    centerX: 0, top: ["#animateButton", MARGIN],
    background: "red",
    textColor: "white",
    font: "20px",
    text: "WAIT FOR GREEN!"
}).appendTo(page);

module.exports = page;

// Create a toggle button 
new tabris.ToggleButton({
    id: "tB",
    centerX: 0, top: 100,
    text: "CLICK!",
    selection: true
}).on("change:selection", function (button, selection) {
    this.set("text", selection ? "WAIT!" : "DON'T GO YET!");
}).appendTo(page);

// Create a push button and add it to the page
var button = new tabris.Button({
    id: "ClickMe",
    centerX: 0, top: 190,
    text: "CLICK!"
}).appendTo(page);


// Create a text view and add it too
var textView = new tabris.TextView({
    id: "tV",
    centerX: 0, top: 260,
    font: "20px"
}).appendTo(page);

// Change the text view's text when the button is pressed
button.on("select", function () {
    textView.set("text", "You may cross the road now! :)");
});

page.apply({
    "#tB": {background: "#FFA400", opacity: 0.9, textColor: "white", cornerRadius: 30},
    "#tV": {textColor: "white", background: "green", opacity: 0.9, cornerRadius: 10},
    "#ClickMe": {background: "green", textColor: "white", opacity: 0.8, cornerRadius: 30},
    "#animateButton": {background: "red", opacity: 0.9, textColor: "white", cornerRadius: 30, height: 50},
    "#red": {position: "absolute", zIndex: 99999, cornerRadius: 10}
});

page.open();
