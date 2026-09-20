import type { ReactNode } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brand}>
            <View style={styles.mark}>
              <Text style={styles.markText}>S</Text>
            </View>
            <View>
              <Text style={styles.brandName}>Subscription</Text>
              <Text style={styles.tagline}>TRACKER</Text>
            </View>
          </View>
          <View style={styles.intro}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
          <View style={styles.card}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export const authStyles = StyleSheet.create({
  field: { gap: 9 },
  label: { color: '#081126', fontFamily: 'sans-bold', fontSize: 16 },
  input: {
    backgroundColor: '#fffbea',
    borderColor: '#cbc5a8',
    borderRadius: 16,
    borderWidth: 1.5,
    color: '#081126',
    fontFamily: 'sans-medium',
    fontSize: 16,
    height: 58,
    paddingHorizontal: 18,
  },
  inputError: { borderColor: '#b42318' },
  passwordInput: { position: 'relative' },
  passwordTextInput: { paddingRight: 54 },
  passwordVisibilityButton: { alignItems: 'center', height: 48, justifyContent: 'center', position: 'absolute', right: 5, top: 5, width: 48 },
  button: {
    alignItems: 'center',
    backgroundColor: '#13b5ea',
    borderRadius: 16,
    height: 58,
    justifyContent: 'center',
    marginTop: 6,
  },
  buttonDisabled: { opacity: 0.55 },
  buttonText: { color: '#fff', fontFamily: 'sans-bold', fontSize: 17 },
  error: { color: '#b42318', fontFamily: 'sans-medium', fontSize: 13, marginTop: -7 },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 25,
  },
  footerText: { color: '#52617d', fontFamily: 'sans-regular', fontSize: 16 },
  footerLink: { color: '#0c98cc', fontFamily: 'sans-bold', fontSize: 16 },
  socialLabel: { color: '#52617d', fontFamily: 'sans-medium', fontSize: 13, textAlign: 'center' },
  socialRow: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  socialButton: { alignItems: 'center', backgroundColor: '#fffbea', borderColor: '#cbc5a8', borderRadius: 14, borderWidth: 1, height: 48, justifyContent: 'center', width: 72 },
  socialButtonDisabled: { opacity: 0.5 },
  socialLogo: { height: 25, resizeMode: 'contain', width: 32 },
})
const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#fff9e3', flex: 1 },
  flex: { flex: 1 },
  content: { flexGrow: 1, padding: 24, paddingTop: 32 },
  brand: { alignItems: 'center', flexDirection: 'row', gap: 13, justifyContent: 'center' },
  mark: {
    alignItems: 'center',
    backgroundColor: '#13b5ea',
    borderBottomLeftRadius: 24,
    borderRadius: 6,
    borderTopRightRadius: 24,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  markText: { color: '#fff', fontFamily: 'sans-bold', fontSize: 35 },
  brandName: { color: '#081126', fontFamily: 'sans-bold', fontSize: 25 },
  tagline: {
    color: '#53617b',
    fontFamily: 'sans-medium',
    fontSize: 14,
    letterSpacing: 0.5,
    marginTop: 3,
  },
  intro: { alignItems: 'center', marginBottom: 26, marginTop: 40 },
  title: { color: '#081126', fontFamily: 'sans-bold', fontSize: 29, textAlign: 'center' },
  subtitle: {
    color: '#53617b',
    fontFamily: 'sans-regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255,248,231,0.68)',
    borderColor: 'rgba(8,17,38,0.12)',
    borderRadius: 28,
    borderWidth: 1,
    gap: 14,
    padding: 20,
  },
})
