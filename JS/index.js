$(document).ready(function () {
    window.onresize = function () {
        if (window.innerWidth >= 1023) {
            $("#postRelated").show();
            $("#filterRelated").show();
        } else {
            $("#postRelated").show();
            $("#filterRelated").hide();
        }
    }

    var votingPower;
    var steemconnect;
    var profilePicSrc;

    sc2.init({
        app: 'learntocurie',
        //callbackURL: 'http://localhost/learntocurie%20git/learntocurie/HTML/steemconnect2', // Dev localhost URL
        callbackURL: 'http://learntocurie.surge.sh/HTML/steemconnect2', // Live demo URL
        scope: ['login', 'vote', 'comment', 'custom_json'],
        //access: $.cookie("access_token")  // requires latest version // use `npm i sc2-sdk --save`
    });

    if ($.cookie("access_token") != null) {
        sc2.setAccessToken($.cookie("access_token"));
        sc2.me(function (err, result) {
            console.log('/me', err, result); // DEBUG
            if (!err) {
                getVotingPower(result, votingPower);
                profilePicSrc = JSON.parse(result.account.json_metadata)['profile']['profile_image'];
                $("#loginProfile").attr("src", profilePicSrc);
                $("#loginProfile2").attr("src", profilePicSrc);
                $("#sc2Img").attr("src", profilePicSrc);
                $("#loginButton").hide();
            } else {
                $("#logoutButton").hide();
            }
            /* $("#loginProfile").css("width", "100%");*/
        });

    } else {
        $("#logoutButton").hide();
        $("#steemConnectDiv").stop().show();
        $("#backgroundOverlay").stop().show();
        /*$("#loginProfile").attr("src", "IMG/sc2.png");
        $("#loginProfile2").attr("src", "IMG/sc2.png");
        $("#sc2Img").attr("src", "IMG/sc2.png");*/
    };

    $("#loginButton").on('click', function () {
        $.when(window.location.replace(sc2.getLoginURL()));
    });

    $("#logoutButton").on('click', function () {
        sc2.revokeToken(function (err, result) {
            console.log('You successfully logged out', err, result);
            // Remove all cookies
            $.removeCookie("access_token", {
                path: '/'
            });
            $.removeCookie("username", {
                path: '/'
            });
            $.removeCookie("expires_in", {
                path: '/'
            });
        });
        $("#logoutButton").hide();
        $("#loginButton").show();
        $("#loginProfile").attr("src", "IMG/sc2.png");
        $("#loginProfile2").attr("src", "IMG/sc2.png");
        $("#sc2Img").attr("src", "IMG/sc2.png");
    });

    addValues();

    /*$("#steemconnect").on('click', function(){
       window.location.replace("HTML/steemconnect.html"); 
    });*/
    $("#steemconnect").on('click', function () {
        $("#steemConnectDiv").stop().fadeToggle(200);
        $("#backgroundOverlay").stop().fadeToggle();
    });
    $("#logInFS").on('click', function () {
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

    $("#filtermenu").on('click', function () {
        $("#postRelated").stop().fadeToggle();
        $("#filterRelated").stop().fadeToggle();
    });

    $("#home").on('click', function () {
        $("#postRelated").stop().fadeIn();
        $("#filterRelated").stop().fadeOut();
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
            /*$("#upvoteSliderDiv").stop().slideToggle(500);*/
            $("#upvote").css('color', '#50b5f4');
            $("#upvote").css('border', '3px solid #50b5f4');
            upvoted = true;
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

    /*
        $("#voteNow").click(function () {
            $("#upvote").css('color', '#50b5f4');
            $("#upvote").css('border', '3px solid #50b5f4');
            $("#upvoteSliderDiv").stop().slideUp(500);
            upvoted = true;
        });
    */

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

    $("#comment").click(function () {
        if (commented == false) {
            $("#comment").css('color', '#50b5f4');
            $("#comment").css('border', '3px solid #50b5f4');
            commented = true;
        } else {
            $("#comment").css('color', 'lightgray');
            $("#comment").css('border', '3px solid lightgray');
            commented = false;
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

function getVotingPower(result, votingPower) {
    var lastTimeVoted = new Date(result.account.last_vote_time.replace('T', ' '));
    var today = Date.now() + ((new Date().getTimezoneOffset()) * 60000);
    console.log(lastTimeVoted);
    console.log(today);
    /*console.log(today - lastTimeVoted.getTime());
    console.log((today - lastTimeVoted.getTime())/4320000);*/
    var allVotingPower = ((result.account.voting_power / 100) + ((today - lastTimeVoted.getTime()) / 4320000)).toFixed(2);
    if (allVotingPower > 100) {
        allVotingPower = 100;
    }
    votingPower = allVotingPower;
    $("#progressbarInner").css('width', votingPower + "%");
    $("#vpPercentage").html(votingPower);
    console.log(votingPower);
}
