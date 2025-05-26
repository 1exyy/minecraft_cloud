import styles from './ServerPage.module.scss'
import {useSocket} from "../hooks/useSocket.hook.ts";
import {endpoints} from "../api/endpoints.ts";
import {useCallback, useState} from "react";
import {Console} from "../components/Console/Console.tsx";

const ServerPage = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const {send, isConnected} = useSocket(endpoints.SERVER);
    const {} = useSocket(endpoints.CONSOLE, {
        events: {
            message: (message: string) => {
                addMessage(message);
            }
        }
    });


    const sendCommand = useCallback((command: string) => {
        send('write', command);
        addMessage(`[${new Date().toLocaleTimeString()}] [COMMAND]: ${command}`);
    }, []);

    const addMessage = (message: string) => {
        setLogs(prevLogs => [...prevLogs, message]);
    }

    const startHandler = () => {
        send('start', {command: "java", arguments: ["-jar", "server.jar", "nogui"]});
    }

    const stopHandler = () => {
        send('stop');
    }

    return (
        <div className={styles.container}>
            <div className={styles.controls}>
                <button disabled={!isConnected} onClick={startHandler}>Start Server</button>
                <button disabled={!isConnected} onClick={stopHandler}>Stop Server</button>
            </div>

            <Console logs={logs} sendCommand={sendCommand} className={styles.console}/>
        </div>
    );
};

export default ServerPage;