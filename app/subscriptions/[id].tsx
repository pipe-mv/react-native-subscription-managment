import { Link, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Text } from 'react-native'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'
import {styled} from 'nativewind'

const SafeAreaView = styled(RNSafeAreaView)

const SubscriptionDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <SafeAreaView>
      <Text>Subscription Details: {id}</Text>
      <Link href="/(tabs)/subscriptions">Back to Subscriptions</Link>
    </SafeAreaView>
  )
}

export default SubscriptionDetails
