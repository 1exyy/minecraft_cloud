import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Box, styled } from '@mui/material';
import { keyframes } from '@mui/system';

interface AnimatedBoxProps {
    children: ReactNode;
    isVisible: boolean;
    direction?: 'left' | 'right' | 'top' | 'bottom';
    type?: 'width' | 'height' | 'fade';
    duration?: number;
    className?: string;
    onExit?: () => void;
    sx?: any;
}

const getAnimation = (direction: string, type: string) => {
    if (type === 'fade') {
        return keyframes`
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        `;
    }

    const isWidth = type === 'width';

    // Анимации входа
    if (direction === 'left' && isWidth) {
        return keyframes`
            0% { 
                width: 0;
                opacity: 0;
                transform: translateX(-20px);
            }
            100% { 
                width: var(--target-width, 100%);
                opacity: 1;
                transform: translateX(0);
            }
        `;
    }
    if (direction === 'right' && isWidth) {
        return keyframes`
            0% { 
                width: 0;
                opacity: 0;
                transform: translateX(20px);
            }
            100% { 
                width: var(--target-width, 100%);
                opacity: 1;
                transform: translateX(0);
            }
        `;
    }

    // Анимации выхода
    if (direction === 'left-exit' && isWidth) {
        return keyframes`
            0% { 
                width: var(--target-width, 100%);
                opacity: 1;
                transform: translateX(0);
            }
            100% { 
                width: 0;
                opacity: 0;
                transform: translateX(-20px);
            }
        `;
    }
    if (direction === 'right-exit' && isWidth) {
        return keyframes`
            0% { 
                width: var(--target-width, 100%);
                opacity: 1;
                transform: translateX(0);
            }
            100% { 
                width: 0;
                opacity: 0;
                transform: translateX(20px);
            }
        `;
    }

    return keyframes``;
};

const AnimatedContainer = styled(Box, {
    shouldForwardProp: (prop) =>
        prop !== 'direction' &&
        prop !== 'type' &&
        prop !== 'duration' &&
        prop !== 'isExiting'
})<{
    direction: string;
    type: string;
    duration: number;
    isExiting: boolean;
}>(({ direction, type, duration, isExiting }) => {
    const animDirection = isExiting ? `${direction}-exit` : direction;
    const animation = getAnimation(animDirection, type);

    return {
        '--target-width': '500px',
        animation: `${animation} ${duration}ms ease-in-out forwards`,
        overflow: 'hidden',
        opacity: isExiting ? 1 : 0,
        display: 'flex',
    };
});

export const AnimatedBox: React.FC<AnimatedBoxProps> = ({
                                                            children,
                                                            isVisible,
                                                            direction = 'left',
                                                            type = 'width',
                                                            duration = 500,
                                                            className,
                                                            onExit,
                                                            sx
                                                        }) => {
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
        <AnimatedContainer
            direction={direction}
            type={type}
            duration={duration}
            isExiting={isExiting}
            className={className}
            sx={sx}
        >
            {children}
        </AnimatedContainer>
    );
};