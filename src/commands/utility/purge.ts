class purgeCommand extends (require('../../base/command')) {

    protected client;
    protected message;

    constructor() {
        super({
            name: "purge",
            description: "Mass delete messages from a certain channel.",
            aliases: ["clear"],
            category: "utility",
            usage: "<purge> <lines>",
            default_cooldown: 10000,
            premium_cooldown: 6000,
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
        this.client = client;
        this.message = message;

        let lines;
        if(!args[0]) {
            return message.channel.send({
                embed: {
                    description: `${lang.commands.purge.need_lines} \`${this.help.usage}\``,
                    color: message.guild.color
                }
            });
        }

        lines = parseFloat(args[0]);

        if(lines < 2 || lines > 1000) {
            return message.channel.send({
                embed: {
                    description: `${lang.commands.purge.limits} (2-1000). \`${this.help.usage}\``,
                    color: message.guild.color
                }
            });
        }
        
        try {
            let totalCleared = await this.clear(lines, null);
            let messageCountDeleted = await message.channel.send({
                embed: {
                    description: `${lang.commands.purge.total_messages} <#${message.channel.id}> (**${totalCleared}** ${lang.global.word.messages}).`,
                    color: message.guild.color
                }
            });

            setTimeout(() => {
                return messageCountDeleted.delete(`(${client.user.username.toUpperCase()})`)
            }, 2000);
        } catch {
            return this.message.channel.send({
                embed: {
                    description: `${lang.global.unexpected_error} **ERROR**: \`0x47lYu\``,
                    color: this.client.utils.colors.error
                }
            });
        }
    }

    public async clear(lines, filter): Promise<Number> {
        let count = 0;
        function asign(counting) {
            count += counting;
        }
        if(lines > 0 && lines < 251) {
            await this.client.purgeChannel(this.message.channel.id, lines).then(total => asign(total));
        } else if(lines > 251 && lines < 501) {
            let lines2 = Math.floor(lines/2);
            await this.client.purgeChannel(this.message.channel.id, lines2).then(total => asign(total));
            await this.client.purgeChannel(this.message.channel.id, lines2).then(total => asign(total));
        } else if(lines > 501 && lines < 751) {
            let lines3 = Math.floor(lines/3);
            await this.client.purgeChannel(this.message.channel.id, lines3).then(total => asign(total));
            await this.client.purgeChannel(this.message.channel.id, lines3).then(total => asign(total));
            await this.client.purgeChannel(this.message.channel.id, lines3).then(total => asign(total));
        } else if(lines > 751 && lines < 1001) {
            let lines4 = Math.floor(lines/4);
            await this.client.purgeChannel(this.message.channel.id, lines4).then(total => asign(total));
            await this.client.purgeChannel(this.message.channel.id, lines4).then(total => asign(total));
            await this.client.purgeChannel(this.message.channel.id, lines4).then(total => asign(total));
            await this.client.purgeChannel(this.message.channel.id, lines4).then(total => asign(total));
        } else {
            await this.client.purgeChannel(this.message.channel.id, lines).then(total => asign(total));
        }

        return count;
    }
}

export = purgeCommand;