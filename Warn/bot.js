const Discord = require('discord.js')
const config = require('./config.json')
const bot = new Discord.Client()
const yesEmoji = "✅"
const noEmoji = "❎"
var prefix = config.prefix
var warnedUsers = []
var warnedUsersPoints = []
var maxWarningPoints = 5,i,taggedUser = 0
var singleChannelId = "",kickEmoji = '586909231387639808',banEmoji = '586909231161147393'
newWarn = false

bot.on('ready', () => {
  console.log("Connected as: " + bot.user.tag)
  bot.user.setActivity("Administering NLG Discord")
  console.log(`Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`); 
  bot.guilds.forEach((guild) => {
    console.log("Connected to: "+ guild.name+"\n")
    guild.channels.forEach((channel) => {
    console.log("Channels: "+` - Name: ${channel.name} Type: ${channel.type} ID: ${channel.id}`)
    })
  })
})

bot.on('message', (message) => {
  if(message.author == bot.user) return
  if(!singleChannelId == "") {
    if(message.channel.id != singleChannelId) return
  }
  if(message.content.startsWith(prefix)) {
    processCmd(message)
  }
})

function processCmd(message) {
  const args = message.content.substr(prefix.length).split(' ')

  //console.log("PrimaryCommand = "+args[0]+"\targs = "+args+"\targs[1] = "+args[1])
  switch(args[0]) {
    case "help": {
      help(args, message)
      return
    }
    case "settings": {
      settings(args, message)
      return
    }
    case "warn": {
      warn(args, message)
      return
    }
    case "delete": {
      del(message, args)
      return
    }
    case "clear": {
      del(message, args)
      return
    }
  }
}

