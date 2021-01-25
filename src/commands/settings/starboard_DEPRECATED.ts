import guildSchema from '../../database/models/guild';

class starboardCommand extends (require('../../base/command')) {

    protected client;
    protected message;

    constructor() {
        super({
            name: "starboard",
            description: "Setup starboard system.",
            aliases: ["sb"],
            category: "utility",
            usage: "<starboard> <argument[channel|minutes|minimumStars]> <type[--channel|--time|--minimum]>",
            default_cooldown: 3000,
            premium_cooldown: 1500,
            disabled: true,
            development: false,
            canary: false
        });
    }

    /**
    * 
    * @param client 
    * @param message 
    * @param args 
    * @param lang 
    */
    public async run(client, message, args, lang) {
        this.client = client;
        this.message = message;

        return;

        if(!(args[0] || args[1])) {
            return message.channel.createMessage({
                embed: {
                    description: `You need specify argument and the type. \n\`${this.help.usage}\``,
                    color: message.guild.color
                }
            });
        }

        switch(args[1].toLowerCase()) {
            case "--channel":
                if(!message.channelMentions[0]) {
                    return message.channel.createMessage({
                        embed: {
                            description: `You need to mention any channel. \n\`${this.help.usage}\``,
                            color: message.guild.color
                        }
                    });
                }

                let channel = message.guild.channels.get(message.channelMentions[0]);
                if(!channel) {
                    return message.channel.createMessage({
                        embed: {
                            description: `Unknown channel in guild.`,
                            color: message.guild.color
                        }
                    });
                }

                await guildSchema.findOneAndUpdate({ id: message.guild.id }, { "services.starboard.channel": channel.id });

                message.channel.createMessage({
                    embed: {
                        description: `The channel for starboard has been changed to <#${channel.id}>`,
                        color: message.guild.color
                    }
                });
                break;

            case "--minimum":
                if(!args[0]) {
                    return message.channel.createMessage({
                        embed: {
                            description: `You need to give minimun numbers of reactions (1 - 25.000). \n\`${this.help.usage}\``,
                            color: message.guild.color
                        }
                    });
                }

                if(isNaN(args[0]) || (isNaN && (parseFloat(args[0]) > 25000 || parseFloat(args[0]) < 1) )) {
                    return message.channel.createMessage({
                        embed: {
                            description: `The starboard minimum reactions is limited. Accepted Values: \`1\`...\`25.000\` is equal to \`1 Reaction\` or \`25.000 Reactions\`.`,
                            color: message.guild.color
                        }
                    });
                }

                await guildSchema.findOneAndUpdate({ id: message.guild.id }, { "services.starboard.minimum": parseFloat(args[0] || 5)});

                message.channel.createMessage({
                    embed: {
                        description: `The minimun reactions for starboard has been changed to **${parseFloat(args[0])}**.`,
                        color: message.guild.color
                    }
                });
                break;
            default: 
                message.channel.createMessage({
                    embed: {
                        description: `You need give a valid value to change. \`[--channel|--minimum]\``,
                        color: message.guild.color
                    }
                });
                break;
        }
    }
}

export = starboardCommand;