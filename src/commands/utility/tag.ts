import guild from "../../database/models/guild";

class tagCommand extends (require('../../base/command')) {

    protected client;
    protected message;
    protected args;
    protected lang;
    protected tagFounded;

    constructor() {
        super({
            name: "tag",
            description: "Tag to get information.",
            aliases: [],
            category: "utility",
            usage: "<tag> <action[create|delete|transfer|rename|(list)|(tagName)]> <argument[name]> <argument2[description|member|newName]>",
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

        this.client = client;
        this.message = message;
        this.args = args;
        this.lang = lang;

        if(!args[0]) {
            return message.channel.createMessage({
                embed: {
                    description: `You need specify any action to execute. \`${this.help.usage}\``,
                    color: this.message.guild.color
                }
            });
        }

        switch(args[0].toLowerCase()) {
            case "create":
                this.createTag();
                break;
            case "delete":
                this.deleteTag();
                break;
            case "list":
                this.tagList();
                break;
            case "transfer":
                this.transferOwnership();
                break;
            case "search":
                this.searchTag();
                break;
            case "rename":
                this.renameTag();
                break;
            default:
                const tagFounded = this.findExistingTag(args[0]);
                if(!tagFounded) {
                    return message.channel.createMessage({
                        embed: {
                            description: `Unknown tag.`,
                            color: message.guild.color
                        }
                    });
                }

                return message.channel.createMessage({
                    embed: {
                        author: {
                            name: `${tagFounded.name}`
                        },
                        description: tagFounded.description,
                        color: message.guild.color
                    }
                });
        }
    }

    public async createTag() {
        if(!this.args[1]) {
            return this.message.channel.createMessage({
                embed: {
                    description: `You need specify the name of tag. \`${this.help.usage}\``,
                    color: this.message.guild.color
                }
            });
        }

        if(this.findExistingTag(this.args[1])) {
            return this.message.channel.createMessage({
                embed: {
                    description: `This tag name already exist.`,
                    color: this.message.guild.color
                }
            });
        }

        if(!this.args[2]) {
            return this.message.channel.createMessage({
                embed: {
                    description: `You need specify the description of tag. \`${this.help.usage}\``,
                    color: this.message.guild.color
                }
            });
        }

        const tag = this.tagConstructor({
            name: this.args[1],
            description: this.args[2],
            author: {
                id: this.message.author.id,
                permissions: this.message.member.permission
            },
            ownership: this.message.author.id,
            channel: {
                id: this.message.channel.id
            }
        });

        try {
            await guild.findOneAndUpdate({ id: this.message.guild.id }, { $push: { "services.tags.tagList": tag } });
            await this.message.channel.createMessage({
                embed: {
                    description: `New tag created \`${this.args[1].toLowerCase()}\`.`,
                    color: this.message.guild.color
                }
            })
        } catch {
            return this.message.channel.createMessage({
                embed: {
                    description: `${this.lang.global.unexpected_error} **ERROR**: \`0x47lYu\``,
                    color: this.client.utils.colors.error
                }
            });
        }
    }

    public async deleteTag() {

        if(!this.args[1]) {
            return this.message.channel.createMessage({
                embed: {
                    description: `You need provide any tag name or alias.`,
                    color: this.message.guild.color
                }
            });
        }

        let tag = this.findExistingTag(this.args[1]);

        if(!tag) {
            return this.message.channel.createMessage({
                embed: {
                    description: `This tag doesn't exist.`,
                    color: this.message.guild.color
                }
            });
        }

        if(!this.message.member.permission.has("administrator")) {
            if(tag.ownership !== this.message.author.id) {
                return this.message.channel.createMessage({
                    embed: {
                        description: `You cant delete this tag because you not have the ownership of this tag, or you don't have either \`ADMINISTRATOR\` permissions.`,
                        color: this.message.guild.color
                    }
                });
            }
        }

        try {
            await guild.findOneAndUpdate({ id: this.message.guild.id }, { $pull: { "services.tags.tagList": { name: this.args[1].toLowerCase() } } });
        } catch {
            return this.message.channel.createMessage({
                embed: {
                    description: `This tag doesn't exist.`,
                    color: this.message.guild.color
                }
            });
        }

        return this.message.channel.createMessage({
            embed: {
                description: `The tag identified with the name \`${this.args[1].toLowerCase()}\` has been deleted.`,
                color: this.message.guild.color
            }
        });
    }

    public async renameTag() {

        if(!this.args[1]) {
            return this.message.channel.createMessage({
                embed: {
                    description: `You need provide any tag name or alias.`,
                    color: this.message.guild.color
                }
            });
        }

        const olderTag = this.findExistingTag(this.args[1]);
        if(!olderTag) {
            return this.message.channel.createMessage({
                embed: {
                    description: `Unknown tag.`,
                    color: this.message.guild.color
                }
            });
        } else if(olderTag.ownership !== this.message.author.id) {
            return this.message.channel.createMessage({
                embed: {
                    description: `You not are owner of this tag.`,
                    color: this.message.guild.color
                }
            });
        } else if(!this.args[2]) {
            return this.message.channel.createMessage({
                embed: {
                    description: `You need specify the new name of tag.`,
                    color: this.message.guild.color
                }
            });
        } else if(this.findExistingTag(this.args[2])) {
            return this.message.channel.createMessage({
                embed: {
                    description: `This tag name already exist.`,
                    color: this.message.guild.color
                }
            });
        }

        const newestTag = {
            name: this.args[2].toLowerCase(),
            id: olderTag.createdTimestamp.id,
            aliases: olderTag.aliases,
            description: olderTag.description,
            author: olderTag.author,
            ownership: olderTag.ownership,
            channel: olderTag.channel,
            createdTimestamp: olderTag.createdTimestamp,
            editedTimestamp: Date.now()
        };

        try {
            await guild.findOneAndUpdate({ id: this.message.guild.id }, { $pull: { "services.tags.tagList": { name: olderTag.name } } });
            await guild.findOneAndUpdate({ id: this.message.guild.id }, { $push: { "services.tags.tagList": newestTag } });
            return this.message.channel.createMessage({
                embed: {
                    description: `The name of __${olderTag.name}__ has been changed to __${newestTag.name}__.`,
                    color: this.message.guild.color
                }
            });
        } catch {
            return this.message.channel.createMessage({
                embed: {
                    description: `${this.lang.global.unexpected_error} **ERROR**: \`0xMqP1I\``,
                    color: this.client.utils.colors.error
                }
            });
        }
    }

    public async transferOwnership() {

        if(!this.args[1]) {
            return this.message.channel.createMessage({
                embed: {
                    description: `You need provide any tag name or alias.`,
                    color: this.message.guild.color
                }
            });
        }

        let olderTag = this.findExistingTag(this.args[1]);
        if(!olderTag) {
            return this.message.channel.createMessage({
                embed: {
                    description: `Unknown tag.`,
                    color: this.message.guild.color
                }
            });
        } else if(olderTag.ownership !== this.message.author.id) {
            return this.message.channel.createMessage({
                embed: {
                    description: `You not are owner of this tag.`,
                    color: this.message.guild.color
                }
            });
        } else if(!this.args[2]) {
            return this.message.channel.createMessage({
                embed: {
                    description: `You need specify the member to give the ownership of this tag.`,
                    color: this.message.guild.color
                }
            });
        }

        let newOwner = this.client.utils.functions.resolveUser(this.message.guild.members, this.args.slice(2).join(" "));
        if(!newOwner) {
            return this.message.channel.createMessage({
                embed: {
                    description: `Unknown member in this guild.`,
                    color: this.message.guild.color
                }
            });
        }

        if(newOwner.bot === true) {
            return this.message.channel.createMessage({
                embed: {
                    description: `You cant transfer tags to bots.`,
                    color: this.message.guild.color
                }
            });
        }

        let newestTag = olderTag;
        newestTag.editedTimestamp = Date.now();
        newestTag.ownership = newOwner.id;

        await guild.findOneAndUpdate({ id: this.message.guild.id }, { $pull: { "services.tags.tagList": { name: olderTag.name } } });
        await guild.findOneAndUpdate({ id: this.message.guild.id }, { $push: { "services.tags.tagList": newestTag } });
        return this.message.channel.createMessage({
            embed: {
                description: `The ownership of this tag has been transfered to <@!${newOwner.id}>.`,
                color: this.message.guild.color
            }
        });
    }

    public async tagList() {
        let tagsFormatted = this.message.guild.services.tags.tagList.map(tag => `**-** __${tag.name}__ [${tag.aliases.map(alias => `*${alias}*`).join("|")}]`).join("\n");
        return this.message.channel.createMessage({
            embed: {
                author: {
                    name: `Total tags in [ ${this.message.guild.name} ]`
                },
                description: `${tagsFormatted.slice(0, 2048)}`,
                footer: {
                    text: `${this.message.guild.services.tags.tagList.length} Tags`
                },
                color: this.message.guild.color
            }
        });
    }

    public searchTag() {

        if(!this.args[1]) {
            return this.message.channel.createMessage({
                embed: {
                    description: `You need provide any tag name or alias.`,
                    color: this.message.guild.color
                }
            });
        }

        let tag = this.findExistingTag(this.args[1]);
        if(!tag) {
            return this.message.channel.createMessage({
                embed: {
                    description: `Unknown tag.`,
                    color: this.message.guild.color
                }
            });
        }

        return this.message.channel.createMessage({
            embed: {
                fields: [
                    {
                        name: `${this.lang.global.word.name}`,
                        value: `${tag.name}`,
                        inline: true
                    },
                    {
                        name: `${this.lang.global.word.id}`,
                        value: `${tag.id}`,
                        inline: true
                    },
                    {
                        name: `‏‏‎ ‎`,
                        value: `‏‏‎ ‎`,
                        inline: true
                    },
                    {
                        name: `${this.lang.commands.snipe.author}`,
                        value: `<@!${tag.author.id}>`,
                        inline: true
                    },
                    {
                        name: `${this.lang.global.word.owner}`,
                        value: `<@!${tag.ownership}>`,
                        inline: true
                    },
                    {
                        name: `‏‏‎ ‎`,
                        value: `‏‏‎ ‎`,
                        inline: true
                    },
                    {
                        name: `‏‏‎Aliases`,
                        value: `‏‏‎${tag.aliases.length < 1 ? "None" : tag.aliases.map(alias => `\`${alias}\``).join(", ")}`,
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
                    {
                        name: `${this.lang.global.word.created_at}`,
                        value: `‏‏‎${this.client.utils.functions.format(tag.createdTimestamp - Date.now(), this.message.guild.lang)}`,
                        inline: true
                    },
                    {
                        name: `Last Edited‎`,
                        value: `‏‏‎${tag.editedTimestamp !== 0 ? this.client.utils.functions.format(tag.editedTimestamp - Date.now(), this.message.guild.lang) : "Never"}`,
                        inline: true
                    },
                    {
                        name: `‏‏‎ ‎`,
                        value: `‏‏‎ ‎`,
                        inline: true
                    },
                ],
                color: this.message.guild.color
            }
        });
    }

    public findExistingTag(argument) {
        let tag = this.message.guild.services.tags.tagList.find(tag => tag.name === argument.toLowerCase());
        if(!tag) tag = this.message.guild.services.tags.tagList.find(tag => tag.aliases.includes(argument.toLowerCase()))
        return tag;
    }

    public tagConstructor(options) {
        return {
            name: options.name.toLowerCase(),
            id: (Math.random() * 1000000000000000000),
            aliases: [],
            description: options.description,
            author: options.author,
            ownership: options.ownership,
            channel: options.channel,
            createdTimestamp: Date.now(),
            editedTimestamp: 0
        }
    }
}

export = tagCommand;