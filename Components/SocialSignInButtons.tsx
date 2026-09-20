import { authStyles } from '@/Components/AuthShell'
import { useSSO } from '@clerk/expo'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Image, Pressable, Text, View } from 'react-native'

const providers = [
  {
    label: 'Google',
    logo: 'https://img.clerk.com/static/google.png',
    strategy: 'oauth_google' as const,
  },
  {
    label: 'Apple',
    logo: 'https://img.clerk.com/static/apple.png',
    strategy: 'oauth_apple' as const,
  },
  { label: 'Xero', logo: 'https://img.clerk.com/static/xero.png', strategy: 'oauth_xero' as const },
]

export function SocialSignInButtons() {
  const { startSSOFlow } = useSSO()
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const signIn = async (strategy: (typeof providers)[number]['strategy']) => {
    setBusy(true)
    setError('')
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy })
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId })
        router.replace('/(tabs)')
      }
    } catch {
      setError('We could not complete that sign-in. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <View style={{ gap: 10 }}>
      <Text style={authStyles.socialLabel}>Or continue with</Text>
      <View style={authStyles.socialRow}>
        {providers.map((provider) => (
          <Pressable
            accessibilityLabel={`Continue with ${provider.label}`}
            disabled={busy}
            key={provider.strategy}
            onPress={() => signIn(provider.strategy)}
            style={[authStyles.socialButton, busy && authStyles.socialButtonDisabled]}
          >
            <Image source={{ uri: provider.logo }} style={authStyles.socialLogo} />
          </Pressable>
        ))}
      </View>
      {error ? <Text style={authStyles.error}>{error}</Text> : null}
    </View>
  )
}
