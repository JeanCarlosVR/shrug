import { continuousListener } from '../../utils/ReactionManager';

class colorCommand extends (require('../../base/command')) {

    protected message;
    protected client;
    protected lang;
    protected embedSelectorColor;

    constructor() {
        super({
            name: "color",
            description: "Set up a better color for your guild.",
            aliases: ["setcolor"],
            category: "preferences",
            usage: "<color>",
            default_cooldown: 35000,
            premium_cooldown: 18000,
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
        this.lang = lang;

        const heartsColor = ["❤️", "🧡", "💛", "💚", "💜", "💙", "🖤"];

        let embedSelectorColor = await message.channel.send({
            embed: {
                description: `Loading...`,
                footer: {
                    text: `${lang.commands.lang.canceled_until} | 2 ${lang.commands.lang.attempts}`
                },
                color: message.guild.color
            } 
        });

        for await(let color of heartsColor) {
            try {
                await embedSelectorColor.addReaction(color).catch(() => { return false; });
            } catch {
                return;
            }
        }

        embedSelectorColor = await embedSelectorColor.edit({
            embed: {
                description: `"The word is most beatiful with colors"`,
                footer: {
                    text: `${lang.commands.lang.canceled_until} | 3 ${lang.commands.lang.attempts}`
                },
                color: message.guild.color
            } 
        });
        this.embedSelectorLang = embedSelectorColor;
        let reactionViewer = new continuousListener(embedSelectorColor, (userID) => userID === message.author.id, false, { maxMatches: 3, time: 35000, passedReactions: heartsColor });

        reactionViewer.on("reacted", async (reaction) => {
            switch (reaction.emoji.name) {
                case "❤️":
                    await this.mainColor(0xFF0000, "❤️");
                    break;
                case "🧡":
                    await this.mainColor(0xF2A457, "🧡");
                    break;
                case "💛":
                    await this.mainColor(0xDBF257, "💛");
                    break;
                case "💚":
                    await this.mainColor(0x4ECB5F, "💚");
                    break;
                case "💜":
                    await this.mainColor(0xB883F0, "💜");
                    break;
                case "💙":
                    await this.mainColor(0x4BC7DF, "💙");
                    break;
                case "🖤":
                    await this.mainColor(0x010101, "🖤");
                    break;
            }
        });
    }

    public async mainColor(colorInt, string) {
        try {
            await (require("../../database/models/guild")).findOneAndUpdate({ id: this.message.guild.id }, { $set: { "preferences.color": colorInt }});

            return this.embedSelectorLang.edit({
                embed: {
                    description: `${this.lang.commands.color.changed_to} \`${string}\``,
                    color: colorInt
                }
            });
        } catch(error) {

            return this.message.channel.send({
                embed: {
                    description: `${this.lang.global.unexpected_error} **ERROR**: \`0x15nXq\``,
                    color: this.client.utils.colors.error
                }
            });
        }
    }
}

export = colorCommand;