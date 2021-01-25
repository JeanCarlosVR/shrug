//!e process.send({ name: "send", cluster: 0, msg: { _eventName: "stats" } });
class clustersCommand extends (require('../../base/command')) {
    constructor() {
        super({
            name: "clusters",
            description: null,
            aliases: ["clustering", "cluster", "cores"],
            category: "development",
            usage: "<clusters>",
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
    */
    public async run(client, message) {

        let data = await (require("../../database/models/client")).findOne({ id: "741539390140055622" });
        let clustersStats = data.data;
        if((clustersStats.clusters && clustersStats.clusters.length < 1) || (clustersStats.updated && clustersStats.updated - Date.now() > 50000)) return message.channel.send({
            embed: {
                description: "Deprecated information"
            }
        });

        let headUp = [
            {
                cluster: null,
                id: "ID",
                name: "NAME",
                shards: "SHARDS",
                guilds: "GUILDS"
            }
        ]

        let clusters = headUp.concat(clustersStats.clusters)

        let strings = [];

        let clusterNames = {
            0: "Jean",
            1: "Adri",
            3: "Roby",
            4: "Mali",
            5: "Carl",
            6: "Mair",
            7: "Veli",
            8: "Mati",
            9: "Adan"
        }

        for await (let cluster of clusters.slice(1)) {
            strings.push(`Clus ${cluster.cluster}  ${clusterNames[cluster.cluster]}   ${cluster.shards} Shards  ${cluster.guilds} Guilds`)
        }

        let separator = "‏‏‎ ‏‏‎ ";
        let headSeparator = `‏‎ ${separator} `;

        let head = `${headSeparator + clusters[0]["id"] + headSeparator + clusters[0]["name"] + headSeparator + clusters[0]["shards"] + headSeparator + clusters[0]["guilds"]}`

        let table = strings.map(e => `${separator}${e}${separator}`).join("\n");
        let fixedTable = `\`\`\`js\n${head}\n${table}\n\`\`\``;

        return message.channel.send(fixedTable);
    }
}

export = clustersCommand;