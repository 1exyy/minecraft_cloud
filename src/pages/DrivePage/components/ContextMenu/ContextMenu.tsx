import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import type {ContextMenu} from "../../types.ts";

interface FileContextMenuProps {
    contextMenu: ContextMenu | null;
    handleClose: () => void;
    onRename: () => void;
    onDelete: () => void;
}

export const FileContextMenu = ({
                                    contextMenu,
                                    handleClose,
                                    onRename,
                                    onDelete
                                }: FileContextMenuProps) => {
    return (
        <Menu
            open={contextMenu !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
                contextMenu !== null
                    ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                    : undefined
            }
            PaperProps={{
                sx: {
                    backgroundColor: 'rgba(26, 26, 26, 0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    '& .MuiMenuItem-root': {
                        color: '#e0e0e0',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                    },
                },
            }}
        >
            <MenuItem onClick={onRename}>
                <ListItemIcon sx={{ color: '#e0e0e0', minWidth: '36px' }}>
                    <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Переименовать</ListItemText>
            </MenuItem>
            <MenuItem onClick={onDelete}>
                <ListItemIcon sx={{ color: '#e0e0e0', minWidth: '36px' }}>
                    <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Удалить</ListItemText>
            </MenuItem>
        </Menu>
    );
};