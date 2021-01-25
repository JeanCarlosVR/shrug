class prefixCommand extends (require('../../base/command')) {
    constructor() {
        super({
            name: "prefix",
            description: "Set up a new prefix.",
            aliases: ["setprefix"],
            category: "preferences",
            usage: "<prefix> <argument1>",
            default_cooldown: 8000,
            premium_cooldown: 4000,
            disabled: false,
            development: false,
            canary: false
        });
    }

    async run(client, message, args, lang) {
        if(!args[0] || args[0].length < 1){
            return message.channel.send({
                embed: {
                    description: `${lang.commands.prefix.need_prefix_argument}`,
                    color: message.guild.color
                }
            });
        }

        if(args[0] && (args[0].length > 20 || args[0].length < (0 || 1))){
            return message.channel.send({
                embed: {
                    description: `${lang.commands.prefix.exceeds_max_length} \`(0-20)\``,
                    color: message.guild.color
                }
            });
        }

        try {
            await (require("../../database/models/guild")).findOneAndUpdate({ id: message.guild.id }, { $set: { "preferences.prefix": args[0] }});
            return message.channel.send({
                embed: {
                    description: `${lang.commands.prefix.success_the_prefix_has_been_changed_to} \`${args[0]}\``,
                    color: message.guild.color
                }
            });
        } catch(error) {

            if(error.length > 1800) {
                error = "0x2Ax8P";
            }

            return message.channel.send({
                embed: {
                    description: `${lang.global.unexpected_error} **ERROR**: \`${error}\``,
                    color: client.utils.colors.error
                }
            });
        }
    }
}

export = prefixCommand;