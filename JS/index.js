$(document).ready(function () {
    addValues();

    /*$("#steemconnect").on('click', function(){
       window.location.replace("HTML/steemconnect.html"); 
    });*/
    $("#steemconnect").on('click', function () {
        $("#steemConnectDiv").stop().fadeToggle(200);
        $("#backgroundOverlay").stop().fadeToggle();
    });

    $(document).mouseup(function (e) {
        var container = $("#steemConnectDiv");

        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.stop().fadeOut(200);
            $("#backgroundOverlay").stop().fadeOut(200);
        }
    });

});

function changeMarkDownToHtml(a, b) {

    var c = a.makeHtml(b.html().trim());

    b.html(c);
    /*
        var resArray = b.html().match(/("\/@[aA-zZ])\w+/g);
        for (var i = 0; i < resArray.length; i++) {
            b.html(b.html().replace(resArray[i].substring(1), "https://steemit.com" + resArray[i].substring(1) + " "));
        }*/

    /*    var resArray1 = b.html().match(/([^\/]{1})(@[aA-zZ])\w+/g);
        for (var i = 0; i < resArray1.length; i++) {
            b.html(b.html().replace(resArray1[i].substring(1), "<a href=\"https://steemit.com/" + resArray1[i].substring(1) + "\">" + resArray1[i].substring(1) + "</a>"));
        }*/

    b.find('a').attr('target', '_blank');
}

function addValues() {
    /*GET ALL RELEVANT DATA FOR FIRST POST
    post
    - time
    - postvalue
    - postupvotes
    - times resteemed
    - amount of comments
    - postTitle
    - postLink???
    - postBody
    logged in user
    - upvoted
    - resteemed
    - commented
    - following
    - curating
    */

    //set these depending on post
    var upvoted = false;
    var resteemed = false;
    var commented = false;
    var following = false;
    var curating = false;
    var converter = new showdown.Converter();

    changeMarkDownToHtml(converter, $("#postBody"));


    $("#upvote").click(function () {
        if (upvoted == false) {
            $("#upvoteSliderDiv").stop().slideToggle(500);
        } else {
            $("#upvote").css('color', 'lightgray');
            $("#upvote").css('border', '3px solid lightgray');
            upvoted = false;
        }
    });

    $("#upvoteSlider").on('input', function () {
        $("#slidervalue").html($(this).val() + "%");

        var val = ($(this).val() - $(this).attr('min')) / ($(this).attr('max') - $(this).attr('min'));

        $(this).css('background-image',
            '-webkit-gradient(linear, left top, right top, ' +
            'color-stop(' + val + ', #62DD9A), ' +
            'color-stop(' + val + ', #C5C5C5)' +
            ')'
        );
    });

    $("#voteNow").click(function () {
        $("#upvote").css('color', '#50b5f4');
        $("#upvote").css('border', '3px solid #50b5f4');
        $("#upvoteSliderDiv").stop().slideUp(500);
        upvoted = true;
    });

    $("#resteem").click(function () {
        if (resteemed == false) {
            $("#resteem").css('color', '#50b5f4');
            $("#resteem").css('border', '3px solid #50b5f4');
            resteemed = true;
        } else {
            $("#resteem").css('color', 'lightgray');
            $("#resteem").css('border', '3px solid lightgray');
            resteemed = false;
        }
    });

    $("#follow").click(function () {
        if (following == false) {
            $("#follow").css('color', '#50b5f4');
            $("#follow").css('border', '3px solid #50b5f4');
            following = true;
        } else {
            $("#follow").css('color', 'lightgray');
            $("#follow").css('border', '3px solid lightgray');
            following = false;
        }
    });

    $("#curate").click(function () {
        if (curating == false) {
            $("#curate").css('color', '#50b5f4');
            $("#curate").css('border', '3px solid #50b5f4');
            curating = true;
        } else {
            $("#curate").css('color', 'lightgray');
            $("#curate").css('border', '3px solid lightgray');
            curating = false;
        }
    });
}
