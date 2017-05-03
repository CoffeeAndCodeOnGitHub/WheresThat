var Trello = require("node-trello");
var t = new Trello("6cabc9ff538609ad5eb9c9f75d20b60f", "f091df8c331042ef605d9db9dfb83bed2dba2e60a3de963ea44820eb01e34927");
var files = ["johnny 5", "file32.js", "file44.java", "file4.html", "file15.js"];

var rooms = [
  {name: "mcp", location: "http://www.getcoloringpages.com/images/o9/o92vsjv.jpg"},
  {name: "holly", location: "http://www.clipartkid.com/images/8/red-3d-numbers-set-psdgraphics-21q2N4-clipart.jpg"},
  {name: "johnny 5", location: "https://www.astrogle.com/images/2014/09/number-24.png"},
  {name: "thommo", location: "https://media-cdn.tripadvisor.com/media/photo-s/02/bd/e8/b0/the-cherry-tree-hotel.jpg"}
];

function getNamesAndTeams(callback) {
  t.get("/1/boards/TAHywwPZ/lists", function(err, data) {
    if (err) throw err;
    var lists = data.map(function(a){return {name: a.name, id: a.id}});
    t.get("/1/boards/TAHywwPZ/cards", function(err, data) {
      if (err) throw err;
      var people = data.map(function(a){return {name: a.name, id: a.idList}});

      var directory = people.map(function(person){
        var result = lists.find(
          function(list){return person.id == list.id}
        );
        return {name: person.name, location: result.name, uri: rooms[result.name]}
      });
      callback(directory);
      
    });
  });
}

function ResolveURI(data, text){
  var filtered = data.find(function(datum) {
        return datum.personName.indexOf(text) != -1;
    }
  )

  if(filtered) {return filtered;}
  return "Sorry Dude!";
}


function WheresThatCommandHandler(token, command, text, reply, callback) {
  function finish(data) {
    
    var result1 = data.find(function(datum){
      return datum.name.indexOf(text) !== -1;
    });

    //var teamName = result1.location.substring(result1.localtion.indexOf("("),result1.location.length);
    //var mapUri = "https://s3-ap-southeast-2.amazonaws.com/myob-map/rooms/" + teamName + ".png";

    reply(`Hey, <@${command.user}>,${result1.localtion.indexOf("(")} is this what you are looking for ?`, (err, result) => {
        
      return callback(null, {
      "token":token,
      "channel":token.channel,
      //"text":rooms[command.text],
      //"username":Fuzzbox,
      "attachments": [
          {
              "fallback": "Required plain-text summary of the attachment.",
              "color": "#36a64f",
              //"pretext": `Where's That?`,
              //"pretext": JSON.stringify(result1.location.substring(result1.location.indexOf(text),result1.location.length()),
              // "author_name": "Bobby Tables",
              // "author_link": "http://flickr.com/bobby/",
              // "author_icon": "http://flickr.com/icons/bobby.jpg",
              // "title": "Slack API Documentation",
              // "title_link": "https://api.slack.com/",
              // "text": "result",
              // "fields": [
              //     {
              //         "title": "Priority",
              //         "value": "High",
              //         "short": false
              //     }
              // ],
              "image_url": "https://media-cdn.tripadvisor.com/media/photo-s/02/bd/e8/b0/the-cherry-tree-hotel.jpg"
              // "footer": "Slack API",
              // "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
              // "ts": 123456789
          }
      ]
    });

    });
  }
  getNamesAndTeams(finish);
  // if (!rooms[text]) getNamesAndTeams(finish);
  // else finish(rooms);

   
};
module.exports = WheresThatCommandHandler;
