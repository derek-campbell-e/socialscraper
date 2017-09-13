module.exports = function CLI(SocialScraper){
  var cli = {};
  var vorpal = require('vorpal')();



  var handlers = {

    fb: {
      command: "fb [reactions...]",
      description: "scrape a facebook <post> and collect all the people who interacted with it",
      options: [
        ["-s, --shared", "inclued people who shared this post"],
        ["-p, --post <post>", "post id"]
      ],
      action: function(args, cb){
        console.log("scraping fb post");
        SocialScraper.scrape('fb', args, cb);
      },
    },

    tumblr: {
      command: "tumblr",
      description: "scrape a tumblr post and collect all the people who liked/loved it",
      options: [
        ["-r, --reblogs", "include reblogs to be collected"],
        ["-p, --post <post>", "post id"]
      ],
      action: function(args, cb){
        SocialScraper.scrape('tumblr', args, cb);
      }
    },

    twitter: {
      command: "twitter",
      description: "scrape a tweet and collect all the people who liked/loved it",
      options: [
        ["-r, --retweets", "include retweets to be collected"],
        ["-p, --post <post>", "post id"]
      ],
      action: function(args, cb){
        console.log("CLI", args);
        SocialScraper.scrape('twitter', args, cb);
      }
    },

  };

  cli.bind = function(){
    for(var handler in handlers){
      console.log("processing handler", handler);
      handler = handlers[handler];
      var vorpal_session = vorpal.command(handler.command).description(handler.description).action(handler.action);


      for(var option in handler.options){
        option = handler.options[option];
        vorpal_session.option.apply(vorpal_session, option);
      }

      vorpal_session.types({
        string: ['p', 'post']
      });
    }
  };

  cli.init = function(){
    var meta = require('../package.json');
    cli.bind();
    vorpal.delimiter(meta.delimiter+"-"+meta.version+"$").show();
    return cli;
  };

  return cli.init();
};
