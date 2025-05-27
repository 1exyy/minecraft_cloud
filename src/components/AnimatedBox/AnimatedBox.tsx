import React, { useState, useEffect,  } from 'react';
import type {ReactNode} from 'react'
import clsx from 'clsx';
import styles from './AnimatedBox.module.scss';

interface AnimatedBoxProps {
    children: ReactNode;
    isVisible: boolean;
    direction?: 'left' | 'right' | 'top' | 'bottom';
    type?: 'width' | 'height';
    duration?: number;
    className?: string;
    onExit?: () => void;
}

export const AnimatedBox = ({
                                children,
                                isVisible,
                                direction = 'left',
                                type = 'width',
                                duration = 500,
                                className,
                                onExit
                            }: AnimatedBoxProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsMounted(true);
            setIsExiting(false);
        } else if (isMounted) {
            setIsExiting(true);
            const timer = setTimeout(() => {
                setIsMounted(false);
                onExit?.();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, isMounted, onExit]);

    if (!isMounted) return null;

    return (
        <div
            className={clsx(
                styles.container,
                styles[`${direction}-${type}`],
                isExiting && styles.exit,
                className
            )}
            style={{ '--animation-duration': `${duration}ms` } as React.CSSProperties}
        >
            {children}
        </div>
    );
};