import { Product } from '@/types';
import { useTicket } from '@/context/TicketContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  mode?: 'catalog' | 'ticket';
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

export function ProductCard({ product, mode = 'catalog', onEdit, onDelete }: ProductCardProps) {
  const { addItem } = useTicket();
  const lowStock = product.stock <= 5;
  const outOfStock = product.stock <= 0;

  const handleAddToTicket = () => {
    if (!outOfStock) {
      addItem(product);
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 hover:shadow-md",
      outOfStock && "opacity-60"
    )}>
      <div className="relative aspect-square">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        {lowStock && !outOfStock && (
          <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
            Bajo stock: {product.stock}
          </span>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="bg-destructive text-white px-3 py-1 rounded-md font-medium">
              Sin Stock
            </span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium line-clamp-1">{product.name}</h3>
          <span className="font-bold">${product.price.toFixed(2)}</span>
        </div>

        <div className="flex mt-3 gap-2">
          {mode === 'catalog' && (
            <>
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1"
                onClick={handleAddToTicket}
                disabled={outOfStock}
              >
                <Icons.PlusCircle className="h-4 w-4 mr-1" />
                Agregar
              </Button>
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(product)}
                >
                  <Icons.Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(product.id)}
                >
                  <Icons.Trash className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
          {mode === 'ticket' && (
            <Button 
              variant="default" 
              size="sm" 
              className="w-full"
              onClick={handleAddToTicket}
              disabled={outOfStock}
            >
              <Icons.PlusCircle className="h-4 w-4 mr-1" />
              Agregar al ticket
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}