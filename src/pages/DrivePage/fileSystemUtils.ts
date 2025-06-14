import type {FileSystemItem} from "./types";

export const buildPaths = (items: FileSystemItem[], parentPath: string): FileSystemItem[] => {
    return items.map(item => {
        const currentPath = parentPath ? `${parentPath}/${item.name}` : `/${item.name}`;

        return {
            ...item,
            path: currentPath,
            children: item.children ? buildPaths(item.children, currentPath) : undefined
        };
    });
};