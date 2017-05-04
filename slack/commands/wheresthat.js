var Trello = require("node-trello");
var t = new Trello("6cabc9ff538609ad5eb9c9f75d20b60f", "f091df8c331042ef605d9db9dfb83bed2dba2e60a3de963ea44820eb01e34927");
var request = require('request');

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
        return datum.personName.toUpperCase().indexOf(text.toUpperCase()) != -1;
    }
  )

  if(filtered) {return filtered;}
  return "Sorry Dude!";
}


function WheresThatCommandHandler(token, command, text, reply, callback) {
  
  function finish(data) {
    
    var result1 = data.find(function(datum){
        return datum.name.toUpperCase().indexOf(text.toUpperCase()) !== -1;
    });

    var teamName = text;
    var mapUri = "https://s3-ap-southeast-2.amazonaws.com/myob-map/rooms/" + text.toLowerCase().replace(" ","").replace("the","").replace("'","") + ".PNG";
    var teamPreText = "Looks like you mean " + text + " that's highlighted in green on the map below!";
    
    if(typeof result1 !== 'undefined'){
        teamName = result1.location.substring(0,result1.location.indexOf("("));
        mapUri = "https://s3-ap-southeast-2.amazonaws.com/myob-map/rooms/" + teamName.toLowerCase().replace(" ","") + ".PNG";
        teamPreText = "Looks like " + text + " is " + result1.name + " and is in " + teamName + " Team highlighted in green on the map below!";
    }


    request(mapUri, function (error, response, body) {
      if(response.statusCode === 404){
        mapUri = "https://media-cdn.tripadvisor.com/media/photo-s/02/bd/e8/b0/the-cherry-tree-hotel.jpg";
        teamPreText = "I couldnt find any matches for " + text + " type 'Rooms' or 'Teams' to see a list of available search options"
      }
    
      var attachment = [
          {
              "fallback": "Required plain-text summary of the attachment.",
              "color": "#36a64f",
              "pretext": teamPreText,
              "author_name": "MYOB.maps",
               "author_icon": "https://image.shutterstock.com/z/stock-vector-vector-map-icon-with-red-flag-108851135.jpg",
               "title": "MYOB.maps",
              "image_url": mapUri,

          }
      ]

      if(text.toLowerCase() === 'teams'){
        teamPreText = "I can see you need help with team names?"
        attachment = [
          {
              "fallback": "Required plain-text summary of the attachment.",
              "color": "#36a64f",
              "pretext": teamPreText,
              "fields": [
                {
                    "title": "Andromeda",
                    "short": false
                },
                {
                    "title": "Area 51",
                    "short": false
                },
                {
                    "title": "Betelgeuse",
                    "short": false
                },
                {
                    "title": "Don't Panic",
                    "short": false
                },
                {
                    "title": "Genesis",
                    "short": false
                },
                {
                    "title": "Juno",
                    "short": false
                },
                {
                    "title": "Kamino",
                    "short": false
                },
                {
                    "title": "Kristi",
                    "short": false
                },
                {
                    "title": "Odyssey",
                    "short": false
                },
                {
                    "title": "Orbital",
                    "short": false
                },
                {
                    "title": "Pathfinder",
                    "short": false
                },
                {
                    "title": "Replicant",
                    "short": false
                },
                {
                    "title": "Sora",
                    "short": false
                },
                {
                    "title": "Super Nova",
                    "short": false
                },
                {
                    "title": "Titan",
                    "short": false
                }
                ]
            }
          ]
      }

      if(text.toLowerCase() === 'rooms'){
        teamPreText = "I can see you need help with room names?"
        attachment = [
          {
              "fallback": "Required plain-text summary of the attachment.",
              "color": "#36a64f",
              "pretext": teamPreText,
              "fields": [
                {
                    "title": "Johnny 5",
                    "short": false
                },
                {
                    "title": "Holly",
                    "short": false
                },
                {
                    "title": "Rosie",
                    "short": false
                },
                {
                    "title": "R2-D2",
                    "short": false
                },
                {
                    "title": "MCP",
                    "short": false
                },
                {
                    "title": "Matrix",
                    "short": false
                },
                {
                    "title": "Marvin",
                    "short": false
                },
                {
                    "title": "M-B9",
                    "short": false
                },
                {
                    "title": "Kitt",
                    "short": false
                },
                {
                    "title": "Hal 9000",
                    "short": false
                },
                {
                    "title": "Wintermute",
                    "short": false
                },
                {
                    "title": "Skynet",
                    "short": false
                },
                {
                    "title": "ExMachina",
                    "short": false
                }
              ]
            }
          ]
      }

    reply(`Hey, <@${command.user}>, is this what you are looking for ?`, (err, result) => {
        
      return callback(null, {
      "token":token,
      "channel":token.channel,
      "attachments": attachment
      //"attachments": [
      //    {
      //        "fallback": "Required plain-text summary of the attachment.",
      //        "color": "#36a64f",
      //        "pretext": teamPreText,
      //        "author_name": "MYOB.maps",
      //         "author_icon": "https://image.shutterstock.com/z/stock-vector-vector-map-icon-with-red-flag-108851135.jpg",
      //         "title": "MYOB.maps",
      //        "image_url": mapUri,

//          }
  //    ]
    });
});
    });
  }

  getNamesAndTeams(finish); 
};
module.exports = WheresThatCommandHandler;
