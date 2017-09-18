module.exports = function TwitterIntegration(SocialScraper){
  var Twitter = require('twitter-node-client').Twitter;
  var client = new Twitter({
    consumerKey: 'nWTQZlE0ENUln0aRNkiBrkgAd',
    consumerSecret: 'jEfXSxhoJpjLQuiNujOX779mB6vLChvnEAv2IkqMeACgzaJVbo',
    accessToken: '908027141803126791-x9C2KKFR0NpqFH1i8dIa5HblpNUIJGq',
    accessTokenSecret: 'TzD9hrzzg82BD2TLX5Qdn0Rif8lH0xnyDktFQLtS9ftxt',
    callBackUrl: "https://micro.ugenu.io/oauth/callback"
  });

  var twitter = {};

  twitter.init = function(){
    return twitter;
  };

  twitter.scrapeLoop = function(args, callback){
    console.log("TRYING TO SCRAPE FROM TwitterIntegration", args.options.post);
    var req_args = {};
    req_args.id = args.options.post;
    if(args.options.cursor){
      req_args.cursor = args.options.cursor;
    }

    client.getCustomApiCall('/statuses/retweeters/ids.json', req_args, function(err, res, body){
      console.log(err);
      callback(err);
    }, function(data){
      data = JSON.parse(data);
      if(data.next_cursor !== -1) {
        args.options.cursor = data.next_cursor;
        console.log(data);
        return twitter.scrapeLoop(args, callback);
      }
      callback(null, data);
    });
    // https://api.twitter.com/1.1/statuses/retweets/210462857140252672.json
    // https://api.twitter.com/1.1/statuses/retweets/210462857140252670.json
  };

  twitter.scrape = function(args, callback){
    twitter.scrapeLoop(args, callback);
  };

  return twitter.init();
};
