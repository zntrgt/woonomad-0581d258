import { useState } from 'react';
import { Bell, BellRing, Loader2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePriceAlerts } from '@/hooks/usePriceAlerts';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface PriceAlertButtonProps {
  originCode: string;
  destinationCode: string;
  currentPrice?: number;
  className?: string;
}

export function PriceAlertButton({
  originCode,
  destinationCode,
  currentPrice,
  className
}: PriceAlertButtonProps) {
  const { user } = useAuth();
  const { createAlert, hasAlertForRoute, alerts, deleteAlert } = usePriceAlerts();
  const [isOpen, setIsOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);

  const hasAlert = hasAlertForRoute(originCode, destinationCode);
  const existingAlert = alerts.find(a => 
    a.origin_code === originCode && 
    a.destination_code === destinationCode &&
    a.is_active
  );

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      await createAlert({
        alertType: 'flight',
        originCode,
        destinationCode,
        targetPrice: targetPrice ? parseFloat(targetPrice) : undefined
      });
      setIsOpen(false);
      setTargetPrice('');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRemove = async () => {
    if (existingAlert) {
      await deleteAlert(existingAlert.id);
    }
  };

  if (!user) {
    return (
      <Button
        variant="outline"
        size="sm"
        className={cn("gap-2", className)}
        onClick={() => setIsOpen(true)}
        title="Fiyat alarmı için giriş yapın"
      >
        <Bell className="h-4 w-4" />
        <span className="hidden sm:inline">Fiyat Alarmı</span>
      </Button>
    );
  }

  if (hasAlert) {
    return (
      <Button
        variant="outline"
        size="sm"
        className={cn("gap-2 border-primary text-primary", className)}
        onClick={handleRemove}
        title="Alarmı kaldır"
      >
        <BellRing className="h-4 w-4" />
        <span className="hidden sm:inline">Alarm Aktif</span>
        <X className="h-3 w-3 ml-1" />
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-2", className)}
        >
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Fiyat Alarmı</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Fiyat Alarmı Oluştur
          </DialogTitle>
          <DialogDescription>
            {originCode} → {destinationCode} rotası için fiyat düştüğünde bildirim alın.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {currentPrice && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">Mevcut Fiyat</span>
              <span className="font-semibold">₺{currentPrice.toLocaleString('tr-TR')}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="targetPrice">Hedef Fiyat (opsiyonel)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₺</span>
              <Input
                id="targetPrice"
                type="number"
                placeholder="Örn: 3000"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="pl-8"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Boş bırakırsanız herhangi bir fiyat düşüşünde bildirim alırsınız.
            </p>
          </div>

          <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg text-sm">
            <Check className="h-4 w-4 text-primary mt-0.5" />
            <span>Fiyatlar günde 2 kez kontrol edilir ve %5'ten fazla düşüşlerde bildirim gönderilir.</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setIsOpen(false)}
          >
            İptal
          </Button>
          <Button
            className="flex-1"
            onClick={handleCreate}
            disabled={isCreating}
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Alarm Oluştur'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