function warn(args, message) {
  const reason = message.content.split(3).join(' ')
  switch(args.length) {
    case 1: {
      message.channel.send("You need to put in a user to warn and how many warn points! ("+prefix+"warn [user] [warning points] [reason] )")
      return
    }
    default: {
      const userId = getIdFromMention(args[1])
      if(warnedUsers.indexOf(userId) > -1) {
        newWarn = false
        taggedUser = warnedUsers.indexOf(userId)
      } 
      else {
        newWarn = true
      }
      if(args[1] == "check") {
        for(i=0; i<warnedUsers.length; ++i) {
          if(warnedUsers[i] == args[2]) {
            message.channel.send(args[2]+" has "+warnedUsersPoints[i]+"/"+maxWarningPoints+" warning points.")
          }
        }
      } 
      else if(newWarn == true) {
        warnedUsers.push(userId) // get the user on the list
        warnedUsersPoints[warnedUsersPoints.length] = parseInt(args[2]) // get points on same place as the user (warnedUsers[0] == userId, warnedUsersPoints[0] == points(int))
        message.channel.send(args[1]+" has been warned with "+args[2]+' points for '+reason) // feedback in channel
      } 
      else if(newWarn == false) {
        if((warnedUsersPoints[taggedUser]+parseInt(args[2])) >= maxWarningPoints) {
          /*let msg = await message.channel.send("This user has "+warnedUsersPoints[taggedUser]+" points, he/she will be over the limit of "+maxWarningPoints+" would you like to ban/kick this person?")
          await msg.react(message.guild.emojis.get(banEmoji))
          await msg.react(message.guild.emojis.get(kickEmoji))*/
          message.channel.send("This user has "+warnedUsersPoints[taggedUser]+" points, he/she will be over the limit of "+maxWarningPoints+" would you like to ban/kick this person?")
          .then(msg => {
            msg.react(message.guild.emojis.get(banEmoji))
              .then(msg.react(message.guild.emojis.get(kickEmoji)))
              .then(msg.awaitReactions((reaction, m) => reaction.emoji.id === banEmoji || reaction.emoji.id === kickEmoji && m.author === message.author, {max: 1, time: 60000, error: 'time'})
                .then(reactions => {
                  if(reactions.first().emoji.id === banEmoji) {
                    let check = getUserFromMention(args[1])
                    /*let msg = await message.channel.send(`Are you sure you want to ban ${check}?`)
                    await msg.react(yesEmoji)
                    await msg.react(noEmoji)*/
                    message.channel.send(`Are you sure you want to ban ${check}?`).then(msg => msg.react(yesEmoji).then(msg.react(noEmoji)))
                    //const banCheckReactions = await msg.awaitReactions((reaction, m) => reaction.emoji.name === yesEmoji || reaction.emoji.name === noEmoji && m.author === message.author, {max: 1, time: 60000, error: 'time'}).catch(console.error)
                    msg.awaitReactions((reaction, m) => reaction.emoji.name === yesEmoji || reaction.emoji.name === noEmoji && m.author === message.author, {max: 1, time: 60000, error: 'time'}).then(banCheckReactions => {
                      if(banCheckReactions.first().emoji.name == yesEmoji) {
                        ban(message, args, reactions)
                      } 
                      else if(banCheckReactions.first().emoji.name == noEmoji) {
                        message.channel.send("Warning canceled/failed. Please try the command again if you chose the wrong option!")
                        return
                      } 
                      else {
                        message.channel.send(`You have reacted with an emoji I do not recognise. Please use the ${prefix}warn command again!`)
                      }
                    }).catch(console.error)
                  } 
                  else if(reactions.first().emoji.id === kickEmoji) {
                    let check = getUserFromMention(args[1])
                    /*let msg = await message.channel.send(`Are you sure you want to kick ${check}?`)
                    await msg.react(yesEmoji)
                    await msg.react(noEmoji)*/
                    message.channel.send(`Are you sure you want to kick ${check}?`).then(msg => msg.react(yesEmoji).then(msg.react(noEmoji)))
                    //const kickCheckReactions = await msg.awaitReactions((reaction, m) => reaction.emoji.name === yesEmoji || reaction.emoji.name === noEmoji && m.author === message.author, {max: 1, time: 60000, error: 'time'})
                    msg.awaitReactions((reaction, m) => reaction.emoji.name === yesEmoji || reaction.emoji.name === noEmoji && m.author === message.author, {max: 1, time: 60000, error: 'time'}).then(kickCheckReactions => {
                      if(kickCheckReactions.first().emoji.name == yesEmoji) {
                        kick(message, args, reactions)
                      } 
                      else if(kickCheckReactions.first().emoji.name == noEmoji) {
                        message.channel.send("Warning canceled/failed. Please try the command again if you chose the wrong option")
                      } 
                      else {
                        message.channel.send(`You have reacted with an emoji I do not recognise. Please use the ${prefix}warn command again!`)
                      }
                    }).catch(console.error)
                  }
                  else message.channel.send("You have reacted with an emoji I do not recognise!")
                  console.log(reactions)
                }).catch(console.error))
          })
          //const reactions = await msg.awaitReactions((reaction, m) => reaction.emoji.id === banEmoji || reaction.emoji.id === kickEmoji && m.author === message.author, {max: 1, time: 60000, error: 'time'}).catch(console.error)
        } 
        else {
          warnedUsersPoints[taggedUser] += parseInt(args[2])
          message.channel.send(args[1]+" has been warned with "+args[2]+" points for "+reason.slice(0,reason.length-1)+".\nThis user now has "+warnedUsersPoints[taggedUser]+" total points.")
        }
      }
    }
    return
  }
}

