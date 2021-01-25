const guildSchemaModel = new (require("mongoose")).Schema({
    id: {
        type: String,
        require: true,
        unique: true
    },
    preferences: {
        type: Object,
        require: true,
        default: {
            prefix: "!",
            lang: 0,
            private: false,
            premium: false,
            canary: false,
            ignored: false,
            color: 0xF1F1F1
        }
    },
    services: {
        type: Object,
        require: true,
        default: {
            reactions: {
                reactionListeners: [],
            },
            starboard: {
                channel: null,
                time: 15000,
                minimum: 5
            },
            tags: {
                tagList: []
            }
        }
    }
});

export = (require("mongoose")).model("guild", guildSchemaModel);