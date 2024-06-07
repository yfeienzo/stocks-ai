'use client'

import {useState} from 'react'

export default function Home() {

  const [ticker,setTicker] = useState("")
  const [report, setReport] = useState("")
  const [loading, setLoading] = useState(false)

  const generateReport = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/stocks?ticker=${ticker}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setReport(data); // Assuming the API returns the report data
    } catch (error) {
      console.error('Error fetching report:', error);
    }
    setLoading(false)
  };

  return (
    <main className="mx-10 my-5 flex flex-col items-start">
      <input value={ticker} onChange={e=>setTicker(e.target.value)} className="mb-4 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" />
      <button onClick={generateReport} className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{loading ? 'Generating...' : 'Generate Report'}</button>
      <p>Recommendation one year ago based on one year old data: </p>
      {report && <div className="mt-4">{report}</div>}
    </main>
  );
}
