import {useEffect, useState, useCallback, useRef, useMemo} from 'react';
import io from 'socket.io-client';
import type {Socket} from 'socket.io-client';
import type {SocketOptions} from "dgram";

type EventHandler = (...args: any[]) => void;

interface UseSocketOptions {
    autoConnect?: boolean;
    events?: {
        [eventName: string]: EventHandler;
    };
}

export const useSocket = (
    url: string,
    options?: UseSocketOptions & Partial<SocketOptions>
) => {
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<typeof Socket | null>(null);
    const eventsRef = useRef(options?.events);

    const socketOptions = useMemo(() => {
        const {events, ...rest} = options ?? {}
        return {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 3000,
            ...rest,
        };
    }, [url, options?.autoConnect]);

    useEffect(() => {
        const socket = io(url, socketOptions);
        socketRef.current = socket;

        const handleConnect = () => setIsConnected(true);
        const handleDisconnect = () => setIsConnected(false);

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);

        if (socketOptions.autoConnect !== false) {
            socket.connect();
        }

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.close();
        };
    }, [url, socketOptions]);

    useEffect(() => {
        eventsRef.current = options?.events;
    }, [options?.events]);

    useEffect(() => {
        const socket = socketRef.current;
        if (!socket || !eventsRef.current) return;

        const events = eventsRef.current;
        Object.entries(events).forEach(([event, handler]) => {
            socket.on(event, handler);
        });

        return () => {
            Object.entries(events).forEach(([event, handler]) => {
                socket.off(event, handler);
            });
        };
    }, [socketRef.current, options?.events]);

    const send = useCallback((event: string, ...args: any[]) => {
        socketRef.current?.emit(event, ...args);
    }, []);

    const connect = useCallback(() => socketRef.current?.connect(), []);
    const disconnect = useCallback(() => socketRef.current?.disconnect(), []);

    return {
        socket: socketRef.current,
        isConnected,
        send,
        connect,
        disconnect,
    };
};
