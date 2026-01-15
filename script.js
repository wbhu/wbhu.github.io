$(document).ready(function() {
    var fontColor = 'black';

    // Hide all sections except home initially
    $("#pub").hide();
    $("#pat").hide();
    $("#exp").hide();
    $("#mis").hide();

    // Set initial active state
    $("#aboutButton li").addClass("active");

    // Helper function to switch sections
    function switchSection(showId, buttonId) {
        // Hide all sections
        $("#about, #pub, #exp, #pat, #mis").hide("slow");
        // Show target section
        $(showId).show("slow");
        // Update active state
        $("div#menu > ul li").removeClass("active");
        $(buttonId + " li").addClass("active");
        // Smooth scroll to content area
        $('html, body').animate({
            scrollTop: $("#content-area").offset().top - 20
        }, 300);
    }

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
            color: '#1C8FE1'
        }, 200);
    }).mouseout(function () {
        $(this).animate({
            color: fontColor
        }, 200);
    });
});