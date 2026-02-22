import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/header';
import { PrimaryButton } from '../components/UIComponent';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme/theme';

const FAQS = [
  { q: 'How long does membership approval take?', a: 'Membership applications are reviewed within 2-3 business days. You will receive an email notification once your application is approved, along with a payment link.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major payment methods including UPI, Net Banking, Credit/Debit Cards, and EMI options for plans above ₹4,999.' },
  { q: 'Can I upgrade my plan later?', a: 'Yes! You can upgrade your membership plan at any time. The difference in amount will be calculated on a pro-rata basis for the remaining period.' },
  { q: 'Is GST invoice provided?', a: 'Yes, GST invoices are automatically generated for all payments. You can download them from your member dashboard.' },
  { q: 'How do I get the Verified badge?', a: 'The Verified badge is awarded after document verification, which is available from the Growth plan and above. Our team verifies your business documents within 3-5 business days.' },
  { q: 'Can I cancel my membership?', a: 'Memberships can be cancelled at any time. Refund policies vary by plan — monthly plans offer no refund for the current month, while yearly plans offer pro-rata refunds.' },
  { q: 'How are events conducted?', a: 'We conduct both online (via Zoom/Google Meet) and offline events across major cities. Event details, including venue and joining links, are shared 48 hours before the event.' },
];

const CONTACT_OPTIONS = [
  { label: 'WhatsApp Support', icon: '💬', desc: 'Quick responses in 15 mins', color: '#25D366', action: 'whatsapp' },
  { label: 'Email Support', icon: '📧', desc: 'support@inextets.com', color: Colors.bluePrimary, action: 'email' },
  { label: 'Call Us', icon: '📞', desc: '+91 98765 43210', color: Colors.orange, action: 'call' },
  { label: 'Submit Ticket', icon: '🎫', desc: 'Track your issue', color: '#7C3AED', action: 'ticket' },
];

