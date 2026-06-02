import { create } from "zustand";
import { type Database, supabase } from "@/lib/supabase";

type CoupleRow = Database["public"]["Tables"]["couples"]["Row"];
// type InvitationRow = Database["public"]["Tables"]["invitations"]["Row"];

interface CoupleState {
  couple: CoupleRow | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCouple: (userId: string) => Promise<void>;
  createCouple: (name: string, partnerAId: string) => Promise<CoupleRow>;
  invitePartner: (coupleId: string, inviterId: string, inviteeEmail: string) => Promise<void>;
  acceptInvitation: (token: string, userId: string) => Promise<void>;
  declineInvitation: (token: string) => Promise<void>;
  leaveCouple: (userId: string) => Promise<void>;
}

export const useCoupleStore = create<CoupleState>((set, get) => ({
  couple: null,
  isLoading: false,
  error: null,

  fetchCouple: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });

      // Find couple where user is partner_a or partner_b
      const { data, error } = await supabase
        .from("couples")
        .select("*")
        .or(`partner_a_id.eq.${userId},partner_b_id.eq.${userId}`)
        .single();

      if (error && error.code !== "PGRST116") throw error; // Not found

      set({ couple: data || null, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createCouple: async (name: string, partnerAId: string) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase
        .from("couples")
        .insert({ name, partner_a_id: partnerAId })
        .select()
        .single();

      if (error) throw error;

      set({ couple: data, isLoading: false });

      // Update user's couple_id
      await supabase
        .from("users")
        .update({ couple_id: data.id, role: "partner_a" })
        .eq("id", partnerAId);

      return data;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  invitePartner: async (coupleId: string, inviterId: string, inviteeEmail: string) => {
    try {
      set({ isLoading: true, error: null });

      // Generate unique token
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

      const { error } = await supabase.from("invitations").insert({
        couple_id: coupleId,
        inviter_id: inviterId,
        invitee_email: inviteeEmail,
        token,
        expires_at: expiresAt.toISOString(),
        status: "pending",
      });

      if (error) throw error;

      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  acceptInvitation: async (token: string, userId: string) => {
    try {
      set({ isLoading: true, error: null });

      // Find invitation
      const { data: invitation, error: findError } = await supabase
        .from("invitations")
        .select("*")
        .eq("token", token)
        .eq("status", "pending")
        .single();

      if (findError) throw findError;

      // Check if expired
      if (new Date(invitation.expires_at) < new Date()) {
        await supabase.from("invitations").update({ status: "expired" }).eq("id", invitation.id);
        throw new Error("Invitation has expired");
      }

      // Update couple with partner B
      const { error: updateError } = await supabase
        .from("couples")
        .update({ partner_b_id: userId })
        .eq("id", invitation.couple_id);

      if (updateError) throw updateError;

      // Update user
      await supabase
        .from("users")
        .update({ couple_id: invitation.couple_id, role: "partner_b" })
        .eq("id", userId);

      // Update invitation status
      await supabase.from("invitations").update({ status: "accepted" }).eq("id", invitation.id);

      // Fetch and set couple
      const { data: couple } = await supabase
        .from("couples")
        .select("*")
        .eq("id", invitation.couple_id)
        .single();

      set({ couple, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  declineInvitation: async (token: string) => {
    try {
      set({ isLoading: true, error: null });

      const { error } = await supabase
        .from("invitations")
        .update({ status: "declined" })
        .eq("token", token);

      if (error) throw error;

      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  leaveCouple: async (userId: string) => {
    try {
      const { couple } = get();
      if (!couple) throw new Error("Not in a couple");

      set({ isLoading: true, error: null });

      // Remove from couple
      const updates =
        couple.partner_a_id === userId ? { partner_a_id: null } : { partner_b_id: null };

      const { error: updateError } = await supabase
        .from("couples")
        .update(updates)
        .eq("id", couple.id);

      if (updateError) throw updateError;

      // Update user
      await supabase.from("users").update({ couple_id: null, role: null }).eq("id", userId);

      set({ couple: null, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
}));
