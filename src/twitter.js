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

  twitter.scrape = function(args, callback){
    console.log("TRYING TO SCRAPE FROM TwitterIntegration", args.options.post);
    client.getCustomApiCall('/statuses/retweets/'+args.options.post+'.json', {}, function(err, res, body){
      console.log("GOT AN ERROR", err, body);
    }, function(data){
      console.log("GOT THE DATA!!", data)
    });
    // https://api.twitter.com/1.1/statuses/retweets/210462857140252672.json
    // https://api.twitter.com/1.1/statuses/retweets/210462857140252670.json
    callback();
  };

  return twitter.init();
};
