class EventSchema {

    protected help = new Object;

    constructor(options) {
        this.help = {
            name: options.name ? options.name : null,
            event_name: options.event_name ? options.event_name : null,
            priority: options.priority ? options.priority : 0,
            deprecated: options.deprecated,
            premium: options.premium,
            canary: options.canary
        }
    }
}

export = EventSchema;