$(document).ready(function() {
    var fontColor = 'black';

    // Hide all sections except home initially
    $("#pub").hide();
    $("#pat").hide();
    $("#exp").hide();
    $("#mis").hide();

    // Set initial active state
    $("#aboutButton li").addClass("active");

    // Hash to section mapping
    var hashMap = {
        '': { section: '#about', button: '#aboutButton' },
        '#': { section: '#about', button: '#aboutButton' },
        '#home': { section: '#about', button: '#aboutButton' },
        '#about': { section: '#about', button: '#aboutButton' },
        '#publications': { section: '#pub', button: '#pubButton' },
        '#pub': { section: '#pub', button: '#pubButton' },
        '#experience': { section: '#exp', button: '#expButton' },
        '#exp': { section: '#exp', button: '#expButton' },
        '#patents': { section: '#pat', button: '#patButton' },
        '#pat': { section: '#pat', button: '#patButton' },
        '#misc': { section: '#mis', button: '#miscButton' },
        '#miscellaneous': { section: '#mis', button: '#miscButton' }
    };

    // Helper function to switch sections
    function switchSection(showId, buttonId, updateHash) {
        // Hide all sections
        $("#about, #pub, #exp, #pat, #mis").hide("slow");
        // Show target section
        $(showId).show("slow");
        // Update active state
        $("div#menu > ul li").removeClass("active");
        $(buttonId + " li").addClass("active");
        // Update URL hash without scrolling
        if (updateHash !== false) {
            var hashName = showId.replace('#', '');
            if (hashName === 'about') hashName = 'home';
            history.replaceState(null, null, '#' + hashName);
        }
        // Smooth scroll to content area
        $('html, body').animate({
            scrollTop: $("#content-area").offset().top - 20
        }, 300);
    }

    // Handle initial hash on page load
    function handleHash() {
        var hash = window.location.hash.toLowerCase();
        var mapping = hashMap[hash];
        if (mapping) {
            // Hide all first without animation
            $("#about, #pub, #exp, #pat, #mis").hide();
            $(mapping.section).show();
            $("div#menu > ul li").removeClass("active");
            $(mapping.button + " li").addClass("active");
        }
    }

    // Check hash on page load
    handleHash();

    // Listen for hash changes (browser back/forward)
    $(window).on('hashchange', function() {
        var hash = window.location.hash.toLowerCase();
        var mapping = hashMap[hash];
        if (mapping) {
            switchSection(mapping.section, mapping.button, false);
        }
    });

    // Menu click handlers
    $("#aboutButton").click(function (e) {
        e.preventDefault();
        switchSection("#about", "#aboutButton");
    });

    $("#pubButton").click(function (e) {
        e.preventDefault();
        switchSection("#pub", "#pubButton");
    });

    $("#expButton").click(function (e) {
        e.preventDefault();
        switchSection("#exp", "#expButton");
    });

    $("#patButton").click(function (e) {
        e.preventDefault();
        switchSection("#pat", "#patButton");
    });

    $("#miscButton").click(function (e) {
        e.preventDefault();
        switchSection("#mis", "#miscButton");
    });

    // Header name hover effect
    $("#header-content h1").mouseover(function () {
        $(this).animate({
            color: '#2563eb'
        }, 200);
    }).mouseout(function () {
        $(this).animate({
            color: fontColor
        }, 200);
    });
});
