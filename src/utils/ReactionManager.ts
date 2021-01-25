const EventEmitter = require('events').EventEmitter;


class reactionManager extends EventEmitter {

    constructor(message, filter, permanent = false, options: Object) {
        super();

        this.client     = (message.channel.guild) ? message.channel.guild.shard.client : message.channel.client;
        this.filter     = filter;
        this.message    = message;
        this.options    = options;
        this.permanent  = permanent;
        this.ended      = false;
        this.collected  = [];
        this.listener   = (msg, emoji, userID) => this.checkPreConditions(msg, emoji, userID);

        this.client.on('messageReactionAdd', this.listener);

        if (this.options.time) {
            setTimeout(() => this.stopListening('time'), this.options.time);
        }
    }

    /**
    * Verify a reaction for its validity with provided filters
    * @param {object} msg The message object 
    * @param {object} emoji The emoji object containing its name and its ID 
    * @param {string} userID The user ID of the user who's reacted 
    */
    public checkPreConditions(msg, emoji, userID) {
        if (this.message.id !== msg.id) {
            return false;
        }

        if(this.options.passedReactions && !this.options.passedReactions.includes(emoji.name)) {
            return false;
        }

        if (this.filter(userID)) {
            this.collected.push({ msg, emoji, userID });
            this.emit('reacted', { msg, emoji, userID });

            if (this.collected.length >= this.options.maxMatches) {
                this.stopListening('maxMatches');
                return true;
            }
        }

        return false;
    }

    /**
    * Stops collecting reactions and removes the listener from the client
    * @param {string} reason The reason for stopping
    */
    public stopListening (reason) {
        if (this.ended) {
            return;
        }

        this.ended = true;

        if (!this.permanent) {
            this.client.removeListener('messageReactionAdd', this.listener);
        }
        
        this.emit('end', this.collected, reason);
    }

    public get getReacted() {
        return this.collected;
    }
}

export const continuousListener = reactionManager;
export const bulkListener = (message, filter, options) => {
    const bulkCollector = new reactionManager(message, filter, false, options);

    return new Promise((resolve) => {
        bulkCollector.on('end', resolve);
    });
}