const ContactScreen = ({ navigation }) => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showTicket, setShowTicket] = useState(false);
  const [ticketForm, setTicketForm] = useState({ subject: '', category: '', message: '' });
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleAction = (action) => {
    switch (action) {
      case 'whatsapp':
        Linking.openURL('https://wa.me/919876543210?text=Hello, I need support with iNext ETS').catch(() => {});
        break;
      case 'email':
        Linking.openURL('mailto:support@inextets.com').catch(() => {});
        break;
      case 'call':
        Linking.openURL('tel:+919876543210').catch(() => {});
        break;
      case 'ticket':
        setShowTicket(true);
        break;
    }
  };

  const TICKET_CATEGORIES = ['Membership Application', 'Payment Issue', 'Event Registration', 'Technical Support', 'Account Access', 'Other'];

  return (
    <View style={styles.container}>
      <Header title="Contact & Support" subtitle="We're here to help" navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* ── Hero ─────────────────────────────────────── */}
        <LinearGradient colors={['#0D3E82', '#1565C0']} style={styles.banner}>
          <Text style={styles.bannerEmoji}>🤝</Text>
          <Text style={styles.bannerTitle}>How Can We Help?</Text>
          <Text style={styles.bannerSub}>
            Our support team is available Mon-Sat, 9AM - 7PM IST
          </Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Support Online Now</Text>
          </View>
        </LinearGradient>

        {/* ── Contact Options ───────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>Reach Us</Text>
          </View>
          <View style={styles.contactGrid}>
            {CONTACT_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.action}
                style={styles.contactCard}
                onPress={() => handleAction(opt.action)}
                activeOpacity={0.85}
              >
                <View style={[styles.contactIcon, { backgroundColor: `${opt.color}18` }]}>
                  <Text style={{ fontSize: 28 }}>{opt.icon}</Text>
                </View>
                <Text style={[styles.contactLabel, { color: opt.color }]}>{opt.label}</Text>
                <Text style={styles.contactDesc}>{opt.desc}</Text>
                <View style={[styles.contactArrow, { backgroundColor: opt.color }]}>
                  <Text style={{ color: Colors.white, fontSize: 12, fontWeight: '700' }}>→</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Contact Form ──────────────────────────────── */}
        <View style={[styles.section, styles.sectionPad]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>Send Us a Message</Text>
          </View>

          {formSubmitted ? (
            <View style={styles.formSuccess}>
              <Text style={styles.formSuccessEmoji}>✅</Text>
              <Text style={styles.formSuccessTitle}>Message Sent!</Text>
              <Text style={styles.formSuccessText}>We'll get back to you within 24 hours.</Text>
            </View>
          ) : (
            <View style={styles.contactForm}>
              {[
                { key: 'name', label: 'Your Name', placeholder: 'Rajesh Sharma' },
                { key: 'email', label: 'Email Address', placeholder: 'rajesh@business.com' },
              ].map(field => (
                <View key={field.key} style={styles.formField}>
                  <Text style={styles.formLabel}>{field.label}</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder={field.placeholder}
                    placeholderTextColor={Colors.gray}
                    value={contactForm[field.key]}
                    onChangeText={v => setContactForm(f => ({ ...f, [field.key]: v }))}
                  />
                </View>
              ))}
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Message</Text>
                <TextInput
                  style={[styles.formInput, styles.formInputMulti]}
                  placeholder="Describe your query in detail..."
                  placeholderTextColor={Colors.gray}
                  value={contactForm.message}
                  onChangeText={v => setContactForm(f => ({ ...f, message: v }))}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
              <PrimaryButton title="Send Message →" onPress={() => setFormSubmitted(true)} />
            </View>
          )}
        </View>

        {/* ── FAQ ───────────────────────────────────────── */}
        <View style={[styles.section, styles.sectionPad]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          </View>

          {FAQS.map((faq, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.faqItem, expandedFaq === i && styles.faqItemOpen]}
              onPress={() => setExpandedFaq(expandedFaq === i ? null : i)}
              activeOpacity={0.85}
            >
              <View style={styles.faqHeader}>
                <Text style={[styles.faqQ, expandedFaq === i && styles.faqQOpen]}>
                  {faq.q}
                </Text>
                <View style={[styles.faqToggle, expandedFaq === i && styles.faqToggleOpen]}>
                  <Text style={[styles.faqToggleText, expandedFaq === i && styles.faqToggleTextOpen]}>
                    {expandedFaq === i ? '▲' : '▼'}
                  </Text>
                </View>
              </View>
              {expandedFaq === i && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqA}>{faq.a}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Office Info ───────────────────────────────── */}
        <View style={[styles.section, styles.sectionPad]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>Our Office</Text>
          </View>
          <LinearGradient colors={['#0A2A5C', '#1565C0']} style={styles.officeCard}>
            <View style={styles.officeRow}>
              <Text style={styles.officeIcon}>🏢</Text>
              <View>
                <Text style={styles.officeLabel}>Head Office</Text>
                <Text style={styles.officeValue}>iNext ETS, 4th Floor, One BKC,{'\n'}Bandra Kurla Complex, Mumbai 400051</Text>
              </View>
            </View>
            <View style={styles.officeDivider} />
            <View style={styles.officeRow}>
              <Text style={styles.officeIcon}>⏰</Text>
              <View>
                <Text style={styles.officeLabel}>Working Hours</Text>
                <Text style={styles.officeValue}>Monday - Saturday: 9:00 AM - 7:00 PM</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.directionBtn}
              onPress={() => Linking.openURL('https://maps.google.com')}
              activeOpacity={0.85}
            >
              <Text style={styles.directionBtnText}>📍 Get Directions</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── Support Ticket Modal ─────────────────────── */}
      <Modal visible={showTicket} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Submit Support Ticket</Text>

            {ticketSubmitted ? (
              <View style={styles.ticketSuccess}>
                <Text style={{ fontSize: 48, textAlign: 'center' }}>🎫</Text>
                <Text style={styles.ticketSuccessTitle}>Ticket Created!</Text>
                <Text style={styles.ticketSuccessText}>
                  Your ticket #TKT-{Math.floor(Math.random() * 9000) + 1000} has been created.
                  We'll respond within 4-6 business hours.
                </Text>
                <PrimaryButton title="Close" onPress={() => { setShowTicket(false); setTicketSubmitted(false); }} />
              </View>
            ) : (
              <ScrollView>
                <View style={styles.modalBody}>
                  {[
                    { key: 'subject', label: 'Subject', placeholder: 'Brief description of your issue' },
                  ].map(f => (
                    <View key={f.key} style={styles.formField}>
                      <Text style={styles.formLabel}>{f.label}</Text>
                      <TextInput
                        style={styles.formInput}
                        placeholder={f.placeholder}
                        placeholderTextColor={Colors.gray}
                        value={ticketForm[f.key]}
                        onChangeText={v => setTicketForm(f => ({ ...f, [f.key]: v }))}
                      />
                    </View>
                  ))}

                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Category</Text>
                    {TICKET_CATEGORIES.map(cat => (
                      <TouchableOpacity
                        key={cat}
                        style={[styles.ticketCat, ticketForm.category === cat && styles.ticketCatSelected]}
                        onPress={() => setTicketForm(f => ({ ...f, category: cat }))}
                      >
                        <Text style={[styles.ticketCatText, ticketForm.category === cat && styles.ticketCatTextSelected]}>
                          {cat}
                        </Text>
                        {ticketForm.category === cat && <Text style={{ color: Colors.bluePrimary }}>✓</Text>}
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Description</Text>
                    <TextInput
                      style={[styles.formInput, styles.formInputMulti]}
                      placeholder="Describe your issue in detail..."
                      placeholderTextColor={Colors.gray}
                      value={ticketForm.message}
                      onChangeText={v => setTicketForm(f => ({ ...f, message: v }))}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>

                  <PrimaryButton title="Submit Ticket" onPress={() => setTicketSubmitted(true)} />
                  <TouchableOpacity style={{ marginTop: 12 }} onPress={() => setShowTicket(false)}>
                    <Text style={{ color: Colors.gray, fontSize: Typography.base, textAlign: 'center' }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  scroll: { paddingBottom: 20 },

  // Banner
  banner: { padding: Spacing.xl, alignItems: 'center', gap: 10 },
  bannerEmoji: { fontSize: 48 },
  bannerTitle: { color: Colors.white, fontSize: Typography.xxl, fontWeight: '900', textAlign: 'center' },
  bannerSub: { color: 'rgba(255,255,255,0.75)', fontSize: Typography.base, textAlign: 'center' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.full,
    marginTop: 4,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4ADE80' },
  statusText: { color: Colors.white, fontSize: Typography.sm, fontWeight: '600' },

  // Sections
  section: { paddingVertical: Spacing.lg },
  sectionPad: { paddingHorizontal: Spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: Spacing.md, paddingHorizontal: Spacing.md },
  sectionAccent: { width: 4, height: 24, backgroundColor: Colors.orange, borderRadius: Radius.full },
  sectionTitle: { fontSize: Typography.lg, fontWeight: '800', color: Colors.dark },

  // Contact Grid
  contactGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.md, gap: 12 },
  contactCard: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.card,
    gap: 6,
  },
  contactIcon: {
    width: 56, height: 56, borderRadius: Radius.lg,
    alignItems: 'center', justifyContent: 'center',
  },
  contactLabel: { fontSize: Typography.sm, fontWeight: '800', textAlign: 'center' },
  contactDesc: { fontSize: 11, color: Colors.gray, textAlign: 'center' },
  contactArrow: {
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: Radius.full, marginTop: 2,
  },

  // Contact Form
  contactForm: { gap: 4 },
  formField: { marginBottom: 14 },
  formLabel: { fontSize: Typography.sm, fontWeight: '600', color: Colors.grayDark, marginBottom: 6 },
  formInput: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.md,
    paddingHorizontal: 14, paddingVertical: 13, fontSize: Typography.base,
    color: Colors.dark, backgroundColor: Colors.white,
  },
  formInputMulti: { minHeight: 100, paddingTop: 12 },

  // Form Success
  formSuccess: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: 8,
    ...Shadow.card,
  },
  formSuccessEmoji: { fontSize: 48 },
  formSuccessTitle: { fontSize: Typography.xl, fontWeight: '800', color: Colors.success },
  formSuccessText: { fontSize: Typography.base, color: Colors.gray, textAlign: 'center' },

  // FAQ
  faqItem: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  faqItemOpen: { borderColor: Colors.bluePrimary },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    gap: 12,
  },
  faqQ: { flex: 1, fontSize: Typography.sm, fontWeight: '600', color: Colors.dark, lineHeight: 20 },
  faqQOpen: { color: Colors.bluePrimary },
  faqToggle: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  faqToggleOpen: { backgroundColor: Colors.bluePrimary },
  faqToggleText: { color: Colors.gray, fontSize: 10, fontWeight: '700' },
  faqToggleTextOpen: { color: Colors.white },
  faqAnswer: {
    paddingHorizontal: Spacing.md, paddingBottom: Spacing.md,
    borderTopWidth: 1, borderTopColor: Colors.grayLight,
    paddingTop: Spacing.sm,
  },
  faqA: { fontSize: Typography.sm, color: Colors.gray, lineHeight: 22 },

  // Office
  officeCard: { borderRadius: Radius.xl, padding: Spacing.xl, gap: 14 },
  officeRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  officeIcon: { fontSize: 24, width: 32, textAlign: 'center' },
  officeLabel: { color: 'rgba(255,255,255,0.6)', fontSize: Typography.xs, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.8 },
  officeValue: { color: Colors.white, fontSize: Typography.sm, lineHeight: 20 },
  officeDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  directionBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 12,
    borderRadius: Radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  directionBtnText: { color: Colors.white, fontSize: Typography.base, fontWeight: '600' },

  // Ticket Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    maxHeight: '88%',
    overflow: 'hidden',
  },
  modalHandle: {
    width: 40, height: 4, backgroundColor: Colors.grayLight,
    borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 8,
  },
  modalTitle: { fontSize: Typography.xl, fontWeight: '800', color: Colors.dark, paddingHorizontal: Spacing.xl, marginBottom: 12 },
  modalBody: { paddingHorizontal: Spacing.xl, paddingBottom: 40 },

  ticketCat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 6,
    backgroundColor: Colors.offWhite,
  },
  ticketCatSelected: { borderColor: Colors.bluePrimary, backgroundColor: Colors.bluePale },
  ticketCatText: { fontSize: Typography.sm, color: Colors.grayDark },
  ticketCatTextSelected: { color: Colors.bluePrimary, fontWeight: '600' },

  ticketSuccess: {
    padding: Spacing.xl, gap: 12, alignItems: 'center',
  },
  ticketSuccessTitle: { fontSize: Typography.xl, fontWeight: '800', color: Colors.success },
  ticketSuccessText: {
    fontSize: Typography.base, color: Colors.grayDark, textAlign: 'center',
    lineHeight: 22, backgroundColor: Colors.bluePale, padding: Spacing.md, borderRadius: Radius.md,
  },
});

export default ContactScreen;
