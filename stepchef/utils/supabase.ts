import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const SUPABASE_URL = 'https://essewyjnpbaixpagrmal.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzc2V3eWpucGJhaXhwYWdybWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2ODM1NTEsImV4cCI6MjA5OTI1OTU1MX0.ii0F3sOlIldgvm8MQxxkKMh3-kLq2Vv7Hf52humK49s';

// AsyncStorage only works on native — on web, Supabase uses localStorage automatically
const getStorage = () => {
  if (Platform.OS === 'web') return undefined;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('@react-native-async-storage/async-storage').default;
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: getStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});
