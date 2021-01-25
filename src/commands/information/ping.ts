class pingCommand extends (require('../../base/command')) {
    constructor() {
        super({
            name: "ping",
            description: "Get information about latency.",
            aliases: ["latency"],
            category: "information",
            usage: "<ping>",
            default_cooldown: 1000,
            premium_cooldown: 500,
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
        let messageEdited = await message.channel.send({
            embed: {
                description: `Pong!!`,
                color: message.guild.color
            }
        });

        let dashboardLatency = null;

        return messageEdited.edit({
            embed: {
                description: `Client: **${message.guild.shard.latency}**ms \nResponse: **${messageEdited.timestamp - Date.now()}**ms \nDashboard: **${dashboardLatency === null ? "Unavailable" : "No response"}**`,
                color: message.guild.color
            }
        }); 
    }
}

export = pingCommand;