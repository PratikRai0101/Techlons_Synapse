import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useWebSocketDNA } from '../../../hooks/useWebSocketDNA';

export default function DoctorAnalysisScreen() {
  const [dna, setDna] = useState('');
  const { result, processing, error, sendDNA } = useWebSocketDNA('ws://piuss-biosentinel-api.hf.space/ws');

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Analysis & Viz (Doctor)</Text>
      <Text className="mb-2 font-bold">Paste DNA Sequence:</Text>
      <TextInput
        className="border border-black rounded p-2 mb-2 font-mono"
        multiline
        numberOfLines={4}
        value={dna}
        onChangeText={setDna}
        placeholder={"Paste DNA sequence here..."}
      />
      <TouchableOpacity
        className="bg-black py-3 rounded items-center mb-4"
        onPress={() => sendDNA(dna)}
        disabled={processing || !dna.trim()}
      >
        <Text className="text-white font-bold">{processing ? 'Processing...' : 'Send for Clustering'}</Text>
      </TouchableOpacity>
      {error && <Text className="text-red-500 mb-2">{error}</Text>}
      {result && (
        <View className="border border-black rounded p-4 mt-2">
          <Text className="font-bold mb-2">Cluster Result</Text>
          <Text>Status: {result.status}</Text>
          <Text>Total Sequences: {result.total}</Text>
          <Text>Clusters: {result.clusters}</Text>
          <Text>Anomalies: {result.anomalies}</Text>
          <Text className="mt-2 font-bold">Assignments:</Text>
          {result.data.map((item, idx) => (
            <Text key={idx}>Seq #{item.seq_idx + 1}: Cluster {item.cluster}</Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
