import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Colors from '../constants/colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    // Using system fonts for compatibility with Expo Go
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor={Colors.primary} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="appointment-detail"
          options={{
            headerShown: true,
            headerTitle: 'Appointment Details',
            headerStyle: { backgroundColor: Colors.primary },
            headerTintColor: Colors.white,
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="medication-detail"
          options={{
            headerShown: true,
            headerTitle: 'Medication Details',
            headerStyle: { backgroundColor: Colors.primary },
            headerTintColor: Colors.white,
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="vital-history"
          options={{
            headerShown: true,
            headerTitle: 'Vital History',
            headerStyle: { backgroundColor: Colors.primary },
            headerTintColor: Colors.white,
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="emergency"
          options={{
            headerShown: true,
            headerTitle: '🚨 Emergency',
            headerStyle: { backgroundColor: Colors.red },
            headerTintColor: Colors.white,
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            headerShown: true,
            headerTitle: 'Notifications',
            headerStyle: { backgroundColor: Colors.primary },
            headerTintColor: Colors.white,
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="robot-control"
          options={{
            headerShown: true,
            headerTitle: 'Robot Controller',
            headerStyle: { backgroundColor: Colors.primary },
            headerTintColor: Colors.white,
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="battery-monitor"
          options={{
            headerShown: true,
            headerTitle: 'Battery & Power Health',
            headerStyle: { backgroundColor: Colors.primary },
            headerTintColor: Colors.white,
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="robot-location"
          options={{
            headerShown: true,
            headerTitle: 'Live Location & Map',
            headerStyle: { backgroundColor: Colors.primary },
            headerTintColor: Colors.white,
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="robot-settings"
          options={{
            headerShown: true,
            headerTitle: 'Robot Settings',
            headerStyle: { backgroundColor: Colors.primary },
            headerTintColor: Colors.white,
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="robot-tasks"
          options={{
            headerShown: true,
            headerTitle: 'Healthcare Tasks',
            headerStyle: { backgroundColor: Colors.primary },
            headerTintColor: Colors.white,
            headerBackTitle: 'Back',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
