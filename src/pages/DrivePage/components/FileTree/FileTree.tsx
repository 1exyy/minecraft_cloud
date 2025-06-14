import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    styled,
    Skeleton, CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import type {ContextMenu, FileSystemActionItem, FileSystemItem} from "../../types.ts";
import {useCallback, useEffect, useState, memo, useMemo, useRef} from "react";
import type {FC, MouseEvent} from 'react';
import {FileContextMenu} from "../ContextMenu/ContextMenu.tsx";

interface FileTreeProps {
    data: FileSystemItem[];
    onSelect: (item: FileSystemActionItem) => void;
    loading?: boolean;
    onLoadChildren: (path: string) => Promise<void>;
}

const StyledListItemButton = styled(ListItemButton)(({theme}) => ({
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(0.5, 1),
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&.Mui-selected': {
        backgroundColor: 'rgba(189, 66, 250, 0.2)',
        '&:hover': {
            backgroundColor: 'rgba(189, 66, 250, 0.3)',
        },
    },
}));

interface TreeNodeProps {
    item: FileSystemItem;
    level: number;
    expanded: Record<string, boolean>;
    loadingItems: Record<string, boolean>;
    selected: string | null;
    onSelect: (item: FileSystemItem) => void;
    onToggle: (item: FileSystemItem, e: MouseEvent) => void;
    onContextMenu: (e: MouseEvent, item: FileSystemItem) => void;
    onLoadChildren: (path: string) => Promise<void>;
}

const TreeNode = memo(({
                           item,
                           level,
                           expanded,
                           loadingItems,
                           selected,
                           onSelect,
                           onToggle,
                           onContextMenu,
                           onLoadChildren,
                       }: TreeNodeProps) => {
    const isExpanded = !!expanded[item.path];
    const isLoading = !!loadingItems[item.path];
    const isSelected = selected === item.path;

    const handleToggle = useCallback((e: MouseEvent) => {
        onToggle(item, e);
    }, [onToggle, item]);

    const handleSelectLocal = useCallback(() => {
        onSelect(item);
    }, [onSelect, item]);

    const handleContextMenuLocal = useCallback((e: MouseEvent) => {
        onContextMenu(e, item);
    }, [onContextMenu, item]);

    return (
        <Box pl={level * 2} onContextMenu={handleContextMenuLocal}>
            <StyledListItemButton
                onClick={handleSelectLocal}
                selected={isSelected}
            >
                {item.type === 'directory' && (
                    <ListItemIcon
                        sx={{minWidth: '24px', marginRight: '8px'}}
                        onClick={handleToggle}
                    >
                        {isExpanded ? <ExpandMoreIcon/> : <ChevronRightIcon/>}
                    </ListItemIcon>
                )}

                <ListItemIcon sx={{minWidth: '24px', marginRight: '8px'}}>
                    {item.type === 'directory'
                        ? <FolderIcon sx={{color: '#e0e0e0'}}/>
                        : <InsertDriveFileIcon sx={{color: '#e0e0e0'}}/>
                    }
                </ListItemIcon>

                <ListItemText
                    primary={
                        <Box display="flex" alignItems="center">
                            {item.name}
                            {isLoading && (
                                <CircularProgress size={14} sx={{color: '#e0e0e0', ml: 1}}/>
                            )}
                        </Box>
                    }
                    primaryTypographyProps={{
                        fontSize: '16px',
                        color: '#e0e0e0',
                        fontFamily: '"Roboto", sans-serif'
                    }}
                />
            </StyledListItemButton>

            {item.type === 'directory' && (
                <Collapse
                    in={isExpanded}
                    timeout="auto"
                    unmountOnExit
                    sx={{
                        transition: 'opacity 300ms, transform 300ms',
                        opacity: isExpanded ? 1 : 0,
                        transform: isExpanded ? 'translateY(0)' : 'translateY(-10px)'
                    }}
                >
                    {isLoading
                        ? <SkeletonTree level={level + 1} count={1}/>
                        : item.children?.length
                            ? item.children.map(child => (
                                <MemoizedTreeNode
                                    key={child.path}
                                    item={child}
                                    level={level + 1}
                                    expanded={expanded}
                                    loadingItems={loadingItems}
                                    selected={selected}
                                    onSelect={onSelect}
                                    onToggle={onToggle}
                                    onContextMenu={onContextMenu}
                                    onLoadChildren={onLoadChildren}
                                />
                            ))
                            : <Box pl={2} py={1} color="#aaa">Папка пуста</Box>
                    }
                </Collapse>
            )}
        </Box>
    );
}, (prev, next) => {
    return prev.item === next.item &&
        prev.level === next.level &&
        prev.expanded === next.expanded &&
        prev.loadingItems === next.loadingItems &&
        prev.selected === next.selected;
});

