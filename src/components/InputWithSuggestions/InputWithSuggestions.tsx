import React, {useState, useEffect, useRef} from 'react';
import type {KeyboardEvent, ChangeEvent} from 'react'
import {
    TextField,
    Paper,
    List,
    ListItem,
    ListItemText,
    Popper,
    Grow,
    ClickAwayListener,
    styled
} from '@mui/material';

interface InputWithSuggestionsProps {
    commands: string[];
    value: string;
    onChange: (value: string) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    fullWidth?: boolean;
}

const SuggestionItem = styled(ListItem)<{ selected?: boolean }>(({ theme }) => ({
    cursor: 'pointer',
    padding: theme.spacing(0.5, 2),
    transition: 'all 0.2s',
    color: '#e0e0e0',
    '&:hover, &.Mui-selected': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        fontWeight: 'bold',
    },
}));

const SuggestionsPaper = styled(Paper)(() => ({
    background: 'rgba(40, 40, 40, 0.85)',
    backdropFilter: 'blur(10px)',
    color: '#e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
}));

export const InputWithSuggestions: React.FC<InputWithSuggestionsProps> = ({
                                                                              commands,
                                                                              value,
                                                                              onChange,
                                                                              onKeyDown,
                                                                              placeholder = 'Введите команду...',
                                                                              fullWidth = false
                                                                          }) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);

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
    };

    const handleBlur = () => {
        setTimeout(() => setShowSuggestions(false), 200);
    };

    const handleSuggestionClick = (cmd: string) => {
        applySuggestion(cmd);
        anchorRef.current?.querySelector('input')?.focus();
    };

    return (
        <div ref={anchorRef} style={{width: fullWidth ? '100%' : 'auto', position: 'relative'}}>
            <TextField
                fullWidth={fullWidth}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder={placeholder}
                variant="standard"
                InputProps={{
                    disableUnderline: true,
                    style: {
                        color: '#e0e0e0',
                        fontSize: '18px',
                        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    }
                }}
                sx={{
                    '& .MuiInputBase-root': {
                        padding: 0
                    },
                    '& .MuiInputBase-input::placeholder': {
                        color: 'rgba(224, 224, 224, 0.7)',
                    }
                }}
            />

            <Popper
                open={showSuggestions && suggestions.length > 0}
                anchorEl={anchorRef.current}
                placement="top-start"
                transition
                disablePortal
                style={{
                    width: anchorRef.current?.clientWidth,
                    zIndex: 1300,
                    maxHeight: '200px',
                    overflowY: 'auto',
                }}
                modifiers={[
                    {
                        name: 'flip',
                        enabled: false,
                    },
                    {
                        name: 'preventOverflow',
                        enabled: true,
                        options: {
                            altBoundary: true,
                            tether: false,
                            rootBoundary: 'document',
                        },
                    }
                ]}
            >
                {({TransitionProps}) => (
                    <Grow {...TransitionProps} style={{transformOrigin: 'bottom center'}}>
                        <SuggestionsPaper elevation={8}>
                            <ClickAwayListener onClickAway={() => setShowSuggestions(false)}>
                                <List dense sx={{py: 0.5}}>
                                    {suggestions.map((cmd, index) => (
                                        <SuggestionItem
                                            key={cmd}
                                            selected={index === selectedIndex}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                            onClick={() => handleSuggestionClick(cmd)}
                                        >
                                            <ListItemText primary={cmd} primaryTypographyProps={{fontSize: '14px'}}/>
                                        </SuggestionItem>
                                    ))}
                                </List>
                            </ClickAwayListener>
                        </SuggestionsPaper>
                    </Grow>
                )}
            </Popper>
        </div>
    );
};