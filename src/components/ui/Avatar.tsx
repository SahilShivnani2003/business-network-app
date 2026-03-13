import { View, Text, StyleSheet } from 'react-native';

interface AvatarProps {
    name: string;
    size?: number;
    bgColor?: string;
}
export const Avatar: React.FC<AvatarProps> = ({ name, size = 44, bgColor }) => {
    const initials = name
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    const colors = ['#1565C0', '#0D47A1', '#FF6D00', '#7C3AED', '#16A34A', '#D97706'];
    const color = bgColor || colors[name.charCodeAt(0) % colors.length];
    return (
        <View
            style={[
                styles.avatar,
                { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
            ]}
        >
            <Text style={[styles.avatarText, { fontSize: size * 0.38 }]}>{initials}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    avatar: { alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: '#fff', fontWeight: '700' },
});
