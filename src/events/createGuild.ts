import guildSchema from "../database/models/guild";

class createGuildEvent extends (require("../base/event")) {

    protected client;

    constructor(client) {
        super({
            name: "create guild",
            event_name: "createGuild",
            priority: 0,
            deprecated: false,
            premium: false,
            canary: false
        });

        this.client = client;

        this.client.on("createGuild", async (guild) => {
            if((async() => await guildSchema.findOne({ id: guild.id }))) {
                try {
                    let newGuildDocument = new guildSchema({
                        id: guild.id
                    });
                    await newGuildDocument.save();
                } catch(e) {
                    guild.leave()
                }
            };
        });
    }
}

export = createGuildEvent;