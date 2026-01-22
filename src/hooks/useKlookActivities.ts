import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSettings } from '@/contexts/SettingsContext';

export interface KlookActivity {
  id: string;
  icon: string;
  label: string;
  link: string;
}

export interface KlookActivitiesResult {
  supported: boolean;
  cityName?: string;
  cityLink?: string;
  activities?: KlookActivity[];
  affiliateLink?: string;
  message?: string;
}

export function useKlookActivities(citySlug: string | undefined) {
  const [data, setData] = useState<KlookActivitiesResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language } = useSettings();

  useEffect(() => {
    if (!citySlug) {
      setData(null);
      return;
    }

    const fetchActivities = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data: result, error: fnError } = await supabase.functions.invoke('get-klook-activities', {
          body: { citySlug, language }
        });

        if (fnError) {
          throw new Error(fnError.message);
        }

        setData(result);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch activities';
        setError(message);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [citySlug, language]);

  return { data, isLoading, error };
}
