import React, {useState, useEffect, useRef} from 'react';
import type {KeyboardEvent, ChangeEvent} from 'react';
import styles from './InputWithSuggestions.module.scss'

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

    useEffect(() => {
        if (!value.trim() || !showSuggestions) {
            setSuggestions([]);
            return;
        }

        const firstSpaceIndex = value.indexOf(' ');
        const commandBase = firstSpaceIndex > 0
            ? value.substring(0, firstSpaceIndex)
            : value;

        const matched = commands.filter(cmd =>
            cmd.toLowerCase().startsWith(commandBase.toLowerCase())
        );

        setSuggestions(matched);
        setSelectedIndex(matched.length > 0 ? 0 : -1);
    }, [value, commands, showSuggestions]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        setShowSuggestions(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (showSuggestions && suggestions.length > 0) {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedIndex(prev =>
                        prev < suggestions.length - 1 ? prev + 1 : -1
                    );
                    return;

                case 'ArrowUp':
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedIndex(prev =>
                        prev > 0 ? prev - 1 : suggestions.length - 1
                    );
                    return;

                case 'Enter':
                    if (selectedIndex >= 0) {
                        e.preventDefault();
                        e.stopPropagation();
                        applySuggestion(suggestions[selectedIndex]);
                    }
                    return;

                case 'Tab':
                    if (selectedIndex >= 0) {
                        e.preventDefault();
                        e.stopPropagation();
                        applySuggestion(suggestions[selectedIndex]);
                    }
                    return;

                case 'Escape':
                    e.preventDefault();
                    e.stopPropagation();
                    setShowSuggestions(false);
                    return;

                default:
                    break;
            }
        }

        if (onKeyDown) {
            onKeyDown(e);
        }
    };

    const applySuggestion = (command: string) => {
        const preserveArgs = () => {
            const firstSpaceIndex = value.indexOf(' ');
            return firstSpaceIndex > 0 ? value.substring(firstSpaceIndex) : '';
        };

        onChange(command + preserveArgs());
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
