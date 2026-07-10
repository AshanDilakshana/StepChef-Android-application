import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://essewyjnpbaixpagrmal.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzc2V3eWpucGJhaXhwYWdybWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2ODM1NTEsImV4cCI6MjA5OTI1OTU1MX0.ii0F3sOlIldgvm8MQxxkKMh3-kLq2Vv7Hf52humK49s';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
