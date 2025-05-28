import styles from './ServerPage.module.scss'
import {useSocket} from "../../hooks/useSocket.hook.ts";
import {endpoints} from "../../api/endpoints.ts";
import {useCallback, useState} from "react";
import {Console} from "../../components/Console/Console.tsx";
import type {IServerMonitoring} from "../../components/Monitoring/types.ts";
import {Monitoring} from "../../components/Monitoring/Monitoring.tsx";
import clsx from "clsx";
import {consoleMessage} from "../../utils/consoleMessageFormat.ts";
import {AnimatedBox} from "../../components/AnimatedBox/AnimatedBox.tsx";

const monitoringEmptyData: IServerMonitoring = {
    cpu: {
        total: 0,
        used: 0
    },
    memory: {
        used: 0,
        total: 0
    }
}
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
    }, []);

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
    }, [send])

    return (
        <div className={clsx(styles.container, {[styles.started]: isServerStart})}>
            <AnimatedBox
                isVisible={isServerStart}
                className={styles.monitoring}
            >
                <Monitoring monitoringData={monitoring}/>
            </AnimatedBox>
            <div className={styles.console_wrapper}>
                <div className={styles.controls}>
                    <button
                        onClick={serverSwitch}
                        disabled={!isConnected}
                        title={isServerStart ? "Выключить" : "Включить"}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 3V12M18.3611 5.64001C19.6195 6.8988 20.4764 8.50246 20.8234 10.2482C21.1704 11.994 20.992 13.8034 20.3107 15.4478C19.6295 17.0921 18.4759 18.4976 16.9959 19.4864C15.5159 20.4752 13.776 21.0029 11.9961 21.0029C10.2162 21.0029 8.47625 20.4752 6.99627 19.4864C5.51629 18.4976 4.36274 17.0921 3.68146 15.4478C3.00019 13.8034 2.82179 11.994 3.16882 10.2482C3.51584 8.50246 4.37272 6.8988 5.6311 5.64001"
                                stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
                <Console logs={logs} sendCommand={sendCommand}
                         className={clsx(styles.console, {[styles.started]: isServerStart})}/>
            </div>
        </div>
    );
};

export default ServerPage;