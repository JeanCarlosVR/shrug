class messageDeleteEvent extends (require("../base/event")) {

    protected client;

    constructor(client) {
        super({
            name: "message update",
            event_name: "messageUpdate",
            priority: 0,
            deprecated: false,
            premium: false,
            canary: false
        });

        this.client = client;

        this.client.on("messageUpdate", async (message) => {
            if(!message.content || (message.content && message.content.length < 1)) return;
            this.client.snipes.set(message.guildID, { update: { [message.channel.id]: { id: message.id, author: message.author.id, content: message.content, timestamp: Date.now() } } });
        });
    }
}

export = messageDeleteEvent;