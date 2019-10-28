const Discord = require('discord.js')
const config = require('./config.json')
const client = new Discord.Client()
/*const InfiniteLoop = require('infinite-loop');
const il = new InfiniteLoop();*/
var prefix = config.prefix
var i, s, x
var playMaps = 3
var toAddMap = ""
var mappool = ""
var mappoolPrint = ""
var mapNotAdded = []
var mapArgumentPlace = []
var bannedMaps = ""
var bannedMapsPrint = ""
var toAddBan = ""
var allMapsCapital = ["Bank", "Barlett U.", "Border", "Chalet", "Club House", "Coastline", "Consulate", "Favela", "Hereford", "House", "Kafe Dostoyevksy", "Kanal", "Oregon", "Plane", "Skyscraper", "Theme Park", "Tower", "Yacht", "Villa", "Fortress"]
var allMapsLower = ["bank", "barlett u.", "border", "chalet", "club house", "coastline", "consulate", "favela", "hereford", "house", "kafe dostoyevksy", "kanal", "oregon", "plane", "skyscraper", "theme park", "tower", "yacht", "villa", "fortress"]
var allRankedMapsCapital = ["Bank", "Border", "Chalet", "Club House", "Coastline", "Consulate", "Hereford", "Kafe Dostoyevsky", "Oregon", "Skyscraper", "Theme Park", "Villa", "Fortress"]
var allRankedMapsLower = ["bank", "border", "chalet", "club house", "coastline", "consulate", "hereford", "kafe dostoyevsky", "oregon", "skyscraper", "theme park", "villa", "fortress"]
var allESLMapsCapital = ["Bank", "Border", "Club House", "Coastline", "Consulate", "Villa", "Oregon"]
var allESLMapsLower = ["bank", "border", "club house", "coastline", "consulate", "villa", "oregon"]

let bank = new Discord.Attachment("https://i.ytimg.com/vi/Y7KrMSz0f0M/maxresdefault.jpg")
let barlett
let border = new Discord.Attachment("https://i.ytimg.com/vi/Hyasl8FBBF8/maxresdefault.jpg")
let chalet
let clubhouse = new Discord.Attachment("https://i.ytimg.com/vi/ggPskg7vv2M/maxresdefault.jpg")
const coastline = new Discord.Attachment("https://cdn.gamerant.com/wp-content/uploads/rainbow-six-siege-coastline-map.jpg.optimal.jpg")
let consulate = new Discord.Attachment("https://i.ytimg.com/vi/sFK05wM-XP0/maxresdefault.jpg")
let favela
let hereford
const house = new Discord.Attachment("https://i.pinimg.com/originals/d8/1c/59/d81c59eb369d024ea5f4dd335b2d43a6.jpg")
let kafe = new Discord.Attachment("https://i.ytimg.com/vi/-fy69uH527Q/maxresdefault.jpg")
let kanal
const oregon = new Discord.Attachment("https://i.ytimg.com/vi/5q9nxFoFuaM/maxresdefault.jpg")
let plane
let skyscraper
let themepark
let tower
let yacht
let villa = new Discord.Attachment("https://assets.rockpapershotgun.com/images//2018/06/r6-siege-villa.jpg/RPSS/resize/760x-1/format/jpg/quality/90")
let fortress

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

client.on('ready', () => {
    console.log("Connected as: " + client.user.tag)
    client.user.setActivity("Rainbow Six Siege Tournament Manager")
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  
    client.guilds.forEach((guild) => {
      console.log("Connected to: " + guild.name)
      console.log("\n")
      guild.channels.forEach((channel) => {
        console.log("Channels: " + ` - ${channel.name} ${channel.type} ${channel.id}`)
      })
    })

    /*
    // tournament-bot ID: 545264524878544906
    let sendChannelID = client.channels.get("getChannelID")
    */
})

