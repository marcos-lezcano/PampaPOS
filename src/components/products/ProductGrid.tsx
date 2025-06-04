import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Icons } from '@/components/ui/icons';

interface ProductGridProps {
  products: Product[];
  mode?: 'catalog' | 'ticket';
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

export function ProductGrid({ products, mode = 'catalog', onEdit, onDelete }: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No se encontraron productos
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              mode={mode}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}