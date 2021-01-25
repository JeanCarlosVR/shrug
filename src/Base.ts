import { Base } from "./sharder/index";
import Load from "./Load";

class Bot extends Base {
    constructor(bot, ipc, clusterID) {
        super(bot, ipc, clusterID);
    }

    public launch() {
        new Load(this.bot, this.ipc, this.clusterID);
    }
}

export = Bot;