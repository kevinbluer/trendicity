'use strict';
angular.module('Trendicity')

.service('InstagramService', function($http) {
  var CLIENT_ID = '75d27c9457cd4d1abbacf80a228f4a10';
  var API_ROOT = 'https://api.instagram.com/v1/';

  this.obtainAccessToken = function() {
    // TOOD: See if we already have one and return that one first
    // TODO: May need to return a promise
    var ref = window.open('https://instagram.com/oauth/authorize?client_id=' + CLIENT_ID + '&scope=likes+comments&response_type=token&redirect_uri=http://localhost'
      , '_blank', 'location=no');
    console.log('Window opened....');
    console.log('ref:', ref);
    if (ref) { // maybe we are being launched by a desktop browser
      ref.addEventListener('loadstart', function(event) {
         //alert(event.url);
        console.log('event.url:' + event.url);
        if((event.url).indexOf('http://localhost') === 0) {
          console.log('inside if.....');
          var accessToken = (event.url).split('access_token=')[1];
          console.log('accessToken:' + accessToken);
          localStorage['TrendiCity:accessToken'] = accessToken;
          ref.close();
        }
      });
    }
  };

  this.findPopularPosts = function(options) {
    options = options || {};

    options.client_id = CLIENT_ID; // jshint ignore:line
    options.callback = 'JSON_CALLBACK';

    var promise =
      $http.jsonp(API_ROOT + 'media/popular', {
        params: options
      })
      .error(function(data, status) {
        console.log('findPopularPosts returned status:'  + status);
      });
    return promise;
  };

  // options.distance by default is 1 Kilometer
  this.findNearbyPosts = function(lat, lng, options) {
    options = options || {};

    options.client_id = CLIENT_ID; // jshint ignore:line
    options.lat = lat;
    options.lng = lng;
    options.callback = 'JSON_CALLBACK';

    var promise = $http.jsonp(API_ROOT + 'media/search', {
      params: options
    })
    .error(function(data, status) {
      console.log('findNearbyPosts returned status:'  + status);
    });
    return promise;
  };

  this.findUserFeedPosts = function(options) {
    options = options || {};

    options.callback = 'JSON_CALLBACK';

    var accessToken = '1536218758.75d27c9.77db16a4e36d48c59fe9174173a38415';
      //localStorage['TrendiCity:accessToken'];

    if (accessToken) {
      options.access_token = accessToken; // jshint ignore:line
    }

    console.log('options.access_token:' + options.access_token); // jshint ignore:line

    var promise = $http.jsonp(API_ROOT + 'users/self/feed', {
      params: options
    })
    .error(function (data, status) {
      console.log('userFeedPosts returned status:' + status);
    });
    return promise;
  };

  this.likePost = function(mediaId) {
    var access_token = '1536218758.75d27c9.77db16a4e36d48c59fe9174173a38415';
      //localStorage['TrendiCity:accessToken'];

    var promise = $http.post(API_ROOT + 'media/' + mediaId + '/likes?access_token=' + access_token)
    .error(function (data, status) {
      console.log('likePost returned status:' + status);
    });
    return promise;
  };
});
