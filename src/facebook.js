module.exports = function FacebookIntegration(SocialScraper){

  var FB = require('fb');
  var client = FB.extend({appID: '1783621581905068', appSecret: 'c2d6058c656aab1bcc907bc15e8b6cbe'});
  //var request = require('request');

  var facebook = {};

  // set up the client before anything else
  client.api('oauth/access_token',{
    client_id: '1783621581905068',
    client_secret: 'c2d6058c656aab1bcc907bc15e8b6cbe',
    grant_type: 'client_credentials'
  }, function(res){
    if(!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
    }

    var accessToken = res.access_token;
    client = client.withAccessToken(accessToken);

    // this is just a test, apparently just requesting a username id is this simple
    client.api('/1587253817985035', function(res){
      console.log(res);
    });
  });

  // this is our internal cache
  var cache = {};

  // this function gets the pageID for when we pass in a full post url
  facebook.getPageID = function(url, callback){

    var base = 'facebook.com/';
    var segments = url.split(base);
    var scheme = segments[0];
    var usernameOrID = segments[1].split("/")[0];

    var urlForPageID = scheme + base + usernameOrID;
    client.api('/'+urlForPageID, {}, function(res){
      if(!res.error){
        return callback(null, res.id);
      }
      return callback(res.error, false);
    });
  };

  // this recursive function is called, filling in the request args if needed,
  // until there is no more page cursoes

  facebook.scrapeLoop = function(args, callback){
    var req_args = {};
    if(args.options.cursor) {
      req_args.after = args.options.cursor;
    }

    var segments = args.options.post.split("/");
    var postID = segments[segments.length - 1];


    args.options.postID = args.options.postID || postID;

    var request = function(request_url, req_args){
      client.api(request_url, req_args, function(res){
        cache.reactions = cache.reactions || [];
        cache.reactions = cache.reactions.concat(res.data);
        //console.log(res);
        if(typeof res.paging !== "undefined" && res.paging.cursors.after){
          args.options.cursor = res.paging.cursors.after;
          return facebook.scrapeLoop(args, callback);
        }
        console.log(cache);
        callback(cache);
      });
    };

    // if we dont have the pageID yet
    if(!args.options.pageID) {
      console.log(" WE DONT HAVE PAGE ID YET");
      facebook.getPageID(args.options.post, function(error, pageID){
        args.options.pageID = pageID;
        var request_url = '/'+pageID+'_'+args.options.postID+'/reactions';
        return request(request_url, req_args);
      });

    } else {
      console.log("NOW WE GOT PAGE ID");
      var request_url = '/'+args.options.pageID+'_'+args.options.postID+'/reactions';
      return request(request_url, req_args);
    }

  };

  facebook.scrape = function(args, callback){
    cache = {};
    facebook.scrapeLoop(args, callback);
  };

  return facebook;
};

// sarah 1661552841_10212524847310466

// wgoimv 509788395807591_1423752094411212
