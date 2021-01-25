import { continuousListener } from '../../utils/ReactionManager';

class langCommand extends (require('../../base/command')) {

    protected message;
    protected client;
    protected lang;
    protected embedSelectorLang;
    protected closeReactionTimeout;

    constructor() {
        super({
            name: "lang",
            description: "Set up a better language for your guild.",
            aliases: ["setlang"],
            category: "preferences",
            usage: "<lang>",
            default_cooldown: 35000,
            premium_cooldown: 25000,
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

        let embedSelectorLang = await message.channel.send({
            embed: {
                description: `Loading...`,
                footer: {
                    text: `${lang.commands.lang.canceled_until} | 2 ${lang.commands.lang.attempts}`
                },
                color: message.guild.color
            } 
        });

        for await(let flag of client.utils.langs_flags) {
            try {
                await embedSelectorLang.addReaction(flag).catch(() => { return false; });
            } catch {
                return;
            }
        }

        embedSelectorLang = await embedSelectorLang.edit({
            embed: {
                description: `🇺🇸 English | English \n🇪🇸 Español | Spanish \n🇨🇳 中文 | Chinese \n🇵🇹 Português | Portuguese \n🇫🇷 Français | French \n🇮🇳 नहीं। | Hindi \n🇹🇷 Hayır | Turk \n🇷🇺 Pусский | Russian \n🇩🇪 Deutsche | German \n🇯🇵 日本人 | Japanese \n🇸🇦 عرب | Arabian`,
                footer: {
                    text: `${lang.commands.lang.canceled_until} | 2 ${lang.commands.lang.attempts}`
                },
                color: message.guild.color
            } 
        });
        this.embedSelectorLang = embedSelectorLang;

        const closeReactionTimeout = setTimeout(async () => {
            await embedSelectorLang.removeReactions();
            await embedSelectorLang.edit({
                embed: {
                    description: "¯\\_(ツ)_/¯",
                    color: message.guild.color
                }
            })
        }, 30000);
        this.closeReactionTimeout = closeReactionTimeout;

        let reactionViewer = new continuousListener(embedSelectorLang, (userID) => userID === message.author.id, false, { maxMatches: 2, time: 30000, passedReactions: client.utils.langs_flags });

        reactionViewer.on("reacted", async (reaction) => {
            switch (reaction.emoji.name) {
                case "🇺🇸":
                    await this.mainLang(0, "English");
                    break;
                case "🇪🇸":
                    await this.mainLang(1, "Español");
                    break;
                case "🇨🇳":
                    await this.mainLang(2, "中文");
                    break;
                case "🇵🇹":
                    await this.mainLang(3, "Português");
                    break;
                case "🇫🇷":
                    await this.mainLang(4, "French")
                    break;
                case "🇮🇳":
                    await this.mainLang(5, "नहीं।");
                    break
                case "🇹🇷":
                    await this.mainLang(6, "Hayır");
                    break;
                case "🇷🇺":
                    await this.mainLang(7, "Pусский");
                    break;
                case "🇩🇪":
                    await this.mainLang(8, "Deutsche");
                    break;
                case "🇯🇵":
                    await this.mainLang(9, "日本人");
                    break;
                case "🇸🇦":
                    await this.mainLang(10, "عرب");
                    break; 
            }
        });
    }

    public async mainLang(langToNum, langToStr) {
        try {
            clearTimeout(this.closeReactionTimeout)
            await (require("../../database/models/guild")).findOneAndUpdate({ id: this.message.guild.id }, { $set: { "preferences.lang": langToNum }});

            let requiredLang = require(`../../../resources/langs/${this.client.utils.langsFormat.strings[langToNum]}.json`);
            return this.embedSelectorLang.edit({
                embed: {
                    description: `${requiredLang.commands.lang.changed_to} \`${langToStr}\``,
                    color: this.message.guild.color
                }
            });
        } catch(e) {
            console.log(e)
            return this.message.channel.send({
                embed: {
                    description: `${this.lang.global.unexpected_error} **ERROR**: \`0x14nRq\``,
                    color: this.client.utils.colors.error
                }
            });
        }
    }
}

export = langCommand;