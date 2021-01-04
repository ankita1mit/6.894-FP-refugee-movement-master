var controller = new ScrollMagic.Controller();
const start_year = 1959
const end_year = 2018

// Table of Contents Scene - Not Animated 
var containerScene = new ScrollMagic.Scene({
    triggerElement: '#table-of-contents',
    triggerHook: "onLeave"
})
    // .setPin('#table-of-contents')
    // .addIndicators()
    .addTo(controller);

// Transition Header - Summary Section
var transitionScene = new ScrollMagic.Scene({
    triggerElement: '#summary',
    triggerHook: 0.75
})
    .setClassToggle('#summary', 'is-active') // set class to active slide
    .addTo(controller);

// World Map Scene
var mapScene = new ScrollMagic.Scene({
    triggerElement: "#map-section",
    triggerHook: 0.05,
    duration: Math.floor(window.innerHeight),
    reverse: true
})
    .setPin('#map-container')
    // .addIndicators() // add indicators (requires plugin)
    .addTo(controller);

mapScene.on("progress", function (event) {
    var year = Math.round(event.progress * (end_year - start_year) + start_year)
    updateSliderValue(year)
    document.getElementById("world-map-year").innerHTML = year;
});

// Transition Header - Conflicts Section
var transitionScene_2 = new ScrollMagic.Scene({
    triggerElement: '#conflicts',
    triggerHook: 0.75
})
    .setClassToggle('#conflicts', 'is-active') // set class to active slide
    .addTo(controller);

// Rwanda Intro Scene
var rwanda_intro = new ScrollMagic.Scene({
    triggerElement: ".rwanda-cover",
    triggerHook: 0.1, // show, when scrolled 10% into view
    // duration: "80%", // hide 10% before exiting view (80% + 10% from bottom)
    offset: 50 // move trigger to center of element
})
    .setClassToggle(".rwanda-intro", "visible") // add class to reveal
    // .addIndicators() // add indicators (requires plugin)
    .addTo(controller);

// Rwanda Map Scene
var mapScene_rwanda = new ScrollMagic.Scene({
    triggerElement: "#rwanda-map-section",
    triggerHook: 0.05,
    duration: Math.floor(window.innerHeight),
    reverse: true
})
    .setPin('#rwanda-map-container')
    // .addIndicators() // add indicators (requires plugin)
    .addTo(controller);

mapScene_rwanda.on("progress", function (event) {
    var year = Math.round(event.progress * (1997 - 1994) + 1994)
    updateSliderValue_rwanda(year)
    document.getElementById("rwanda-world-map-year").innerHTML = year;
});

// Venezuela Intro Scene
var venezuela_intro = new ScrollMagic.Scene({
    triggerElement: ".venezuela-cover",
    triggerHook: 0.1, // show, when scrolled 10% into view
    // duration: "80%", // hide 10% before exiting view (80% + 10% from bottom)
    offset: 50 // move trigger to center of element
}).setClassToggle(".venezuela-intro", "visible") // add class to reveal
    // .addIndicators() // add indicators (requires plugin)
    .addTo(controller);

// Venezuela Map Scene
var mapScene_venezuela = new ScrollMagic.Scene({
    triggerElement: "#venezuela-map-section",
    triggerHook: 0.05,
    duration: Math.floor(window.innerHeight),
    reverse: true
})
    .setPin('#venezuela-map-container')
    // .addIndicators() // add indicators (requires plugin)
    .addTo(controller);

mapScene_venezuela.on("progress", function (event) {
    var year = Math.round(event.progress * (2015 - 1997) + 1997)
    updateSliderValue_venezuela(year)
    document.getElementById("venezuela-world-map-year").innerHTML = year;
});

// Syria Intro Scene
var conflict_intro = new ScrollMagic.Scene({
    triggerElement: ".syria-cover",
    triggerHook: 0.1, // show, when scrolled 10% into view
    // duration: "80%", // hide 10% before exiting view (80% + 10% from bottom)
    offset: 50 // move trigger to center of element
})
    .setClassToggle(".syria-intro", "visible") // add class to reveal
    // .addIndicators() // add indicators (requires plugin)
    .addTo(controller);

// Syria Map Scene
var mapScene_conflict = new ScrollMagic.Scene({
    triggerElement: "#conflict-map-section",
    triggerHook: 0.05,
    duration: Math.floor(window.innerHeight),
    reverse: true
})
    .setPin('#conflict-map-container')
    // .addIndicators() // add indicators (requires plugin)
    .addTo(controller);

mapScene_conflict.on("progress", function (event) {
    var year = Math.round(event.progress * (2018 - 2011) + 2011)
    updateSliderValue_conflict(year)
    document.getElementById("conflict-world-map-year").innerHTML = year;
});

// Transition Header - Humans Section
var transitionScene_3 = new ScrollMagic.Scene({
    triggerElement: '#humans',
    triggerHook: 0.75
})
    .setClassToggle('#humans', 'is-active') // set class to active slide
    .addTo(controller);

// Animation for Anchor Scrolling
// Change behaviour of controller to animate scroll instead of jump
controller.scrollTo(function (newpos) {
    TweenMax.to(window, 1.2, {
        scrollTo: { y: newpos },
        ease: Cubic.easeInOut
    });
});

