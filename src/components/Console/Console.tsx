import type {FC, KeyboardEventHandler} from "react";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {InputWithSuggestions} from "../InputWithSuggestions/InputWithSuggestions.tsx";
import {commandSuggestions} from "../../constants/commandSuggestions.ts";
import {
    Paper,
    Box,
    Typography,
    styled
} from '@mui/material';
import type {PaperProps} from '@mui/material'

interface IConsole extends PaperProps {
    logs: string[];
    sendCommand: (command: string) => void;
}

const ConsoleContainer = styled(Paper)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
    borderRadius: '24px',
    backgroundColor: 'rgba(26, 26, 26, 0.85)',
    backdropFilter: 'blur(10px)',
    height: '100%',
    overflow: 'hidden',
    transition: 'width 0.3s',
    gap: theme.spacing(1),
}));

const LogsContainer = styled(Box)(({theme}) => ({
    overflow: 'auto',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: '18px',
    color: '#e0e0e0',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingRight: theme.spacing(1),

    '&::-webkit-scrollbar': {
        width: '10px',
    },
    '&::-webkit-scrollbar-track': {
        background: 'rgba(40, 40, 40, 0.5)',
        borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: 'rgba(100, 100, 100, 0.7)',
        borderRadius: '10px',
        border: '2px solid transparent',
        backgroundClip: 'content-box',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: 'rgba(120, 120, 120, 0.9)',
    },
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(100, 100, 100, 0.7) rgba(40, 40, 40, 0.5)',
    scrollBehavior: 'smooth'
}));

const LogEntry = styled(Typography)({
    padding: '2px 0',
    wordBreak: 'break-word',
    fontSize: '18px',
    lineHeight: 1.5,
    color: '#e0e0e0',
    fontFamily: '"Roboto", sans-serif',
});

const CommandInput = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingTop: '12px',
});

export const Console: FC<IConsole> = React.memo(({className, logs, sendCommand, ...rest}) => {
    const [enterValue, setEnterValue] = useState<string>("");
    const containerRef = useRef<HTMLDivElement>(null);
    const commandsHistory = useRef<string[]>([]);
    const commandsHistoryCount = useRef<number>(0);

    const sendCommandHandler: KeyboardEventHandler<HTMLInputElement> = useCallback((event) => {
        switch (event.key) {
            case 'Enter': {
                if (enterValue.trim()) {
                    sendCommand(enterValue);
                    commandsHistory.current.push(enterValue);
                }
                setEnterValue("");
                commandsHistoryCount.current = commandsHistory.current.length;
                break;
            }

            case "ArrowUp": {
                event.preventDefault();
                if (!commandsHistory.current.length) return;

                commandsHistoryCount.current = Math.max(commandsHistoryCount.current - 1, 0);
                setEnterValue(commandsHistory.current[commandsHistoryCount.current]);
                break;
            }

            case "ArrowDown": {
                event.preventDefault();
                if (!commandsHistory.current.length) return;

                commandsHistoryCount.current = Math.min(
                    commandsHistoryCount.current + 1,
                    commandsHistory.current.length
                );

                setEnterValue(
                    commandsHistoryCount.current === commandsHistory.current.length
                        ? ""
                        : commandsHistory.current[commandsHistoryCount.current]
                );
                break;
            }
        }
    }, [enterValue, sendCommand]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <ConsoleContainer
            className={className}
            elevation={8}
            {...rest}
        >
            <LogsContainer ref={containerRef}>
                {logs.map((data, index) => (
                    <LogEntry key={index}>
                        {data}
                    </LogEntry>
                ))}
            </LogsContainer>

            <CommandInput>
                <Typography fontSize={24} fontWeight="bolder" color="#e0e0e0">{'>'}</Typography>
                <InputWithSuggestions
                    value={enterValue}
                    commands={commandSuggestions}
                    onChange={value => setEnterValue(value)}
                    onKeyDown={sendCommandHandler}
                    fullWidth
                />
            </CommandInput>
        </ConsoleContainer>
    );
});