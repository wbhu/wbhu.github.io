var fontColor = 'black';

$("#pub").hide();
$("#pat").hide();

$("#aboutButton").click(function () {
    $("#pub").hide("slow");
    $("#exp").hide("slow");
    $("#pat").hide("slow");
    $("#mis").hide("slow");
    $("#about").show("slow");
});
$("#pubButton").click(function () {
    $("#about").hide("slow");
    $("#exp").hide("slow");
    $("#pat").hide("slow");
    $("#mis").hide("slow");
    $("#pub").show("slow");
});
$("#expButton").click(function () {
    $("#about").hide("slow");
    $("#pub").hide("slow");
    $("#pat").hide("slow");
    $("#mis").hide("slow");
    $("#exp").show("slow");
});
$("#patButton").click(function () {
    $("#about").hide("slow");
    $("#pub").hide("slow");
    $("#exp").hide("slow");
    $("#mis").hide("slow");
    $("#pat").show("slow");
});
$("#misButton").click(function () {
    $("#about").hide("slow");
    $("#pub").hide("slow");
    $("#exp").hide("slow");
    $("#pat").hide("slow");
    $("#mis").show("slow");
});
$("div#menu > ul li").mouseover(function () {
    $(this).animate({
        color: fontColor,
        margin: '0 0 0 20px'
    }, 200)
}).mouseout(function () {
    $(this).animate({
        color: fontColor,
        margin: '0'
    }, 200)
});
$("h1").mouseover(function () {
    $(this).animate({
        color: '#1C8FE1'
        // color: '#972'
    }, 200)
}).mouseout(function () {
    $(this).animate({
        color: fontColor
    }, 200)
});