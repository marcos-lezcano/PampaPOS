import { supabase } from '@/lib/supabase';
import { Product, InsertProduct } from '@/types/database.types';

class ProductService {
  private static instance: ProductService;

  private constructor() {}

  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  // Obtener todos los productos de un negocio
  public async getProducts(businessId: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('business_id', businessId)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Obtener un producto por ID
  public async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      throw error;
    }
  }

  // Crear un nuevo producto
  public async createProduct(productData: InsertProduct): Promise<Product> {
    try {
      console.log('Creating product with data:', productData);
      
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) {
        console.error('Error details:', error);
        throw error;
      }
      
      console.log('Product created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Actualizar un producto existente
  public async updateProduct(
    id: string,
    updates: Partial<InsertProduct>
  ): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error updating product with id ${id}:`, error);
      throw error;
    }
  }

  // Eliminar un producto
  public async deleteProduct(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw error;
    }
  }

  // Actualizar el stock de un producto
  public async updateStock(
    id: string,
    quantity: number,
    operation: 'increment' | 'decrement' = 'increment'
  ): Promise<Product> {
    try {
      const { data, error } = await supabase.rpc(operation === 'increment' ? 'increment_stock' : 'decrement_stock', {
        product_id: id,
        amount: quantity
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error updating stock for product ${id}:`, error);
      throw error;
    }
  }
}

export const productService = ProductService.getInstance();
