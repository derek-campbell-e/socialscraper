module.exports = function SocialScraper(){
  var ss = {};

  var socialModules = {
    twitter: require('./twitter')(ss),
  };

  ss.init = function(){
    console.log("initialized");
    var cli = require('./cli')(ss);
    return ss;
  };

  ss.scrape = function(network, args, callback){
    console.log("scraping", network, "with args", args);
    socialModules[network].scrape(args, function(error, result){
      callback();
    });
  };

  return ss.init();
};
