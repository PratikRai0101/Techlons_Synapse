import { Tabs } from 'expo-router';
import { BarChart2, BellDot, FileText, User } from 'lucide-react-native';

export default function DoctorTabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Cases',
          tabBarIcon: ({ color, size }) => <FileText color={color} size={size} />, 
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
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color, size }) => <FileText color={color} size={size} />, 
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
