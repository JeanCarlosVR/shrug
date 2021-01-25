import Pagination from '../../utils/Pagination';

class testCommand extends (require('../../base/command')) {
    constructor() {
        super({
            name: "test",
            description: null,
            aliases: ["t"],
            category: "development",
            usage: "<test>",
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

        let responses = await message.channel.awaitMessages(m => m.content === "yes" && m.author.id === message.author.id, { time: 10000, maxMatches: 1 });
        if(responses.length) message.channel.send("You said yes :)");
        else message.channel.send("You didn't say yes :(");
    }
}

export = testCommand;