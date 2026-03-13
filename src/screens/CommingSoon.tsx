import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, BorderRadius } from '../theme/colors';

type Props = {
    title?: string;
    subtitle?: string;
};

const ComingSoon: React.FC<Props> = ({
    title = 'Coming Soon',
    subtitle = `We're working on something awesome.\nStay tuned!`,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconWrap}>
                <Text style={styles.icon}>🚀</Text>
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    iconWrap: {
        width: 96,
        height: 96,
        borderRadius: BorderRadius.full,
        backgroundColor: `${Colors.primary}12`,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    icon: {
        fontSize: 42,
    },
    title: {
        fontSize: FontSize.xxl,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
});

export default ComingSoon;