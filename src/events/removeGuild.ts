import guildSchema from "../database/models/guild";

class removeGuildEvent extends (require("../base/event")) {

    protected client;

    constructor(client) {
        super({
            name: "removeGuild",
            event_name: "removeGuild",
            priority: 0,
            deprecated: false,
            premium: false,
            canary: false
        });

        this.client = client;

        this.client.on("removeGuild", async (guild) => {
            if((async() => await guildSchema.findOne({ id: guild.id }))) {
                await guildSchema.findOneAndDelete({ id: guild.id });
            };
        });
    }
}

export = removeGuildEvent;