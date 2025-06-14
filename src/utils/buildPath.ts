import type {FileSystemItem} from "../pages/DrivePage/types.ts";

export const buildPaths = (
    items: FileSystemItem[],
    parentPath: string,
    loaded = false
): FileSystemItem[] => {
    return items.map(item => {
        const path = parentPath ? `${parentPath}/${item.name}` : item.name;

        return {
            ...item,
            path,
            loaded,
            children: item.type === 'directory' && item.children
                ? buildPaths(item.children, path, loaded)
                : undefined
        };
    });
};