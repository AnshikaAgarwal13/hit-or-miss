import React, { useState } from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const algorithms = ["FCFS", "SSTF", "SCAN", "LOOK"];
const MAX_CYLINDER = 199;

const DiskModule = () => {
  const [requests, setRequests] = useState([55, 58, 60, 70, 18]);
  const [head, setHead] = useState(50);
  const [algo, setAlgo] = useState("FCFS");
  const [path, setPath] = useState([]);
  const [metrics, setMetrics] = useState({ totalMovement: 0, seekTime: 0 });
  const [allResults, setAllResults] = useState({});

  const calculateAll = () => {
    const results = {};

    for (let a of algorithms) {
      let sequence = [];
      let total = 0;
      const sorted = [...requests].sort((a, b) => a - b);
      let current = head;

      switch (a) {
        case "FCFS":
          sequence = [...requests];
          break;

        case "SSTF":
          let temp = [...requests];
          let currPos = current;

          while (temp.length) {
            let closest = temp[0];
            let minDistance = Math.abs(temp[0] - currPos);

            for (let i = 1; i < temp.length; i++) {
              const dist = Math.abs(temp[i] - currPos);
              if (dist < minDistance) {
                minDistance = dist;
                closest = temp[i];
              }
            }

            sequence.push(closest);
            total += Math.abs(currPos - closest);
            currPos = closest;
            temp.splice(temp.indexOf(closest), 1);
          }
          results[a] = { path: [head, ...sequence], total };
          continue;

        case "SCAN":
          const scanLeft = sorted.filter((r) => r < head);
          const scanRight = sorted.filter((r) => r >= head);
          sequence = [...scanRight, MAX_CYLINDER, ...scanLeft.reverse()];
          break;

        case "LOOK":
          const left = sorted.filter((r) => r < head);
          const right = sorted.filter((r) => r >= head);

          if (
            left.length === 0 ||
            (right.length > 0 &&
              Math.abs(right[0] - head) <
                Math.abs(head - left[left.length - 1]))
          ) {
            sequence = [...right, ...left.reverse()];
          } else {
            sequence = [...left.reverse(), ...right];
          }
          break;

        default:
          break;
      }

      current = head;
      for (let req of sequence) {
        total += Math.abs(current - req);
        current = req;
      }

      results[a] = { path: [head, ...sequence], total };
    }

    setAllResults(results);
    setPath(results[algo].path);
    setMetrics({
      totalMovement: results[algo].total,
      seekTime: results[algo].total * 0.1,
    });
  };

  const chartData = {
    labels: path.map((_, i) => i),
    datasets: [
      {
        label: `${algo} Head Movement`,
        data: path,
        fill: false,
        borderColor: "#6366f1",
        backgroundColor: "#6366f1",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-700 text-black dark:text-gray-100 transition-colors duration-300 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Disk Scheduling Simulator</h1>

      <label className="block mb-2">Select Algorithm</label>
      <select
        value={algo}
        onChange={(e) => {
          setAlgo(e.target.value);
          if (allResults[e.target.value]) {
            setPath(allResults[e.target.value].path);
            setMetrics({
              totalMovement: allResults[e.target.value].total,
              seekTime: allResults[e.target.value].total * 0.1,
            });
          }
        }}
        className="mb-4 p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
      >
        {algorithms.map((a) => (
          <option key={a}>{a}</option>
        ))}
      </select>

      <label className="block mb-2">Initial Head Position: {head}</label>
      <input
        type="range"
        min="0"
        max={MAX_CYLINDER}
        value={head}
        onChange={(e) => setHead(Number(e.target.value))}
        className="w-full mb-4"
      />

      <label className="block mb-2">
        Cylinder Requests (0–{MAX_CYLINDER})
      </label>
      <div className="flex flex-wrap gap-2 mb-4">
        {requests.map((r, i) => (
          <input
            key={i}
            type="number"
            value={r}
            onChange={(e) => {
              const newReqs = [...requests];
              newReqs[i] = Number(e.target.value);
              setRequests(newReqs);
            }}
            className="w-16 p-1 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
          />
        ))}
        <button
          onClick={() => setRequests([...requests, 0])}
          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-500"
        >
          +
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={calculateAll}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 dark:hover:bg-green-500"
        >
          Simulate
        </button>
        <button
          onClick={() => {
            setPath([]);
            setMetrics({ totalMovement: 0, seekTime: 0 });
            setAllResults({});
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-500"
        >
          Reset
        </button>
      </div>

      <div className="mb-4">
        <p>Total Head Movement: {metrics.totalMovement}</p>
        <p>Seek Time: {metrics.seekTime.toFixed(2)} ms</p>
      </div>

      {Object.keys(allResults).length > 0 && (
        <div className="bg-white dark:bg-gray-600 shadow rounded p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2">Algorithm Comparison</h2>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-500">
                <th className="border px-4 py-2">Algorithm</th>
                <th className="border px-4 py-2">Total Head Movement</th>
                <th className="border px-4 py-2">Seek Time (ms)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(allResults).map(([name, result]) => (
                <tr
                  key={name}
                  className={
                    name === algo ? "bg-blue-100 dark:bg-blue-600" : "dark:bg-gray-700"
                  }
                >
                  <td className="border px-4 py-2">{name}</td>
                  <td className="border px-4 py-2">{result.total}</td>
                  <td className="border px-4 py-2">
                    {(result.total * 0.1).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {path.length > 0 && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-2">
            {algo} Head Movement Chart
          </h2>
          <Line data={chartData} />
        </motion.div>
      )}
    </div>
  );
};

export default DiskModule;
