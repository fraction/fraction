'use strict';

HackerNews.read = {
  since: (before) => {
    var hn = Npm.require('hacker-news-api');

    var now = Math.floor(Date.now() / 1000);
    var listQuery = 'search?tags=story&numericFilters=created_at_i>';
    listQuery    += (now - before) + ',created_at_i<' + now;

    hn.call(listQuery, Meteor.bindEnvironment((error, data) => {
        if (error) {
          throw error;
        }

        var saveItem = (item) => {
          var obj = {
            oldId: parseInt(item.objectID, 10),
            oldPoints: parseInt(item.points, 10),
            createdAt: new Date(item.created_at),
            site: 'hn',
            author: item.author,
            title: item.title,
            hnText: item.text,
            url: item.url,
            oldComments: parseInt(item.num_comments, 10),
          };

          var postQuery = 'items/' + parseInt(item.objectID, 10);
          hn.call(postQuery, Meteor.bindEnvironment((error, post) => {
            if (error) {
              throw error;
            }
            // save object comments too
            obj.oldChildren = post.children;

            Posts.upsert({
              oldId: obj.oldId
            },{
              $set: obj
            });
          }));
        };

        _(data.hits).forEach(saveItem);
      }, (error) => {
        throw error;
      })
    );
  },
  every: function (interval) {
    Meteor.setInterval(() => {               // 4410rph (21 * 7 * (60/2))
      console.log("Reading 140 posts from Hacker News");
      this.since(2 * 60);                        // 2 minutes - 21 requests
      this.since(60 * 60);                       // hour      - 21 requests
      this.since(24 * 60 * 60);                  // day       - 21 requests
      this.since(7 * 24 * 60 * 60);              // week      - 21 requests
      this.since(31 * 24 * 60 * 60);             // month     - 21 requests
      this.since(31 * 24 * 60 * 60);             // year      - 21 requests
      this.since(Math.floor(Date.now() / 1000)); // ever      - 21 requests
    }, interval);
  }
};

HackerNews.read.every(2 * 60 * 1000);
