import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PagingModule = () => {
  const [refString, setRefString] = useState("7,0,1,2,0,3,0,4,2,3,0,3");
  const [frames, setFrames] = useState(3);
  const [algorithm, setAlgorithm] = useState("FIFO");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const runSimulation = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const referenceArray = refString.split(',').map(s => s.trim());

    // Input validation
    if (referenceArray.some(val => isNaN(parseInt(val)))) {
      setError("Reference string must only contain comma-separated numbers.");
      setLoading(false);
      return;
    }

    if (frames < 1 || frames > 10) {
      setError("Frame count must be between 1 and 10.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: referenceArray.map(Number),
          frames,
          algorithm
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Simulation failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const pieChartData = result ? {
    labels: ['Hits', 'Faults'],
    datasets: [
      {
        label: 'Page Performance',
        data: [result.hits, result.faults],
        backgroundColor: ['#4ade80', '#f87171'],
        borderColor: ['#16a34a', '#dc2626'],
        borderWidth: 1
      }
    ]
  } : null;

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-3xl mx-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 min-h-screen"
    >
      <h2 className="text-3xl font-bold mb-6">Paging Algorithms Simulator</h2>

      <label className="block mb-2 font-semibold">Reference String (comma separated):</label>
      <input
        type="text"
        className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
        value={refString}
        onChange={e => {
          setRefString(e.target.value);
          setError(null);
        }}
      />

      <label className="block mb-2 font-semibold">Number of Frames:</label>
      <input
        type="number"
        min={1}
        max={10}
        className="w-24 p-2 mb-4 border rounded dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
        value={frames}
        onChange={e => {
          setFrames(Number(e.target.value));
          setError(null);
        }}
      />

      <label className="block mb-2 font-semibold">Algorithm:</label>
      <select
        className="w-full p-2 mb-6 border rounded dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
        value={algorithm}
        onChange={e => {
          setAlgorithm(e.target.value);
          setError(null);
        }}
      >
        <option value="FIFO">FIFO</option>
        <option value="LIFO">LIFO</option>
        <option value="Optimal">Optimal</option>
        <option value="AI-Based">AI-Based</option>
      </select>

      <button
        onClick={runSimulation}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Running..." : "Run Simulation"}
      </button>

      {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}

      {result && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Results</h3>
          <p><strong>Hits:</strong> {result.hits} (<strong>Hit Ratio:</strong> {result.hit_ratio})</p>
          <p><strong>Faults:</strong> {result.faults} (<strong>Fault Ratio:</strong> {result.fault_ratio})</p>

          <div className="w-full md:w-1/2 mt-6">
            <h4 className="text-lg font-semibold mb-2">Hits vs Faults (Pie Chart)</h4>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>

          <h4 className="mt-8 font-semibold">Frames Over Time:</h4>
          <div className="overflow-x-auto">
            <table className="w-full mt-2 border-collapse border border-gray-300 dark:border-gray-600">
              <thead>
                <tr>
                  {result.steps.map((_, idx) => (
                    <th key={idx} className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                      Step {idx + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: frames }).map((_, frameIdx) => (
                  <tr key={frameIdx} className="dark:bg-gray-700">
                    {result.steps.map((step, stepIdx) => (
                      <td key={stepIdx} className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                        {step.memory[frameIdx] !== undefined && step.memory[frameIdx] !== null
                          ? step.memory[frameIdx]
                          : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  {result.steps.map((step, idx) => (
                    <td
                      key={idx}
                      className={`border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-semibold ${
                        step.status === "HIT" ? "bg-green-100 dark:bg-green-700" : "bg-red-100 dark:bg-red-700"
                      }`}
                    >
                      {step.status}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Detailed Step Transitions */}
          <div className="mt-10">
            <h4 className="text-lg font-semibold mb-2">Detailed Step Transitions</h4>
            <div className="space-y-2">
              {result.steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded border-l-4 shadow-sm ${
                    step.status === "HIT"
                      ? "bg-green-50 border-green-500 dark:bg-green-900"
                      : "bg-red-50 border-red-500 dark:bg-red-900"
                  }`}
                >
                  <p className="text-sm">
                    <strong>Step {idx + 1}:</strong> Page <code>{step.page}</code> →
                    <span className={`ml-2 font-bold ${step.status === "HIT" ? "text-green-600" : "text-red-600"}`}>
                      {step.status}
                    </span>
                  </p>
                  {step.status === "MISS" && step.replaced !== null && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Replaced page <code>{step.replaced}</code>
                    </p>
                  )}
                  <p className="text-sm mt-1 text-gray-700 dark:text-gray-400">
                    Memory state: <code>[{step.memory.map(p => (p === null || p === undefined ? '-' : p)).join(', ')}]</code>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PagingModule;
