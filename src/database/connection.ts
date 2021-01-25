import Mongoose = require("mongoose");
import { mongo_atlas_url } from "../config";

export default class mongoAtlas {

    protected mongoose;

    constructor(mongoose: typeof Mongoose) {
        this.mongoose = mongoose;
    }

    public connect() {

        this.mongoose.connect(mongo_atlas_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        .then(() => console.log("Mongo Atlas Successfelly connected."))
        .catch(() => console.log("Failed to try connect to Mongo Atlas."));
    }
}