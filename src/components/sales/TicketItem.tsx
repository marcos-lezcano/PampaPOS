import { TicketItem as TicketItemType } from '@/types';
import { useTicket } from '@/context/TicketContext';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TicketItemProps {
  item: TicketItemType;
}

export function TicketItem({ item }: TicketItemProps) {
  const { updateQuantity, removeItem } = useTicket();
  const { product, quantity } = item;
  
  const subtotal = product.price * quantity;

  return (
    <div className="flex items-center py-3 border-b border-border last:border-0">
      <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between">
          <h4 className="font-medium text-sm truncate">{product.name}</h4>
          <span className="font-semibold text-sm">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <div className="text-xs text-muted-foreground">
            ${product.price.toFixed(2)} x {quantity}
          </div>
          
          <div className="flex items-center space-x-1">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => updateQuantity(product.id, quantity - 1)}
            >
              <Icons.Minus className="h-3 w-3" />
            </Button>
            
            <span className={cn(
              "inline-flex items-center justify-center h-6 w-6 text-xs font-medium"
            )}>
              {quantity}
            </span>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => updateQuantity(product.id, quantity + 1)}
              disabled={quantity >= product.stock}
            >
              <Icons.Plus className="h-3 w-3" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-muted-foreground hover:text-destructive" 
              onClick={() => removeItem(product.id)}
            >
              <Icons.Trash className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}