import { styled, keyframes } from '@mui/material';
import { Box, Paper, Typography } from '@mui/material';

export const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const FilesPageContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    height: '100%',
    width: '100%',
    position: 'relative',
    padding: theme.spacing(3),
    gap: theme.spacing(4),
}));

export const TreeContainer = styled(Paper)(({ theme }) => ({
    height: '100%',
    maxWidth: '400px',
    width: '400px',
    padding: theme.spacing(2),
    borderRadius: '24px',
    backgroundColor: 'rgba(26, 26, 26, 0.85)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
}));

export const ContentContainer = styled(Paper)(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    borderRadius: '24px',
    backgroundColor: 'rgba(26, 26, 26, 0.85)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
}));

export const Header = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    paddingBottom: theme.spacing(2),
    borderBottom: '1px solid rgba(224, 224, 224, 0.2)',
    marginBottom: theme.spacing(2),
    animation: `${fadeInLeft} 0.5s ease-out forwards`,
    opacity: 0,
}));

export const Title = styled(Typography)({
    color: '#e0e0e0',
    fontSize: '32px',
    fontWeight: 'bold',
    marginLeft: '16px',
    fontFamily: '"Roboto", sans-serif',
});