import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Colors, FontSize, BorderRadius, Shadow } from '../../theme/colors';
import { MOCK_MESSAGES } from '../../data/mockData';
import { Avatar } from '../../components/ui/Avatar';

type Props = { navigation: any };

const MessagesScreen: React.FC<Props> = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const filtered = MOCK_MESSAGES.filter(m =>
    search === '' || m.sender.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.newMsgBtn}>
          <Text style={styles.newMsgIcon}>✏️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput style={styles.searchInput} value={search} onChangeText={setSearch} placeholder="Search conversations..." placeholderTextColor={Colors.textMuted} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate('ChatScreen', { memberId: item.sender.id })}
            activeOpacity={0.85}
          >
            <View style={styles.avatarWrapper}>
              <Avatar name={item.sender.name} size={52} />
              <View style={styles.onlineDot} />
            </View>
            <View style={styles.chatInfo}>
              <View style={styles.chatTop}>
                <Text style={styles.chatName}>{item.sender.name}</Text>
                <Text style={styles.chatTime}>{item.timestamp}</Text>
              </View>
              <Text style={styles.chatCompany}>{item.sender.company}</Text>
              <View style={styles.chatBottom}>
                <Text style={styles.chatMsg} numberOfLines={1}>{item.lastMessage}</Text>
                {item.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* New message FAB */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Text style={styles.fabIcon}>💬</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primaryDark, paddingTop: 52, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.white },
  newMsgBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: `${Colors.white}20`, alignItems: 'center', justifyContent: 'center' },
  newMsgIcon: { fontSize: 18 },
  searchWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, margin: 16, borderRadius: BorderRadius.lg, paddingHorizontal: 14, ...Shadow.card },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchInput: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary, paddingVertical: 12 },
  list: { paddingBottom: 100 },
  chatItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: Colors.surface, gap: 14 },
  avatarWrapper: { position: 'relative' },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.success, borderWidth: 2, borderColor: Colors.surface },
  chatInfo: { flex: 1 },
  chatTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  chatName: { fontSize: FontSize.md, fontWeight: '800', color: Colors.textPrimary },
  chatTime: { fontSize: 11, color: Colors.textMuted },
  chatCompany: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: 4 },
  chatBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatMsg: { fontSize: FontSize.sm, color: Colors.textSecondary, flex: 1, marginRight: 8 },
  unreadBadge: { backgroundColor: Colors.primary, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  unreadText: { color: Colors.white, fontSize: 11, fontWeight: '800' },
  separator: { height: 1, backgroundColor: Colors.border, marginLeft: 82 },
  fab: { position: 'absolute', bottom: 90, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', ...Shadow.button },
  fabIcon: { fontSize: 24 },
});

export default MessagesScreen;
