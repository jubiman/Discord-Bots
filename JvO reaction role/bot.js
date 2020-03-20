const Discord = require('discord.js')
const config = require('./config.json')
const bot = new Discord.Client()
var prefix = config.prefix
var singleChannelId = ''
var rrChannelId = '689786890861281280'
var logChannel = '689553063589052523'


bot.on('ready', () => {
  console.log("Connected as: " + bot.user.tag)
  bot.user.setActivity("Administering JvO Discord")
  console.log(`Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`); 
  bot.guilds.forEach((guild) => {
    console.log("Connected to: "+ guild.name)
  })
})

bot.on('message', (message) => {
  if(message.author == bot.user) return
  if(singleChannelId != "") {
    if(message.channel.id != singleChannelId) return
  }
  if(message.content.startsWith(prefix)) {
    processCmd(message)
  }
})

function processCmd(message) {
  const args = message.content.substr(prefix.length).split(' ')
  switch(args[0]) {
    case "help": {
      help(args, message)
      return
    }
    case "settings": {
      settings(args, message)
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

bot.on('messageReactionAdd', (messageReaction, user) => {
  if(!messageReaction.channel === logChannel) return
  if(messageReaction.emoji.name != "✅") return

  var member = messageReaction.message.guild.members.find(member => member.id === user.id)
  if(member) {
    var profielRole = false
    if(member.roles.find(role => role.id === '689773485395804205')) profielRole = true
    if(member.roles.find(role => role.id === '689773506547810378')) profielRole = true
    if(member.roles.find(role => role.id === '689773519759867952')) profielRole = true
    if(member.roles.find(role => role.id === '689773530103021612')) profielRole = true
    if(!profielRole) {
      user.send("Je hebt geen profiel geselecteerd")
      return
    }

    var klasRole = false
    if(member.roles.find(role => role.id === '689809587754631243')) klasRole = true
    if(member.roles.find(role => role.id === '689809540723900438')) klasRole = true
    if(member.roles.find(role => role.id === '689809498571014164')) klasRole = true
    if(member.roles.find(role => role.id === '689809457965826180')) klasRole = true
    if(member.roles.find(role => role.id === '689809327913041985')) klasRole = true
    if(member.roles.find(role => role.id === '689809152972685334')) klasRole = true
    if(!klasRole)  {
      user.send("Je hebt geen klas geselecteerd")
      return
    }

    var keuzevakRole = 0
    if(member.roles.find(role => role.id === '689781092240064524')) ++keuzevakRole
    if(member.roles.find(role => role.id === '689780398976401408')) ++keuzevakRole
    if(member.roles.find(role => role.id === '689781028826775583')) ++keuzevakRole
    if(member.roles.find(role => role.id === '689779837992566857')) ++keuzevakRole
    if(member.roles.find(role => role.id === '689780952532385803')) ++keuzevakRole
    if(member.roles.find(role => role.id === '689780212006649883')) ++keuzevakRole
    if(member.roles.find(role => role.id === '689779589379391517')) ++keuzevakRole
    if(member.roles.find(role => role.id === '689779245500858533')) ++keuzevakRole
    if(member.roles.find(role => role.id === '689779769251987468')) ++keuzevakRole
    if(member.roles.find(role => role.id === '689812749491896487')) ++keuzevakRole
    if(member.roles.find(role => role.id === '689780253094183051')) ++keuzevakRole
    if(member.roles.find(role => role.id === '689780321448886272')) ++keuzevakRole
    if(member.roles.find(role => role.id === '689781754910736391')) ++keuzevakRole
    if(member.roles.find(role => role.id === '689781935073001487')) ++keuzevakRole
    if(member.roles.find(role => role.id === '689781256300265503')) ++keuzevakRole
    if(member.roles.find(role => role.id === '689779509393752064')) ++keuzevakRole
    if(keuzevakRole < 3) {
      user.send("Je hebt geen keuzevakken geselecteerd")
      return
    }
  }

  var role = messageReaction.message.guild.roles.find(role => role.id === '690525990144966716')
  if(role) {
    if(member) {
      member.removeRole(role.id)
      return
    }
  }
})

bot.on('raw', event => {
  if(event.t === 'MESSAGE_REACTION_ADD') {
    if(!event.d.channel_id === logChannel) return
    if(bot.channels.get(event.d.channel_id).messages.has(event.d.message_id)) return
    else {
      bot.channels.get(event.d.channel_id).fetchMessage(event.d.message_id).then(msg => {
        bot.emit('messageReactionAdd', msg.reactions.get(event.d.emoji.name), bot.users.get(event.d.user_id))
      }).catch(err => console.log(err))
    }
  }
})

const helpEmbed = new Discord.RichEmbed()
  .setColor('#0099ff')
  .setTitle('Commands list')
  .setAuthor('Jvo helper', 'https://gymnasiumamersfoort.nl/wp-content/uploads/2016/08/JvO.png')
  .setDescription('[] means required, {} means optional, | means or.\nDon\'t include these.')
  .setThumbnail('https://gymnasiumamersfoort.nl/wp-content/uploads/2016/08/JvO.png')
  .addField(prefix+'help', 'This command')
  .addField(prefix+'settings [setting] {args}', 'Change the bot\'s configuration')
  .addField(prefix+'clear|delete [int|all]', 'Clear (x) amount of messages (max = 100)')
  .setFooter('By Jubiman', 'https://gymnasiumamersfoort.nl/wp-content/uploads/2016/08/JvO.png');


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

function getChanFromMention(mention) {
	if (!mention) return
	if (mention.startsWith('<#') && mention.endsWith('>'))
		return bot.channels.get(mention.slice(2, -1))
}

function getChanIdFromMention(mention) {
	if (!mention) return
	if (mention.startsWith('<#') && mention.endsWith('>'))
		return mention.slice(2, -1).toString()
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
  } else if(parseInt(args[1]) < 100) {
    message.channel.bulkDelete(parseInt(args[1])+1)
  } else {
    message.channel.bulkDelete(parseInt(args[1]))
  }
}

function help(args, message) {
  if(args.length == 1) {
    message.channel.send(helpEmbed)
  } 
  else {
    message.channel.send("Coming soon...")
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
        if(args.length < 2 || args[2] == "this") {
          singleChannelId = message.channel.id.toString()
        } else if(args.length == 3 && args[2] != "this") {
          if(!message.mentions.channels.first()) {
            bot.channels.get(args[2])
            console.log("Please add a mention a channel for me to log.")
          } else {
            singleChannelId = getChanIdFromMention(args[2])
          }
        }
        message.channel.send(`The bot is now listening on ${getChanFromMention(args[2])}`)
        return
      }
      case "logChannel": {
        if(args.length < 2 || args[2] == "this") {
          logChannel = message.channel.id.toString()
        } else if(args.length >= 3) {
          if(!message.mentions.channels.first()) {
            bot.channels.get(args[2])
            console.log("Please add a mention a channel for me to log.")
          } else {
            logChannel = getChanIdFromMention(args[2])
          }
        }
        message.channel.send(`The bot is now listening on ${getChanFromMention(args[2])}`)
        return
      }
      case "emoji": {
        return
      }
      case "emojis": {
        return
      }
    }
  }
}

bot.login(config.token)