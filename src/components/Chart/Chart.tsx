import React from 'react';
import {CircularProgress, Box, Typography, styled} from '@mui/material';

interface IChart {
    percent: number;
    className?: string;
}

const StyledProgress = styled(CircularProgress)(() => ({
    position: 'relative',
    '& .MuiCircularProgress-circle': {
        strokeLinecap: 'round',
    },
    '& .MuiCircularProgress-svg': {
        transform: 'rotate(-90deg)',
    },
}));

export const Chart: React.FC<IChart> = React.memo(({percent}) => {
    return (
        <Box position="relative" maxWidth="350px" justifySelf="center" display="inline-flex">
            <StyledProgress
                variant="determinate"
                value={100}
                size={350}
                thickness={4}
                sx={{
                    color: 'rgba(255, 255, 255, 0.67)',
                    position: 'absolute',
                }}
            />
            <StyledProgress
                variant="determinate"
                value={percent}
                size={350}
                thickness={4}
                sx={{
                    color: 'rgba(189, 66, 250, 0.4)',
                }}
            />
            <Box
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="100%"
                height="100%"
            >
                <Typography
                    variant="h2"
                    component="div"
                    color="#e0e0e0"
                    fontSize={56}
                >
                    {`${percent}%`}
                </Typography>
            </Box>
        </Box>
    );
});