import React, {useId} from 'react';
import styles from './Input.module.scss'
import clsx from "clsx";

type TInputVariant = "console" | "base";

interface IInput extends React.ComponentPropsWithoutRef<'input'> {
    label?: string
    variant?: TInputVariant
}

export const Input: React.FC<IInput> = ({
                                            label,
                                            id,
                                            variant = "base",
                                            className,
                                            ...props
                                        }) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
        <div className={clsx(className, styles.wrapper, variant)}>
            {label && (
                <label
                    htmlFor={inputId}
                    className={styles.label}
                >
                    {label}
                </label>
            )}
            <input
                autoFocus={true}
                id={inputId}
                {...props}
                className={styles.input}
            />
        </div>
    );
};

