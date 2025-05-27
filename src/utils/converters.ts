type ByteUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB';

interface ConvertBytesOptions {
    /** Количество десятичных знаков (по умолчанию: 2) */
    precision?: number;
    /** Использовать двоичные (1024) или десятичные (1000) единицы (по умолчанию: true) */
    binary?: boolean;
}

export function convertBytes(
    bytes: number,
    options: ConvertBytesOptions = {}
): string {
    const { precision = 2, binary = true } = options;
    const units: ByteUnit[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const divider = binary ? 1024 : 1000;

    if (bytes === 0) return `0 B`;

    let unitIndex = 0;
    let size = Math.abs(bytes);

    while (size >= divider && unitIndex < units.length - 1) {
        size /= divider;
        unitIndex++;
    }

    const rounded = size.toFixed(precision).replace(/\.?0+$/, '');
    return `${rounded} ${units[unitIndex]}`;
}