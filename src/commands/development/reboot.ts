class rebootCommand extends (require('../../base/command')) {
    constructor() {
        super({
            name: "reboot",
            description: null,
            aliases: ["restart", "reload"],
            category: "development",
            usage: "<reboot> <id>",
            default_cooldown: 0,
            premium_cooldown: 0,
            disabled: false,
            development: true,
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

        if(message.author.id !== "525842461655040011") return;

        await message.channel.send("Bye!");
        return client.utils.ipc.sendTo(0, "restart", { name: "restart" });
    }
}

export = rebootCommand;