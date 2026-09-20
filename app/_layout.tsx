import { ClerkProvider, useAuth } from '@clerk/expo'
import { tokenCache } from '@clerk/expo/token-cache'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { useEffect } from 'react'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? ''

if (!publishableKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add your key to .env.\nRun: 1) clerk auth login  2) clerk link  3) clerk env pull — then restart the dev server.',
  )
}

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <RootLayoutContent />
    </ClerkProvider>
  )
}

function RootLayoutContent() {
  const [fontsLoaded] = useFonts({
    'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf'),
    'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    // 'sans-ExtraLight': require('./assets/fonts/PlusJakartaSans-ExtraLight.ttf'),
    // 'sans-Thin': require('./assets/fonts/PlusJakartaSans-Thin.ttf'),
  })
  const { isLoaded: authLoaded } = useAuth()

  useEffect(() => {
    if (fontsLoaded && authLoaded) {
      SplashScreen.hideAsync()
    }
  }, [authLoaded, fontsLoaded])

  if (!fontsLoaded || !authLoaded) return null

  return <Stack screenOptions={{ headerShown: false }} />
}
