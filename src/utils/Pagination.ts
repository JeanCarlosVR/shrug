import { continuousListener } from './ReactionManager';

class Pagination {

    protected message;
    protected page;
    protected embeds;
    protected firstEmbedID;
    protected reactions;

    protected id;

    public constructor(message, embeds, firstEmbedID) {
        this.message = message;
        this.embeds = embeds;
        this.firstEmbedID = firstEmbedID;

        this.id = this.embeds[this.firstEmbedID].id;
        this.reactions = ["⏮", "⏪", "⏹️", "⏩", "⏭️", "ℹ"];
    }

    public async render(): Promise<void> {
        this.embeds[this.firstEmbedID].footer = {
            text: `Page ${this.id + 1}/${this.embeds.length}`
        }

        let renderMessage = await this.message.channel.createMessage({
            embed: {
                description: `Loading...`,
                color: this.message.guild.color
            }
        });
        this.page = renderMessage;

        for await(let emoji of this.reactions){
            await renderMessage.addReaction(emoji);
        }

        await renderMessage.edit({
            embed: this.embeds[this.firstEmbedID]
        });

        const reactionViewer = new continuousListener(renderMessage , (userID) => userID === this.message.author.id, false, { maxMatches: 250, time: 60000, passedReactions: this.reactions });
        reactionViewer.on("reacted", async (reaction) => {
            try {
                await renderMessage.removeReaction(reaction.emoji.name, reaction.userID);
                switch (reaction.emoji.name) {
                    case "⏩":
                        if((this.id + 1) >= (this.embeds.length)) return;
                        this.id += 1;

                        this.embeds[this.id].footer = {
                            text: `Page ${this.id + 1}/${this.embeds.length}`
                        };

                        renderMessage.edit({
                            embed: this.embeds[this.id]
                        }); 
                        break;
                    case "⏪":
                        if((this.id - 1) < 0) return;
                        this.id = this.id - 1;

                        this.embeds[this.id].footer = {
                            text: `Page ${this.id + 1}/${this.embeds.length}`
                        };

                        renderMessage.edit({
                            embed: this.embeds[this.id]
                        }); 
                        break;
                    case "⏮":
                        this.id = this.firstEmbedID;

                        this.embeds[this.id].footer = {
                            text: `Page ${this.id + 1}/${this.embeds.length}`
                        };

                        renderMessage.edit({
                            embed: this.embeds[this.firstEmbedID]
                        }); 
                        break;
                    case "⏭️":
                        this.id = this.embeds.length - 1;

                        this.embeds[this.id].footer = {
                            text: `Page ${this.id + 1}/${this.embeds.length}`
                        };

                        renderMessage.edit({
                            embed: this.embeds[this.id]
                        }); 
                        break;
                    case "⏹️":
                        renderMessage.delete();
                        break;
                    case "ℹ":
                        this.id = 0;
                        renderMessage.edit({
                            embed: {
                                description: `⏮ Go to first page.\n⏪ Turn a page back.\n⏹️ Stop pagination.\n⏩ Turn a page next.\n⏭️ Go to last page.\nℹ Show this page.`,
                                color: this.message.guild.color
                            },
                            footer: {
                                text: `Page help/${this.embeds.length}`
                            }
                        });
                }
            } catch {
                return;
            }
        });
    }

    public toJSON() {
        return {
            message: this.message,
            page: this.page,
            embeds: this.embeds,
            firstEmbedID: this.firstEmbedID,
            actualPageID: this.id,
            filters: {
                user: this.message.author.id,
                reactions: this.reactions
            }
        }
    }

    public toString() {
        return `[Pagination ${this.message.id}]`
    }
}

export = Pagination;