const MemoizedTreeNode = memo(TreeNode);

const SkeletonTree = memo(({count, level = 0}: { count: number; level?: number }) => {
    return (
        <>
            {Array.from({length: count}).map((_, index) => (
                <Box
                    key={index}
                    pl={level * 2}
                    display="flex"
                    alignItems="center"
                    py={1}
                    sx={{
                        animation: 'pulse 1.5s infinite',
                        '@keyframes pulse': {
                            '0%': {opacity: 0.5},
                            '50%': {opacity: 0.8},
                            '100%': {opacity: 0.5}
                        }
                    }}
                >
                    <Skeleton variant="circular" width={24} height={24} sx={{mr: 1}}/>
                    <Skeleton variant="circular" width={24} height={24} sx={{mr: 1}}/>
                    <Skeleton variant="text" width={`${Math.random() * 100 + 100}px`} height={24}/>
                </Box>
            ))}
        </>
    );
});

const FileTree: FC<FileTreeProps> = ({data, onSelect, loading = false, onLoadChildren}) => {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [selected, setSelected] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
    const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
    const initializedRef = useRef(false);

    // Инициализация папки "server" с загрузкой данных
    useEffect(() => {
        if (initializedRef.current || loading || !data.length) return;

        const serverItem = data.find(item =>
            item.name === 'server' &&
            item.type === 'directory'
        );

        if (serverItem) {
            initializedRef.current = true;
            const path = serverItem.path;

            // Разворачиваем папку
            setExpanded(prev => ({...prev, [path]: true}));

            // Загружаем данные если они еще не загружены
            if (!serverItem.loaded && !loadingItems[path]) {
                setLoadingItems(prev => ({...prev, [path]: true}));
                onLoadChildren(path).finally(() => {
                    setLoadingItems(prev => ({...prev, [path]: false}));
                });
            }
        }
    }, [data, loading, loadingItems, onLoadChildren]);

    const handleSelect = useCallback((item: FileSystemItem) => {
        if (!loading) {
            setSelected(item.path);
            onSelect(item);
        }
    }, [loading, onSelect]);

    const handleContextMenu = useCallback((e: MouseEvent, item: FileSystemItem) => {
        e.preventDefault();
        setContextMenu({
            mouseX: e.clientX,
            mouseY: e.clientY,
            item
        });
    }, []);

    const handleToggle = useCallback(async (item: FileSystemItem, e: MouseEvent) => {
        e.stopPropagation();
        const path = item.path;

        if (item.type === 'directory') {
            // Загружаем детей при первом открытии
            if (!expanded[path] && !item.loaded) {
                setLoadingItems(prev => ({...prev, [path]: true}));
                try {
                    await onLoadChildren(path);
                } finally {
                    setLoadingItems(prev => ({...prev, [path]: false}));
                }
            }
            setExpanded(prev => ({...prev, [path]: !prev[path]}));
        }
    }, [expanded, onLoadChildren]);

    const treeNodes = useMemo(() => {
        if (loading) return <SkeletonTree count={5}/>;

        return data.map(item => (
            <MemoizedTreeNode
                key={item.path}
                item={item}
                level={0}
                expanded={expanded}
                loadingItems={loadingItems}
                selected={selected}
                onSelect={handleSelect}
                onToggle={handleToggle}
                onContextMenu={handleContextMenu}
                onLoadChildren={onLoadChildren}
            />
        ));
    }, [data, loading, expanded, loadingItems, selected, handleSelect, handleToggle, handleContextMenu, onLoadChildren]);

    const handleCloseContextMenu = useCallback(() => {
        setContextMenu(null);
    }, []);

    return (
        <>
            <List component="nav" sx={{width: '100%', overflow: 'auto'}}>
                {treeNodes}
            </List>
            <FileContextMenu
                onRename={() => {
                }}
                onDelete={() => {
                }}
                handleClose={handleCloseContextMenu}
                contextMenu={contextMenu}
            />
        </>
    );
};

export default memo(FileTree);