import Collection from "./utils/Collection";
import Utilities from "./utils/Functions";
import loadStructures from "./loadStructures";

let langsToString: Object = {
    0: "en_US",
    1: "es_ES",
    2: "zh_CH",
    3: "pt_PT",
    4: "fr_FR",
    5: "hi_HI",
    6: "cv_TK",
    7: "ru_RU",
    8: "nl_GE",
    9: "ja_JA",
    10: "ar_AR"
}
let langsToArray: string[] = ["en_US", "es_ES", "zh_CH", "pt_PT", "fr_FR", "hi_HI", "cv_TK", "ru_RU", "nl_GE", "ja_JA", "ar_AR"];

export default class Load {

    protected client;
    protected ipc;
    protected clusterID;

    constructor(client, ipc, clusterID) {
        this.client = client;
        this.ipc = ipc;
        this.clusterID = clusterID;

        new loadStructures()

        this.client.commands = new Collection();
        this.client.cooldown = new Collection();
        this.client.snipes = new Collection();
        this.client.langs = new Collection();
        this.client.starboard = new Collection();

        this.utils();

        this.clearCache();

        new (require("./handlers/command"))(this.client);
        new (require("./handlers/event"))(this.client);
    }

    public async utils() {

        new loadStructures()

        this.client.utils = {
            ipc: this.ipc,
            clusterID: this.clusterID,
            langsFormat: {
                strings: langsToString,
                array: langsToArray
            },
            functions: (new Utilities(this.client, { danger: true })),
            colors: {
                error: 0xE61D1D,
                warning: 0xF67845,
                success: 0x3BE61D
            },
            errors: (require("../resources/errors.json")),
            emojis: (require("../resources/emojis.json")),
            langs_flags: ["🇺🇸", "🇪🇸", "🇨🇳", "🇵🇹", "🇫🇷", "🇮🇳", "🇹🇷", "🇷🇺", "🇩🇪", "🇯🇵", "🇸🇦"]
        }

        for(let lang of langsToArray) {
            this.client.langs.set(lang, require(`../resources/langs/${lang}.json`))
        }
    }

    public clearCache() {
        setInterval(async () => {
            for(let [key] of this.client.users) {
                if(this.client && key !== this.client.id) {
                    this.client.users.delete(key);
                }
            }

            for(let [key] of this.client.snipes) {
                this.client.snipes.delete(key);
            }
        }, 1000 * 60 * 60 * 6); // 6 Hours
    }
}