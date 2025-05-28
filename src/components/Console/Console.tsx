import type {ComponentPropsWithoutRef, FC, KeyboardEventHandler} from "react";
import styles from './Console.module.scss';
// import {Input} from "../Input/Input.tsx";
import clsx from "clsx";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {InputWithSuggestions} from "../InputWithSuggestions/InputWithSuggestions.tsx";
import {commandSuggestions} from "../../constants/commandSuggestions.ts";

interface IConsole extends ComponentPropsWithoutRef<'div'> {
    width?: number;
    height?: number;
    logs: string[],
    sendCommand: (command: string) => void;
}

export const Console: FC<IConsole> = React.memo(({width, height, className, logs, sendCommand, ...rest}) => {
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
        <>
            <div className={clsx(styles.container, "frosted-glass", className)} style={{width, height}} {...rest}>
                <div className={styles.body} ref={containerRef}>
                    {logs.map((data, index) => <div key={index} className={styles.message}>{data}</div>)}
                </div>
                <div className={styles.input}>
                    <span>{'>'}</span>

                    <InputWithSuggestions value={enterValue} commands={commandSuggestions}
                                          onChange={value => setEnterValue(value)}
                                          onKeyDown={sendCommandHandler}/>
                </div>
            </div>
        </>

    );
});

