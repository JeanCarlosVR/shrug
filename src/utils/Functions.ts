import humanizeDuration from 'humanize-duration';
import guild from '../database/models/guild';
import clientSchema from '../database/models/client';

const formatLangs = {
    0: "en",
    1: "es",
    2: "zh_CN",
    3: "pt",
    4: "fr",
    5: "hi",
    6: "cv",
    7: "ru",
    8: "de",
    9: "ja",
    10: "ar"
}

const dateCountries = {
    0: "en-US",
    1: "es-ES",
    2: "zh_CN",
    3: "pt-PT",
    4: "fr-FR",
    5: "hi-IN",
    6: "cv-TR",
    7: "ru-RU",
    8: "de-DE",
    9: "ja-JA",
    10: "ar-EG"
}

const ands = {
    0: " and ",
    1: " y ",
    2: " 和 ",
    3: " e ",
    4: " et ",
    5: " तथा ",
    6: " ve ",
    7: " и ",
    8: " und ",
    9: " そして ",
    10: " و "
}

export default class Functions {

    protected danger;
    protected client;

    protected auto_reboot;

    constructor(client, options) {
        if(!client) throw Error("Undefined client.");
        this.client = client;
        if(options.danger === true) {
            this.danger = true;
        } else if(!options.danger || options.danger === false) {
            this.danger = false;
        }
    }

    /**
    * End everything.
    * @param key Authorization key for stop all bot.
    * 
    */
    public protocolZ(key: any): void {
        if(!key) throw Error("Unknown key");
        process.exit();
    }

    public reloadAllShards() {
        if(!this.danger) throw Error("Danger Mode is deactivated.");
        for(let shard of this.client.shards) {
            this.client.shards.get(shard[0]).disconnect();
        }
        return true;
    }

    public reloadAllClusters() {
        if(!this.danger) throw Error("Danger Mode is deactivated.");
        this.client.utils.ipc.sendTo(0, "restart", { name: "restart" });
        return true
    }

    /**
    * Reload certain shard.
    * @param id of shard.
    */
    public async reloadShard(id: number): Promise<any> {
        if(!id) id = 0;
        let shard = this.client.shards.get(id);
        if(!shard) throw Error("Unknown shard.")
        await shard.disconnect();
        return true;
    }


    /**
    * Setup auto reboot with interval between hours.
    * @param hours interval between reboot.
    */
    public autoReboot(hours: number): void {
        if(typeof hours !== "number") throw Error("Only numbers for specify hours.")
        if(this.auto_reboot) throw Error("Auto reboot is already running.")
        this.auto_reboot = true;
        setInterval(() => {
            console.log("Auto reboot initializing.")
            this.client.utils.ipc.sendTo(0, "restart", { name: "restart" });
        }, 1000 * 60 * 60 * hours);
    }

    /**
    * Get random number between {min} - {max}.
    * @param min Minimun number to get random number.
    * @param max Maximum number to get random number.
    */
    public randomNumber(min: number, max: number) {
        if(!(min || max)) throw Error("Unknown min or max.");
        return (Math.floor(Math.random() * max) + min);
    }

    /**
    * Calculate exp based in the experience
    * @param exp user experience
    */
    public calculateLevel(exp: number) {
        if(!exp) throw Error("Unknown experience");
        return Math.floor(((((Math.pow(exp, 1.4)) - (23 * 0.2242222 / ((exp*2) / (exp * (exp*5)))))) / exp * (exp/1/230)));
    }

    /**
    * Get random element from array
    * @param array array with multiples elements. 
    */
    public randomElement(array) {
        if(!array || (array && array.length < 1)) throw Error("This array always return the same value.");
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
    * Format the timestamp to time like counter (1 Hours, 2 Minutes and 5 Seconds).
    * @param timestamp timestamp in numbers.
    * @param lang Lang for format timestamp.
    */
    public format(timestamp: number, lang: number, options) {
        if(!timestamp) throw Error("Unknown timestamp.");
        let localLang = formatLangs[lang];
        if(!localLang) localLang = formatLangs[0];

        let and = ands[lang] || " and ";
        if(!options) options = { round: false, maxDecimals: 0 };

        let optionsFormat = { conjunction: and, round: (options.round || false), serialComma: true, decimal: ".", language: localLang, maxDecimalPoints: (options.maxDecimals || 0) };

        return humanizeDuration(timestamp, optionsFormat);
    }

    /**
    * Get date from any time (10 of December of the year 2020)
    * @param timestamp timestamp in numbers.
    * @param country date from {country}
    */
    public date(timestamp: number, country_lang: number) {
        let country = dateCountries[country_lang];
        if(!country) country = dateCountries[0];

        if(!timestamp) throw Error("Unknown timestamp.");
        let options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        let newDate = new Date(timestamp);
        return newDate.toLocaleString(country, options);
    }

    // Requests to database (Color, etc)

    /**
    * Get main color of certain guild. 
    * @param id ID of guild.
    */
    public color(id) {
        return ((guild.findOne({ id: id })).preferences.color || 0xF1F1F1);
    }

    /**
    * Get any member who match to any argument includes username, discriminator, mention, id, etc.
    * @param message Message object
    * @param argument Argument to search
    */
    public resolveUser(list, argument) {
        const idMatcher = /^([0-9]{15,21})$/;
        const userMentionMatcher = /<@!?([0-9]{15,21})>/;

        const idMatch = idMatcher.exec(argument) || userMentionMatcher.exec(argument);
        let member = null

        if (idMatch) {
            member = list.get(idMatch[1])
        } else {
            if (list.find(e => e.discriminator && e.username) &&argument.length > 5 && argument.slice(-5, -4) === '#') {
                member = list.find(e => (`${e.username}#${e.discriminator}`.toLowerCase()).startsWith(argument.toLowerCase()))
            } else if(list.find(e => e.discriminator) && argument.length < 5 && !isNaN(argument)) {
                member = list.find(e => `${e.discriminator}` === argument)
            } else if(list.find(e => e.discriminator) && argument.startsWith("#") && argument.length === 5 && !isNaN((argument.slice(1)))) {
                member = list.find(e => `#${e.discriminator}` === argument)
            } else {
                member = list.find(e => e.username.toLowerCase().startsWith(argument.toLowerCase()))
            }
        }

        return member;
    };

    /**
    * Get status data from database. 
    */
    public statusData() {
        return clientSchema.findOne({ id: "741539390140055622" }).data;
    }

    /**
    * Generate random characters with certain length.
    * @param length Total length of the key generated. 
    */
    public randomKey(length) {
        const characters = "123456789abcdefghijkmnlopqrstuvwxyz_";
        let password = "";

        for(var i = 0; i < length; i++) {
            let character = characters[Math.floor(Math.random() * characters.length)];
            password = password + character;
        }

        return password;
    }

    /**
    * Class to JSON 
    */
    public get toJSON() {
        return {
            protocolZ: this.protocolZ,
            autoReboot: this.autoReboot,
            reloadShard: this.reloadShard,
            reloadAllShards: this.reloadAllShards,
            reloadAllClusters: this.reloadAllClusters,
            randomNumber: this.randomNumber,
            randomElement: this.randomElement,
            format: this.format,
            date: this.date,
            color: this.color,
            resolveUser: this.resolveUser,
            statusData: this.statusData,
            randomKey: this.randomKey
        }
    }

    public toString() {
        return `[Functions Indetificator(${this.client.user.id})]`
    }
}