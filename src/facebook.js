module.exports = function FacebookIntegration(SocialScraper){
  var FB = require('fb');
  var client = FB.extend({appID: '1783621581905068', appSecret: 'c2d6058c656aab1bcc907bc15e8b6cbe'});

  var facebook = {};



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
    client.api('/10156384500276729', function(res){
      console.log(res);
    });
  });

  var cache = {};

  facebook.scrapeLoop = function(args, callback){
    var req_args = {};
    if(args.options.cursor) {
      req_args.after = args.options.cursor;
    }
    var request_url = '/'+args.options.post+'/reactions';
    client.api(request_url, req_args, function(res){
      cache.reactions = cache.reactions || [];
      cache.reactions = cache.reactions.concat(res.data);
      console.log(res);
      if(typeof res.paging !== "undefined" && res.paging.cursors.after){
        args.options.cursor = res.paging.cursors.after;
        return facebook.scrapeLoop(args, callback);
      }
      console.log(cache);
      callback(cache);
    });
  };

  facebook.scrape = function(args, callback){
    cache = {};
    facebook.scrapeLoop(args, callback);
  };

  return facebook;
};

// sarah 1661552841_10212524847310466

// wgoimv 509788395807591_1423752094411212