client.on('message', (receivedMessage) => {
    if(receivedMessage.author == client.user) {
      return
    }
    if(receivedMessage.content.startsWith(prefix)) {
      processCommand(receivedMessage)
    }
})

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1)
    let splitCommand = fullCommand.split(" ")
    let primaryCommand = splitCommand[0]
    let argument = splitCommand.slice(1)

    const banFilter = receivedMessage => primaryCommand.startsWith(prefix+"ban")
    const pickFilter = receivedMessage => primaryCommand.startsWith(prefix+"pick")

    // console.log("FullCommand = "+fullCommand+"\tsplitCommand = "+splitCommand+"\nPrimaryCommand = "+primaryCommand+"\targument = "+argument+"\targument[0] = "+argument[0])
    if(primaryCommand == "help") {
      helpCommand(argument, receivedMessage)
    } else if(primaryCommand == "reset") {
      resetCommand(receivedMessage)
    } else if(primaryCommand == "resetbans") {
      resetbansCommand(receivedMessage)
    } else if(primaryCommand == "addmap") {
      addmapCommand(argument, receivedMessage)
    } else if(primaryCommand == "removemap") {
      removemapCommand(argument, receivedMessage)
    } else if(primaryCommand == "mappool") {
      mappoolCommand(argument, receivedMessage)
    } else if(primaryCommand == "settings") {
      settingsCommand(argument, receivedMessage)
    } else if(primaryCommand == "startban") {
      startbanCommand(argument, receivedMessage, banFilter, pickFilter)
    }
}

