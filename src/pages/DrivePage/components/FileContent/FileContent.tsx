import React, {useState, useEffect} from 'react';
import {
    Box,
    Typography,
    styled,
    Button,
    TextField,
    Skeleton
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import type {FileSystemItem} from "../../types.ts";

const FileInfo = styled(Box)(({theme}) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
    color: '#e0e0e0',
    fontSize: '16px',
}));

const InfoItem = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
});

const FileContent: React.FC<{ item: FileSystemItem | null }> = ({item}) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    // Загрузка содержимого файла
    useEffect(() => {
        if (!item) return;

        setLoading(true);

        const timer = setTimeout(() => {
            if (item.type === 'file') {
                const mockContent = `# ${item.name}\n\nЭто содержимое файла ${item.name}.\nЗдесь вы можете редактировать конфигурационные файлы сервера.`;
                setContent(mockContent);
            } else {
                setContent('');
            }
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [item]);

    const handleSave = () => {
        if (item) {
            console.log('Сохранение файла:', item.path, content);
        }
    };

    if (!item) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Typography variant="h5" color="#e0e0e0">
                    Выберите файл или папку для просмотра содержимого
                </Typography>
            </Box>
        );
    }

    if (item.type === 'directory') {
        return (
            <Box>
                <Typography variant="h6" color="#e0e0e0" gutterBottom>
                    Содержимое папки {item.name}
                </Typography>
                <Typography color="#e0e0e0">
                    Выберите файл для просмотра или редактирования.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <FileInfo>
                <InfoItem>
                    <Typography fontWeight="bold" gutterBottom>Путь:</Typography>
                    {loading ? (
                        <Skeleton variant="text" width="100%" height={24}/>
                    ) : (
                        <Typography>{item.path}</Typography>
                    )}
                </InfoItem>

                <InfoItem>
                    <Typography fontWeight="bold" gutterBottom>Размер:</Typography>
                    {loading ? (
                        <Skeleton variant="text" width="80%" height={24}/>
                    ) : (
                        <Typography>{item.size ? `${(item.size / 1024).toFixed(2)} KB` : 'Неизвестно'}</Typography>
                    )}
                </InfoItem>

                <InfoItem>
                    <Typography fontWeight="bold" gutterBottom>Изменен:</Typography>
                    {loading ? (
                        <Skeleton variant="text" width="70%" height={24}/>
                    ) : (
                        <Typography>{item.modified || 'Неизвестно'}</Typography>
                    )}
                </InfoItem>
            </FileInfo>

            {loading ? (
                <Box mb={2}>
                    <Skeleton variant="rectangular" width="100%" height={300}/>
                </Box>
            ) : (
                <TextField
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    multiline
                    fullWidth
                    minRows={15}
                    maxRows={25}
                    variant="outlined"
                    InputProps={{
                        style: {
                            color: '#e0e0e0',
                            fontFamily: 'monospace',
                            backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        },
                    }}
                    sx={{mb: 2}}
                />
            )}

            {loading ? (
                <Skeleton variant="rectangular" width={120} height={36}/>
            ) : (
                <Button
                    variant="contained"
                    startIcon={<SaveIcon/>}
                    onClick={handleSave}
                    sx={{
                        backgroundColor: 'rgba(189, 66, 250, 0.4)',
                        '&:hover': {
                            backgroundColor: 'rgba(189, 66, 250, 0.6)',
                        },
                    }}
                >
                    Сохранить
                </Button>
            )}
        </Box>
    );
};

export default FileContent;