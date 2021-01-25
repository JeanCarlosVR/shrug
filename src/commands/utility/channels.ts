class channelsCommand extends (require('../../base/command')) {
    constructor() {
        super({
            name: "channels",
            description: "See all channels in nice structure.",
            aliases: [],
            category: "utility",
            usage: "<channels>",
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

        const spacer = " ‍  ‍ "
        const channelType = {
            0: `${spacer}(💬)`,
            2: `${spacer}(🔊)`,
            4: `(⤵️)`,
            5: `${spacer}(📢)`
        }

        const missingChannels = message.guild.channels.filter(channel => channel.parentID === null && channel.type !== 4).map(channel => `${message.guild.channels.filter(channel => channel.parentID === null).length > 0 ? `${channelType[channel.type] || "(❓)"} ${channel.name}` : "0 Channels"}`).join("\n");
        const structure = message.guild.channels.filter(channel => channel.type === 4 || channel.parentID !== null).map(channel => `${channelType[channel.type] || "(❓)"} ${channel.name}`).join("\n");
        
        return message.channel.send(`\`\`\`\nChannels Without Category\n${missingChannels}\nCategories\n${structure}\n\`\`\``); 
    }
}

export = channelsCommand;