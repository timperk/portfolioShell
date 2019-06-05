(function ($) {

	// Init ScrollMagic
  var controller = new ScrollMagic.Controller();

    // get all slides
	var slides = ["#slide01", "#slide02", "#slide03", "#slide04", "#slide05", "#slide06", "#slide07", "#slide08", "#slide09", "#slide10"];

	// get all headers in slides that trigger animation
	var headers = ["#slide01 header", "#slide02 header", "#slide03 header", "#slide04 header", "#slide05 header", "#slide06 header", "#slide07 header", "#slide08 header", "#slide09 header", "#slide10 header"];

	// get all break up sections
	var breakSections = ["#cb01", "#cb02", "#cb03"];

	// number of loaded images for preloader progress
	var loadedCount = 0; //current number of images loaded
	var imagesToLoad = $('.bcg').length; //number of slides with .bcg container
	var loadingProgress = 0; //timeline progress - starts at 0

	$('.bcg').imagesLoaded({
	    background: true
	})

  .progress( function( instance, image ) {
		loadProgress();
	});

	function loadProgress(imgLoad, image)
	{
	 	//one more image has been loaded
		loadedCount++;

		loadingProgress = (loadedCount/imagesToLoad);

		//console.log(loadingProgress);

		// GSAP timeline for our progress bar
		TweenLite.to(progressTl, 0.7, {progress:loadingProgress, ease:Linear.easeNone});

	}

	//progress animation instance. the instance's time is irrelevant, can be anything but 0 to void  immediate render
	var progressTl = new TimelineMax({paused:true,onUpdate:progressUpdate,onComplete:loadComplete});

	progressTl
		//tween the progress bar width
		.to($('.progress span'), 1, {width:100, ease:Linear.easeNone});

	//as the progress bar witdh updates and grows we put the precentage loaded in the screen
	function progressUpdate()
	{
		//the percentage loaded based on the tween's progress
		loadingProgress = Math.round(progressTl.progress() * 100);
		//we put the percentage in the screen
		$(".txt-perc").text(loadingProgress + '%');

	}

	function loadComplete() {

		// preloader out
		var preloaderOutTl = new TimelineMax();

		preloaderOutTl
			.to($('.progress'), 0.3, {y: 100, autoAlpha: 0, ease:Back.easeIn})
			.to($('.txt-perc'), 0.3, {y: 100, autoAlpha: 0, ease:Back.easeIn}, 0.1)
			.set($('body'), {className: '-=is-loading'})
			.set($('#intro'), {className: '+=is-loaded'})
			.to($('#preloader'), 0.7, {yPercent: 100, ease:Power4.easeInOut})
			.set($('#preloader'), {className: '+=is-hidden'})
			.from($('#intro .title'), 1, {autoAlpha: 0, ease:Power1.easeOut}, '-=0.2')
			.from($('.scroll-hint'), 0.3, {y: -20, autoAlpha: 0, ease:Power1.easeOut}, '-=0.1');

		return preloaderOutTl;
	}



	// Enable ScrollMagic only for desktop, disable on touch and mobile devices
	if (!Modernizr.touch) {

		// SCENE 1
		// create scenes for each of the headers
		headers.forEach(function (header, index) {

		    // number for highlighting scenes
			var num = index+1;

		    // make scene
		    var headerScene = new ScrollMagic.Scene({
		        triggerElement: header, // trigger CSS animation when header is in the middle of the viewport
		        offset: -50
		    })
		    .setClassToggle('#slide0'+num, 'is-active') // set class to active slide
		    .addTo(controller);
		});

	    // SCENE 2
	    // change color of the nav for dark content blocks
	    breakSections.forEach(function (breakSection, index) {

		    // number for highlighting scenes
			var breakID = $(breakSection).attr('id');

		    // make scene
		    var breakScene = new ScrollMagic.Scene({
		        triggerElement: breakSection, // trigger CSS animation when header is in the middle of the viewport
		        triggerHook: 0.75
		    })
		    .setClassToggle('#'+breakID, 'is-active') // set class to active slide
		    .on("enter", function (event) {
			    $('nav').attr('class','is-light');
			})
		    .addTo(controller);
		});

	    // SCENE 3
	    // change color of the nav back to dark
		slides.forEach(function (slide, index) {

			var slideScene = new ScrollMagic.Scene({
		        triggerElement: slide // trigger CSS animation when header is in the middle of the viewport
		    })
		    .on("enter", function (event) {
			    $('nav').removeAttr('class');
			})
		    .addTo(controller);
	    });

	    // SCENE 4 - parallax effect on each of the slides with bcg
	    // move bcg container when slide gets into the view


		slides.forEach(function (slide, index) {

			var $bcg = $(slide).find('.bcg');

            var bcgTl = new TimelineMax();

            bcgTl
	    	.from($bcg, 1, {y: '-40%', autoAlpha: 0.35, ease:Power0.easeNone});
            //.to($bcg, {autoAlpha:.7})

			var slideParallaxScene = new ScrollMagic.Scene({
		        triggerElement: slide,
		        triggerHook: 1,
		        duration: "100%"
		    })
		    .setTween(bcgTl)
		    .addTo(controller);
	    });



        // **NEW** SCENE 5 - size mixer for each section
        // resizes block when the section is out/in view

        var sliderTl = new TimelineMax({
            paused:true,
            onUpdate:progressUpdate,
            onComplete:loadComplete}
            );






        var sectionOne = new ScrollMagic.Scene({
            triggerElement: '#slide02',
            triggerHook: 1,
            duration: "100%"
        })
        .setTween(TweenMax.to($("#slide01"), 0.2, {scale: 0.85, autoAlpha:0.35, ease:Power1.easeOut}, '-=0.2'))
        .on("enter", function (event) {
          //$('#slide01 iframe').attr('src', 'https://player.vimeo.com/video/272634066?autoplay=1&loop=1&autopause=0&background=1');
			    $('nav').attr('class','is-light');
			})
        .addTo(controller);

        var sectionTwo = new ScrollMagic.Scene({
            triggerElement: '#slide03',
            triggerHook: 1,
            duration: "100%"
        })
        .setTween(TweenMax.to($("#slide02"), 0.2, {scale: 0.85, autoAlpha:0.35, ease:Power1.easeOut}, '-=0.2'))
        //.setPin("#slide02", {pushFollowers: true})
        .addTo(controller);

        var sectionThree = new ScrollMagic.Scene({
            triggerElement: '#slide04',
            triggerHook: 1,
            duration: "100%"
        })
        .setTween(TweenMax.to($("#slide03"), 0.2, {scale: 0.85, autoAlpha:0.35, ease:Power1.easeOut}, '-=0.2'))
        //.setPin("#slide03", {pushFollowers: true})
        .addTo(controller);

        var sectionFour = new ScrollMagic.Scene({
            triggerElement: '#slide05',
            triggerHook: 1,
            duration: "100%"
        })
        .setTween(TweenMax.to($("#slide04"), 0.2, {scale: 0.85, autoAlpha:0.35, ease:Power1.easeOut}, '-=0.2'))
        //.setPin("#slide04", {pushFollowers: true})
        .addTo(controller);

        var sectionFive = new ScrollMagic.Scene({
            triggerElement: '#slide06',
            triggerHook: 1,
            duration: "100%"
        })
        .setTween(TweenMax.to($("#slide05"), 0.2, {scale: 0.85, autoAlpha:0.35, ease:Power1.easeOut}, '-=0.2'))
        //.setPin("#slide05", {pushFollowers: true})
        .addTo(controller);

        var sectionSix = new ScrollMagic.Scene({
            triggerElement: '#slide07',
            triggerHook: 1,
            duration: "100%"
        })
        .setTween(TweenMax.to($("#slide06"), 0.2, {scale: 0.85, autoAlpha:0.35, ease:Power1.easeOut}, '-=0.2'))
        //.setPin("#slide06", {pushFollowers: true})
        .addTo(controller);

        var sectionSeven = new ScrollMagic.Scene({
            triggerElement: '#slide07',
            triggerHook: 1,
            duration: "100%"
        })
        .setTween(TweenMax.from($("#slide07"), 0.2, {opacity: 0.4, ease:Power1.easeOut}, '-=0.1'))
        //.setPin("#slide07", {pushFollowers: true})
        .addTo(controller);

        var sectionEight = new ScrollMagic.Scene({
            triggerElement: '#slide08',
            triggerHook: 1,
            duration: "100%"
        })
        .setTween(TweenMax.from($("#slide08"), 0.2, {opacity: 0.4, ease:Power1.easeOut}, '-=0.1'))
        //.setPin("#slide07", {pushFollowers: true})
        .addTo(controller);

        var sectionNine = new ScrollMagic.Scene({
            triggerElement: '#slide09',
            triggerHook: 1,
            duration: "100%"
        })
        .setTween(TweenMax.from($("#slide09"), 0.2, {opacity: 0.4, ease:Power1.easeOut}, '-=0.1'))
        //.setPin("#slide07", {pushFollowers: true})
        .addTo(controller);

        var sectionTen = new ScrollMagic.Scene({
            triggerElement: '#slide10',
            triggerHook: 1,
            duration: "100%"
        })
        .setTween(TweenMax.from($("#slide10"), 0.2, {opacity: 0.4, ease:Power1.easeOut}, '-=0.1'))
        //.setPin("#slide07", {pushFollowers: true})
        .addTo(controller);


	    // SCENE 6 - parallax effect on the intro slide
	    // move bcg container when intro gets out of the the view

	    var introTl = new TimelineMax();

	    introTl
	    	.to($('#intro header, .scroll-hint'), 0.2, {autoAlpha: 0, ease:Power1.easeNone})
            .to($('#intro'), 0.2, {scale: 0.7, ease:Power1.easeOut}, '-=0.1');

		var introScene = new ScrollMagic.Scene({
	        triggerElement: '#intro',
	        triggerHook: 0,
	        duration: "100%"
	    })
	    .setTween(introTl)
	    .addTo(controller);

	  // change behaviour of controller to animate scroll instead of jump
		controller.scrollTo(function (newpos) {
			TweenMax.to(window, 1, {scrollTo: {y: newpos}, ease:Power0.easeInOut});
		});

		//  bind scroll to anchor links
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

	}

}(jQuery));
