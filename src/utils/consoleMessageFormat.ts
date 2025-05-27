export type consoleType = "COMMAND" | "SYSTEM" | "ERROR";
export const consoleMessage = (message: string, type: consoleType): string => {
    return `[${new Date().toLocaleTimeString()}] [${type}]: ${message}`;
}