import '@/global.css'
import { clsx } from 'clsx'
import dayjs from 'dayjs'
import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import { icons } from '../constants/icons'

const categories = [
  'Entertainment',
  'AI Tools',
  'Developer Tools',
  'Design',
  'Productivity',
  'Cloud',
  'Music',
  'Other',
] as const

const categoryColors: Record<(typeof categories)[number], string> = {
  Entertainment: '#f5c542',
  'AI Tools': '#b8d4e3',
  'Developer Tools': '#e8def8',
  Design: '#b8e8d0',
  Productivity: '#f3c4a8',
  Cloud: '#c8d9f2',
  Music: '#f2b5d4',
  Other: '#d9d4c7',
}

type Frequency = 'Monthly' | 'Yearly'

interface CreateSubscriptionModalProps {
  visible: boolean
  onClose: () => void
  onCreate: (subscription: Subscription) => void
}

export default function CreateSubscriptionModal({
  visible,
  onClose,
  onCreate,
}: CreateSubscriptionModalProps) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [frequency, setFrequency] = useState<Frequency>('Monthly')
  const [category, setCategory] = useState<(typeof categories)[number]>('Other')

  const numericPrice = Number.parseFloat(price)
  const valid = Boolean(name.trim()) && Number.isFinite(numericPrice) && numericPrice > 0

  const resetForm = () => {
    setName('')
    setPrice('')
    setFrequency('Monthly')
    setCategory('Other')
  }

  const close = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = () => {
    if (!valid) return

    const startDate = dayjs()
    const subscription: Subscription = {
      id: `${name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
      name: name.trim(),
      price: numericPrice,
      frequency,
      category,
      status: 'active',
      startDate: startDate.toISOString(),
      renewalDate: startDate.add(1, frequency === 'Monthly' ? 'month' : 'year').toISOString(),
      icon: icons.wallet,
      billing: frequency,
      color: categoryColors[category],
    }

    onCreate(subscription)
    resetForm()
    onClose()
  }

  return (
    <Modal animationType="slide" onRequestClose={close} transparent visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <Pressable className="flex-1" onPress={close} />
        <View className="modal-container">
          <View className="modal-header">
            <Text className="modal-title">New Subscription</Text>
            <Pressable
              accessibilityLabel="Close new subscription form"
              className="modal-close"
              hitSlop={8}
              onPress={close}
            >
              <Text className="modal-close-text">×</Text>
            </Pressable>
          </View>
          <ScrollView
            className="max-h-[620px]"
            contentContainerClassName="modal-body"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="auth-field">
              <Text className="auth-label">Name</Text>
              <TextInput
                autoCapitalize="words"
                className="auth-input"
                onChangeText={setName}
                placeholder="e.g. Netflix"
                placeholderTextColor="rgba(0, 0, 0, 0.45)"
                value={name}
              />
            </View>
            <View className="auth-field">
              <Text className="auth-label">Price</Text>
              <TextInput
                className="auth-input"
                keyboardType="decimal-pad"
                onChangeText={setPrice}
                placeholder="0.00"
                placeholderTextColor="rgba(0, 0, 0, 0.45)"
                value={price}
              />
            </View>
            <View className="auth-field">
              <Text className="auth-label">Frequency</Text>
              <View className="picker-row">
                {(['Monthly', 'Yearly'] as const).map((option) => {
                  const active = frequency === option
                  return (
                    <Pressable
                      className={clsx('picker-option', active && 'picker-option-active')}
                      key={option}
                      onPress={() => setFrequency(option)}
                    >
                      <Text
                        className={clsx(
                          'picker-option-text',
                          active && 'picker-option-text-active',
                        )}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>
            </View>
            <View className="auth-field">
              <Text className="auth-label">Category</Text>
              <View className="category-scroll">
                {categories.map((option) => {
                  const active = category === option
                  return (
                    <Pressable
                      className={clsx('category-chip', active && 'category-chip-active')}
                      key={option}
                      onPress={() => setCategory(option)}
                    >
                      <Text
                        className={clsx(
                          'category-chip-text',
                          active && 'category-chip-text-active',
                        )}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>
            </View>
            <Pressable
              className={clsx('auth-button', !valid && 'auth-button-disabled')}
              disabled={!valid}
              onPress={handleSubmit}
            >
              <Text className="auth-button-text">Add Subscription</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
