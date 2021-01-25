class helpCommand extends (require('../../base/command')) {
    constructor() {
        super({
            name: "help",
            description: "Get help about all bot.",
            aliases: ["ayuda"],
            category: "information",
            usage: "<help>",
            default_cooldown: 0,
            premium_cooldown: 0,
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
        return message.channel.send({
            embed: {
                description: lang.commands.help.head_message_embed_aMlQaZJ,
                fields: [
                    {
                        name: "⠀",
                        value: `${lang.commands.help.center_fields_embed_aMlQaZJ["0"]}`,
                        inline: true
                    },
                    {
                        name: "⠀",
                        value: `${lang.commands.help.center_fields_embed_aMlQaZJ["1"]}`,
                        inline: true
                    },
                    {
                        name: "⠀",
                        value: `${lang.commands.help.center_fields_embed_aMlQaZJ["2"]}`,
                        inline: true
                    }
                ],
                color: message.guild.color
            }
        }); 
    }
}

export = helpCommand;