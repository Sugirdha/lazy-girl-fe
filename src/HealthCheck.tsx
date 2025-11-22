import { useEffect, useState } from 'react';

function HealthCheck() {
  const [status, setStatus] = useState<string>('Checking…');

  useEffect(() => {
    fetch('http://localhost:8000/health')
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
