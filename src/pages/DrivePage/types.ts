export type FileSystemItem = {
    name: string;
    path: string;
    type: 'file' | 'directory';
    size?: number;
    modified?: string;
    children?: FileSystemItem[];
    newItem?: boolean;
};

export const ItemTypes = {
    FILE: 'file',
};