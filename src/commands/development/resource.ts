class resourceCommand extends (require('../../base/command')) {
    constructor() {
        super({
            name: "resource",
            description: "Get useful information about content of bot.",
            aliases: ["resources", "searchdevelopment"],
            category: "development",
            usage: "<resource> <type[error]> <key[error_code]>",
            default_cooldown: 5000,
            premium_cooldown: 3000,
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
        if(!args[0]){
            return message.channel.send({
                embed: {
                    description: `${lang.commands.resource.type}: \`${this.help.usage}\`.`,
                    color: client.utils.colors.warning
                }
            });
        }

        if(!args[1]){
            return message.channel.send({
                embed: {
                    description: `${lang.commands.resource.key}: \`${this.help.usage}\`.`,
                    color: client.utils.colors.warning
                }
            });
        }

        if(args && args[0].toLowerCase() === "error") {
            let errorData = client.utils.errors[args[1]];
            if(!errorData) {
                return message.channel.send({
                    embed: {
                        description: `${lang.commands.resource.unknown_error}: \`<resource> <list>\``,
                        color: client.utils.colors.error
                    }
                }); 
            }

            return message.channel.send({
                embed: {
                    fields: [
                        {
                            name: `${lang.global.word.code}`,
                            value: `${errorData.code}`,
                            inline: true
                        },
                        {
                            name: `${lang.global.word.type_error}`,
                            value: `${errorData.type}`,
                            inline: true
                        },
                        {
                            name: `${lang.global.word.description}`,
                            value: `${errorData.description}`,
                            inline: true
                        },
                        {
                            name: `${lang.global.word.causes}`,
                            value: `\`\`\`\n${errorData.causes.join("\n \n")}\n\`\`\``,
                            inline: true
                        },
                        {
                            name: `${lang.global.word.solution}`,
                            value: `${errorData.solution}`,
                            inline: true
                        }
                    ],
                    color: message.guild.color
                }
            })
        } else {
            return message.channel.send({
                embed: {
                    description: "Unknown search type.",
                    color: client.utils.colors.error
                }
            });
        }
    }
}

export = resourceCommand;