function startbanCommand(argument, receivedMessage, banFilter, pickFilter) {
  if(mappool.length == 0) {
    receivedMessage.channel.send("There are no maps in the map pool. Please add maps before starting a ban phase.")
  } else {
    if(playMaps == 3) {
      receivedMessage.channel.send("Starting ban phase!\nTeam A is banning.")
      // First ban Team A
      do {
        receivedMessage.channel.awaitMessages(banFilter, { max: 1, time: 60000}).then(collected => {
          if(receivedMessage.member.roles.some(r => ["Team A", "Jubiman"].includes(r.name))) {
            if(collected.startsWith(prefix+"ban")) {
              if(argument.length == 0) {
                receivedMessage.channel.send("Please add the map you want to ban")
              } else if(argument.length == 1) {
                s = bannedMaps.search(argument[0])
                if(s != -1) {
                  receivedMessage.channel.send("The map "+argument[0]+" has already been banned.")
                } else {
                  toAddBan = argument[0]+" "
                  bannedMaps += toAddBan
                  map = argument[0].capitalize()
                  receivedMessage.channel.send(map+" has been banned.")
                  return
                }
              } else {
                receivedMessage.channel.send("You have taken too many arguments. You can only ban 1 map at a time.")
              }
            } else {}
          }
        }).catch(err => {
          receivedMessage.channel.send("You took to long.")
        })
      } while(0)
      receivedMessage.channel.send("Team B is banning")
      // First ban Team B
      do {
        receivedMessage.channel.awaitMessages(banFilter, { max: 1, time: 60000}).then(collected => {
          if(message.author == client.user) {}
          if(collected.startsWith(prefix+"ban")) {
            if(message.member.roles.some(r=>["Team B"].includes(r.name))) {
              if(argument.length == 0) {
                receivedMessage.channel.send("Please add the map you want to ban")
              } else if(argument.length == 1) {
                s = bannedMaps.search(argument[0])
                if(s != -1) {
                  receivedMessage.channel.send("The map "+argument[0]+" has already  been banned.")
                } else {
                  toAddBan = argument[0]+" "
                  bannedMaps += toAddBan
                  map = argument[0].capitalize()
                  receivedMessage.channel.send(map+" has been banned.")
                  return
                }
              } else {
                receivedMessage.channel.send("You have taken too many arguments. You can only ban 1 map at a time.")
              }
            } else {}
          }
        }).catch(err => {
          receivedMessage.channel.send("You took to long.")
        })
      } while(0)
      receivedMessage.channel.send("Team A is picking.")
      // Pick Team A
      do {
        receivedMessage.channel.awaitMessages(pickFilter, { max: 1, time: 60000}).then(collected => {
          if(collected.startsWith(prefix+"pick")) {
            if(receivedMessage.member.roles.some(r=>["Team A"].includes(r.name))) {
              if(argument.length == 0) {
                receivedMessage.channel.send("Please add the map you want to pick")
              } else if(argument.length == 1) {
                s = pickedMaps.search(argument[0])
                if(s != -1) {
                  receivedMessage.channel.send("The map "+argument[0]+" has already been picked.")
                } else {
                  toAddPick = argument[0]+" "
                  pickedMaps += toAddPick
                  map = argument[0].capitalize()
                  receivedMessage.channel.send(map+" has been banned.")
                  return
                }
              } else {
                receivedMessage.channel.send("You have taken too many arguments. You can only pick 1 map.")
              }
            } else {}
          }
        }).catch(err => {
          receivedMessage.channel.send("You took to long.")
        })
      } while(0)
      receivedMessage.channel.send("Team B is picking.")
      // Pick Team B
      do {
        receivedMessage.channel.awaitMessages(pickFilter, { max: 1, time: 60000}).then(collected => {
          if(collected.startsWith(prefix+"pick")) {
            if(receivedMessage.member.roles.some(r=>["Team B"].includes(r.name))) {
              if(argument.length == 0) {
                receivedMessage.channel.send("Please add the map you want to pick")
              } else if(argument.length == 1) {
                s = pickedMaps.search(argument[0])
                if(s != -1) {
                  receivedMessage.channel.send("The map "+argument[0]+" has already been picked.")
                } else {
                  toAddPick = argument[0]+" "
                  pickedMaps += toAddPick
                  map = argument[0].capitalize()
                  receivedMessage.channel.send(map+" has been banned.")
                  return
                }
              } else {
                receivedMessage.channel.send("You have taken too many arguments. You can only pick 1 map.")
              }
            } else {}
          }
        }).catch(err => {
          receivedMessage.channel.send("You took to long.")
        })
      } while(0)
    } else if(playMaps == 1) {
      amountBan = mappool.split(" ")
      for(i = 0; i < (amountBan.length - 1); ++i) {
        receivedMessage.channel.send("Starting ban phase!\nTeam A is banning.")
      // First ban Team A
      do {
        receivedMessage.channel.awaitMessages(banFilter, { max: 1, time: 60000}).then(collected => {
          if(receivedMessage.member.roles.some(r => ["Team A", "Jubiman"].includes(r.name))) {
            if(collected.startsWith(prefix+"ban")) {
              if(argument.length == 0) {
                receivedMessage.channel.send("Please add the map you want to ban")
              } else if(argument.length == 1) {
                s = bannedMaps.search(argument[0])
                if(s != -1) {
                  receivedMessage.channel.send("The map "+argument[0]+" has already been banned.")
                } else {
                  toAddBan = argument[0]+" "
                  bannedMaps += toAddBan
                  map = argument[0].capitalize()
                  receivedMessage.channel.send(map+" has been banned.")
                  return
                }
              } else {
                receivedMessage.channel.send("You have taken too many arguments. You can only ban 1 map at a time.")
              }
            } else {}
          }
        }).catch(err => {
          receivedMessage.channel.send("You took to long.")
        })
      } while(0)
      receivedMessage.channel.send("Team B is banning")
      // First ban Team B
      do {
        receivedMessage.channel.awaitMessages(banFilter, { max: 1, time: 60000}).then(collected => {
          if(message.author == client.user) {}
          if(collected.startsWith(prefix+"ban")) {
            if(message.member.roles.some(r=>["Team B"].includes(r.name))) {
              if(argument.length == 0) {
                receivedMessage.channel.send("Please add the map you want to ban")
              } else if(argument.length == 1) {
                s = bannedMaps.search(argument[0])
                if(s != -1) {
                  receivedMessage.channel.send("The map "+argument[0]+" has already  been banned.")
                } else {
                  toAddBan = argument[0]+" "
                  bannedMaps += toAddBan
                  map = argument[0].capitalize()
                  receivedMessage.channel.send(map+" has been banned.")
                  return
                }
              } else {
                receivedMessage.channel.send("You have taken too many arguments. You can only ban 1 map at a time.")
              }
            } else {}
          }
        }).catch(err => {
          receivedMessage.channel.send("You took to long.")
        })
      } while(0)
      }
    }
  }
}

function resetCommand(receivedMessage) {
  mappool = ""
  bannedMaps = ""
  receivedMessage.channel.send("Map pool and bans are reset.")
}

function resetbansCommand(receivedMessage) {
  bannedMaps = [""]
  receivedMessage.channel.send("Bans are reset.")
}

