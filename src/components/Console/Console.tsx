import type {ComponentPropsWithoutRef, FC, KeyboardEventHandler} from "react";
import styles from './Console.module.scss';
import {Input} from "../Input/Input.tsx";
import clsx from "clsx";
import React, {useCallback, useState} from "react";

interface IConsole extends ComponentPropsWithoutRef<'div'> {
    width?: number;
    height?: number;
    logs: string[],
    sendCommand: (command: string) => void;
}

export const Console: FC<IConsole> = React.memo(({width, height, className, logs, sendCommand, ...rest}) => {
    const [enterValue, setEnterValue] = useState<string>("");

    const sendCommandHandler: KeyboardEventHandler<HTMLInputElement> = useCallback((event) => {
        if (event.key === 'Enter') {
            sendCommand(enterValue);
            setEnterValue("");
        }
    }, [enterValue]);


    return (
        <>
            <div className={clsx(styles.container, className)} style={{width, height}} {...rest}>
                <div className={styles.body}>
                    {logs.map((data, index) => <div key={index} className={styles.message}>{data}</div>)}
                </div>
                <div className={styles.input}>
                    <span>{'>'}</span>
                    <Input value={enterValue}
                           onChange={event => setEnterValue(event.target.value)}
                           onKeyDown={sendCommandHandler}
                    />

                </div>
            </div>
        </>

    );
});

