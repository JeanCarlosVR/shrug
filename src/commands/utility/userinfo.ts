class userInfoCommand extends (require('../../base/command')) {
    constructor() {
        super({
            name: "user",
            description: "Get useful data about any user.",
            aliases: ["userinfo"],
            category: "utility",
            usage: "<user> [member]",
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

        const statues: Object = {
            "dnd": "No Disturb",
            "online": "Online",
            "idle": "AFK",
            "offline": "Offline",
            "streaming": "Streaming"
        }

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
                fields: [
                    {
                        name: `‏‏${lang.global.word.id}`,
                        value: `${userTarget.user.id}`,
                        inline: true
                    },
                    {
                        name: `‏‏${lang.global.word.username}`,
                        value: `${userTarget.user.username}`,
                        inline: true
                    },
                    {
                        name: `‏‏‎ ‎`,
                        value: `‏‏‎ ‎`,
                        inline: true
                    },
                    {
                        name: `‏‏${lang.global.word.status}`,
                        value: `${userTarget.status ? statues[userTarget.status] : "Offline"}`,
                        inline: true
                    },
                    {
                        name: `Bot`,
                        value: `${userTarget.bot === true ? "Yes" : "No"}`,
                        inline: true
                    },
                    {
                        name: `"Official System"`,
                        value: `‏‏‎${userTarget.user.system ? "Yes" : "No"}`,
                        inline: true
                    },
                    {
                        name: `Boosting ${lang.global.word.since}`,
                        value: `${userTarget.premiumSince === null ? "No" : userTarget.premiumSince}`,
                        inline: false
                    },
                    {
                        name: `‏‏${lang.global.word.nickname}`,
                        value: `‏‏‎${userTarget.nick === null ? "None" : userTarget.nick}‎`,
                        inline: true
                    },
                    {
                        name: `‏‏${lang.commands.user_info.joined_since}`,
                        value: `‏‏‎${client.utils.functions.format(userTarget.joinedAt - Date.now(), message.guild.lang)}‎`,
                        inline: true
                    },
                    {
                        name: `‏‏‎ ‎`,
                        value: `‏‏‎ ‎`,
                        inline: true
                    },
                    {
                        name: `‏‏${lang.global.word.activity}`,
                        value: `‏‏‎${(userTarget.activities && userTarget.activities.length > 0 ? `**${userTarget.activities[0].name ? userTarget.activities[0].name : ""}**: ${userTarget.activities[0].state ? userTarget.activities[0].state : ""} (${lang.global.word.listening} ${lang.global.word.since} ${userTarget.activities[0].created_at ? client.utils.functions.format(userTarget.activities[0].created_at - Date.now(), message.guild.lang) : ""}) ${userTarget.activities[0].type === 2 ? `[\`Listen Now\`](https://open.spotify.com/track/${userTarget.activities[0].sync_id}/)` : ""}` : "None") || "None"}`,
                        inline: false
                    },
                    {
                        name: `‏‏${lang.global.word.roles}`,
                        value: `‏‏‎${userTarget.roles.length > 0 ? userTarget.roles.map(role => `<@&${role}>`) : "None"}`,
                        inline: false
                    },
                ],
                color: message.guild.color
            }
        }); 
    }
}

export = userInfoCommand;