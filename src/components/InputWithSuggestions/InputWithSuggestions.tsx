import React, { useState, useEffect, useRef } from 'react';
import type { KeyboardEvent, ChangeEvent } from 'react';
import styles from './InputWithSuggestions.module.scss';

interface InputWithSuggestionsProps {
    commands: string[];
    value: string;
    onChange: (value: string) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

export const InputWithSuggestions: React.FC<InputWithSuggestionsProps> = ({
                                                                              commands,
                                                                              value,
                                                                              onChange,
                                                                              onKeyDown,
                                                                              placeholder = 'Введите команду...'
                                                                          }) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const getCommandBase = (input: string) => {
        const trimmed = input.trim();
        const firstSpace = trimmed.indexOf(' ');
        return firstSpace > 0 ? trimmed.slice(0, firstSpace) : trimmed;
    };

    const isExactMatch = (cmd: string) =>
        commands.some(c => c.toLowerCase() === cmd.toLowerCase());

    useEffect(() => {
        const base = getCommandBase(value);
        const hasArgs = value.trim().includes(' ');
        const matched = commands.filter(cmd =>
            cmd.toLowerCase().startsWith(base.toLowerCase())
        );

        if (isExactMatch(base) && hasArgs) {
            setSuggestions([]);
            return;
        }

        setSuggestions(matched);
        setSelectedIndex(-1);
    }, [value, commands]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        setShowSuggestions(true);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const base = getCommandBase(value);
        const matched = isExactMatch(base);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : 0
                );
                break;

            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev > 0 ? prev - 1 : suggestions.length - 1
                );
                break;

            case 'Enter':
                if (
                    selectedIndex >= 0 &&
                    suggestions[selectedIndex].toLowerCase() !== base.toLowerCase()
                ) {
                    e.preventDefault();
                    applySuggestion(suggestions[selectedIndex]);
                    return;
                }

                if (matched) break;

                e.preventDefault();
                break;

            case 'Tab':
                if (selectedIndex >= 0) {
                    e.preventDefault();
                    applySuggestion(suggestions[selectedIndex]);
                }
                break;

            case 'Escape':
                setShowSuggestions(false);
                break;

            default:
                break;
        }

        if (onKeyDown) {
            onKeyDown(e);
        }
    };

    const applySuggestion = (command: string, preserveArgs = true) => {
        const suffix = preserveArgs
            ? value.slice(value.indexOf(' ')).trimStart()
            : '';
        onChange(command + (suffix ? ' ' + suffix : ''));
        setShowSuggestions(false);
        setSelectedIndex(-1);
        setTimeout(() => inputRef.current?.focus(), 10);
    };

    const handleBlur = () => {
        setTimeout(() => setShowSuggestions(false), 200);
    };

    return (
        <div className={styles.container}>
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
                onBlur={handleBlur}
                placeholder={placeholder}
                className={styles.input}
            />

            {showSuggestions && suggestions.length > 0 && (
                <div className={styles.suggestionsContainer}>
                    {suggestions.map((cmd, index) => (
                        <div
                            key={cmd}
                            className={`${styles.suggestionItem} ${
                                index === selectedIndex
                                    ? `${styles.suggestionItemHovered} ${styles.suggestionItemSelected}`
                                    : ''
                            }`}
                            onMouseEnter={() => setSelectedIndex(index)}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                applySuggestion(cmd);
                            }}
                        >
                            {cmd}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};