function addmapCommand(argument, receivedMessage) {
  if(argument.length == 0) {
    receivedMessage.channel.send("Please add a map you want to remove from the map pool.")
  } else if(argument.length == 1) {
    toAddMap = argument[0]+" "
    s = mappool.search(argument[0])
    if(s != -1) {
      receivedMessage.channel.send(argument[0]+" is already in the map pool. Try "+prefix+"mappool to view the map pool!")
    } else {
      mappool = mappool+toAddMap
      receivedMessage.channel.send(argument[0]+" has been added")
    }
  } else if(argument.length == 2) {
    for(i = 0; i < 2; ++i) {
      toAddMap = argument[i]+" "
      s = mappool.search(argument[i])
      if(s != -1) {
        receivedMessage.channel.send(argument[i]+" is already in the map pool. Try "+prefix+"mappool to view the map pool!")
        mapArgumentPlace.push(i)
        mapNotAdded.push(argument[i])
      } else {
        mappool = mappool+toAddMap
      }
    }
    if(mapNotAdded.length == 0) {
      var addedMessage = argument[0]+" and "+argument[1]+" have been added."
      receivedMessage.channel.send(addedMessage)
    } else if(mapNotAdded.length >= 1 && mapNotAdded.length <= 5) {
      for(i = 0; i < mapNotAdded.length; ++i) {
        if(mapArgumentPlace[0] == 0) {
          var addedMessage = argument[0]+" has been added."
        } else if(mapArgumentPlace[1] == 1) {
          var addedMessage = argument[1]+" has been added."
        } else if(mapArgumentPlace[2] == 2) {
          var addedMessage = argument[2]+" has been added."
        } else if(mapArgumentPlace[3] == 3) {
          var addedMessage = argument[3]+" has been added."
        } else if(mapArgumentPlace[4] == 4) {
          var addedMessage = argument[4]+" has been added."
        } else if(mapArgumentPlace[5] == 5) {
          var addedMessage = argument[5]+" has been added."
        }
      }
    }
  } else if(argument.length == 3) {
    for(i = 0; i < 3; ++i) {
      toAddMap = argument[i]+" "
      s = mappool.search(argument[i])
      if(s != -1) {
        receivedMessage.channel.send(argument[i]+" is already in the map pool. Try "+prefix+"mappool to view the map pool!")
      } else {
        mappool = mappool+toAddMap
      }
    }
    if(mapNotAdded.length == 0) {
      var addedMessage = argument[0]+", "+argument[1]+" and "+argument[2]+" have been added."
      receivedMessage.channel.send(addedMessage)
    } else if(mapNotAdded.length >= 1 && mapNotAdded.length <= 5) {
      for(i = 0; i < mapNotAdded.length; ++i) {
        if(mapArgumentPlace[0] == 0) {
          var addedMessage = argument[0]+" has been added."
        } else if(mapArgumentPlace[1] == 1) {
          var addedMessage = argument[1]+" has been added."
        } else if(mapArgumentPlace[2] == 2) {
          var addedMessage = argument[2]+" has been added."
        } else if(mapArgumentPlace[3] == 3) {
          var addedMessage = argument[3]+" has been added."
        } else if(mapArgumentPlace[4] == 4) {
          var addedMessage = argument[4]+" has been added."
        } else if(mapArgumentPlace[5] == 5) {
          var addedMessage = argument[5]+" has been added."
        }
      }
    }
  } else if(argument.length == 4) {
    for(i = 0; i < 4; ++i) {
      toAddMap = argument[i]+" "
      s = mappool.search(argument[i])
      if(s != -1) {
        receivedMessage.channel.send(argument[i]+" is already in the map pool. Try "+prefix+"mappool to view the map pool!")
        mapArgumentPlace.push(i)
        mapNotAdded.push(argument[i])
      } else {
        mappool = mappool+toAddMap
      }
    }
    if(mapNotAdded.length == 0) {
      var addedMessage = argument[0]+", "+argument[1]+", "+argument[2]+" and "+argument[3]+" have been added."
      receivedMessage.channel.send(addedMessage)
    } else if(mapNotAdded.length >= 1 && mapNotAdded.length <= 5) {
      for(i = 0; i < mapNotAdded.length; ++i) {
        if(mapArgumentPlace[0] == 0) {
          var addedMessage = argument[0]+" has been added."
        } else if(mapArgumentPlace[1] == 1) {
          var addedMessage = argument[1]+" has been added."
        } else if(mapArgumentPlace[2] == 2) {
          var addedMessage = argument[2]+" has been added."
        } else if(mapArgumentPlace[3] == 3) {
          var addedMessage = argument[3]+" has been added."
        } else if(mapArgumentPlace[4] == 4) {
          var addedMessage = argument[4]+" has been added."
        } else if(mapArgumentPlace[5] == 5) {
          var addedMessage = argument[5]+" has been added."
        }
      }
    }
  } else if(argument.length == 5) {
    for(i = 0; i < 5; ++i) {
      toAddMap = argument[i]+" "
      s = mappool.search(argument[i])
      if(s != -1) {
        receivedMessage.channel.send("The map"+argument[i]+" is already in the map pool. Try "+prefix+"mappool to view the map pool!")
        mapArgumentPlace.push(i)
        mapNotAdded.push(argument[i])
      } else {
        mappool = mappool+toAddMap
      }
    }
    if(mapNotAdded.length == 0) {
      var addedMessage = argument[0]+", "+argument[1]+", "+argument[2]+", "+argument[3]+" and "+argument[4]+" have been added."
      receivedMessage.channel.send(addedMessage)
    } else if(mapNotAdded.length >= 1 && mapNotAdded.length <= 5) {
      for(i = 0; i < mapNotAdded.length; ++i) {
        if(mapArgumentPlace[0] == 0) {
          var addedMessage = argument[0]+" has been added."
        } else if(mapArgumentPlace[1] == 1) {
          var addedMessage = argument[1]+" has been added."
        } else if(mapArgumentPlace[2] == 2) {
          var addedMessage = argument[2]+" has been added."
        } else if(mapArgumentPlace[3] == 3) {
          var addedMessage = argument[3]+" has been added."
        } else if(mapArgumentPlace[4] == 4) {
          var addedMessage = argument[4]+" has been added."
        } else if(mapArgumentPlace[5] == 5) {
          var addedMessage = argument[5]+" has been added."
        }
      }
    }
  } else if(argument >= 6) {
    receivedMessage.channel.send("You have too much arguments. Try having at most 5 arguments!")
    return
  }
  
  if(mappool.length > 0 || mappoolPrint.length > 0) {
    mappoolSplit = []
    mappoolPrint = ""
  }
  mappoolSplit = mappool.split(" ")
  mappoolSplit.forEach(function(value) {
    mappoolPrint += value+", "
  })
  mappoolPrint = mappoolPrint.substring(0, mappoolPrint.length-4)
  mappoolPrint += "."
  return
}