async function ban(message, args, reactions) {
  let tempUsername = getUserFromMention(args[1]) // first try to get user to be banned
  let sentMsg = await message.channel.send(`For how long do you want to ban ${tempUsername}?`)
  const collected = await sentMsg.channel.awaitMessages(m => m.author === message.author, {max: 1, time: 60000})
  colArgs = collected.first().content.split(' ') // standard format: [0] == int, [1] == (string)days, [2] == int, [3] == (string)hours, [4] == int, [5] == (string)minutes
  /* banDur is in minutes */
  var tempBanDur
  if(colArgs.length == 2 && colArgs[1] == "day") {
    tempBanDur = parseInt(colArgs[0])*24*60
  } 
  else if((colArgs[1] == "days" || colArgs[1] == "Days") && colArgs.length >= 5) {
    tempBanDur = (parseInt(colArgs[0])*24*60)+(parseInt(colArgs[2])*60)+(parseInt(colArgs[4]))
  } 
  else if((colArgs[1] == "days" || colArgs[1] == "Days") && colArgs.length == 2) {
    tempanDur = (parseInt(colArgs[0])*24*60)+(parseInt(colArgs[2])*60)+(parseInt(colArgs[4]))
  } 
  else if((colArgs[1] == "hours" || colArgs[1] == "Hours") && (colArgs.length >= 2 && colArgs.length <= 4)) {
    tempBanDur = (parseInt(colArgs[0])*60)+(parseInt(colArgs[2]))
  } 
  else if(((colArgs[1] == "minutes" || colArgs[1] == "Minutes") && (colArgs[3] == "seconds" || colArgs[3] == "Seconds")) && (colArgs.length >= 2 && colArgs.length <= 4)) {
    tempBanDur = (parseInt(colArgs[0]))+(parseInt(colArgs[2])*60)
  } 
  else if(((colArgs[1] == "minutes" || colArgs[1] == "Minutes") && colArgs.length < 2) && colArgs.length == 2) {
    tempBanDur = parseInt(args[0])
  }
  const banDur = tempBanDur
  delete tempBanDur
  if (!tempUsername) {
    try {
      if (!message.guild.members.get(tempUsername)) throw new Error('Couldn\' get a Discord user with this userID!')
      tempUsername = message.guild.members.get(args[1])
      tempUsername = user.tempUsername
    } catch (error) {
      return message.reply('I couldn\'t get a Discord user with this userID!')
    }
  }
  const banReason = `You have too many warn points and ${reactions.get(banEmoji).users.get(tempUsername)} told me to ban you. You had ${warnedUsersPoints[taggedUser]}/${maxWarningPoints} warnign points. You received ${args[2]} warning points. You will be banned for ${banDur} minutes.`
  let sentMsg2 = await message.channel.send(`Do you want to delete messages from ${args[1]}, if yes, type how many days long. If no, type 0 or no.`)
  collected2 = await sentMsg2.channel.awaitMessages(m => m.author === message.author, {max: 1, time: 60000})
  if(collected2.first().content == "no" || collected2.first().content == "0") {
    delDays = 0
  } 
  else {
    delDays = parseInt(collected2.first().content)
  }
  const username = tempUsername
  if (username === message.author) return message.channel.reply('you can\'t ban yourself.')
  if (!banReason) return message.reply('please enter a reason for the ban.')
  if (!message.guild.member(username).bannable) return message.reply('you can\'t ban this user because the bot has not sufficient permissions! (!bannable)')
  const member = message.guild.member(username)
  await member.ban(username, {banDur, days: delDays, reason: banReason})
  const banConfirmationEmbed = new Discord.RichEmbed()
    .setColor('RED')
    .setDescription(`✅ ${username.tag} has been successfully banned!`)
  message.channel.send(banConfirmationEmbed)
  username.send(banReason)
}

async function kick(message, args, reactions) {
  let tempUsername = getUserFromMention(args[1]) // first try to get user to be banned
  if (!tempUsername) {
    try {
      if (!message.guild.members.get(tempUsername)) throw new Error('Couldn\' get a Discord user with this userID!')
      tempUsername = message.guild.members.get(args[1])
      tempUsername = user.tempUsername
    } catch (error) {
      return message.reply('I couldn\'t get a Discord user with this userID!')
    }
  }
  const kickReason = `You have too many warn points and ${reactions.get(banEmoji).users.get(tempUsername)} told me to ban you. You had ${warnedUsersPoints[taggedUser]}/${maxWarningPoints} warnign points. You received ${args[2]} warning points. You will be banned for ${banDur} minutes.`
  const username = tempUsername
  if (username === message.author) return message.channel.reply('you can\'t ban yourself.')
  if (!kickReason) return message.reply('please enter a reason for the ban.')
  if (!message.guild.member(username).bannable) return message.reply('you can\'t ban this user because the bot has not sufficient permissions! (!bannable)')
  const member = message.guild.member(username)
  await member.kick(username, kickReason)
  const kickConfirmationEmbed = new Discord.RichEmbed()
    .setColor('RED')
    .setDescription(`✅ ${username.tag} has been successfully banned!`)
  message.channel.send(kickConfirmationEmbed)
  username.send(kickReason)
}

