export interface Toilet {
  id: number;
  name: string;
  street: string;
  city: string;
  state: string;
  accessible: boolean;
  unisex: boolean;
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
  location_description?: string;
  phone?: string;
  additional_notes?: string;
} 