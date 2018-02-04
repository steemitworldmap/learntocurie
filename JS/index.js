var loggedUsername;
var votingPower;
var steemconnect;
var profilePicSrc;
var deferredFollowing;
var errors = "";
//change to timestamp in miliseconds
var minTime;
var maxTime;
var minValue;
var maxValue;
var totalReward;
var totalTime;
var minRep;
var maxRep;
var minWc;
var maxWc;
var postContains;
//Think more about the AND / OR / () as it might take too long  
var includeTags;
var excludeTags;
//array of users if following or curating is checked add to users
var users;
var excludeUsers;
var sortPost;

$(document).ready(function () {
    window.onresize = function () {
        if (window.innerWidth >= 1023) {
            $("#postRelated").show();
            $("#filterRelated").show();
        }
    }

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
                loggedUsername = result.user;
                /*alert(result.user);*/
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
        $("#postRelated").stop().fadeOut();
        $("#filterRelated").stop().fadeIn();
    });

    $("#home").on('click', function () {
        $("#postRelated").stop().fadeIn();
        $("#filterRelated").stop().fadeOut();
    });

    $("#loadFilter").on('click', function () {
        getAllFilters().then(createFilterJson(errors, minTime, maxTime, minValue, maxValue, totalReward, totalTime, minRep, maxRep, minWc, maxWc, postContains, includeTags, excludeTags, users, excludeUsers, sortPost));
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
    //set these depending on post

    //construct exact time
    var daysPassed;
    var hoursPassed;
    var minutesPassed;

    var sbdValue;
    var upvotes;
    var timesResteemed;
    var totalComments;

    //can be used to costruct link to other frontend
    var permLink;

    var postTitle;

    //will need to be parsed through markdown converter
    var postBody;

    var author;
    var authorProfilePic;

    var upvoted = false;
    var resteemed = false;
    var commented = false;
    var following = false;
    var curating = false;
    var converter = new showdown.Converter();

    changeMarkDownToHtml(converter, $("#postBody"));

    setStartingCssValues(upvoted, "#upvote");
    setStartingCssValues(resteemed, "#resteem");
    setStartingCssValues(commented, "#comment");
    setStartingCssValues(following, "#follow");
    setStartingCssValues(curating, "#curate");

    $("#upvote").click(function () {
        if (upvoted == false) {
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
    /*console.log(lastTimeVoted);
    console.log(today);*/
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

function setStartingCssValues(a, b) {
    if (a == true) {
        $(b).css('color', '#50b5f4');
        $(b).css('border', '3px solid #50b5f4');
    }
}

function getAllFilters() {
    deferredFollowing = $.Deferred();
    //TODO: set all variables underneath this comment
    minTime = $("#minTime").val();
    if (minTime.match(/^(\d)(\d)(\d)(:)(\d)(\d)$/g) != null) {
        var minHours = minTime.split(':')[0];
        var minMinutes = minTime.split(':')[1];
        minTime = (minHours * 3600000) + (minMinutes * 60000);
    } else {
        if (minTime == "") {
            minTime = 0;
        } else {
            errors = errors + "Min time is incorrect use hhh:mm \n";
        }
    }

    maxTime = $("#maxTime").val();
    if (maxTime.match(/^(\d)(\d)(\d)(:)(\d)(\d)$/g) != null) {
        var maxHours = maxTime.split(':')[0];
        var maxMinutes = maxTime.split(':')[1];
        maxTime = (maxHours * 3600000) + (maxMinutes * 60000);
        //max 7 days
    } else {
        if (maxTime == "") {
            maxTime = 604800000;
        } else {
            errors = errors + "Max time is incorrect use hhh:mm\n";
        }
    }
    if (maxTime > 604800000 || minTime > 604800000) {
        errors = errors + "You can only go back 7 days\n"
    }

    if (minTime > maxTime) {
        errors = errors + "Mintime is larger than maxtime\n"
    }

    minValue = $("#minValue").val();
    if (minValue == "") {
        minValue = 0;
    } else {
        minValue = minValue.toFixed(2);
    }

    maxValue = $("#maxValue").val();
    if (maxValue == "") {
        maxValue = 1000000;
    } else {
        maxValue = maxValue.toFixed(2);
    }

    totalReward = $("#totalReward").val();
    if (totalReward == "") {
        totalReward = 1000000;
    } else {
        totalReward = totalReward.toFixed(2);
    }

    totalTime = $("#totalTime").val();
    if (totalTime.match(/^(\d)(\d)(\d)(:)(\d)(\d)$/g) != null) {
        var maxHoursT = totalTime.split(':')[0];
        var maxMinutesT = totalTime.split(':')[1];
        totalTime = (maxHoursT * 3600000) + (maxMinutesT * 60000);
        //max 7 days
    } else {
        if (totalTime == "") {
            totalTime = 604800000;
        } else {
            errors = errors + "Over X time is incorrect use hhh:mm\n";
        }
    }

    minRep = $("#minRep").val();
    if (minRep == "") {
        minRep = 0;
    } else {
        minRep = minRep.toFixed(0);
    }

    maxRep = $("#maxRep").val();
    if (maxRep == "") {
        maxRep = 250;
    } else {
        maxRep = maxRep.toFixed(0);
    }

    minWc = $("#minWC").val();
    if (minWc == "") {
        minWc = 0;
    } else {
        minWc = minWc.toFixed(0);
    }

    maxWc = $("#maxWC").val();
    if (maxWc == "") {
        maxWc = 1000000;
    } else {
        maxWc = maxWc.toFixed(0);
    }

    //ignore whitespace? ignore caps?
    postContains = $("#bodyContains").val();

    includeTags = $("#includeTags").val();
    includeTags = includeTags.replace(/ /g, '');
    includeTags = includeTags.toLowerCase();
    includeTags = includeTags.split(",");

    excludeTags = $("#excludeTags").val();
    excludeTags = excludeTags.replace(/ /g, '');
    excludeTags = excludeTags.toLowerCase();
    excludeTags = excludeTags.split(",");

    users = $("#specificUser").val();
    users = users.replace(/ /g, '');
    users = users.toLowerCase();
    users = users.split(",");

    var wrongInclude = 0;
    if (users != "") {
        for (i = 0; i < users.length; i++) {
            if (users[i].match(/(@(?:[a-z]+))+/g) == null) {
                wrongInclude++;
            } else {
                users[i] = users[i].replace(/@/g, '');
            }
        }
    }
    if (wrongInclude > 0) {
        errors = errors + "The users you want to include are incorrect\n";
    }

    excludeUsers = $("#excludeSpecificUser").val();
    excludeUsers = excludeUsers.replace(/ /g, '');
    excludeUsers = excludeUsers.toLowerCase();
    excludeUsers = excludeUsers.split(",");

    var wrongExclude = 0;
    if (excludeUsers != "") {
        for (i = 0; i < excludeUsers.length; i++) {
            if (excludeUsers[i].match(/(@(?:[a-z]+))+/g) == null) {
                wrongExclude++;
            } else {
                excludeUsers[i] = excludeUsers[i].replace(/@/g, '');
            }
        }
    }
    if (wrongExclude > 0) {
        errors = errors + "The users you want to exclude are incorrect\n";
    }

    if ($("#followingInput").is(':checked')) {
        getFollowing(loggedUsername, null, 100, users, function (s) {
            users = s;
        });
    } else{
        deferredFollowing.resolve();
    }

    sortPost = $('input[name=sortPost]:checked').val();
    return deferredFollowing.promise();
}

function getFollowing(loggedInUser, lastCheckedUser, totalResults, allUsers, callback) {
    if (totalResults == 100) {
        steem.api.getFollowing(loggedInUser, lastCheckedUser, null, 100, function (err, result) {
            console.log(err, result);
            for (var i = 0; i < result.length; i++) {
                allUsers.push(result[i].following);
            }
            if (result.length == 100) {
                getFollowing(loggedInUser, result[99].following, result.length, allUsers);
            } else {
                callback(allUsers);
                deferredFollowing.resolve();
            }
        });
    }
}

/*errors, minTime, maxTime, minValue, maxValue, totalReward, totalTime, minRep, maxRep, minWc, maxWc, postContains, includeTags, excludeTags, users, excludeUsers, sortPost*/
function createFilterJson(errorsR, minTimeR, maxTimeR, minValueR, maxValueR, totalRewardR, totalTimeR, minRepR, maxRepR, minWcR, maxWcR, postContainsR, includeTagsR, excludeTagsR, usersR, excludeUsersR, sortPostR) {
    if (errorsR == "") {
        //create JSON
        var myObject = new Object();
        myObject.minTime = minTimeR;
        myObject.maxTime = maxTimeR;
        myObject.minValue = minValueR;
        myObject.maxValue = maxValueR;
        myObject.totalReward = totalRewardR;
        myObject.totalTime = totalTimeR;
        myObject.minRep = minRepR;
        myObject.maxRep = maxRepR;
        myObject.minWc = minWcR;
        myObject.maxWc = maxWcR;
        myObject.postContains = postContainsR;
        myObject.includeTags = includeTagsR;
        myObject.excludeTags = excludeTagsR;
        myObject.users = usersR;
        myObject.excludeUsers = excludeUsersR;
        myObject.sortPost = sortPostR;
        console.log(myObject);
    } else {
        alert(errors);
    }
}
