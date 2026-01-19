import { Tabs } from 'expo-router';
import { BarChart2, BellDot, Compass, Home, User } from 'lucide-react-native';

export default function LabTabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />, 
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: 'Analysis',
          tabBarIcon: ({ color, size }) => <BarChart2 color={color} size={size} />, 
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: '',
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} style={{ backgroundColor: 'black', borderRadius: 50, padding: 8 }} />, 
          tabBarLabel: () => null,
          tabBarButton: (props) => (
            <div style={{ position: 'relative', top: -20, background: 'black', borderRadius: 50, width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Compass color={'white'} size={32} />
            </div>
          ),
        }}
      />
      <Tabs.Screen
        name="audit"
        options={{
          title: 'Audit',
          tabBarIcon: ({ color, size }) => <BellDot color={color} size={size} />, 
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />, 
        }}
      />
    </Tabs>
  );
}
