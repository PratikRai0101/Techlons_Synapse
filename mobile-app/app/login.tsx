import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen({ navigation }: any) {
  const [userId, setUserId] = useState('');
  // For demo: role selection
  const [role, setRole] = useState<'lab' | 'doctor' | 'patient'>('lab');

  const handleLogin = () => {
    if (role === 'lab') {
      navigation.replace('lab');
    } else if (role === 'doctor') {
      navigation.replace('doctor');
    } else {
      navigation.replace('patient');
    }
  };

  return (
    <View className="flex-1 bg-white justify-center px-6">
      <Text className="text-4xl font-extrabold tracking-widest mb-2">BIOSENTINEL</Text>
      <Text className="text-xs font-mono mb-8">ACCESS CONTROL // TERMINAL 1</Text>
      <View className="flex-row justify-center mb-6">
        <TouchableOpacity onPress={() => setRole('lab')} className={`px-4 py-2 mx-1 rounded ${role==='lab'?'bg-black':'bg-gray-200'}`}><Text className={`font-bold ${role==='lab'?'text-white':'text-black'}`}>LABORATORY</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setRole('doctor')} className={`px-4 py-2 mx-1 rounded ${role==='doctor'?'bg-black':'bg-gray-200'}`}><Text className={`font-bold ${role==='doctor'?'text-white':'text-black'}`}>PRACTITIONER</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setRole('patient')} className={`px-4 py-2 mx-1 rounded ${role==='patient'?'bg-black':'bg-gray-200'}`}><Text className={`font-bold ${role==='patient'?'text-white':'text-black'}`}>PATIENT</Text></TouchableOpacity>
      </View>
      <Text className="text-xs font-bold tracking-widest mb-1">IDENTITY VERIFICATION</Text>
      <View className="border border-black rounded px-2 py-4 mb-6">
        <TextInput
          className="text-lg font-mono"
          placeholder="USER_ID_"
          value={userId}
          onChangeText={setUserId}
          autoCapitalize="none"
        />
      </View>
      <TouchableOpacity onPress={handleLogin} className="bg-black py-4 rounded items-center mb-2">
        <Text className="text-white text-lg font-bold tracking-widest">LOGIN →</Text>
      </TouchableOpacity>
      <Text className="text-xs text-center mt-8 text-gray-400">BIOSENTINEL SYSTEMS V1.0.4{"\n"}UNAUTHORIZED ACCESS IS PROHIBITED</Text>
    </View>
  );
}
