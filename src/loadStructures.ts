import fs from "fs";
import Eris from 'eris';

class loadStructures {
    constructor() {
        this.main();
    }

    public main() {
        fs.readdirSync("./dist/structures/").map(file => {
            let structure = (require(`./structures/${file}`));
            structure(Eris);
        });
    }
}

export = loadStructures;