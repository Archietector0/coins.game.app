import { ActionCommands, Directory } from "./types";
import * as fs from 'fs';
import * as readline from 'readline';
import { Utils } from "./utils";

class App {
    private utils: Utils;
    private root: Directory;

    constructor() {
        this.root = this.loadState();
        this.utils = new Utils(this.root);
    }

    private loadState(): Directory {
        if (fs.existsSync('state.json')) {
            return JSON.parse(fs.readFileSync('state.json').toString());
        }
        return {};
    }

    public start() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.on('line', (input: string) => {
            const commands = input.trim().split(/\s(?=CREATE|MOVE|DELETE|LIST)/);
            commands.forEach((command) => {
                const [action, ...args] = command.trim().split(/\s+/);

                switch (action) {
                    case ActionCommands.CREATE:
                        const path = args.join(' ').trim();
                        if (path) {
                            const isValid = this.utils.createDirectory({ path });
                            if (!isValid) return;
                            this.utils.saveState();
                        } else {
                            console.log("Please provide a directory name.");
                        }
                        break;
                    case ActionCommands.MOVE: {
                        if (args.length === 2) {
                            this.utils.moveDirectory({ sourcePath: args[0], targetPath: args[1] });
                            this.utils.saveState();
                        } else {
                            console.log("Please provide source and target directories.");
                        }
                        break;
                    }
                    case ActionCommands.DELETE: {
                        if (args.length) {
                            this.utils.deleteDirectory({ path: args[0] });
                            this.utils.saveState();
                        } else {
                            console.log("Please provide a directory name to delete.");
                        }
                        break;
                    }
                    case ActionCommands.LIST: {
                        if (args.length > 0) {
                            console.log("Unexpected values after the LIST command.");
                        } else {
                            this.utils.listDirectories({});
                        }
                        break;
                    }
                    default: {
                        console.log(`Unknown command: ${action}`);
                    }
                }
            });
        });
    }
}

new App().start();