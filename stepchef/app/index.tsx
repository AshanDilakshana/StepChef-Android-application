// app/index.tsx
import { Redirect } from 'expo-router';

// Redirect to home route on app load
export default function Index() {
  return <Redirect href="/home" />;
}