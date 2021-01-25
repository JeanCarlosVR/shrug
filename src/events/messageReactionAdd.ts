import guildSchema from "../database/models/guild";
import Collection from "../utils/Collection";

class messageReactionAddEvent extends (require("../base/event")) {

    protected client;

    constructor(client) {
        super({
            name: "message reaction add",
            event_name: "messageReactionAdd",
            priority: 0,
            deprecated: false,
            premium: false,
            canary: false
        });

        this.client = client;

        return;
        this.client.on("messageReactionAdd", async (message, emoji, userID) => {

            if(message.channel.guild.members.get(userID).bot === true) return;

            const messageObject = await this.client.getMessage(message.channel.id, message.id);
            if(messageObject.author.id === userID) return;
            if(messageObject.timestamp > (1000 * 60 * 60 * 24 * 7)) return;

            let guild = await guildSchema.findOne({ id: message.guildID });
            if(messageObject.reactions && messageObject.reactions["⭐"] && messageObject.reactions["⭐"].count >= guild.services.starboard.minimum) {

                if(!guild) return;
                if(guild.preferences.ignored === true) return;

                if(this.client.starboard.get(message.channel.guild.id) && this.client.starboard.get(message.channel.guild.id).actives[messageObject.id]) return;

                this.client.starboard.set(message.channel.guild.id, { "actives": { [messageObject.id]: {
                    timestamp: messageObject.timestamp
                }}});

                setTimeout(async () => {
                    try {
                        const newMessageObject = await this.client.getMessage(message.channel.id, messageObject.id);

                        let content;
                        if(newMessageObject.length <= 0) content = "Embed"
                        if(!newMessageObject || (newMessageObject && Object.keys(newMessageObject.reactions).length <= guild.services.starboard.minimum)) return;
                        let messageLogged = await message.channel.guild.channels.get(guild.services.starboard.channel).send({
                            embed: {
                                author: {
                                    name: "Message Starry"
                                },
                                description: `New message starry with **${newMessageObject.reactions["⭐"].count}** ⭐ [\`Go to message\`](https://discord.com/channels/${message.channel.guild.id}/${message.channel.id}/${newMessageObject.id}/).`,
                                fields: [
                                    {
                                        name: "Author",
                                        value: `<@!${newMessageObject.author.id}>`,
                                        inline: true
                                    },
                                    {
                                        name: "Date",
                                        value: `${this.client.utils.functions.date(newMessageObject.timestamp, guild.preferences.lang)}`,
                                        inline: true
                                    },
                                    {
                                        name: "Content",
                                        value: `\`${newMessageObject.content.slice(0, 1024)}\``,
                                        inline: false
                                    },
                                ],
                                color: guild.preferences.color
                            }
                        });
                        await messageLogged.addReaction("⭐");
                        this.client.starboard.delete(message.channel.guild.id, { actives: { [newMessageObject.id]: Object } });
                    } catch {
                        return;
                    }
                }, guild.services.starboard.time);
            }
        });
    }
}

export = messageReactionAddEvent;