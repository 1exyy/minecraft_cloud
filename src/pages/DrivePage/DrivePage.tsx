import { useState, useEffect } from 'react';
import { IconButton, Box } from '@mui/material';
import { AnimatedBox } from '../../components/AnimatedBox/AnimatedBox';
import FileTree from './components/FileTree/FileTree.tsx';
import FileContent from './components/FileContent/FileContent.tsx';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import { Skeleton } from '@mui/material';
import {
    FilesPageContainer,
    TreeContainer,
    ContentContainer,
    Header,
    Title
} from './DrivePageStyles';
import { getMockFileSystem } from './mockFileSystem.mock.ts';
import type { FileSystemItem } from "./types.ts";

const DrivePage = () => {
    const navigate = useNavigate();
    const [fileTree, setFileTree] = useState<FileSystemItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<FileSystemItem | null>(null);
    const [loading, setLoading] = useState(true);

    // Загрузка данных файловой системы
    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(() => {
            const dataWithPaths = getMockFileSystem();
            setFileTree(dataWithPaths);
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const handleSelectItem = (item: FileSystemItem) => {
        setSelectedItem(item);
    };

    const updateItemInTree = (
        items: FileSystemItem[],
        path: string,
        newName: string
    ): FileSystemItem[] => {
        return items.map(item => {
            if (item.path === path) {
                const updatedPath = item.path.replace(/[^/]+$/, newName);
                return {
                    ...item,
                    name: newName,
                    path: updatedPath,
                    children: item.children ? updatePaths(item.children, item.path, updatedPath) : undefined
                };
            } else if (item.children) {
                return {
                    ...item,
                    children: updateItemInTree(item.children, path, newName)
                };
            }
            return item;
        });
    };

    const updatePaths = (items: FileSystemItem[], oldBase: string, newBase: string): FileSystemItem[] => {
        return items.map(item => {
            const updatedPath = item.path.replace(oldBase, newBase);
            return {
                ...item,
                path: updatedPath,
                children: item.children ? updatePaths(item.children, oldBase, newBase) : undefined
            };
        });
    };

// Рекурсивное удаление
    const removeItemFromTree = (
        items: FileSystemItem[],
        pathToRemove: string
    ): FileSystemItem[] => {
        return items
            .filter(item => item.path !== pathToRemove)
            .map(item => ({
                ...item,
                children: item.children ? removeItemFromTree(item.children, pathToRemove) : undefined
            }));
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
                <Box
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        const files = Array.from(e.dataTransfer.files);
                        const newItems: FileSystemItem[] = files.map(file => ({
                            type: 'file',
                            name: file.name,
                            path: `/root/${file.name}`,
                        }));
                        setFileTree(prev => [...prev, ...newItems]);
                    }}
                    sx={{ height: '100%', width: '100%' }}
                >
                <TreeContainer elevation={8}>
                    <Header>
                        <IconButton onClick={() => navigate(-1)} sx={{ color: '#e0e0e0' }}>
                            <ArrowBackIcon fontSize="large" />
                        </IconButton>
                        <Title>Файлы сервера</Title>
                    </Header>
                    <FileTree
                        data={fileTree}
                        onSelect={handleSelectItem}
                        loading={loading}
                    />
                </TreeContainer>
                </Box>
            </AnimatedBox>

            <ContentContainer elevation={8}>
                <Header>
                    {loading ? (
                        <Skeleton variant="text" width={300} height={40} />
                    ) : (
                        <Title>
                            {selectedItem ? selectedItem.name : 'Выберите файл или папку'}
                        </Title>
                    )}
                </Header>

                <Box flexGrow={1} overflow="auto">
                    <FileContent item={selectedItem} />
                </Box>
            </ContentContainer>
        </FilesPageContainer>
    );
};

export default DrivePage;