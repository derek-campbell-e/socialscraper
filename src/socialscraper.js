module.exports = function SocialScraper(){
  var ss = {};

  var socialModules = {
    twitter: require('./twitter')(ss),
    facebook: require('./facebook')(ss)
  };

  ss.init = function(){
    console.log("initialized", socialModules);
    var cli = require('./cli')(ss);
    return ss;
  };

  ss.scrape = function(network, args, callback){
    console.log("scraping", network, "with args", args);
    socialModules[network].scrape(args, function(error, result){
      console.log("FINIISHED");
      callback();
    });
  };

  return ss.init();
};
