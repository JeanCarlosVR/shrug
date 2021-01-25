class editSnipeCommand extends (require('../../base/command')) {
    constructor() {
        super({
            name: "editsnipe",
            description: "Get last message edited.",
            aliases: [],
            category: "utility",
            usage: "<editSnipe>",
            default_cooldown: 4000,
            premium_cooldown: 2000,
            disabled: false,
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

        let snipesGuild = client.snipes.get(message.guild.id);
        if(!snipesGuild) {
            return message.channel.send({
                embed: {
                    description: `${lang.commands.snipe.not_recently}`,
                    color: message.guild.color
                }
            });
        }

        let snipe = snipesGuild["update"][message.channel.id];
        if(!snipe) {
            return message.channel.send({
                embed: {
                    description: `${lang.commands.snipe.not_recently}`,
                    color: message.guild.color
                }
            });
        }

        return message.channel.send({
            embed: {
                author: {
                    name: `${lang.commands.snipe.content}`
                },
                fields: [
                    {
                        name: `${lang.commands.snipe.author}`,
                        value: `<@${snipe.author}>`,
                        inline: true
                    },
                    {
                        name: `${lang.commands.snipe.message_id}`,
                        value: `${snipe.id}`,
                        inline: true
                    },
                    {
                        name: `${lang.commands.snipe.updated}`,
                        value: `${client.utils.functions.date(snipe.timestamp, message.guild.lang)}`,
                        inline: true
                    },
                ],
                description: `${snipe.content}`,
                color: message.guild.color
            }
        }); 
    }
}

export = editSnipeCommand;