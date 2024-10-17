import * as fs from 'fs';
import { Directory } from './types';

export class Utils {
    private root: Directory;

    constructor(root: Directory) {
        this.root = root;
    }

    public saveState(): void {
        if (Object.keys(this.root).length === 0) {
            if (fs.existsSync('state.json')) {
                fs.unlinkSync('state.json');
            }
        } else {
            fs.writeFileSync('state.json', JSON.stringify(this.root, null, 2));
        }
    }

    public createDirectory({ path }: { path: string }): boolean {
        const maxPartLength = 11;
        const maxParts = 11;

        const trimmedPath = path.trim();

        if (!trimmedPath) {
            console.log('Please provide a valid directory name.');
            return false;
        }

        const parts = trimmedPath.split('/').filter(part => part.trim().length > 0);
        if (parts.length === 0) {
            console.log('Please provide a valid directory name.');
            return false;
        }

        if (parts.length > maxParts) {
            console.log('The path cannot consist of more than 11 parts.');
            return false;
        }

        const isValidPart = (part: string) => {
            const validPattern = /^[A-Za-z](?:[A-Za-z0-9.-]*[A-Za-z0-9])?$/;
            return validPattern.test(part);
        };

        for (let part of parts) {
            if (part.length > maxPartLength) {
                console.log(`The part "${part}" exceeds the maximum length of 11 characters.`);
                return false;
            }

            if (!isValidPart(part)) {
                console.log(`The part "${part}" contains invalid characters or numbers at the beginning or end.`);
                return false;
            }
        }

        let current = this.root;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];

            if (current[part] && i === parts.length - 1) {
                console.log(`Directory "${path}" already exists.`);
                return false;
            }

            if (!current[part]) {
                current[part] = {};
            }

            current = current[part];
        }

        return true;
    }
}