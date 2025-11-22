import { useEffect, useState } from 'react';
import { API_BASE_URL } from './config';

function HealthCheck() {
  const [status, setStatus] = useState<string>('Checking…');

  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then(async (res) => {
        const data = await res.json();
        setStatus(`Backend status: ${data.status}`);
      })
      .catch(() => {
        setStatus('Backend not reachable');
      });
  }, []);

  return (
    <div className="p-4">
      <p>{status}</p>
    </div>
  );
}

export default HealthCheck;