function removemapCommand(argument, receivedMessage) {
  if(argument.length == 0) {
    receivedMessage.channel.send("Error: No Argument found.\nPlease add a map you want to remove from the map pool.")
    return
  } else if(argument.length == 1) {
    s = mappool.search(argument[0])
    if(s == -1) {
      receivedMessage.channel.send("The map "+argument[0]+" has not been found. Try "+prefix+"mappool to view the mappool")
      return
    }
    if(mappool.length > 0 || mappoolPrint > 0) {
      mappoolSplit = []
      mappoolPrint = ""
    }
    mappool = mappool.replace(argument[0], "")
    // Logic for creating new mappoolPrint
    mappoolSplit = []
    mappoolPrint = ""
    mappoolSplit = mappool.split(" ")
    mappoolSplit.forEach(function(value) {
      mappoolPrint += value+", "
    })
    mappoolPrint = mappoolPrint.substring(0, mappoolPrint.length-4)
    mappoolPrint += "."
    receivedMessage.channel.send(argument[0]+" has been removed.")
     /*else if(argument.length == 2) {
      receivedMessage.channel.send(argument[0]+" and "+argument[1]+" have been removed.")
    } else if(argument.length == 3) {
      receivedMessage.channel.send(argument[0]+", "+argument[1]+" and "+argument[2]+" have been removed.")
    } else if(argument.length == 4) {
      receivedMessage.channel.send(argument[0]+", "+argument[1]+", "+argument[2]+" and "+argument[3]+" have been removed.")
    } else if(argument.length == 5) {
      receivedMessage.channel.send(argument[0]+", "+argument[1]+", "+argument[2]+", "+argument[3]+" and "+argument[4]+" have been removed.")
    } else if(argument.length > 5) {
      receivedMessage.channel.send("You have given too many arguments. The maximum amount of arguments removemap can take is 5!")
    }*/
    return
  } else if(argument.length == 2) {
    for(x = 0; x < argument.length; ++x) {
      for(i = 0; i < mappool.length; ++i) {
        s = mappool.search(argument[i])
        if(s == -1) {
          receivedMessage.channel.send("The map "+argument[i]+" has not been found. Try "+prefix+"mappool to view the mappool")
        }
        mappool = mappool.replace(argument[i], "")
        return
      }
    }
  } else if(argument.length == 3) {
    for(x = 0; x < argument.length; ++x) {
      for(i = 0; i < mappool.length; ++i) {
        s = mappool.search(argument[i])
        if(s == -1) {
          receivedMessage.channel.send("The map "+argument[i]+" has not been found. Try "+prefix+"mappool to view the mappool")
        }
        mappool = mappool.replace(argument[i], "")
        return
      }
    }
  } else if(argument.length == 4) {
    for(x = 0; x < argument.length; ++x) {
      for(i = 0; i < mappool.length; ++i) {
        s = mappool.search(argument[i])
        if(s == -1) {
          receivedMessage.channel.send("The map "+argument[i]+" has not been found. Try "+prefix+"mappool to view the mappool")
        }
        mappool = mappool.replace(argument[i], "")
        return
      }
    }
  } else if(argument.length == 5) {
    for(x = 0; x < argument.length; ++x) {
      for(i = 0; i < mappool.length; ++i) {
        s = mappool.search(argument[i])
        if(s == -1) {
          receivedMessage.channel.send("The map "+argument[i]+" has not been found. Try "+prefix+"mappool to view the mappool")
        }
        mappool = mappool.replace(argument[i], "")
        return
      }
    }
  }
}

