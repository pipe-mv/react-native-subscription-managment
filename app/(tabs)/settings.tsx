import { useClerk, useUser } from '@clerk/expo'
import { posthog } from '@/lib/posthog'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'
import {styled} from 'nativewind'

const SafeAreaView = styled(RNSafeAreaView)

const Settings = () => {
	const { user } = useUser()
	const { signOut } = useClerk()

	const handleSignOut = async () => {
		posthog?.capture('signed_out')
		await signOut()
		posthog?.reset()
	}

	return (
		<SafeAreaView className= "flex-1 bg-background p-5">
			<Text style={styles.title}>Account</Text>
			<View style={styles.card}>
				<View style={styles.avatar}><Text style={styles.avatarText}>{user?.firstName?.charAt(0) ?? user?.primaryEmailAddress?.emailAddress.charAt(0)?.toUpperCase() ?? 'R'}</Text></View>
				<View><Text style={styles.name}>{user?.fullName || 'Subscription Tracker member'}</Text><Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress}</Text></View>
			</View>
			<Pressable onPress={handleSignOut} style={styles.signOut}><Text style={styles.signOutText}>Sign out</Text></Pressable>
		</SafeAreaView>
	)
}

export default Settings

const styles = StyleSheet.create({
	title: { color: '#081126', fontFamily: 'sans-bold', fontSize: 30, marginTop: 20, marginBottom: 24 },
	card: { alignItems: 'center', backgroundColor: '#fff8e7', borderColor: 'rgba(8,17,38,0.12)', borderRadius: 24, borderWidth: 1, flexDirection: 'row', gap: 16, padding: 20 },
	avatar: { alignItems: 'center', backgroundColor: '#13b5ea', borderRadius: 28, height: 56, justifyContent: 'center', width: 56 }, avatarText: { color: '#fff', fontFamily: 'sans-bold', fontSize: 22 },
	name: { color: '#081126', fontFamily: 'sans-semibold', fontSize: 16 }, email: { color: '#53617b', fontFamily: 'sans-regular', fontSize: 13, marginTop: 4 },
	signOut: { alignItems: 'center', borderColor: '#0c98cc', borderRadius: 16, borderWidth: 1, marginTop: 20, paddingVertical: 15 }, signOutText: { color: '#0c98cc', fontFamily: 'sans-bold', fontSize: 16 },
})
