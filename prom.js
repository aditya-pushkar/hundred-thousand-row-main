"use client";

import { useState, useEffect, useCallback } from "react";
import { TableVirtuoso } from "react-virtuoso";

const TOTAL_INTEGERS = 1000;
const BATCH_SIZE = 50; // Increased batch size for efficiency

export default function Home() {
  const [sqrs, setSqrs] = useState({});
  const [fetchingBatches, setFetchingBatches] = useState(new Set());

  const fetchSquareBatch = useCallback(async (startIndex) => {
    if (fetchingBatches.has(startIndex)) return;

    setFetchingBatches(prev => new Set(prev).add(startIndex));

    // The Math.min() method returns the number with the lowest value.
    const endIndex = Math.min(startIndex + BATCH_SIZE, TOTAL_INTEGERS);
    const promises = [];

    for (let i = startIndex; i < endIndex; i++) {
      promises.push(
        fetch('/api/square', {
          method: 'POST',
          body: JSON.stringify({ integer: i + 1 }), // +1 because we don't want to start from 0
        }).then(res => res.json())
      );
    }

    const results = await Promise.all(promises);

    setSqrs(prev => {
      const newSqrs = { ...prev };
      results.forEach((result, index) => {
        newSqrs[startIndex + index] = result.sqr;
      });
      return newSqrs;
    });

    setFetchingBatches(prev => {
      const newSet = new Set(prev);
      newSet.delete(startIndex);
      return newSet;
    });
  }, [fetchingBatches]);

  const renderRow = useCallback((index) => {
    const batchStartIndex = Math.floor(index / BATCH_SIZE) * BATCH_SIZE;
    
    if (sqrs[index] === undefined && !fetchingBatches.has(batchStartIndex)) {
      fetchSquareBatch(batchStartIndex);
    }

    return (
      <>
        <td className="py-2 px-6 border-b border-gray-800">{index + 1}</td>
        <td className="py-2 px-6 border-b border-gray-800">
          {sqrs[index] !== undefined ? sqrs[index] : "Loading..."}
        </td>
      </>
    );
  }, [sqrs, fetchingBatches, fetchSquareBatch]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-3xl bg-gray-950 shadow-lg rounded-lg overflow-hidden">
        <TableVirtuoso
          className="w-full"
          totalCount={TOTAL_INTEGERS}
          itemContent={renderRow}
          components={{
            Table: ({ style, ...props }) => (
              <table {...props} style={{ ...style, width: '100%' }} />
            ),
          }}
          fixedHeaderContent={() => (
            <tr className="bg-gray-900 px-24">
              <th className="text-left py-3 px-6 font-semibold text-white-200 w-full">
                Integer
              </th>
              <th className="text-left py-3 px-6 font-semibold text-white-200 w-full">
                Square
              </th>
            </tr>
          )}
        />
      </div>
    </main>
  );
}