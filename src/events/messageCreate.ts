import guildSchema from "../database/models/guild";
import { client_users_with_admin_perms } from '../config';

class messageCreateEvent extends (require("../base/event")) {

    protected client;

    constructor(client) {
        super({
            name: "message create",
            event_name: "messageCreate",
            priority: 0,
            deprecated: false,
            premium: false,
            canary: false
        });

        this.client = client;

        this.client.on("messageCreate", async (message) => {
            if (message.author.bot) return;

            let guild = await guildSchema.findOne({ id: message.guildID });

            if(!guild) return;
            if(guild.preferences.ignored === true) return;

            let prefix = guild.preferences.prefix;
            if(!message.content.startsWith(prefix)) return;
            
            let lang = "en_US";

            message.guild = message.channel.guild;

            message.guild.lang = guild.preferences.lang || 0;
            message.guild.prefix = guild.preferences.prefix || "!";
            message.guild.color = guild.preferences.color || 0xF1F1F1;
            message.guild.services = Object;
            message.guild.services.tags = guild.services.tags;

            try {
                lang = this.client.utils.langsFormat.strings[message.guild.lang]; 
            } catch {
                lang = lang;
            }

            let args = message.content.slice(prefix.length).trim().split(/ +/);
            let command = args.shift().toLowerCase();
            let cmd = this.client.commands.get(command) || this.client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(command));

            if(prefix && cmd && cmd.help && cmd.run && !cmd.help.disabled) {
                const developmentAccess = client_users_with_admin_perms.includes(message.author.id);
                message.author.developer = developmentAccess;

                if(message.author.developer !== true){
                    if(cmd.help.development === true && developmentAccess === false) return;
                    if(cmd.help.canary === true && guild.preferences.canary === false) return;

                    let _cooldown = cmd.help.default_cooldown || 6000;
                    if(guild.preferences.premium === true) {
                        _cooldown = cmd.help.premium.cooldown || 3000;
                    } else if(cmd.help.development === true){
                        _cooldown = 0;
                    }
                    let cooldown_guild = await this.client.cooldown.get(message.guild.id) ? this.client.cooldown.get(message.guild.id) : null;

                    if(cooldown_guild && cooldown_guild[message.author.id] && cooldown_guild[message.author.id][cmd.help.name]){
                        if(cooldown_guild[message.author.id][cmd.help.name].response === false) return;
                        await this.client.cooldown.set(message.guildID, { [message.author.id]: { [cmd.help.name]: { response: false } } });
                        return message.channel.send(`${(this.client.langs.get(lang) || this.client.langs.get("en_US")).global.cooldown} **${this.client.utils.functions.format((cooldown_guild[message.author.id][cmd.help.name].timestamp + _cooldown) - Date.now(), guild.preferences.lang, { maxDecimals: 1, round: false })}**.`);
                    } else {
                        this.client.cooldown.set(message.guild.id, {});
                        if((cooldown_guild && !cooldown_guild[message.author.id]) || (cooldown_guild && !(cooldown_guild[message.author.id] && cooldown_guild[message.author.id][cmd.help.name]))) {
                            await this.client.cooldown.set(message.guildID, { [message.author.id]: { [cmd.help.name]: { timestamp: Date.now(), type: 0, premium: false, response: true } }});
                            
                            setTimeout(() => {
                                this.client.cooldown.delete(message.guildID, [message.author.id][cmd.help.name]);
                            }, _cooldown);
                        }
                    }     
                }

                return cmd.run(this.client, message, args, (this.client.langs.get(lang) || this.client.langs.get("en_US")));
            }
        });
    }
}

export = messageCreateEvent;