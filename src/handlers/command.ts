let fs = require('fs');
import logger from '../utils/Logger';

class commandHandler {

    protected client;

    constructor(client) {
        this.client = client;

        fs.readdirSync("./dist/commands/").map(dir => {
            fs.readdirSync(`./dist/commands/${dir}`).map(async (thisCommand) => {
                let Command = require(`../commands/${dir}/${thisCommand}`);
                let command = new Command();
                logger.load("Handler Commands", `Loaded ${command.help.name}`);

                this.client.commands.set(command.help.name, command);
            });
        });
    }
}

export = commandHandler