let fs = require('fs');
import logger from '../utils/Logger';

class eventHandler {

    protected client;

    constructor(client) {
        this.client = client;

        fs.readdirSync(`./dist/events/`).map(async (thisEvent) => {
            let Event = require(`../events/${thisEvent}`);
            let event = new Event(this.client);
            logger.load("Handler Events", `Loaded ${event.help.event_name}`);
        });
    }
}

export = eventHandler