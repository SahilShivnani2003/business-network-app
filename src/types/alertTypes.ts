// ─── alert.types.ts ───────────────────────────────────────────────────────────

export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'confirm';
export type ButtonStyle = 'primary' | 'danger' | 'ghost' | 'warning';

export interface AlertButton {
    label: string;
    onPress: () => void;
    style?: ButtonStyle;
}

export interface AlertConfig {
    type: AlertType;
    title: string;
    message?: string;
    buttons?: AlertButton[];
    /** Tap backdrop to dismiss — defaults to true except for 'confirm' */
    dismissOnBackdrop?: boolean;
}

export interface AlertContextValue {
    show: (config: AlertConfig) => void;
    dismiss: () => void;
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
    confirm: (title: string, message?: string) => Promise<boolean>;
}