import {useSocket} from "./useSocket.hook.ts";

export const useServer = (url: string) => {
    const {send, isConnected} = useSocket(url, {
        autoConnect: true
    });
    // {command: "java", arguments: ["-jar", "server.jar", "nogui"]}
    const start = (args: string) => {
        send('start', args);
    }

    const stop = () => {
        send('stop');
    }

    const sendCommand = (command: string) => {
        send('write', command)
    }

    return {start, stop, sendCommand, isConnected}
}