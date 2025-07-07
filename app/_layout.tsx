// _layout.tsx
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import this!

export default function RootLayout() {
  return (
    // Wrap your entire application content with GestureHandlerRootView
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{headerShown:false}}>
        {/* Your screen definitions or other layout components go here */}
        <Stack.Screen name="index" options={{ title: "My To-Do App" }} />
        {/* Add more Stack.Screen components for other routes if you have them */}
      </Stack>
    </GestureHandlerRootView>
  );
}