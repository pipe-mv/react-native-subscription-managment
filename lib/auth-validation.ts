const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string) {
  if (!email.trim()) return 'Email is required.'
  if (!emailPattern.test(email.trim())) return 'Enter a valid email address.'
  return ''
}

export function validatePasswordForSignIn(password: string) {
  return password ? '' : 'Password is required.'
}

export function validatePasswordForSignUp(password: string) {
  if (!password) return 'Password is required.'
  if (password.length < 15) {
    const remaining = 15 - password.length
    return `Use at least 15 characters (${remaining} more to go).`
  }
  return ''
}
