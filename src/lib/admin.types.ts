export type AdminRsvp = {
  id: string;
  attending: boolean;
  guest_name: string | null;
  plus_one: boolean;
  plus_one_name: string | null;
  created_at: string;
};

export type AdminWish = { id: string; message: string; created_at: string };
