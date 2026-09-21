import '@/global.css'
import React, { useMemo, useState } from 'react'
import { FlatList, Text, TextInput, View } from 'react-native'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'
import {styled} from 'nativewind'
import SubscriptionCard from '../../Components/SubscriptionCard'
import { HOME_SUBSCRIPTIONS } from '../../constants/data'
import { posthog } from '../../lib/posthog'

const SafeAreaView = styled(RNSafeAreaView)

const Subscriptions = () => {
	const [searchQuery, setSearchQuery] = useState('')
	const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null)

	const filteredSubscriptions = useMemo(() => {
		const query = searchQuery.trim().toLowerCase()
		if (!query) return HOME_SUBSCRIPTIONS

		return HOME_SUBSCRIPTIONS.filter((subscription) =>
			[
				subscription.name,
				subscription.plan,
				subscription.category,
				subscription.billing,
				subscription.status,
			]
				.filter(Boolean)
				.some((value) => value?.toLowerCase().includes(query)),
		)
	}, [searchQuery])

	return (
		<SafeAreaView className= "flex-1 bg-background p-5">
			<FlatList
				data={filteredSubscriptions}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<SubscriptionCard
						{...item}
						expanded={expandedSubscriptionId === item.id}
						onPress={() => {
							const expanded = expandedSubscriptionId !== item.id
							setExpandedSubscriptionId(expanded ? item.id : null)
							posthog?.capture('subscription_card_toggled', {
								expanded,
								source: 'subscriptions',
							})
						}}
					/>
				)}
				extraData={expandedSubscriptionId}
				ItemSeparatorComponent={() => <View className="h-4" />}
				ListHeaderComponent={
					<View className="mb-5">
						<Text className="mb-2 text-3xl font-sans-bold text-primary">Subscriptions</Text>
						<Text className="mb-5 text-sm font-sans-medium text-muted-foreground">
							{filteredSubscriptions.length} of {HOME_SUBSCRIPTIONS.length} subscriptions
						</Text>
						<TextInput
							value={searchQuery}
							onChangeText={setSearchQuery}
							placeholder="Search subscriptions"
							placeholderTextColor="rgba(0, 0, 0, 0.45)"
							className="rounded-2xl border border-border bg-card px-4 py-4 text-base font-sans-medium text-primary"
							accessibilityLabel="Search subscriptions"
							clearButtonMode="while-editing"
							returnKeyType="search"
						/>
					</View>
				}
				ListEmptyComponent={
					<Text className="home-empty-state">
						No subscriptions match “{searchQuery.trim()}”.
					</Text>
				}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
				keyboardDismissMode="on-drag"
				automaticallyAdjustKeyboardInsets
				contentContainerClassName="pb-18"
			/>
		</SafeAreaView>
	)
}

export default Subscriptions
