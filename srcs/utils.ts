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

    public listDirectories({ directory = this.root, indent = '' }: { directory?: Directory, indent?: string }): boolean {
        if (Object.keys(directory).length === 0) {
            return false;
        }
    
        Object.keys(directory).forEach(dir => {
            console.log(`${indent}${dir}`);
            this.listDirectories({ directory: directory[dir], indent: indent + '  ' });
        });
        return true;
    }

    public moveDirectory({ sourcePath, targetPath }: { sourcePath: string, targetPath: string }): boolean {
        const sourceParts = sourcePath.split('/');
        let sourceDir = this.root;
    
        for (let part of sourceParts.slice(0, -1)) {
            if (!sourceDir[part]) {
                console.log(`Source directory "${sourcePath}" not found.`);
                return false;
            }
            sourceDir = sourceDir[part];
        }
    
        const dirToMove = sourceParts[sourceParts.length - 1];
    
        if (!sourceDir[dirToMove]) {
            console.log(`Directory "${sourcePath}" not found.`);
            return false;
        }
    
        if (targetPath.startsWith(`${sourcePath}/`)) {
            console.log(`Cannot move directory "${sourcePath}" into its child "${targetPath}".`);
            return false;
        }
    
        if (targetPath === '/') {
            if (this.root[dirToMove]) {
                console.log(`Directory "${dirToMove}" already exists in the root.`);
                return false;
            }
    
            this.root[dirToMove] = sourceDir[dirToMove];
            delete sourceDir[dirToMove];
            return true;
        }
    
        const targetParts = targetPath.split('/');
        let targetDir = this.root;
    
        for (let part of targetParts) {
            if (!targetDir[part]) {
                console.log(`Target directory "${targetPath}" not found.`);
                return false;
            }
            targetDir = targetDir[part];
        }
    
        if (targetDir[dirToMove]) {
            console.log(`Directory "${dirToMove}" already exists in "${targetPath}".`);
            return false;
        } else {
            targetDir[dirToMove] = sourceDir[dirToMove];
            delete sourceDir[dirToMove];
            return true;
        }
    }

    public deleteDirectory({ path }: { path: string }): boolean {
        if (path === '/') {
            Object.keys(this.root).forEach(key => delete this.root[key]);
            this.saveState();
            console.log('Root has been deleted.');
            return true;
        }
    
        const parts = path.split('/');
        let current = this.root;
    
        for (let part of parts.slice(0, -1)) {
            if (!current[part]) {
                console.log(`Cannot delete ${path} - directory does not exist.`);
                return false;
            }
            current = current[part];
        }
    
        const dirToDelete = parts[parts.length - 1];
        if (current[dirToDelete]) {
            delete current[dirToDelete];
            this.saveState();
            return true;
        } else {
            console.log(`Cannot delete ${path} - directory does not exist.`);
            return false;
        }
    }
}