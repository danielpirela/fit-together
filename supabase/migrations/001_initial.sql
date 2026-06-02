-- Fit Together: Initial Database Schema
-- Creates all tables for the habit tracking application

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT,
    couple_id UUID,
    role TEXT CHECK (role IN ('partner_a', 'partner_b')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- COUPLES TABLE
-- ============================================
CREATE TABLE public.couples (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    partner_a_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    partner_b_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add unique constraint on couple name (optional, can be removed if names can duplicate)
-- CREATE UNIQUE INDEX idx_couples_name ON public.couples(name);

-- ============================================
-- HABITS TABLE
-- ============================================
CREATE TABLE public.habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT '✓',
    color TEXT NOT NULL DEFAULT '#34C759',
    target_days TEXT[] NOT NULL DEFAULT ARRAY['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    target_frequency TEXT NOT NULL DEFAULT 'daily' CHECK (target_frequency IN ('daily', 'weekly', 'custom')),
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- COMPLETIONS TABLE
-- ============================================
CREATE TABLE public.completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date TEXT NOT NULL, -- YYYY-MM-DD format for easy comparison
    completed BOOLEAN NOT NULL DEFAULT true,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unique constraint to prevent duplicate completions
CREATE UNIQUE INDEX idx_completions_unique ON public.completions(habit_id, user_id, date);

-- ============================================
-- INVITATIONS TABLE
-- ============================================
CREATE TABLE public.invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
    inviter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    invitee_email TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Users indexes
CREATE INDEX idx_users_couple_id ON public.users(couple_id);
CREATE INDEX idx_users_email ON public.users(email);

-- Couples indexes
CREATE INDEX idx_couples_partner_a ON public.couples(partner_a_id);
CREATE INDEX idx_couples_partner_b ON public.couples(partner_b_id);

-- Habits indexes
CREATE INDEX idx_habits_couple_id ON public.habits(couple_id);
CREATE INDEX idx_habits_is_active ON public.habits(is_active);
CREATE INDEX idx_habits_couple_active ON public.habits(couple_id, is_active);

-- Completions indexes
CREATE INDEX idx_completions_habit_id ON public.completions(habit_id);
CREATE INDEX idx_completions_user_id ON public.completions(user_id);
CREATE INDEX idx_completions_date ON public.completions(date);
CREATE INDEX idx_completions_habit_date ON public.completions(habit_id, date);
CREATE INDEX idx_completions_user_date ON public.completions(user_id, date);

-- Invitations indexes
CREATE INDEX idx_invitations_token ON public.invitations(token);
CREATE INDEX idx_invitations_status ON public.invitations(status);
CREATE INDEX idx_invitations_couple_id ON public.invitations(couple_id);
CREATE INDEX idx_invitations_invitee_email ON public.invitations(invitee_email);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is part of a couple
CREATE OR REPLACE FUNCTION public.is_user_in_couple(user_uuid UUID, couple_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users
        WHERE id = user_uuid AND couple_id = couple_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- RLS POLICIES: USERS
-- ============================================

-- Users can read their own data
CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- Users can read partner's info if in same couple
CREATE POLICY "Users can view partner profile"
    ON public.users FOR SELECT
    USING (
        couple_id IS NOT NULL
        AND couple_id = (
            SELECT couple_id FROM public.users WHERE id = auth.uid()
        )
    );

-- ============================================
-- RLS POLICIES: COUPLES
-- ============================================

-- Partners can view their couple
CREATE POLICY "Partners can view their couple"
    ON public.couples FOR SELECT
    USING (
        id IN (
            SELECT couple_id FROM public.users
            WHERE id = auth.uid() AND couple_id IS NOT NULL
        )
    );

-- Partners can update their couple
CREATE POLICY "Partners can update their couple"
    ON public.couples FOR UPDATE
    USING (
        id IN (
            SELECT couple_id FROM public.users
            WHERE id = auth.uid() AND couple_id IS NOT NULL
        )
    );

-- Only partner_a can insert couples
CREATE POLICY "Partner A can create couple"
    ON public.couples FOR INSERT
    WITH CHECK (partner_a_id = auth.uid());

-- ============================================
-- RLS POLICIES: HABITS
-- ============================================

-- Partners can view their couple's habits
CREATE POLICY "Partners can view habits"
    ON public.habits FOR SELECT
    USING (
        couple_id IN (
            SELECT couple_id FROM public.users
            WHERE id = auth.uid() AND couple_id IS NOT NULL
        )
    );

-- Partners can insert habits
CREATE POLICY "Partners can create habits"
    ON public.habits FOR INSERT
    WITH CHECK (
        couple_id IN (
            SELECT couple_id FROM public.users
            WHERE id = auth.uid() AND couple_id IS NOT NULL
        )
    );

-- Partners can update habits
CREATE POLICY "Partners can update habits"
    ON public.habits FOR UPDATE
    USING (
        couple_id IN (
            SELECT couple_id FROM public.users
            WHERE id = auth.uid() AND couple_id IS NOT NULL
        )
    );

-- Partners can delete (archive) habits
CREATE POLICY "Partners can delete habits"
    ON public.habits FOR DELETE
    USING (
        couple_id IN (
            SELECT couple_id FROM public.users
            WHERE id = auth.uid() AND couple_id IS NOT NULL
        )
    );

-- ============================================
-- RLS POLICIES: COMPLETIONS
-- ============================================

-- Partners can view completions for their couple's habits
CREATE POLICY "Partners can view completions"
    ON public.completions FOR SELECT
    USING (
        habit_id IN (
            SELECT h.id FROM public.habits h
            WHERE h.couple_id IN (
                SELECT couple_id FROM public.users WHERE id = auth.uid()
            )
        )
    );

-- Users can insert their own completions
CREATE POLICY "Users can create own completions"
    ON public.completions FOR INSERT
    WITH CHECK (
        user_id = auth.uid()
        AND habit_id IN (
            SELECT h.id FROM public.habits h
            WHERE h.couple_id IN (
                SELECT couple_id FROM public.users WHERE id = auth.uid()
            )
        )
    );

-- Users can update their own completions
CREATE POLICY "Users can update own completions"
    ON public.completions FOR UPDATE
    USING (user_id = auth.uid());

-- Users can delete their own completions
CREATE POLICY "Users can delete own completions"
    ON public.completions FOR DELETE
    USING (user_id = auth.uid());

-- ============================================
-- RLS POLICIES: INVITATIONS
-- ============================================

-- Invitee can view invitation by token
CREATE POLICY "Invitee can view invitation by token"
    ON public.invitations FOR SELECT
    USING (
        invitee_email = (
            SELECT email FROM public.users WHERE id = auth.uid()
        )
        OR inviter_id = auth.uid()
    );

-- Inviters can update their invitations
CREATE POLICY "Inviters can update invitations"
    ON public.invitations FOR UPDATE
    USING (inviter_id = auth.uid());

-- Only inviter can delete invitations
CREATE POLICY "Inviters can delete invitations"
    ON public.invitations FOR DELETE
    USING (inviter_id = auth.uid());

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_couples_updated_at
    BEFORE UPDATE ON public.couples
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_habits_updated_at
    BEFORE UPDATE ON public.habits
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invitations_updated_at
    BEFORE UPDATE ON public.invitations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant usage on the helper function
GRANT EXECUTE ON FUNCTION public.is_user_in_couple TO authenticated;

-- Make tables accessible to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;