import { AuthShell, authStyles } from '@/Components/AuthShell'
import { SocialSignInButtons } from '@/Components/SocialSignInButtons'
import { validateEmail, validatePasswordForSignIn } from '@/lib/auth-validation'
import { useSignIn } from '@clerk/expo'
import { Feather } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'

import { posthog } from '@/lib/posthog'

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn()
  const router = useRouter()
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const busy = fetchStatus === 'fetching'
  const emailError = emailTouched ? validateEmail(emailAddress) : ''
  const passwordError = passwordTouched ? validatePasswordForSignIn(password) : ''

  const signInWithPassword = async () => {
    setEmailTouched(true)
    setPasswordTouched(true)
    if (validateEmail(emailAddress) || validatePasswordForSignIn(password)) return
    const { error } = await signIn.password({ emailAddress, password })
    if (error || signIn.status !== 'complete') return
    await signIn.finalize({ navigate: () => router.replace('/(tabs)') })
    posthog?.capture('signed_in', { method: 'password' })
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue managing your subscriptions">
      <SocialSignInButtons />
      <View style={authStyles.field}>
        <Text style={authStyles.label}>Email</Text>
        <TextInput
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          onBlur={() => setEmailTouched(true)}
          onChangeText={(value) => {
            setEmailAddress(value)
            setEmailTouched(Boolean(value))
          }}
          placeholder="Enter your email"
          placeholderTextColor="#62718b"
          style={[authStyles.input, Boolean(emailError) && authStyles.inputError]}
          value={emailAddress}
        />
      </View>
      {emailError ? (
        <Text style={authStyles.error}>{emailError}</Text>
      ) : (
        errors.fields.identifier && (
          <Text style={authStyles.error}>{errors.fields.identifier.message}</Text>
        )
      )}
      <View style={authStyles.field}>
        <Text style={authStyles.label}>Password</Text>
        <View style={authStyles.passwordInput}>
          <TextInput
            autoComplete="password"
            onBlur={() => setPasswordTouched(true)}
            onChangeText={(value) => {
              setPassword(value)
              setPasswordTouched(Boolean(value))
            }}
            placeholder="Enter your password"
            placeholderTextColor="#62718b"
            secureTextEntry={!passwordVisible}
            style={[
              authStyles.input,
              authStyles.passwordTextInput,
              Boolean(passwordError) && authStyles.inputError,
            ]}
            value={password}
          />
          <Pressable
            accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
            hitSlop={8}
            onPress={() => setPasswordVisible((visible) => !visible)}
            style={authStyles.passwordVisibilityButton}
          >
            <Feather color="#53617b" name={passwordVisible ? 'eye-off' : 'eye'} size={21} />
          </Pressable>
        </View>
      </View>
      {passwordError ? (
        <Text style={authStyles.error}>{passwordError}</Text>
      ) : (
        errors.fields.password && (
          <Text style={authStyles.error}>{errors.fields.password.message}</Text>
        )
      )}
      {signIn.status === 'needs_second_factor' && (
        <Text style={authStyles.error}>This account requires a second-factor verification.</Text>
      )}
      <Pressable
        disabled={
          busy ||
          Boolean(validateEmail(emailAddress)) ||
          Boolean(validatePasswordForSignIn(password))
        }
        onPress={signInWithPassword}
        style={[
          authStyles.button,
          (busy || validateEmail(emailAddress) || validatePasswordForSignIn(password)) &&
            authStyles.buttonDisabled,
        ]}
      >
        <Text style={authStyles.buttonText}>{busy ? 'Signing in…' : 'Sign in'}</Text>
      </Pressable>
      <View style={authStyles.footer}>
        <Text style={authStyles.footerText}>New to Subscription Tracker? </Text>
        <Link href="/(auth)/sign-up">
          <Text style={authStyles.footerLink}>Create an account</Text>
        </Link>
      </View>
    </AuthShell>
  )
}
