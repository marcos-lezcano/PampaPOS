// Tipos principales de la app
import { Category } from './database.types';

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  cost?: number | null;
  stock: number;
  sku?: string | null;
  barcode?: string | null;
  image_url?: string | null;
  category_id?: string | null;
  business_id: string;
  created_at?: string;
  updated_at?: string;
  category?: Category;
}
