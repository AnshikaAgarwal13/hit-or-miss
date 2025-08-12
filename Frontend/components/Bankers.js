import React, { useState } from "react";
import { motion } from "framer-motion";

const Bankers = () => {
  const [isSafeState, setIsSafeState] = useState(null);
  const [safeSequence, setSafeSequence] = useState([]);
  const [numProcesses, setNumProcesses] = useState("");
  const [numResources, setNumResources] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showNeedMatrix, setShowNeedMatrix] = useState(false);
  const [allocation, setAllocation] = useState([]);
  const [maxDemand, setMaxDemand] = useState([]);
  const [available, setAvailable] = useState([]);
  const [step, setStep] = useState(1);

  const initMatrices = (p, r) => {
    const zeroMatrix = Array(p).fill().map(() => Array(r).fill(0));
    const zeroVector = Array(r).fill(0);
    setAllocation(zeroMatrix);
    setMaxDemand(zeroMatrix);
    setAvailable(zeroVector);
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    const p = parseInt(numProcesses);
    const r = parseInt(numResources);
    if (isNaN(p) || p <= 0 || isNaN(r) || r <= 0) {
      alert("Enter valid numbers for processes and resources");
      return;
    }
    initMatrices(p, r);
    setSubmitted(true);
    setStep(2);
  };

  const handleAllocationChange = (pIdx, rIdx, value) => {
    const val = Math.max(0, parseInt(value) || 0);
    setAllocation((prev) =>
      prev.map((row, i) =>
        i === pIdx ? row.map((cell, j) => (j === rIdx ? val : cell)) : row
      )
    );
  };

  const handleMaxChange = (pIdx, rIdx, value) => {
    const val = Math.max(0, parseInt(value) || 0);
    setMaxDemand((prev) =>
      prev.map((row, i) =>
        i === pIdx ? row.map((cell, j) => (j === rIdx ? val : cell)) : row
      )
    );
  };

  const handleAvailableChange = (rIdx, value) => {
    const val = Math.max(0, parseInt(value) || 0);
    setAvailable((prev) =>
      prev.map((cell, j) => (j === rIdx ? val : cell))
    );
  };

  const renderMatrixInput = (matrix, onChange, label, isVector = false) => (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2 dark:text-gray-200">{label}</h3>
      <table className="border border-collapse dark:border-gray-600">
        <tbody>
          {!isVector ? (
            matrix.map((row, rIdx) => (
              <tr key={rIdx} className="dark:bg-gray-800">
                <td className="border px-2 py-1 font-bold dark:border-gray-600 dark:text-gray-300">P{rIdx}</td>
                {row.map((val, cIdx) => (
                  <td key={cIdx} className="border px-2 py-1 dark:border-gray-600">
                    <input
                      type="number"
                      min="0"
                      value={val}
                      onChange={(e) =>
                        onChange(rIdx, cIdx, e.target.value)
                      }
                      className="w-14 p-1 border rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    />
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr className="dark:bg-gray-800">
              {matrix.map((val, idx) => (
                <td key={idx} className="border px-2 py-1 dark:border-gray-600">
                  <input
                    type="number"
                    min="0"
                    value={val}
                    onChange={(e) => onChange(idx, e.target.value)}
                    className="w-14 p-1 border rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  />
                </td>
              ))}
            </tr>
          )}
        </tbody>
        {!isVector && (
          <tfoot>
            <tr className="dark:bg-gray-900">
              <td className="border px-2 py-1 font-bold dark:border-gray-600 dark:text-gray-300">R#</td>
              {matrix[0].map((_, idx) => (
                <td key={idx} className="border px-2 py-1 font-bold dark:border-gray-600 dark:text-gray-300">
                  R{idx}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );

  const getNeedMatrix = () =>
    maxDemand.map((row, i) =>
      row.map((val, j) => val - allocation[i][j])
    );

  const resetMatrices = () => {
    initMatrices(allocation.length, available.length);
    setStep(2);
    setShowNeedMatrix(false);
  };

  const restartApp = () => {
    setNumProcesses("");
    setNumResources("");
    setSubmitted(false);
    setAllocation([]);
    setMaxDemand([]);
    setAvailable([]);
    setStep(1);
    setShowNeedMatrix(false);
  };

  const checkSafety = () => {
    const p = allocation.length;
    const r = available.length;
    const need = getNeedMatrix();
    const work = [...available];
    const finish = Array(p).fill(false);
    const sequence = [];
    let found;

    do {
      found = false;
      for (let i = 0; i < p; i++) {
        if (!finish[i]) {
          const canProceed = need[i].every((n, j) => n <= work[j]);
          if (canProceed) {
            for (let j = 0; j < r; j++) {
              work[j] += allocation[i][j];
            }
            finish[i] = true;
            sequence.push(i);
            found = true;
          }
        }
      }
    } while (found);

    const isSafe = finish.every(Boolean);
    setIsSafeState(isSafe);
    setSafeSequence(sequence);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen"
    >
      <h1 className="text-3xl font-bold mb-4">Banker's Algorithm Simulator</h1>

      {!submitted ? (
        <form onSubmit={handleInitialSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold dark:text-gray-200">
              Number of Processes:
              <input
                type="number"
                value={numProcesses}
                onChange={(e) => setNumProcesses(e.target.value)}
                min="1"
                className="ml-2 p-1 border rounded w-24 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              />
            </label>
          </div>
          <div>
            <label className="block font-semibold dark:text-gray-200">
              Number of Resources:
              <input
                type="number"
                value={numResources}
                onChange={(e) => setNumResources(e.target.value)}
                min="1"
                className="ml-2 p-1 border rounded w-24 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              />
            </label>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Next
          </button>
        </form>
      ) : step === 2 ? (
        <>
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">
            Enter Allocation, Max Demand and Available Resources
          </h2>
          {renderMatrixInput(allocation, handleAllocationChange, "Allocation Matrix")}
          {renderMatrixInput(maxDemand, handleMaxChange, "Max Demand Matrix")}
          {renderMatrixInput(available, handleAvailableChange, "Available Vector", true)}
          {renderMatrixInput(getNeedMatrix(), () => {}, "Need Matrix")}

          <div className="space-x-2">
            <button onClick={resetMatrices} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">
              Reset Matrices
            </button>
            <button onClick={() => setStep(3)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
              Next: Check Safety
            </button>
          </div>
        </>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">Safety Check</h2>
          <div className="space-x-2 mb-4">
            <button onClick={restartApp} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition">
              Restart
            </button>
            <button onClick={checkSafety} className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition">
              Run Safety Algorithm
            </button>
            <button
              onClick={() => setShowNeedMatrix(!showNeedMatrix)}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
              {showNeedMatrix ? "Hide" : "Show"} Need Matrix
            </button>
          </div>

          {isSafeState !== null && (
            <div className="mt-4 font-semibold">
              {isSafeState ? (
                <div className="text-green-600 dark:text-green-400">
                  ✅ System is in a <u>SAFE</u> state.
                  <br />
                  Safe sequence:{" "}
                  {safeSequence.map((p, idx) => (
                    <span key={p}>
                      P{p}{idx !== safeSequence.length - 1 ? " → " : ""}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-red-600 dark:text-red-400">
                  ❌ System is <u>NOT</u> in a safe state.
                </div>
              )}
            </div>
          )}

          {showNeedMatrix && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2 dark:text-gray-200">Need Matrix</h3>
              {renderMatrixInput(getNeedMatrix(), () => {}, "Need Matrix")}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Bankers;
