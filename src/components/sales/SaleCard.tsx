import { Sale, SaleItem } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';

interface SaleCardProps {
  sale: Sale;
}

export function SaleCard({ sale }: SaleCardProps) {
  const { id, created_at, items, total } = sale;
  const saleDate = new Date(created_at);
  const formattedDate = format(saleDate, "d 'de' MMMM, yyyy", { locale: es });
  const formattedTime = format(saleDate, "HH:mm");
  
  const totalItems = items.reduce((sum: number, item: SaleItem) => sum + item.quantity, 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Icons.Receipt className="h-5 w-5 mr-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Venta #{id.slice(-5)}</span>
          </div>
          <span className="font-semibold">${total.toFixed(2)}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-3 text-sm">
          <Icons.Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>
            {formattedDate} • {formattedTime}
          </span>
        </div>
        
        <div className="flex items-center mb-4 text-sm">
          <Icons.ShoppingBag className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{totalItems} producto{totalItems !== 1 ? 's' : ''}</span>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="items">
            <AccordionTrigger className="text-sm py-2">
              Ver detalles
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {items.map((item: SaleItem) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <span className="font-medium">{item.product.name}</span>
                      <div className="text-xs text-muted-foreground">
                        ${item.product.price.toFixed(2)} x {item.quantity}
                      </div>
                    </div>
                    <span className="font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}