import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/header';
import { SectionHeader } from '../components/UIComponent';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme/theme';

const ARTICLES = [
  { id: '1', title: '10 Networking Strategies That Actually Work in 2025', category: 'Growth', read: '5 min', emoji: '📈', featured: true, author: 'Harish Mehta', date: 'Feb 10', views: '2.4k', excerpt: 'Discover the proven networking strategies that top business leaders use to build lasting connections...' },
  { id: '2', title: 'How to Convert Connections into Paying Clients', category: 'Sales', read: '7 min', emoji: '🤝', featured: true, author: 'Priya Shah', date: 'Feb 5', views: '1.8k', excerpt: 'The art of turning your network into revenue — a step-by-step breakdown of consultative relationship building...' },
  { id: '3', title: 'Success Story: How Sneha Built a ₹5Cr Export Business', category: 'Stories', read: '4 min', emoji: '⭐', featured: false, author: 'iNext Team', date: 'Jan 28', views: '3.1k', excerpt: 'Starting with just ₹50,000 and a dream, Sneha Mehta has built one of the fastest-growing textile export businesses...' },
  { id: '4', title: 'GST & Compliance: What Every Business Owner Must Know', category: 'Finance', read: '8 min', emoji: '📊', featured: false, author: 'CA Rohit Gupta', date: 'Jan 22', views: '987', excerpt: 'Navigating GST compliance doesn\'t have to be stressful. Here\'s a complete guide for small business owners...' },
  { id: '5', title: 'Building a Personal Brand That Attracts Clients', category: 'Branding', read: '6 min', emoji: '🎯', featured: false, author: 'Deepika Rao', date: 'Jan 15', views: '1.2k', excerpt: 'Your personal brand is your most powerful marketing asset. Here\'s how to build one that converts...' },
  { id: '6', title: 'The Future of B2B Networking in India', category: 'Industry', read: '5 min', emoji: '🌐', featured: false, author: 'Amit Kumar', date: 'Jan 10', views: '754', excerpt: 'A deep dive into how technology is reshaping business relationships and the rise of community-led growth...' },
];

const CATEGORIES = ['All', 'Growth', 'Sales', 'Stories', 'Finance', 'Branding', 'Industry'];

const CATEGORY_COLORS = {
  Growth: Colors.success,
  Sales: Colors.bluePrimary,
  Stories: Colors.orange,
  Finance: '#7C3AED',
  Branding: '#DC2626',
  Industry: Colors.blueLight,
};

