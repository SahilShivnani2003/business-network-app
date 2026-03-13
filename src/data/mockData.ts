import { Member, Lead, Event, Message, Notification, MembershipPlan, WhatsAppGroup, HelpRequest } from '../types';

export const MOCK_MEMBERS: Member[] = [
  { id: '1', name: 'Rajesh Kumar', company: 'TechSoft Solutions', industry: 'Information Technology', city: 'Mumbai', isVerified: true, trustScore: 92, services: ['Web Dev', 'App Dev', 'Cloud'] },
  { id: '2', name: 'Priya Sharma', company: 'DigiMarkPro', industry: 'Digital Marketing', city: 'Delhi', isVerified: true, trustScore: 88, services: ['SEO', 'Social Media', 'PPC'] },
  { id: '3', name: 'Amit Patel', company: 'BuildRight Infra', industry: 'Real Estate', city: 'Ahmedabad', isVerified: true, trustScore: 95, services: ['Residential', 'Commercial'] },
  { id: '4', name: 'Sunita Joshi', company: 'FinWise Advisory', industry: 'Finance', city: 'Pune', isVerified: false, trustScore: 78, services: ['Investment', 'Tax Planning'] },
  { id: '5', name: 'Vikram Singh', company: 'StartupHub India', industry: 'Startup Ecosystem', city: 'Bangalore', isVerified: true, trustScore: 85, services: ['Mentorship', 'Funding'] },
  { id: '6', name: 'Meera Nair', company: 'EduTech Innovators', industry: 'Education', city: 'Chennai', isVerified: true, trustScore: 90, services: ['E-Learning', 'Training'] },
];

export const MOCK_LEADS: Lead[] = [
  { id: '1', clientName: 'ABC Corp', requirement: 'Need custom ERP software for 200+ employees', budget: '₹8-15 Lakhs', industry: 'Manufacturing', city: 'Surat', postedAt: '2 hours ago', isPremium: true },
  { id: '2', clientName: 'Startup XYZ', requirement: 'Looking for digital marketing agency - 6 month contract', budget: '₹50K/month', industry: 'E-Commerce', city: 'Mumbai', postedAt: '5 hours ago', isPremium: false },
  { id: '3', clientName: 'Real Infra Ltd', requirement: 'Need interior designer for 3000 sq ft office', budget: '₹12 Lakhs', industry: 'Real Estate', city: 'Pune', postedAt: '1 day ago', isPremium: true },
  { id: '4', clientName: 'MedCare Hospital', requirement: 'Hospital management software with app', budget: '₹20-30 Lakhs', industry: 'Healthcare', city: 'Bangalore', postedAt: '2 days ago', isPremium: true },
];

export const MOCK_EVENTS: Event[] = [
  { id: '1', title: 'Business Networking Summit 2025', description: 'Annual grand networking event with 500+ business owners from across India', date: 'Dec 20, 2025', time: '10:00 AM', location: 'The Grand Hotel, Mumbai', type: 'offline', attendees: 347 },
  { id: '2', title: 'Digital Marketing Masterclass', description: 'Learn advanced digital marketing strategies from industry experts', date: 'Dec 15, 2025', time: '6:00 PM', location: 'Zoom Webinar', type: 'online', attendees: 189 },
  { id: '3', title: 'Startup Funding Workshop', description: 'Connect with investors and learn how to raise seed funding', date: 'Dec 28, 2025', time: '2:00 PM', location: 'NSRCEL, Bangalore', type: 'offline', attendees: 95 },
];

export const MOCK_MESSAGES: Message[] = [
  { id: '1', sender: MOCK_MEMBERS[0], lastMessage: 'Sure, let\'s schedule a call tomorrow', timestamp: '10:42 AM', unread: 2 },
  { id: '2', sender: MOCK_MEMBERS[1], lastMessage: 'I can refer you to a potential client', timestamp: '9:15 AM', unread: 0 },
  { id: '3', sender: MOCK_MEMBERS[4], lastMessage: 'Thanks for attending the event!', timestamp: 'Yesterday', unread: 1 },
  { id: '4', sender: MOCK_MEMBERS[2], lastMessage: 'Let\'s connect on this project', timestamp: 'Yesterday', unread: 0 },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'lead', title: 'New Premium Lead', body: 'A new ERP project lead worth ₹15L has been posted in your industry', timestamp: '2 min ago', isRead: false },
  { id: '2', type: 'connection', title: 'Connection Request', body: 'Vikram Singh from StartupHub wants to connect with you', timestamp: '1 hour ago', isRead: false },
  { id: '3', type: 'event', title: 'Event Reminder', body: 'Business Networking Summit is in 3 days. Are you registered?', timestamp: '3 hours ago', isRead: true },
  { id: '4', type: 'message', title: 'New Message', body: 'Priya Sharma sent you a message about a referral', timestamp: 'Yesterday', isRead: true },
  { id: '5', type: 'referral', title: 'Client Referral', body: 'Rajesh Kumar referred a client to you for web development', timestamp: 'Yesterday', isRead: true },
];

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  { id: 'free', name: 'Free', price: '₹0', period: 'Forever', color: '#6B7280', features: ['Basic profile', 'View members', 'Attend events', '5 connections/month', 'Community help access'] },
  { id: 'premium', name: 'Premium', price: '₹999', period: 'per month', color: '#1565C0', isPopular: true, features: ['All Free features', 'Verified badge', 'Access premium leads', 'Unlimited connections', 'WhatsApp groups', 'AI smart match', 'Priority listing'] },
  { id: 'elite', name: 'Elite', price: '₹2499', period: 'per month', color: '#7C3AED', features: ['All Premium features', 'Featured profile', 'Client database access', 'Video meetings', 'Dedicated support', 'Investor connections', 'Custom analytics'] },
];

export const WHATSAPP_GROUPS: WhatsAppGroup[] = [
  { id: '1', name: 'IT Business Network', industry: 'Information Technology', members: 256, description: 'Connect with IT entrepreneurs, developers and tech companies' },
  { id: '2', name: 'Real Estate Professionals', industry: 'Real Estate', members: 189, description: 'Network with builders, brokers, and property investors' },
  { id: '3', name: 'Startup Founders India', industry: 'Startups', members: 312, description: 'India\'s largest startup founders networking group' },
  { id: '4', name: 'Digital Marketing Hub', industry: 'Marketing', members: 223, description: 'Connect with digital marketing agencies and consultants' },
  { id: '5', name: 'Finance & Investment', industry: 'Finance', members: 145, description: 'Chartered accountants, financial advisors and investors' },
];

export const HELP_REQUESTS: HelpRequest[] = [
  { id: '1', author: MOCK_MEMBERS[0], request: 'Need 3 website clients urgently. Can anyone refer?', category: 'Client Need', postedAt: '1 hour ago', responses: 7 },
  { id: '2', author: MOCK_MEMBERS[3], request: 'Looking for a reliable GST consultant in Mumbai', category: 'Vendor Need', postedAt: '3 hours ago', responses: 4 },
  { id: '3', author: MOCK_MEMBERS[1], request: 'Need a good content writer for B2B blogs', category: 'Hiring', postedAt: 'Yesterday', responses: 12 },
  { id: '4', author: MOCK_MEMBERS[4], request: 'Anyone who can help with startup pitch deck design?', category: 'Support', postedAt: 'Yesterday', responses: 5 },
];
