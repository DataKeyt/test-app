var MARGIN = 12;

var trayHeight;
var trayState = "down";
var dragOffset;

//Adding the kitty picture to the page
var page = new tabris.Page({
    title: "Sleeping kitty",
    topLevel: true
});
//scaleMode: "fit" is another way to fit the picture on the screen


//new tabris.ImageView({
//  centerX: 0, top: 15,
//image: {src: "images/kiiisu.png"}
//}).appendTo(page);

var textView = new tabris.TextView({
    top: 0, centerX: 0,
    text: "Cover the kitty with a blanket",
    textColor: "#ff71dc",
    elevation: 999,
    font: "bold italic 24px"
}).appendTo(page);

new tabris.ImageView({
    image: {src: "images/kiiisu.png", width: 360, centerX: 0, height: 770, top: [textView, 20]}
}).appendTo(page);

var shade = new tabris.Composite({
    layoutData: {left: 0, right: 0, top: 0, bottom: 0},
    background: "#92998E",
    opacity: 0
}).appendTo(page);

var tray = new tabris.Composite({
    layoutData: {left: 0, right: 0, top: "30%", bottom: 0},
    cornerRadius: 20
}).appendTo(page);

var strap = new tabris.Composite({
    layoutData: {left: "40%", right: "40%", top: 0, height: 65},
    background: "#FF48A6",
    cornerRadius: 20
}).appendTo(tray);

var strapIcon = new tabris.TextView({
    layoutData: {left: MARGIN, right: MARGIN, top: 20},
    alignment: "center",
    text: "⇧",
    font: "bold 24px",
    textColor: "white"
}).appendTo(strap);

var trayContent = new tabris.Composite({
    layoutData: {left: MARGIN, right: MARGIN, top: [strap, 0], bottom: 0},
    background: "#FF79C2",
    cornerRadius: 20
}).appendTo(tray);

new tabris.TextView({
    layoutData: {left: MARGIN, right: MARGIN, top: MARGIN},
    alignment: "center",
    cornerRadius: 20,
    text: "Kitty blanket",
    font: "bold 24px",
    textColor: "white"
}).appendTo(trayContent);

trayContent.on("resize", function () {
    var bounds = trayContent.get("bounds");
    trayHeight = bounds.height;
    if (trayState === "dragging") {
        positionTrayInRestingState(2000);
    } else {
        tray.set("transform", {translationY: trayHeight});
    }
});

strap.on("pan:vertical", function (widget, event) {
    if (event.state === "start" && (trayState === "up" || trayState === "down")) {
        trayState = "dragging";
        dragOffset = tray.get("transform").translationY - event.translation.y;
    }
    if (trayState === "dragging") {
        var offsetY = Math.min(Math.max(event.translation.y + dragOffset, 0), trayHeight);
        tray.set("transform", {translationY: offsetY});
        shade.set("opacity", getShadeOpacity(offsetY));
        strapIcon.set("transform", getStrapIconTransform(offsetY));
    }
    if (event.state === "end" && trayState === "dragging") {
        positionTrayInRestingState(event.velocity.y);
    }
});

strap.on("tap", function () {
    if (trayState === "up" || trayState === "down") {
        positionTrayInRestingState(trayState === "down" ? -1000 : 1000);
    }
});

module.exports = page;

function positionTrayInRestingState(velocity) {
    trayState = "animating";
    var translationY = velocity > 0 ? trayHeight : 0;
    var options = {
        duration: Math.min(Math.abs(trayHeight / velocity * 1000), 800),
        easing: Math.abs(velocity) >= 1000 ? "ease-out" : "ease-in-out"
    };
    shade.animate({opacity: getShadeOpacity(translationY)}, options);
    strapIcon.animate({transform: getStrapIconTransform(translationY)}, options);
    tray.once("animationend", function () {
        trayState = velocity > 0 ? "down" : "up";
    }).animate({
        transform: {translationY: translationY}
    }, options);
}

function getShadeOpacity(translationY) {
    var traveled = translationY / trayHeight;
    return Math.max(0, 0.75 - traveled);
}

function getStrapIconTransform(translationY) {
    var traveled = translationY / trayHeight;
    return {rotation: traveled * Math.PI - Math.PI};
}

page.open();