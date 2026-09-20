import { AuthShell, authStyles } from '@/Components/AuthShell'
import { SocialSignInButtons } from '@/Components/SocialSignInButtons'
import { validateEmail, validatePasswordForSignUp } from '@/lib/auth-validation'
import { Feather } from '@expo/vector-icons'
import { useSignUp } from '@clerk/expo'
import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp()
  const router = useRouter()
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const verifying = signUp.unverifiedFields?.includes('email_address')
  const busy = fetchStatus === 'fetching'
  const emailError = emailTouched ? validateEmail(emailAddress) : ''
  const passwordError = passwordTouched ? validatePasswordForSignUp(password) : ''

  const createAccount = async () => {
    setEmailTouched(true)
    setPasswordTouched(true)
    if (validateEmail(emailAddress) || validatePasswordForSignUp(password)) return
    const { error } = await signUp.password({ emailAddress, password })
    if (!error) await signUp.verifications.sendEmailCode()
  }
  const verifyEmail = async () => {
    const { error } = await signUp.verifications.verifyEmailCode({ code })
    if (error || signUp.status !== 'complete') return
    await signUp.finalize({ navigate: () => router.replace('/(tabs)') })
  }

  return (
    <AuthShell
      title={verifying ? 'Verify your email' : 'Create your account'}
      subtitle={
        verifying
          ? `We sent a verification code to ${emailAddress}.`
          : 'Start keeping every subscription in one place.'
      }
    >
      {verifying ? (
        <>
          <View style={authStyles.field}>
            <Text style={authStyles.label}>Verification code</Text>
            <TextInput
              autoComplete="one-time-code"
              keyboardType="number-pad"
              onChangeText={setCode}
              placeholder="Enter your code"
              placeholderTextColor="#62718b"
              style={authStyles.input}
              value={code}
            />
          </View>
          {errors.fields.code && <Text style={authStyles.error}>{errors.fields.code.message}</Text>}
          <Pressable
            disabled={busy || !code}
            onPress={verifyEmail}
            style={[authStyles.button, (busy || !code) && authStyles.buttonDisabled]}
          >
            <Text style={authStyles.buttonText}>{busy ? 'Verifying…' : 'Verify email'}</Text>
          </Pressable>
          <Pressable disabled={busy} onPress={() => signUp.verifications.sendEmailCode()}>
            <Text style={authStyles.footerLink}>Resend code</Text>
          </Pressable>
        </>
      ) : (
        <>
          <SocialSignInButtons />
          <View style={authStyles.field}>
            <Text style={authStyles.label}>Email</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onBlur={() => setEmailTouched(true)}
              onChangeText={(value) => { setEmailAddress(value); setEmailTouched(Boolean(value)) }}
              placeholder="Enter your email"
              placeholderTextColor="#62718b"
              style={[authStyles.input, Boolean(emailError) && authStyles.inputError]}
              value={emailAddress}
          />
          {emailError && <Text style={authStyles.error}>{emailError}</Text>}
          </View>
          <View style={authStyles.field}>
            <Text style={authStyles.label}>Password</Text>
            <View style={authStyles.passwordInput}>
              <TextInput
                autoComplete="new-password"
                onBlur={() => setPasswordTouched(true)}
                onChangeText={(value) => { setPassword(value); setPasswordTouched(Boolean(value)) }}
                placeholder="Create a password"
                placeholderTextColor="#62718b"
                secureTextEntry={!passwordVisible}
                style={[authStyles.input, authStyles.passwordTextInput, Boolean(passwordError) && authStyles.inputError]}
                value={password}
              />
              <Pressable accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'} hitSlop={8} onPress={() => setPasswordVisible((visible) => !visible)} style={authStyles.passwordVisibilityButton}>
                <Feather color="#53617b" name={passwordVisible ? 'eye-off' : 'eye'} size={21} />
              </Pressable>
            </View>
          </View>
          {passwordError ? <Text style={authStyles.error}>{passwordError}</Text> : errors.fields.password && <Text style={authStyles.error}>{errors.fields.password.message}</Text>}
          <Pressable
            disabled={busy || Boolean(validateEmail(emailAddress)) || Boolean(validatePasswordForSignUp(password))}
            onPress={createAccount}
            style={[
              authStyles.button,
              (busy || validateEmail(emailAddress) || validatePasswordForSignUp(password)) && authStyles.buttonDisabled,
            ]}
          >
            <Text style={authStyles.buttonText}>{busy ? 'Creating…' : 'Create account'}</Text>
          </Pressable>
          <View nativeID="clerk-captcha" />
          <View style={authStyles.footer}>
            <Text style={authStyles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/sing-in">
              <Text style={authStyles.footerLink}>Sign in</Text>
            </Link>
          </View>
        </>
      )}
    </AuthShell>
  )
}
