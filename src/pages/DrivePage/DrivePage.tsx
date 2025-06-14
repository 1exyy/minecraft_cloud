import {useEffect, useState} from 'react';
import {Box, IconButton, Skeleton} from '@mui/material';
import {AnimatedBox} from '../../components/AnimatedBox/AnimatedBox';
import FileTree from './components/FileTree/FileTree.tsx';
import FileContent from './components/FileContent/FileContent.tsx';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useNavigate} from 'react-router';
import {ContentContainer, FilesPageContainer, Header, Title, TreeContainer} from './DrivePageStyles';
import {getMockFileSystem} from './mockFileSystem.mock.ts';
import type {FileSystemItem} from "./types.ts";
import {buildPaths} from "../../utils/buildPath.ts";

type FileSystemActionItem = FileSystemItem & {
    _action?: 'delete' | 'rename';
    oldPath?: string;
}

const DrivePage = () => {
    const navigate = useNavigate();
    const [fileTree, setFileTree] = useState<FileSystemItem[]>([]);
    const [fullTree, setFullTree] = useState<FileSystemItem[]>([]); // Полное дерево
    const [selectedItem, setSelectedItem] = useState<FileSystemItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            const fullData = getMockFileSystem();
            setFullTree(fullData);

            // Инициализация только корневых элементов
            const rootTree = fullData.map(item => ({
                ...item,
                loaded: false,
                children: undefined
            }));

            setFileTree(rootTree);
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleLoadChildren = async (path: string) => {
        // Искусственная задержка для демонстрации
        await new Promise(resolve => setTimeout(resolve, 1000));

        const findItem = (items: FileSystemItem[]): FileSystemItem | undefined => {
            for (const item of items) {
                if (item.path === path) return item;
                if (item.type === 'directory' && item.children) {
                    const found = findItem(item.children);
                    if (found) return found;
                }
            }
            return undefined;
        };

        const item = findItem(fullTree);
        if (item && item.type === 'directory' && item.children) {
            setFileTree(prev => updateTree(prev, path, item.children!));
        }
    };

    const updateTree = (
        items: FileSystemItem[],
        targetPath: string,
        children: FileSystemItem[]
    ): FileSystemItem[] => {
        return items.map(item => {
            if (item.path === targetPath && item.type === 'directory') {
                return {
                    ...item,
                    loaded: true,
                    children: buildPaths(children, targetPath, false)
                };
            }

            if (item.type === 'directory' && item.children) {
                return {
                    ...item,
                    children: updateTree(item.children, targetPath, children)
                };
            }

            return item;
        });
    };

    const handleSelectItem = (item: FileSystemActionItem) => {
        setSelectedItem(item);
    };

    return (
        <FilesPageContainer>
            <AnimatedBox
                isVisible={true}
                direction="left"
                type="width"
                duration={500}
                sx={{
                    maxWidth: '400px',
                    width: '400px',
                    flexShrink: 0,
                }}
            >
                <Box>
                    <TreeContainer elevation={8}>
                        <Header>
                            <IconButton onClick={() => navigate(-1)} sx={{color: '#e0e0e0'}}>
                                <ArrowBackIcon fontSize="large"/>
                            </IconButton>
                            <Title>Файлы сервера</Title>
                        </Header>
                        <FileTree
                            data={fileTree}
                            onSelect={handleSelectItem}
                            loading={loading}
                            onLoadChildren={handleLoadChildren} // Передаем функцию загрузки
                        />
                    </TreeContainer>
                </Box>
            </AnimatedBox>

            <ContentContainer elevation={8}>
                <Header>
                    {loading ? (
                        <Skeleton variant="text" width={300} height={40}/>
                    ) : (
                        <Title>
                            {selectedItem ? selectedItem.name : 'Выберите файл или папку'}
                        </Title>
                    )}
                </Header>

                <Box flexGrow={1} overflow="auto">
                    <FileContent item={selectedItem}/>
                </Box>
            </ContentContainer>
        </FilesPageContainer>
    );
};

export default DrivePage;