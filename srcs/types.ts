export enum ActionCommands {
    CREATE = 'CREATE',
    MOVE = 'MOVE',
    DELETE = 'DELETE',
    LIST = 'LIST',
}

export type Directory = {
    [name: string]: Directory
};