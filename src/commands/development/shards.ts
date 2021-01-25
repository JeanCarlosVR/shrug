class shardsCommand extends (require('../../base/command')) {
    constructor() {
        super({
            name: "shards",
            description: null,
            aliases: [],
            category: "development",
            usage: "<shards>",
            default_cooldown: 0,
            premium_cooldown: 0,
            disabled: false,
            development: true,
            canary: false
        });
    }

    /**
    * 
    * @param client
    * @param message 
    * @param args 
    * @param lang 
    */
    async run(client, message, args, lang) {

        let shardsTest = [
            {
                id: 0,
                guilds: "129.294",
                users: "1.225.239",
                ram: "119mb"
            },
            {
                id: 1,
                guilds: "192.942",
                users: "2.194.644",
                ram: "133mb"
            },
            {
                id: 2,
                guilds: "132.942",
                users: "1.305.494",
                ram: "128mb"
            },
            {
                id: 3,
                guilds: "142.942",
                users: "1.691.290",
                ram: "171mb"
            },
            {
                id: 4,
                guilds: "172.942",
                users: "1.535.824",
                ram: "124mb"
            },
            {
                id: 5,
                guilds: "182.942",
                users: "1.839.241",
                ram: "165mb"
            },
            {
                id: 6,
                guilds: "182.942",
                users: "1.245.809",
                ram: "155mb"
            },
            {
                id: 7,
                guilds: "142.112",
                users: "1.593.894",
                ram: "181mb"
            },
            {
                id: null,
                guilds: "Unavailable",
                users: "Unavailable",
                ram: "Unavailable"
            },
        ];

        let shardsIDs = client.shards.map(shard => shard.id);
        let shards = [];
        for(let thisShardID of shardsIDs) {
            let shard = client.shards.get(thisShardID);

            let shard_id = shard.id;
            if(shard_id === message.guild.shard.id) {
                shard_id = `${shard.id} (You)`
            }

            let shardConstructor = {
                id: shard_id,
                guilds: Object.keys(client.guildShardMap).filter(key => client.guildShardMap[key] === shard.id).length || 0,
                latency: shard.latency || "Offline"
            }

            shards.push(shardConstructor);
        }

        let fields = [];
        let node = {
            0: "Jean",
            1: "Adrian",
            2: "Mairon",
            3: "Velikaz",
            4: "Matheo",
            5: "Elizabeth",
            6: "Alexandria",
            7: "Carl",
            8: "Louis",
            9: "Marik",
            10: "Yubel",
            11: "Angelica",
            12: "Mariana",
            13: "Arthur",
            14: "Alejandra",
            15: "Kelly",
            16: "Mike",
            17: "Tom",
            18: "Anderson",
            19: "Anstron",
            20: "Harry",
            21: "Paulo",
            22: "Dani",
            23: "Monica",
            24: "Osiris",
            25: "Justin",
            26: "Juan",
            27: "Bill",
            28: "Benito",
            29: "Eva",
            30: "Jhay",
            31: "Jack",
            32: "Kevin",
            33: "Britanny",
            null: "Unavailable"
        }

        for(let shard of shards) {
            let field = {
                name: null,
                value: null,
                inline: true
            };

            field.name = `Shard ${shard.id ? shard.id : "Unavailable"}`;
            field.value = `**Node** \`${node[parseFloat(shard.id)] ? node[parseFloat(shard.id)] : "Adan"}\` \n**Guilds** \`${shard.guilds}\` \n**Ping** \`${shard.latency}ms\``;
            fields.push(field);
        }

        const embed = {
            fields: fields,
            color: message.guild.color
        }

        return message.channel.send({
            embed: embed
        })
    }
}

export = shardsCommand;