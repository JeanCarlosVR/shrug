class guildInfoCommand extends (require('../../base/command')) {
    constructor() {
        super({
            name: "guild",
            description: "Get useful data about actual guild.",
            aliases: ["guildinfo", "serverinfo", "server"],
            category: "utility",
            usage: "<guild>",
            default_cooldown: 5000,
            premium_cooldown: 3500,
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

        const regions: Object = {
            "us-west": "🇺🇸 USA West",
            "us-east": "🇺🇸 USA East",
            "us-central": "🇺🇸 USA Central",
            "us-south": "🇺🇸 USA South",
            "singapore": "🇸🇬 Singapore",
            "southafrica": "🇿🇦 South Africa",
            "europe": "🇪🇺 Europe",
            "hongkong": "🇭🇰 Hong Kong",
            "russia": "🇷🇺 Russia",
            "japan": "🇯🇵 Japan",
            "india": "🇮🇳 India",
            "dubai": "🇦🇪 Dubai",
            "amsterdam": "🇳🇱 Amsterdam",
            "london": "🇬🇧 London",
            "frankfurt": "🇩🇪 Frankfurt",
            "eu-central": "🇪🇺 Europe Central",
            "eu-west": "🇪🇺 Europe West",
            "sydney": "🇦🇺 Sydney",
            "vip-us-east": "🇺🇸 USA East ***VIP***",
            "brazil": "🇧🇷 Brazil"
        };

        const features: Object = {
            "INVITE_SPLASH": "Invite Splash",
            "WELCOME_SCREEN_ENABLED": "Welcome Screen",
            "PUBLIC_DISABLED": "Disable Public",
            "BANNER": "Banner",
            "ANIMATED_ICON": "Animated Icon",
            "FEATURABLE": "Featurable",
            "DISCOVERABLE": "Discoverable",
            "NEWS": "News",
            "COMMERCE": "Commerce",
            "PUBLIC": "Public",
            "PARTNERED": "Partnered",
            "VERIFIED": "Verified",
            "VANITY_URL": "Vanity Url",
            "VIP_REGIONS": "Vip Regions",
            "COMMUNITY": "Community"
        };

        const verificationLevels: Object = {
            0: "❌",
            1: "Verified Email",
            2: "Registered on Discord for longer than 5 minutes",
            3: "Member for longer than 10 minutes",
            4: "Verified Phone"
        };

        const explicitContentFilters: Object = {
            0: "❌",
            1: `${lang.global.word.members} without ${lang.global.word.roles}`,
            2: "Everyone"
        };

        const mfaLevels: Object = {
            0: "❌",
            1: "✅"
        };

        const percentageMembers = Math.floor(((message.guild.memberCount / client.users.size) * 100));

        return message.channel.send({
            embed: {
                author: {
                    name: `${message.guild.name}`,
                    icon_url: `${message.guild.iconURL}`
                },
                fields: [
                    //Identification
                    {
                        name: `${lang.global.word.id}`,
                        value: `${message.guildID}`,
                        inline: true
                    },
                    {
                        name: `${lang.global.word.name}`,
                        value: `${message.guild.name}`,
                        inline: true
                    },
                    {
                        name: `${lang.global.word.owner}`,
                        value: `<@!${message.guild.ownerID}>`,
                        inline: true
                    },
                    // Location
                    {
                        name: `${lang.global.word.region}`,
                        value: `${regions[message.guild.region]}`,
                        inline: true
                    },
                    {
                        name: `${lang.global.word.lang}`,
                        value: `${message.guild.preferredLocale || "en-EN"}`,
                        inline: true
                    },
                    {
                        name: `‏‏‎ ‎`,
                        value: `‏‏‎ ‎`,
                        inline: true
                    },
                    //Dates
                    {
                        name: `${lang.global.word.created_at}`,
                        value: `${client.utils.functions.date(message.guild.createdAt, message.guild.lang)}`,
                        inline: true
                    },
                    {
                        name: `‏‏‎ ‎`,
                        value: `‏‏‎ ‎`,
                        inline: true
                    },
                    {
                        name: `‏‏‎ ‎`,
                        value: `‏‏‎ ‎`,
                        inline: true
                    },
                    //Security
                    {
                        name: `${lang.global.word.verification}`,
                        value: `${verificationLevels[message.guild.verificationLevel] || verificationLevels[0]}`,
                        inline: true
                    },
                    {
                        name: `${lang.commands.guild_info.explicit_content}`,
                        value: `${explicitContentFilters[message.guild.explicitContentFilter] || explicitContentFilters[0]}`,
                        inline: true
                    },
                    {
                        name: `MFA`,
                        value: `${mfaLevels[message.guild.mfaLevel] || mfaLevels[0]}`,
                        inline: true
                    },
                    //Stats
                    {
                        name: `${lang.commands.guild_info.on_numbers}`,
                        value: `**${message.guild.memberCount || 0}** / **250.000** ${lang.global.word.members} \n**${message.guild.channels.size || 0}** ${lang.global.word.channels} \n**${message.guild.roles.size || 0}** ${lang.global.word.roles} \n**${message.guild.emojis.length || 0}** ${lang.global.word.emojis} \n**${percentageMembers}%** of all users of ${client.user.username || "Jean"}`,
                        inline: true
                    },
                    {
                        name: `‏‏‎ ‎`,
                        value: `‏‏‎ ‎`,
                        inline: true
                    },
                    {
                        name: `‏‏‎ ‎`,
                        value: `‏‏‎ ‎`,
                        inline: true
                    },
                    //Channels
                    {
                        name: `‏‏‎${lang.commands.guild_info.rules_channel}`,
                        value: `‏‏‎${message.guild.rulesChannelID !== null ? `<#${message.guild.rulesChannelID}>` : "None"}`,
                        inline: true
                    },
                    {
                        name: `${lang.commands.guild_info.system_channel}`,
                        value: `‏‏‎${message.guild.systemChannelID !== null ? `<#${message.guild.systemChannelID}>` : "None"}`,
                        inline: true
                    },
                    {
                        name: `${lang.commands.guild_info.public_updates_channel}`,
                        value: `‏‏‎${message.guild.publicUpdatesChannelID !== null ? `<#${message.guild.publicUpdatesChannelID}>` : "None"}`,
                        inline: true
                    },
                    //Nitro
                    {
                        name: `‏‏‎Boost ${lang.global.word.level}`,
                        value: `‏‏‎${lang.global.word.level} **${message.guild.premiumTier}**`,
                        inline: true
                    },
                    {
                        name: `‏‏‎Boosters`,
                        value: `‏‏‎**${message.guild.premiumSubscriptionCount}** ${client.utils.emojis.boost}`,
                        inline: true
                    },
                    {
                        name: `‏‏‎ ‎`,
                        value: `‏‏‎ ‎`,
                        inline: true
                    },
                    //Features And More
                    {
                        name: `${lang.global.word.features}`,
                        value: `${message.guild.features.length > 0 ? message.guild.features.map(feature => features[feature]).join(", ") : "No Feature"}`,
                        inline: true
                    },
                    {
                        name: `Vanity URL (VIP)`,
                        value: `${message.guild.vanityURL !== null ? `**${message.guild.vanityURL}**` : "❌"}`,
                        inline: true
                    },
                    {
                        name: `‏‏‎ ‎`,
                        value: `‏‏‎ ‎`,
                        inline: true
                    }
                ],
                color: message.guild.color
            }
        }); 
    }
}

export = guildInfoCommand;