const ArticleCard = ({ item, onPress, horizontal }) => (
  <TouchableOpacity
    onPress={() => onPress(item)}
    activeOpacity={0.9}
    style={horizontal ? styles.articleCardH : styles.articleCard}
  >
    <View style={[styles.articleEmoji, horizontal && styles.articleEmojiH]}>
      <Text style={{ fontSize: horizontal ? 28 : 36 }}>{item.emoji}</Text>
    </View>
    <View style={styles.articleContent}>
      <View style={styles.articleMeta}>
        <View style={[styles.catBadge, { backgroundColor: `${CATEGORY_COLORS[item.category]}20` }]}>
          <Text style={[styles.catBadgeText, { color: CATEGORY_COLORS[item.category] || Colors.gray }]}>
            {item.category}
          </Text>
        </View>
        <Text style={styles.articleDate}>{item.date}</Text>
      </View>
      <Text style={[styles.articleTitle, horizontal && styles.articleTitleH]} numberOfLines={horizontal ? 3 : 2}>
        {item.title}
      </Text>
      {!horizontal && (
        <Text style={styles.articleExcerpt} numberOfLines={2}>{item.excerpt}</Text>
      )}
      <View style={styles.articleFooter}>
        <View style={styles.authorRow}>
          <View style={styles.authorDot}>
            <Text style={styles.authorDotText}>{item.author[0]}</Text>
          </View>
          <Text style={styles.authorName}>{item.author}</Text>
        </View>
        <View style={styles.articleStats}>
          <Text style={styles.articleStat}>⏱ {item.read}</Text>
          <Text style={styles.articleStat}>👁 {item.views}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const BlogScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const featured = ARTICLES.filter(a => a.featured);
  const filtered = ARTICLES.filter(a => {
    const matchCat = activeCategory === 'All' || a.category === activeCategory;
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (selectedArticle) {
    return (
      <View style={styles.container}>
        <Header
          title={selectedArticle.category}
          showBack
          navigation={navigation}
          onBack={() => setSelectedArticle(null)}
          showNotification={false}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <LinearGradient colors={['#0D3E82', '#1565C0']} style={styles.articleDetailHeader}>
            <View style={styles.articleDetailEmoji}>
              <Text style={{ fontSize: 52 }}>{selectedArticle.emoji}</Text>
            </View>
            <View style={[styles.catBadge, { backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start' }]}>
              <Text style={{ color: Colors.white, fontSize: Typography.sm, fontWeight: '600' }}>
                {selectedArticle.category}
              </Text>
            </View>
            <Text style={styles.articleDetailTitle}>{selectedArticle.title}</Text>
            <View style={styles.articleDetailMeta}>
              <Text style={styles.articleDetailMetaText}>✍️ {selectedArticle.author}</Text>
              <Text style={styles.articleDetailMetaText}>📅 {selectedArticle.date}</Text>
              <Text style={styles.articleDetailMetaText}>⏱ {selectedArticle.read} read</Text>
            </View>
          </LinearGradient>

          <View style={styles.articleBody}>
            <Text style={styles.articleBodyText}>{selectedArticle.excerpt}</Text>
            {[
              'Building meaningful business relationships requires a combination of strategy, authenticity, and consistent follow-through. The most successful networkers understand that every connection is a potential long-term partnership.',
              'Start by identifying your ideal business connections. Who are the people that would benefit most from knowing you, and who would you benefit most from knowing? This clarity will help you focus your networking efforts.',
              'When attending events, come with a clear value proposition. Know what you offer and be prepared to articulate it concisely. Remember, networking is a two-way street — always look for ways to add value before asking for anything.',
              'Follow up within 24 hours of meeting someone new. A quick message referencing your conversation shows that you were genuinely engaged and opens the door for further dialogue.',
              'Leverage the iNext ETS platform to maintain and nurture your connections. Regular touchpoints — sharing relevant content, congratulating milestones, making introductions — keep you top of mind.',
            ].map((para, i) => (
              <Text key={i} style={[styles.articleBodyText, { marginTop: 14 }]}>{para}</Text>
            ))}

            <View style={styles.articleShareRow}>
              <TouchableOpacity style={styles.shareBtn}>
                <Text style={styles.shareBtnText}>📤 Share Article</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bookmarkBtn}>
                <Text style={styles.bookmarkBtnText}>🔖 Save</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.relatedSection}>
              <Text style={styles.relatedTitle}>You Might Also Like</Text>
              {ARTICLES.filter(a => a.id !== selectedArticle.id).slice(0, 2).map(a => (
                <TouchableOpacity
                  key={a.id}
                  style={styles.relatedItem}
                  onPress={() => setSelectedArticle(a)}
                  activeOpacity={0.85}
                >
                  <Text style={{ fontSize: 24, width: 40 }}>{a.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.relatedItemTitle} numberOfLines={2}>{a.title}</Text>
                    <Text style={styles.relatedItemMeta}>{a.category} • {a.read}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Knowledge Hub" subtitle="Grow your business" navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Hero Banner ───────────────────────────────── */}
        <LinearGradient colors={['#0A2A5C', '#1565C0']} style={styles.banner}>
          <Text style={styles.bannerTitle}>Business{'\n'}Knowledge Hub</Text>
          <Text style={styles.bannerSub}>Articles · Strategies · Success Stories</Text>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search articles..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </LinearGradient>

        {/* ── Categories ───────────────────────────────── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat} onPress={() => setActiveCategory(cat)} activeOpacity={0.8}>
              <LinearGradient
                colors={activeCategory === cat ? [Colors.orange, Colors.orangeLight] : ['#F0F4FF', '#F0F4FF']}
                style={styles.catChip}
              >
                <Text style={[styles.catChipText, activeCategory === cat && styles.catChipTextActive]}>
                  {cat}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Featured Articles ─────────────────────────── */}
        {activeCategory === 'All' && !search && (
          <View style={styles.section}>
            <SectionHeader title="Featured Articles" subtitle="Editor's picks" />
            <FlatList
              data={featured}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: Spacing.md, gap: 14 }}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <ArticleCard item={item} onPress={setSelectedArticle} horizontal />
              )}
            />
          </View>
        )}

        {/* ── All Articles ──────────────────────────────── */}
        <View style={styles.section}>
          <SectionHeader
            title={activeCategory === 'All' ? 'All Articles' : `${activeCategory} Articles`}
            subtitle={`${filtered.length} articles`}
          />
          <View style={{ paddingHorizontal: Spacing.md }}>
            {filtered.map(article => (
              <ArticleCard key={article.id} item={article} onPress={setSelectedArticle} />
            ))}
          </View>
        </View>

        {/* ── Newsletter CTA ────────────────────────────── */}
        <LinearGradient colors={['#0D3E82', '#1565C0']} style={styles.newsletterBanner}>
          <Text style={styles.newsletterEmoji}>📬</Text>
          <Text style={styles.newsletterTitle}>Stay Updated</Text>
          <Text style={styles.newsletterSub}>Get weekly business insights delivered to your inbox</Text>
          <TouchableOpacity style={styles.newsletterBtn} activeOpacity={0.85}>
            <Text style={styles.newsletterBtnText}>Subscribe to Newsletter</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },

  // Banner
  banner: { padding: Spacing.xl, gap: 10 },
  bannerTitle: { color: Colors.white, fontSize: Typography.xxl, fontWeight: '900', lineHeight: 38 },
  bannerSub: { color: 'rgba(255,255,255,0.7)', fontSize: Typography.sm },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    gap: 8,
    marginTop: 6,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, color: Colors.white, fontSize: Typography.base },

  // Categories
  catScroll: { paddingHorizontal: Spacing.md, paddingVertical: 14, gap: 8 },
  catChip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: Radius.full },
  catChipText: { color: Colors.gray, fontSize: Typography.sm, fontWeight: '600' },
  catChipTextActive: { color: Colors.white },

  // Section
  section: { paddingVertical: 8 },

  // Article Cards
  articleCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.card,
  },
  articleCardH: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    width: 260,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.card,
  },
  articleEmoji: {
    backgroundColor: Colors.bluePale,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
  },
  articleEmojiH: { paddingVertical: 20 },
  articleContent: { padding: Spacing.md },
  articleMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  catBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  catBadgeText: { fontSize: 11, fontWeight: '700' },
  articleDate: { fontSize: 11, color: Colors.gray },
  articleTitle: { fontSize: Typography.md, fontWeight: '800', color: Colors.dark, lineHeight: 24 },
  articleTitleH: { fontSize: Typography.base, lineHeight: 22 },
  articleExcerpt: { fontSize: Typography.sm, color: Colors.gray, lineHeight: 20, marginTop: 6 },
  articleFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  authorDot: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.bluePrimary,
    alignItems: 'center', justifyContent: 'center',
  },
  authorDotText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
  authorName: { fontSize: 11, color: Colors.grayDark, fontWeight: '500' },
  articleStats: { flexDirection: 'row', gap: 8 },
  articleStat: { fontSize: 11, color: Colors.gray },

  // Article Detail
  articleDetailHeader: { padding: Spacing.xl, gap: 12 },
  articleDetailEmoji: {
    width: 80, height: 80, borderRadius: Radius.xl,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  articleDetailTitle: { color: Colors.white, fontSize: Typography.xl, fontWeight: '900', lineHeight: 32 },
  articleDetailMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  articleDetailMetaText: { color: 'rgba(255,255,255,0.7)', fontSize: Typography.sm },
  articleBody: { padding: Spacing.xl },
  articleBodyText: { fontSize: Typography.base, color: Colors.grayDark, lineHeight: 26 },
  articleShareRow: { flexDirection: 'row', gap: 12, marginTop: Spacing.xl },
  shareBtn: {
    flex: 1, paddingVertical: 13, borderRadius: Radius.lg,
    backgroundColor: Colors.bluePrimary, alignItems: 'center',
  },
  shareBtnText: { color: Colors.white, fontSize: Typography.sm, fontWeight: '700' },
  bookmarkBtn: {
    paddingVertical: 13, paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg, borderWidth: 2, borderColor: Colors.border, alignItems: 'center',
  },
  bookmarkBtnText: { color: Colors.grayDark, fontSize: Typography.sm, fontWeight: '600' },
  relatedSection: { marginTop: Spacing.xl },
  relatedTitle: { fontSize: Typography.lg, fontWeight: '800', color: Colors.dark, marginBottom: 14 },
  relatedItem: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: Colors.white, borderRadius: Radius.md,
    padding: Spacing.md, marginBottom: 8, borderWidth: 1, borderColor: Colors.border, ...Shadow.card,
  },
  relatedItemTitle: { fontSize: Typography.sm, fontWeight: '600', color: Colors.dark, lineHeight: 20 },
  relatedItemMeta: { fontSize: 11, color: Colors.gray, marginTop: 4 },

  // Newsletter
  newsletterBanner: {
    margin: Spacing.md,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: 8,
    ...Shadow.card,
  },
  newsletterEmoji: { fontSize: 36 },
  newsletterTitle: { color: Colors.white, fontSize: Typography.xl, fontWeight: '900' },
  newsletterSub: { color: 'rgba(255,255,255,0.75)', fontSize: Typography.sm, textAlign: 'center' },
  newsletterBtn: {
    backgroundColor: Colors.orange, paddingVertical: 13, paddingHorizontal: Spacing.xl,
    borderRadius: Radius.lg, marginTop: 6,
  },
  newsletterBtnText: { color: Colors.white, fontSize: Typography.base, fontWeight: '700' },
});

export default BlogScreen;
