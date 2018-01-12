// This should probably go in its own .js file and imported
// Official documentation is available @ https://github.com/steemit/sc2-sdk

// Define a Fonction object for static calls
function SC2Utils(){};

SC2Utils.vote = function(author, permlink, weight) {
  sc2.vote($scope.user.name, author, permlink, weight, function (err, res) {
    if (!err) {
      console.log('You successfully voted for @' + author + '/' + permlink, err, res);
    } else {
      console.log(err);
    }
  });
};

SC2Utils.comment = function(parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata) {
  sc2.comment(parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function (err, res) {
    if (!err) {
      console.log('You successfully commented post @' + author + '/' + permlink, err, res);
    } else {
      console.log(err);
    }
  });
};


SC2Utils.reblog = function(account, author, permlink) {
  sc2.reblog(account, author, permlink, function (err, res) {
    if (!err) {
      console.log('You successfully rebloged post @' + author + '/' + permlink, err, res);
    } else {
      console.log(err);
    }
  });
};

// follower = user that follows
// following = user to follow
SC2Utils.follow = function(follower, following) {
  sc2.follow(follower, following, function (err, res) {
    if (!err) {
      console.log('You successfully followed @' + following, err, res);
    } else {
      console.log(err);
    }
  });
};

// unfollower = user that unfollows
// unfollowing = user to unfollow
SC2Utils.unfollow = function(unfollower, unfollowing) {
  sc2.unfollow(unfollower, unfollowing, function (err, res) {
    if (!err) {
      console.log('You successfully unfollowed @' + unfollowing, err, res);
    } else {
      console.log(err);
    }
  });
};

// follower = user that ignores
// following = user to ignore
SC2Utils.ignore = function(follower, following) {
  sc2.ignore = (follower, following, function (err, res) {
    if (!err) {
      console.log('You successfully ignored @' + following, err, res);
    } else {
      console.log(err);
    }
  });
};