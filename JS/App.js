$(document).ready(function () {

});

/*

// initialize SteemConnect v2
sc2.init({
  app: 'learntocurie',
  callbackURL: 'http://localhost/learntocurie%20git/learntocurie/HTML/steemconnect2',            // Dev localhost URL
  //callbackURL: 'http://steemconnect.surge.sh/steemconnect/',  // Live demo URL
  scope: ['vote', 'comment', 'custom_json'],
  //access: $.cookie("access_token")  // requires latest version // use `npm i sc2-sdk --save`
});

// Need to define an object that will be observed for changes by Vue.js
var steemconnect = {};
steemconnect.user = null;
steemconnect.metadata = null;
steemconnect.profile_image = null;

// Request user details if token is available
if ($.cookie("access_token") != null) {
  sc2.setAccessToken($.cookie("access_token"));
  sc2.me(function (err, result) {
    // console.log('/me', err, result); // DEBUG
    if (!err) {
      // Fill the steemconnect placeholder with results
      steemconnect.user = result.account;
      steemconnect.metadata = JSON.stringify(result.user_metadata, null, 2);
      steemconnect.profile_image = JSON.parse(vm.$data.steemconnect.user.json_metadata)['profile']['profile_image'];
    }
  });
};

// Initialize the Vue Model
var vm = new Vue({
  el: '#vm',
  data: {
    loginUrl: sc2.getLoginURL(),
    steemconnect: steemconnect,
    message: null
  },
  methods: {
    logout: function() {
      sc2.revokeToken(function (err, result) {
        console.log('You successfully logged out', err, result);
        // Remove all cookies
        $.removeCookie("access_token", { path: '/' });
        $.removeCookie("username", { path: '/' });
        $.removeCookie("expires_in", { path: '/' });
        // Reset all steemconnect local data
        for (var key in this.steemconnect) {
          this.steemconnect[key] = null;
        }
      });
    },
    formatDate: function(date) {
      // Format date from UTC to locale Date
      return new Date(Date.parse(date)).toLocaleDateString();
    },
    createMessage: function(type, data) {
      this.message = {type: type, data: data}
    },
    deleteMessage: function() {
      this.message = null
    },
    followAccount: function(username) {
      app = this
      sc2.follow(steemconnect.user.name, username, function (err, res) {
        if (!err) {
          app.createMessage("is-success", "You successfully followed @" + username)
          console.log(app.message.data, err, res);
        } else {
          console.log(err);
          app.createMessage("is-danger", err)
        }
      });
    },
    unfollowAccount: function(username) {
      app = this
      sc2.unfollow(steemconnect.user.name, username, function (err, res) {
        if (!err) {
          app.createMessage("is-warning", "You successfully unfollowed @" + username)
          console.log(app.message.data, err, res);
        } else {
          console.log(err);
          app.createMessage("is-danger", err)
        }
      });
    }
  }
});

*/
