import {useCallback, useState} from 'react';
import {Box, IconButton, styled} from '@mui/material';
import {useSocket} from "../../hooks/useSocket.hook.ts";
import {endpoints} from "../../api/endpoints.ts";
import {Console} from "../../components/Console/Console.tsx";
import type {IServerMonitoring} from "../../components/Monitoring/types.ts";
import {Monitoring} from "../../components/Monitoring/Monitoring.tsx";
import {consoleMessage} from "../../utils/consoleMessageFormat.ts";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import FolderIcon from '@mui/icons-material/Folder';
import {AnimatedBox} from "../../components/AnimatedBox/AnimatedBox.tsx";
import {keyframes} from '@mui/system';
import {Link} from 'react-router'

const monitoringEmptyData: IServerMonitoring = {
    cpu: {
        total: 0,
        used: 0
    },
    memory: {
        used: 0,
        total: 0
    }
};

const fadeInTop = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
`;

const ServerPageContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    height: '100%',
    width: '100%',
    position: 'relative',
    padding: theme.spacing(3),
    gap: theme.spacing(4),
}));

const ControlsContainer = styled(Box)(({theme}) => ({
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    top: theme.spacing(1.5),
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1.5),
    backgroundColor: 'rgba(255, 255, 255, 0.56)',
    borderRadius: '24px',
    minWidth: '200px',
    padding: theme.spacing(0, 1.5),
    height: '64px',
    backdropFilter: 'blur(4px)',
    animation: `${fadeInTop} 0.5s ease-out forwards`,
    opacity: 0,
}));

const MonitoringContainer = styled(Box)(({theme}) => ({
    height: '100%',
    maxWidth: '500px',
    width: '500px',
    display: 'grid',
    gridTemplateRows: '1fr 1fr',
    gap: theme.spacing(4),
    transition: 'all 0.5s ease',
}));

const ConsoleWrapper = styled(Box)({
    position: 'relative',
    flexGrow: 1,
    minWidth: 0,
});

const ServerPage = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [isServerStart, setIsServerStart] = useState<boolean>(false);
    const [monitoring, setMonitoring] = useState<IServerMonitoring>(monitoringEmptyData);
    const {send, isConnected} = useSocket(endpoints.SERVER, {});

    useSocket(endpoints.CONSOLE, {
        events: {
            message: (message: string) => {
                addMessage(message);
            },
            monitoring: (data: IServerMonitoring) => {
                setMonitoring(data);
            },
            exit: () => {
                setIsServerStart(false);
                addMessage(consoleMessage("Server was stopped", "SYSTEM"));
            },
            error: (error) => {
                setIsServerStart(false);
                addMessage(consoleMessage(error, "ERROR"));
            }
        }
    });

    const sendCommand = useCallback((command: string) => {
        send('write', command);
        addMessage(consoleMessage(command, "COMMAND"));
    }, [send]);

    const addMessage = useCallback((message: string) => {
        setLogs(prevLogs => [...prevLogs.slice(-999), message]);
    }, []);

    const serverSwitch = useCallback(() => {
        isServerStart ? stopHandler() : startHandler()
    }, [isServerStart]);

    const startHandler = useCallback(() => {
        setIsServerStart(true);
        send('start', {command: "java", arguments: ["-jar", "server.jar", "nogui"]});
    }, [send]);

    const stopHandler = useCallback(() => {
        send('stop');
    }, [send]);

    return (
        <ServerPageContainer>
            <AnimatedBox
                isVisible={isServerStart}
                direction="left"
                type="width"
                duration={500}
                sx={{
                    maxWidth: '500px',
                    width: '500px',
                    flexShrink: 0,
                }}
            >
                <MonitoringContainer>
                    <Monitoring monitoringData={monitoring}/>
                </MonitoringContainer>
            </AnimatedBox>

            <ConsoleWrapper>
                <ControlsContainer>
                    <IconButton
                        onClick={serverSwitch}
                        disabled={!isConnected}
                        title={isServerStart ? "Выключить" : "Включить"}
                        sx={{
                            ...(isServerStart && {
                                boxShadow: '1px 1px 3px #1a1a1a',
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                padding: '4px'
                            })
                        }}
                    >
                        <PowerSettingsNewIcon fontSize="large"/>
                    </IconButton>

                    <IconButton
                        disabled={!isConnected}
                        title="Перезагрузить">
                        <RestartAltIcon fontSize="large"/>
                    </IconButton>

                    <IconButton title="Настройки">
                        <SettingsIcon fontSize="large"/>
                    </IconButton>

                    <Link to="/server/drive" title="Файлы сервера">
                        <FolderIcon fontSize="large"/>
                    </Link>
                </ControlsContainer>

                <Console
                    logs={logs}
                    sendCommand={sendCommand}
                    sx={{
                        width: '100%',
                        height: '100%',
                        minWidth: 0,
                    }}
                />
            </ConsoleWrapper>
        </ServerPageContainer>
    );
};

export default ServerPage;