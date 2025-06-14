export type FileSystemItem = {
    name: string;
    path: string;
    loaded?: boolean; // Флаг загрузки содержимого
} & (
    | {
    type: "directory";
    children?: FileSystemItem[]; // Дети не обязательны
}
    | {
    type: "file";
    size: number;
    modified: string;
}
    );

export type FileSystemActionItem = FileSystemItem & {
    _action?: 'delete' | 'rename';
    oldPath?: string;
}

export interface ContextMenu {
    mouseX: number;
    mouseY: number;
    item: FileSystemItem | null;
}

