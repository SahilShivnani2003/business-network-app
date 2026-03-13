export interface Member {
    id: string;
    name: string;
    company: string;
    industry: string;
    city: string;
    avatar?: string;
    isVerified: boolean;
    trustScore: number;
    services?: string[];
    website?: string;
}

export interface Lead {
    id: string;
    clientName: string;
    requirement: string;
    budget: string;
    industry: string;
    city: string;
    postedAt: string;
    isPremium: boolean;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    type: 'online' | 'offline';
    attendees: number;
    imageUrl?: string;
}

export interface Message {
    id: string;
    sender: Member;
    lastMessage: string;
    timestamp: string;
    unread: number;
}

export interface Notification {
    id: string;
    type: 'lead' | 'message' | 'event' | 'connection' | 'referral';
    title: string;
    body: string;
    timestamp: string;
    isRead: boolean;
}

export interface MembershipPlan {
    id: string;
    name: string;
    price: string;
    period: string;
    features: string[];
    isPopular?: boolean;
    color: string;
}

export interface WhatsAppGroup {
    id: string;
    name: string;
    industry: string;
    members: number;
    description: string;
}

export interface HelpRequest {
    id: string;
    author: Member;
    request: string;
    category: string;
    postedAt: string;
    responses: number;
}