import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    styled,
    Skeleton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import type { FileSystemItem } from "../../types.ts";
import {useCallback, useState} from "react";

interface FileTreeProps {
    data: FileSystemItem[];
    onSelect: (item: FileSystemItem) => void;
    loading?: boolean;
}

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
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

interface FileTreeProps {
    data: FileSystemItem[];
    onSelect: (item: FileSystemItem) => void;
    loading?: boolean;
}

const FileTree: React.FC<FileTreeProps> = ({ data, onSelect, loading = false }) => {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [selected, setSelected] = useState<string | null>(null);

    const toggleExpand = useCallback((path: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpanded(prev => ({ ...prev, [path]: !prev[path] }));
    }, []);

    const handleSelect = useCallback((item: FileSystemItem) => {
        if (!loading) {
            setSelected(item.path);
            onSelect(item);
        }
    }, [loading, onSelect]);

    const renderSkeleton = (count: number, level = 0) => {
        return Array.from({ length: count }).map((_, index) => (
            <Box key={index} pl={level * 2} display="flex" alignItems="center" py={1}>
                <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
                <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
                <Skeleton variant="text" width={150} height={24} />
            </Box>
        ));
    };

    const renderTree = (items: FileSystemItem[], level = 0) => {
        if (loading) {
            return renderSkeleton(5, level);
        }

        return items.map(item => (
            <Box key={item.path} pl={level * 2}>
                <StyledListItemButton
                    onClick={() => handleSelect(item)}
                    selected={selected === item.path}
                    disabled={loading}
                >
                    {item.type === 'directory' && (
                        <ListItemIcon
                            sx={{ minWidth: '24px', marginRight: '8px' }}
                            onClick={(e) => toggleExpand(item.path, e)}
                        >
                            {expanded[item.path] ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                        </ListItemIcon>
                    )}

                    {item.type !== 'directory' && (
                        <ListItemIcon sx={{ minWidth: '24px', marginRight: '8px' }}>
                            <Box width={24} height={24} />
                        </ListItemIcon>
                    )}

                    <ListItemIcon sx={{ minWidth: '24px', marginRight: '8px' }}>
                        {item.type === 'directory' ?
                            <FolderIcon sx={{ color: '#e0e0e0' }} /> :
                            <InsertDriveFileIcon sx={{ color: '#e0e0e0' }} />
                        }
                    </ListItemIcon>

                    <ListItemText
                        primary={item.name}
                        primaryTypographyProps={{
                            fontSize: '16px',
                            color: '#e0e0e0',
                            fontFamily: '"Roboto", sans-serif'
                        }}
                    />
                </StyledListItemButton>

                {item.type === 'directory' && item.children && (
                    <Collapse in={expanded[item.path]} timeout="auto">
                        {renderTree(item.children, level + 1)}
                    </Collapse>
                )}
            </Box>
        ));
    };

    return (
        <List component="nav" sx={{ width: '100%', overflow: 'auto' }}>
            {renderTree(data)}
        </List>
    );
};

export default FileTree;