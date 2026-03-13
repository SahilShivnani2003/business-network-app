// ─── AlertContext.tsx ─────────────────────────────────────────────────────────
// Owns all state, animations, and helper methods.
// Renders <AlertModal> as a controlled child — zero UI logic here.

import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated } from 'react-native';
import AlertModal from '../components/AlertModal';
import { AlertButton, AlertConfig, AlertContextValue } from '../types/alertTypes';

// ─── Context ──────────────────────────────────────────────────────────────────

const AlertContext = createContext<AlertContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<AlertConfig | null>(null);
    const [visible, setVisible] = useState(false);

    // Animated values passed straight to AlertModal as props
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const cardScale = useRef(new Animated.Value(0.85)).current;
    const cardOpacity = useRef(new Animated.Value(0)).current;

    // Holds the resolve fn for the async confirm() call
    const confirmResolve = useRef<((val: boolean) => void) | null>(null);

    // ── show ──────────────────────────────────────────────────────────────────
    const show = useCallback(
        (cfg: AlertConfig) => {
            setConfig(cfg);
            setVisible(true);

            // Reset before animating in
            backdropOpacity.setValue(0);
            cardScale.setValue(0.85);
            cardOpacity.setValue(0);

            Animated.parallel([
                Animated.timing(backdropOpacity, {
                    toValue: 1,
                    duration: 220,
                    useNativeDriver: true,
                }),
                Animated.spring(cardScale, {
                    toValue: 1,
                    tension: 70,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(cardOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
            ]).start();
        },
        [backdropOpacity, cardScale, cardOpacity],
    );

    // ── dismiss ───────────────────────────────────────────────────────────────
    const dismiss = useCallback(() => {
        Animated.parallel([
            Animated.timing(backdropOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
            Animated.timing(cardOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
            Animated.spring(cardScale, {
                toValue: 0.9,
                tension: 100,
                friction: 10,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setVisible(false);
            setConfig(null);
            // Resolve any pending confirm as false on backdrop/back-button dismiss
            if (confirmResolve.current) {
                confirmResolve.current(false);
                confirmResolve.current = null;
            }
        });
    }, [backdropOpacity, cardOpacity, cardScale]);

    // ── simple helpers ────────────────────────────────────────────────────────
    const success = useCallback(
        (title: string, message?: string) => {
            show({ type: 'success', title, message, dismissOnBackdrop: true });
        },
        [show],
    );

    const error = useCallback(
        (title: string, message?: string) => {
            show({ type: 'error', title, message, dismissOnBackdrop: true });
        },
        [show],
    );

    const warning = useCallback(
        (title: string, message?: string) => {
            show({ type: 'warning', title, message, dismissOnBackdrop: true });
        },
        [show],
    );

    const info = useCallback(
        (title: string, message?: string) => {
            show({ type: 'info', title, message, dismissOnBackdrop: true });
        },
        [show],
    );

    // ── async confirm ─────────────────────────────────────────────────────────
    const confirm = useCallback(
        (title: string, message?: string): Promise<boolean> => {
            return new Promise(resolve => {
                confirmResolve.current = resolve;
                show({
                    type: 'confirm',
                    title,
                    message,
                    dismissOnBackdrop: false,
                    buttons: [
                        {
                            label: 'Cancel',
                            style: 'ghost',
                            onPress: () => {
                                resolve(false);
                                confirmResolve.current = null;
                                dismiss();
                            },
                        },
                        {
                            label: 'Confirm',
                            style: 'primary',
                            onPress: () => {
                                resolve(true);
                                confirmResolve.current = null;
                                dismiss();
                            },
                        },
                    ],
                });
            });
        },
        [show, dismiss],
    );

    // ── derived props for AlertModal ──────────────────────────────────────────
    const buttons: AlertButton[] = config?.buttons ?? [
        { label: 'OK', style: 'primary', onPress: dismiss },
    ];

    const canDismissOnBackdrop = config?.dismissOnBackdrop ?? config?.type !== 'confirm';

    // ── render ────────────────────────────────────────────────────────────────
    return (
        <AlertContext.Provider value={{ show, dismiss, success, error, warning, info, confirm }}>
            {children}

            <AlertModal
                visible={visible}
                config={config}
                buttons={buttons}
                canDismissOnBackdrop={canDismissOnBackdrop}
                onBackdropPress={dismiss}
                onRequestClose={dismiss}
                backdropOpacity={backdropOpacity}
                cardScale={cardScale}
                cardOpacity={cardOpacity}
            />
        </AlertContext.Provider>
    );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAlert = (): AlertContextValue => {
    const ctx = useContext(AlertContext);
    if (!ctx) throw new Error('useAlert must be used inside <AlertProvider>');
    return ctx;
};
