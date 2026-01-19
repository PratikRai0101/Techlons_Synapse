import { useEffect, useRef, useState } from 'react';

export interface ClusterResult {
  status: string;
  total: number;
  clusters: number;
  anomalies: number;
  data: Array<{ cluster: number; seq_idx: number }>;
}

export function useWebSocketDNA(url: string) {
  const ws = useRef<WebSocket | null>(null);
  const [result, setResult] = useState<ClusterResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(url);
    ws.current.onopen = () => {
      setError(null);
    };
    ws.current.onerror = (e) => {
      setError('WebSocket error');
    };
    ws.current.onclose = () => {
      setProcessing(false);
    };
    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.status === 'complete') {
          setResult(data);
          setProcessing(false);
        } else if (data.status === 'processing') {
          setProcessing(true);
        }
      } catch (e) {
        setError('Invalid response');
      }
    };
    return () => {
      ws.current?.close();
    };
  }, [url]);

  const sendDNA = (sequence: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(sequence);
      setProcessing(true);
    } else {
      setError('WebSocket not connected');
    }
  };

  return { result, processing, error, sendDNA };
}