//  Bind scroll to anchor links
$(document).on("click", "a[href^='#']", function (e) {
    var id = $(this).attr("href");
    if ($(id).length > 0) {
        e.preventDefault();

        // trigger scroll
        controller.scrollTo(id);

        // if supported by the browser we can even update the URL.
        if (window.history && window.history.pushState) {
            history.pushState("", document.title, id);
        }
    }
});

//  Slides Scene
// define movement of panels
var wipeAnimation_rwanda = new TimelineMax()
    // animate to second panel
    .to("#slideContainer-rwanda", 0.5, { z: -150 })		// move back in 3D space
    .to("#slideContainer-rwanda", 1, { x: "-25%" })	// move in to first panel
    .to("#slideContainer-rwanda", 0.5, { z: 0 })				// move back to origin in 3D space
    // animate to third panel
    .to("#slideContainer-rwanda", 0.5, { z: -150, delay: 1 })
    .to("#slideContainer-rwanda", 1, { x: "-50%" })
    .to("#slideContainer-rwanda", 0.5, { z: 0 })
    // animate to forth panel
    .to("#slideContainer-rwanda", 0.5, { z: -150, delay: 1 })
    .to("#slideContainer-rwanda", 1, { x: "-75%" })
    .to("#slideContainer-rwanda", 0.5, { z: 0 });

// create scene to pin and link animation
var rwanda_slides = new ScrollMagic.Scene({
    triggerElement: "#rwanda-scene",
    triggerHook: "onLeave",
    duration: "500%"
})
    .setPin("#rwanda-scene")
    .setTween(wipeAnimation_rwanda)
    // .addIndicators() // add indicators (requires plugin)
    .addTo(controller);

var wipeAnimation_venezuela = new TimelineMax()
    // animate to second panel
    .to("#slideContainer-venezuela", 0.5, { z: -150 })		// move back in 3D space
    .to("#slideContainer-venezuela", 1, { x: "-25%" })	// move in to first panel
    .to("#slideContainer-venezuela", 0.5, { z: 0 })				// move back to origin in 3D space
    // animate to third panel
    .to("#slideContainer-venezuela", 0.5, { z: -150, delay: 1 })
    .to("#slideContainer-venezuela", 1, { x: "-50%" })
    .to("#slideContainer-venezuela", 0.5, { z: 0 })
    // animate to forth panel
    .to("#slideContainer-venezuela", 0.5, { z: -150, delay: 1 })
    .to("#slideContainer-venezuela", 1, { x: "-75%" })
    .to("#slideContainer-venezuela", 0.5, { z: 0 });

var venezuela_slides = new ScrollMagic.Scene({
    triggerElement: "#venezuela-scene",
    triggerHook: "onLeave",
    duration: "500%"
})
    .setPin("#venezuela-scene")
    .setTween(wipeAnimation_venezuela)
    // .addIndicators() // add indicators (requires plugin)
    .addTo(controller);

var wipeAnimation_syria = new TimelineMax()
    // animate to second panel
    .to("#slideContainer-syria", 0.5, { z: -150 })		// move back in 3D space
    .to("#slideContainer-syria", 1, { x: "-25%" })	// move in to first panel
    .to("#slideContainer-syria", 0.5, { z: 0 })				// move back to origin in 3D space
    // animate to third panel
    .to("#slideContainer-syria", 0.5, { z: -150, delay: 1 })
    .to("#slideContainer-syria", 1, { x: "-50%" })
    .to("#slideContainer-syria", 0.5, { z: 0 })
    // animate to forth panel
    .to("#slideContainer-syria", 0.5, { z: -150, delay: 1 })
    .to("#slideContainer-syria", 1, { x: "-75%" })
    .to("#slideContainer-syria", 0.5, { z: 0 });

var syria_slides = new ScrollMagic.Scene({
    triggerElement: "#syria-scene",
    triggerHook: "onLeave",
    duration: "500%"
})
    .setPin("#syria-scene")
    .setTween(wipeAnimation_syria)
    // .addIndicators() // add indicators (requires plugin)
    .addTo(controller);


// Rwanda Human Scene
var rwanda_humans = new ScrollMagic.Scene({
    triggerElement: ".rwanda-human-cover",
    triggerHook: 0.05, // show, when scrolled 10% into view
    duration: Math.floor(window.innerHeight),
    offset: 50, // move trigger to center of element
    reverse: true
}).setPin('.rwanda-human-cover')
    // .addIndicators() // add indicators (requires plugin)
    .addTo(controller);

// Venezuela Human Scene
var venezuela_humans = new ScrollMagic.Scene({
    triggerElement: ".venezuela-human-cover",
    triggerHook: 0.05, // show, when scrolled 10% into view
    duration: Math.floor(window.innerHeight),
    offset: 50, // move trigger to center of element
    reverse: true
}).setPin('.venezuela-human-cover')
    // .addIndicators() // add indicators (requires plugin)
    .addTo(controller);

// Syria Human Scene
var syria_humans = new ScrollMagic.Scene({
    triggerElement: ".syria-human-cover",
    triggerHook: 0.05, // show, when scrolled 10% into view
    duration: Math.floor(window.innerHeight),
    offset: 50, // move trigger to center of element
    reverse: true
}).setPin('.syria-human-cover')
    // .addIndicators() // add indicators (requires plugin)
    .addTo(controller);
