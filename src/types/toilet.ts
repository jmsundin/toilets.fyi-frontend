/**
 * Toilet interface defines the shape of a Toilet object.
 * Contains various metadata fields like id, location, images etc.
 */
export interface Toilet {
  id: number;
  site?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  cleaningFrequency?: string;
  operatedBy?: string;
  public?: boolean;
  hours?: Date;
  content?: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ListViewProps {
  items: Toilet[];
}