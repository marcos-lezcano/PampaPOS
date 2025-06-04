import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [storeSettings, setStoreSettings] = useState({
    name: 'Mi Tienda',
    address: 'Av. Corrientes 1234, Buenos Aires',
    phone: '+54 11 4567-8901',
    email: 'contacto@mitienda.com',
  });
  
  const [taxSettings, setTaxSettings] = useState({
    enableTax: false,
    taxRate: '21',
  });

  const handleStoreSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStoreSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleTaxSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTaxSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = () => {
    // In a real app, we would save to a database
    toast({
      title: 'Configuración guardada',
      description: 'Los cambios han sido guardados exitosamente.',
    });
  };

  return (
    <Layout title="Configuración">
      <div className="space-y-6">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-semibold tracking-tight">Configuración</h2>
          <p className="text-muted-foreground">
            Administra las preferencias y configuración de tu sistema POS.
          </p>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Tienda</CardTitle>
              <CardDescription>
                Estos detalles aparecerán en los recibos y documentos generados.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="store-name">Nombre de la Tienda</Label>
                <Input
                  id="store-name"
                  name="name"
                  value={storeSettings.name}
                  onChange={handleStoreSettingsChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="store-address">Dirección</Label>
                <Input
                  id="store-address"
                  name="address"
                  value={storeSettings.address}
                  onChange={handleStoreSettingsChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="store-phone">Teléfono</Label>
                <Input
                  id="store-phone"
                  name="phone"
                  value={storeSettings.phone}
                  onChange={handleStoreSettingsChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="store-email">Email</Label>
                <Input
                  id="store-email"
                  name="email"
                  type="email"
                  value={storeSettings.email}
                  onChange={handleStoreSettingsChange}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferencias de Apariencia</CardTitle>
                <CardDescription>
                  Personaliza la apariencia de tu sistema POS.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme-mode">Modo Oscuro</Label>
                  <Switch
                    id="theme-mode"
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Impuestos</CardTitle>
                <CardDescription>
                  Configura los impuestos para tus ventas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-tax">Habilitar Impuestos</Label>
                  <Switch
                    id="enable-tax"
                    checked={taxSettings.enableTax}
                    onCheckedChange={(checked) => 
                      setTaxSettings(prev => ({ ...prev, enableTax: checked }))
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Tasa de Impuesto (%)</Label>
                  <Input
                    id="tax-rate"
                    name="taxRate"
                    type="number"
                    value={taxSettings.taxRate}
                    onChange={handleTaxSettingsChange}
                    disabled={!taxSettings.enableTax}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>
            Guardar Cambios
          </Button>
        </div>
      </div>
    </Layout>
  );
}