function getUserFromMention(mention) {
	if (!mention) return
	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1)
		if (mention.startsWith('!')) {
			mention = mention.slice(1)
		}
		return bot.users.get(mention)
	}
}

function getIdFromMention(mention) {
	if (!mention) return
	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1)
		if (mention.startsWith('!')) {
			mention = mention.slice(1)
		}
		return mention.toString()
	}
}

function del(message, args) {
  if(args.length == 1) {
    message.channel.send("Please add how many messages you want to delete! ("+prefix+"delete [int|all] )")
  } else if(args[1] == "all" || args[1] == "ALL") {
    async function clear() {
      message.delete()
      const fetched = await message.channel.fetchMessages({limit: 100})
      message.channel.bulkDelete(fetched)
    }
    clear()
  } else if(args[1] < 100) {
    message.channel.bulkDelete(parseInt(args[1])+1)
  } else {
    message.channel.bulkDelete(parseInt(args[1]))
  }
}

function help(args, message) {
  if(args.length == 1) {
    var helpEmbed = new Discord.RichEmbed()
      .setColor('#0099ff')
      .setTitle('Commands list')
      .setAuthor('No Limits Gaming Warn Bot', 'https://cdn1.iconfinder.com/data/icons/color-bold-style/21/08-512.png')
      .setDescription('[] means required, {} means optional, | means or.\nDon\'t include these.')
      .setThumbnail('https://cdn1.iconfinder.com/data/icons/color-bold-style/21/08-512.png')
      .addField(prefix+'help', 'This command')
      .addField(prefix+'settings [setting] {args}', 'Change the bot\'s configuration')
      .addField(prefix+'warn [user] [warning points] [reason]', 'Give a user warning points')
      .addField(prefix+'clear|delete [int|all]', 'Clear (x) amount of messages (max = 100)')
      .setFooter('By Jubiman', 'https://cdn1.iconfinder.com/data/icons/color-bold-style/21/08-512.png');
    message.channel.send(helpEmbed)
  } 
  else {
    message.channel.send("Comming soon...")
  }
}

function settings(args, message) {
  if(args.length == 0) {
    message.channel.send("You done fucked up! You need arguments to edit shit!!")
  } 
  else {
    switch(args[1]) {
      case "prefix": {
       message.channel.send("The old prefix: "+prefix+" was changed to "+args[2]+".")
       prefix = args[2]
       return
      } 
      case "channel": {
        if(args.length <= 2 || args[2] == "this") {
          singleChannelId = message.channel.id.toString()
          message.channel.send("The bot now only listens to this channel.")
        }
        return
      }
      case "warn": {
        if(args[2] == "maxWarnPoints") {
          message.channel.send("maxWarningPoints has changed from "+maxWarningPoints+" to "+args[3])
          maxWarningPoints == parseInt(args[3])
        }
        return
      } 
      case "emoji": {
        if(args[2] == "kick") {
          kickEmoji = args[3]
          message.channel.send("kick emoji is now set to "+kickEmoji)
        } 
        else if(args[2] == "ban") {
          banEmoji = args[3]
          message.channel.send("ban emoji is now set to "+banEmoji)
        }
        return
      }
      case "emojis": {
        if(args[2] == "kick") {
          if(!parseInt(args[3])) {
            kickEmoji = args[3]
          } 
          else {
            kickEmoji = parseInt(args[3])
          }
          message.channel.send("kick emoji is now set to "+kickEmoji)
        } 
        else if(args[2] == "ban") {
          if(!parseInt(args[3])) {
            banEmoji = args[3]
          } 
          else {
            banEmoji = parseInt(args[3])
          }
          message.channel.send("ban emoji is now set to "+banEmoji)
        }
        return
      }
    }
  }
}

bot.login(config.token)