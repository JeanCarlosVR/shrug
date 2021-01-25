class avatarCommand extends (require('../../base/command')) {
    constructor() {
        super({
            name: "avatar",
            description: "Get the avatar from user.",
            aliases: ["av", "profileimg", "pfp"],
            category: "utility",
            usage: "<avatar> [member]",
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

        let userTarget;
        if(args[0]) {
            if(message.mentions[0]) {
                userTarget = message.guild.members.get(message.mentions[0].id)
            }
            let findUser = client.utils.functions.resolveUser(message.guild.members, args.join(" "));
            if(findUser) {
                userTarget = message.guild.members.get(findUser.id);
            } else {
                return message.channel.send({
                    embed: {
                        description: "Unknown user.",
                        color: message.guild.color
                    }
                })
            }
        } else {
            userTarget = message.member;
        }

        return message.channel.send({
            embed: {
                author: {
                    name: `${userTarget.user.username}`,
                    icon_url: `https://cdn.discordapp.com/avatars/${userTarget.user.id}/${userTarget.user.avatar}.png`
                },
                description: `[\`2048px\`](https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=2048) | [\`1024px\`](https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=1024) | [\`512px\`](https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512) | [\`256px\`](https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=256) | [\`128px\`](https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=128) | [\`64px\`](https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=64)`,
                image: {
                    url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=2048`
                },
                color: message.guild.color
            }
        }); 
    }
}

export = avatarCommand;