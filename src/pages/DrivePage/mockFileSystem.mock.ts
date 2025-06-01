import type { FileSystemItem } from "./types";
import { buildPaths } from "./fileSystemUtils";

export const getMockFileSystem = (): FileSystemItem[] => {
    const rawData = [
        {
            name: 'server',
            type: 'directory',
            children: [
                {
                    name: 'mods',
                    type: 'directory',
                    children: []
                },
                {
                    name: 'config',
                    type: 'directory',
                    children: [
                        {
                            name: 'server.properties',
                            type: 'file',
                            size: 1024,
                            modified: '2023-05-15'
                        },
                        {
                            name: 'bukkit.yml',
                            type: 'file',
                            size: 2048,
                            modified: '2023-05-14'
                        },
                    ],
                },
                {
                    name: 'plugins',
                    type: 'directory',
                    children: [
                        {
                            name: 'EssentialsX.jar',
                            type: 'file',
                            size: 5120,
                            modified: '2023-05-10'
                        },
                        {
                            name: 'WorldEdit.jar',
                            type: 'file',
                            size: 4096,
                            modified: '2023-05-09'
                        },
                    ],
                },
                {
                    name: 'server.jar',
                    type: 'file',
                    size: 102400,
                    modified: '2023-05-01'
                },
                {
                    name: 'eula.txt',
                    type: 'file',
                    size: 256,
                    modified: '2023-05-01'
                },
            ],
        },
    ] as FileSystemItem[];

    return buildPaths(rawData, '');
};