import type {FileSystemItem} from "../pages/DrivePage/types.ts";

export const buildPaths = (items: FileSystemItem[], parentPath = ''): FileSystemItem[] => {
    return items.map(item => {
        const currentPath = `${parentPath}/${item.name}`.replace('//', '/');
        return {
            ...item,
            path: currentPath,
            children: item.children ? buildPaths(item.children, currentPath) : undefined
        };
    });
};