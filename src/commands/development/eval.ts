const { inspect } = require("util");

class evalCommand extends (require('../../base/command')) {
    constructor() {
        super({
            name: "eval",
            description: null,
            aliases: ["e"],
            category: "development",
            usage: "<eval> <code>",
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
    public async run(client, message, args, lang) {

        if (message.author.id !== "525842461655040011") return;

        let secret = {
            c: client,
            m: message,
            a: args,
            l: lang,
            g: client.utils.ipc,
            fetch: require("node-fetch")
        }

        const clean = text => {
            if (typeof (text) === "string")
                return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
        }

        try {
            let code = args.join(" ");
            let evaled = await eval(code);

            if (typeof evaled !== "string")
                evaled = await inspect(evaled, { depth: 0 });
            //evaled = await inspect(evaled);

            if (clean(evaled).length > 2040) {
                console.log(evaled);
                evaled = `Exceded Embed Limits: Check Console. (${clean(evaled).length} Characters)`
            }

            if (["bitch.token", "process.env", "client.token", "token", "require(\"../../Settings\")"].includes(code.toLowerCase())) {
                code = "Me gusta free fire 🥵🤑"
                evaled = `No me sorprende.`
            }

            return message.channel.send(
                {
                    embed: {
                        author: {
                            name: "Evaluation",
                            icon_url: client.user.avatarURL
                        },
                        fields: [
                            {
                                name: "Input",
                                value: `\`\`\`js\n${code}\n\`\`\``,
                                inline: true
                            }
                        ],
                        description: `**Output** \n\`\`\`js\n${clean(evaled)}\n\`\`\``,
                        color: client.utils.colors.success
                    }
                }
            );
        } catch (err) {
            return message.channel.send(
                {
                    embed: {
                        author: {
                            name: "Evaluation (ERROR)",
                            icon_url: client.user.avatarURL
                        },
                        fields: [
                            {
                                name: "Output",
                                value: `\`\`\`xl\n${clean(err)}\n\`\`\``,
                                inline: true
                            }
                        ],
                        color: client.utils.colors.error
                    }
                }
            );
        }
    }
}

export = evalCommand;