function mappoolCommand(argument, receivedMessage) {
  if(mappool.length == 0) {
    receivedMessage.channel.send("The map pool is empty.")
  } else {
    if(argument.length == 0) {
      receivedMessage.channel.send("The maps in the map pool are:\n  "+mappoolPrint)
      return
    } else if(argument == "-p") {
      receivedMessage.channel.send("This feature will come soon")
      //for(i = 0; i < mappool.length; ++i) {}
      return
    }
  }
}

function settingsCommand(argument, receivedMessage) {
  if(argument.length == 0) {
    receivedMessage.channel.send("To change prefix, type: " + prefix + "settings prefix [new prefix]\nTo change playable maps, type: "+prefix+"settings playmaps [1 or 3]. For further information, type: "+prefix+"settings playmaps.")
  } else if(argument[0] == "prefix") {
    receivedMessage.channel.send("The prefix has been changed from " + prefix + " to " + argument[1] + ".")
    prefix = argument[1]
  } else if(argument[0] == "playmaps") {
    toChangePlayMaps = parseInt(argument[1])
    playMaps = toChangePlayMaps
    receivedMessage.channel.send("The the next ban/pick phase will go for "+playMaps+" maps to play.")
  }
}

function helpCommand(argument, receivedMessage) {
  if(argument.length == 0) {
    receivedMessage.channel.send("All commands:\n    " + prefix + "ban   Ban a map. (Takes 1 argument)\n    " + prefix + "mappool   Show the current map pool. (Takes no arguments)\n    " + prefix + "addmap   Add a map to the map pool. (Takes 1 or more arguments)\n    " + prefix + "removemap   Remove a map from the map pool. (Takes 1 or more arguments)\n    " + prefix + "reset   This resets all bans and maps to restart a ban phase. (Takes no arguments)\n    " + prefix + "resetbans   This resets all bans to restart a ban phase. (Takes no arguments) (You MUST use this command before adding or removing a map from the map pool!)\n    " + prefix + "help [command]   Get further information about a command.\n   " + prefix + "settings")
  } else if(argument[0] == "prefix") {
    receivedMessage.channel.send("You can change the prefix of this bot by typing: "+prefix+"settings prefix [new prefix]")
  } else if(argument[0] == "playmaps") {
    receivedMessage.channel.send("With the command *playmaps* you can select how many maps you want to play. This will affect the ban/pick phase and can be either a 1 or a 3.\nTo use this command, type: "+prefix+"settings playmaps [1 or 3]")
  } else {
    receivedMessage.channel.send("Comming soon...")
  }
}







client.login(config.token)