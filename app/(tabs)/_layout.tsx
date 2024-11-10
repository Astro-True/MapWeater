import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
//import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
      }}>
        <Tabs.Screen
        name="index"
        options={{
          title: 'GUIA',
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

      <Tabs.Screen
        name="climas"
        options={{
          title: 'Estados de climas',
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="today"
        options={{
          title: 'Clima Del Dia',
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tomorrow"
        options={{
          title: 'Clima De Mañana',
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
        }}
      />
            <Tabs.Screen
        name="fiveday"
        options={{
          title: 'Próximos 5 días',
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
        }}
      />
    </Tabs>
  );
}
