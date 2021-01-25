class CommandSchema {

    protected help = new Object;
    
    constructor(options) {
        this.help = {
            name: options.name || null,
            description: options.description || null,
            category: options.category || null,
            aliases: options.aliases || [],
            usage: options.usage || null,
            default_cooldown: options.default_cooldown || 6000,
            premium_cooldown: options.premium_cooldown || 3000,
            disabled: options.disabled === true ? true : false,
            development: options.development === true ? true : false,
            canary: options.canary === true ? true : false
        }
    }
}

export = CommandSchema;