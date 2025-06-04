import { useState, useEffect } from 'react';
import { Product, InsertProduct } from '@/types/database.types';
import { productService } from '@/services/product.service';
import { useAuth } from '@/context/AuthContext';

export function useProducts() {
  console.log('🌀 [useProducts] Iniciando hook...');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  console.log('👤 [useProducts] Estado inicial:', {
    'products.length': products.length,
    loading,
    error,
    'user?.id': user?.id,
    'user?.user_metadata?.business_id': user?.user_metadata?.business_id
  });

  // Efecto para cargar productos cuando el usuario está disponible
  useEffect(() => {
    console.log('🔍 [useProducts] useEffect ejecutándose, business_id:', user?.user_metadata?.business_id);
    
    if (!user?.user_metadata?.business_id) {
      console.log('⚠️ [useProducts] No hay business_id disponible, estableciendo loading=true');
      setLoading(true);
      return;
    }
    
    console.log('📦 [useProducts] business_id disponible, cargando productos...');
    loadProducts();
  }, [user?.user_metadata?.business_id]); // Dependencia específica al business_id

  // Function to load products from Supabase
  const loadProducts = async () => {
    console.log('💼 [loadProducts] Iniciando carga de productos...');
    const businessId = user?.user_metadata?.business_id;
    
    if (!businessId) {
      console.error('❌ [loadProducts] No hay business_id disponible');
      setError('No se pudo cargar los productos: ID de negocio no disponible');
      setLoading(false);
      return;
    }
    
    console.log('🕐 [loadProducts] Iniciando petición para business_id:', businessId);
    setLoading(true);
    try {
      console.log('📡 [loadProducts] Solicitando productos...');
      const products = await productService.getProducts(businessId);
      console.log('✅ [loadProducts] Productos obtenidos:', products.length);
      setProducts(products);
    } catch (err) {
      console.error('❌ [loadProducts] Error cargando productos:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      console.log('🌟 [loadProducts] Finalizando carga, loading=false');
      setLoading(false);
    }
  };

  // Function to add a new product
  const addProduct = async (productData: Omit<InsertProduct, 'business_id'>) => {
    const businessId = user?.user_metadata?.business_id;
    console.log('addProduct - businessId:', businessId);
    console.log('addProduct - productData:', productData);
    
    if (!businessId) {
      console.error('No businessId found in user metadata');
      return null;
    }
    
    setLoading(true);
    try {
      const productToCreate = {
        ...productData,
        business_id: businessId
      };
      console.log('Creating product with data:', productToCreate);
      
      const newProduct = await productService.createProduct(productToCreate);
      console.log('Product created successfully:', newProduct);
      
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to update a product
  const updateProduct = async (id: string, updates: Partial<InsertProduct>) => {
    setLoading(true);
    try {
      const updatedProduct = await productService.updateProduct(id, {
        ...updates,
        updated_at: new Date().toISOString(),
      });
      
      setProducts(prev => 
        prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p)
      );
      
      return updatedProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a product
  const deleteProduct = async (id: string) => {
    setLoading(true);
    try {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load products when the component mounts or when the businessId changes
  useEffect(() => {
    if (user?.user_metadata?.business_id) {
      loadProducts();
    }
  }, [user?.user_metadata?.business_id]);

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: loadProducts,
  };
}
