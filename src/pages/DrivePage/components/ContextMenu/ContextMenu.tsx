import React, { useRef, useEffect } from 'react';
import { Box, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';
import type { FileSystemItem } from '../../types';

const MenuPaper = styled(Paper)(() => ({
    position: 'absolute',
    zIndex: 1300,
    minWidth: 200,
    borderRadius: '8px',
    backgroundColor: 'rgba(40, 40, 40, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.7)',
    overflow: 'hidden',
}));

const MenuItem = styled(ListItem)(({ theme }) => ({
    cursor: 'pointer',
    padding: theme.spacing(1, 2),
    '&:hover': {
        backgroundColor: 'rgba(189, 66, 250, 0.3)',
    },
}));

interface ContextMenuProps {
    item: FileSystemItem;
    position: { x: number; y: number };
    onClose: () => void;
    onRename: () => void;
    onDelete: () => void;
    onDownload?: () => void;
    onNewFile?: () => void;
    onNewFolder?: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
                                                            item,
                                                            position,
                                                            onClose,
                                                            onRename,
                                                            onDelete,
                                                            onDownload,
                                                            onNewFile,
                                                            onNewFolder,
                                                        }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleAction = (action: () => void) => {
        action();
        onClose();
    };

    return (
        <MenuPaper
            ref={menuRef}
            style={{
                left: position.x,
                top: position.y,
                transform: 'translateY(-100%)'
            }}
        >
            <List dense sx={{ py: 0.5 }}>
                <Box px={2} py={1} borderBottom="1px solid rgba(255,255,255,0.1)">
                    <Typography variant="subtitle2" color="#e0e0e0" noWrap>
                        {item.name}
                    </Typography>
                </Box>

                {item.type === 'file' && onDownload && (
                    <MenuItem onClick={() => handleAction(onDownload)}>
                        <ListItemText primary="Скачать" />
                    </MenuItem>
                )}

                {onNewFile && (
                    <MenuItem onClick={() => handleAction(onNewFile)}>
                        <ListItemText primary="Новый файл" />
                    </MenuItem>
                )}

                {onNewFolder && (
                    <MenuItem onClick={() => handleAction(onNewFolder)}>
                        <ListItemText primary="Новая папка" />
                    </MenuItem>
                )}

                <MenuItem onClick={() => handleAction(onRename)}>
                    <ListItemText primary="Переименовать" />
                </MenuItem>

                <MenuItem onClick={() => handleAction(onDelete)} sx={{ color: '#ff5252' }}>
                    <ListItemText primary="Удалить" />
                </MenuItem>
            </List>
        </MenuPaper>
    );
};