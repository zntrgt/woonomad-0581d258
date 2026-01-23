import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface PriceAlert {
  id: string;
  user_id: string;
  alert_type: string;
  origin_code: string | null;
  destination_code: string | null;
  city_slug: string | null;
  target_price: number | null;
  current_price: number | null;
  last_checked_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateAlertParams {
  alertType: 'flight' | 'hotel';
  originCode?: string;
  destinationCode?: string;
  citySlug?: string;
  targetPrice?: number;
}

export function usePriceAlerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user's alerts
  const fetchAlerts = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // @ts-ignore - price_alerts table added via migration
      const { data, error } = await supabase
        .from('price_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts((data as PriceAlert[]) || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Create a new price alert
  const createAlert = useCallback(async (params: CreateAlertParams) => {
    if (!user) {
      toast.error('Fiyat alarmı eklemek için giriş yapın');
      return null;
    }

    try {
      // @ts-ignore - price_alerts table added via migration
      const { data, error } = await supabase
        .from('price_alerts')
        .insert({
          user_id: user.id,
          alert_type: params.alertType,
          origin_code: params.originCode,
          destination_code: params.destinationCode,
          city_slug: params.citySlug,
          target_price: params.targetPrice,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      
      setAlerts(prev => [(data as PriceAlert), ...prev]);
      toast.success('Fiyat alarmı oluşturuldu!');
      return data;
    } catch (error) {
      console.error('Error creating alert:', error);
      toast.error('Alarm oluşturulamadı');
      return null;
    }
  }, [user]);

  // Toggle alert active status
  const toggleAlert = useCallback(async (alertId: string, isActive: boolean) => {
    try {
      // @ts-ignore - price_alerts table added via migration
      const { error } = await supabase
        .from('price_alerts')
        .update({ is_active: isActive })
        .eq('id', alertId);

      if (error) throw error;
      
      setAlerts(prev => prev.map(a => 
        a.id === alertId ? { ...a, is_active: isActive } : a
      ));
      toast.success(isActive ? 'Alarm aktif edildi' : 'Alarm durduruldu');
    } catch (error) {
      console.error('Error toggling alert:', error);
      toast.error('İşlem başarısız');
    }
  }, []);

  // Delete an alert
  const deleteAlert = useCallback(async (alertId: string) => {
    try {
      // @ts-ignore - price_alerts table added via migration
      const { error } = await supabase
        .from('price_alerts')
        .delete()
        .eq('id', alertId);

      if (error) throw error;
      
      setAlerts(prev => prev.filter(a => a.id !== alertId));
      toast.success('Alarm silindi');
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast.error('Alarm silinemedi');
    }
  }, []);

  // Check if user has an alert for a specific route
  const hasAlertForRoute = useCallback((originCode: string, destinationCode: string) => {
    return alerts.some(a => 
      a.alert_type === 'flight' && 
      a.origin_code === originCode && 
      a.destination_code === destinationCode &&
      a.is_active
    );
  }, [alerts]);

  return {
    alerts,
    isLoading,
    createAlert,
    toggleAlert,
    deleteAlert,
    hasAlertForRoute,
    refetch: fetchAlerts
  };
}
