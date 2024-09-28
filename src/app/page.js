"use client";

import { useState, useEffect } from "react";
import { TableVirtuoso } from "react-virtuoso";

const TOTAL_INTEGERS = 100_000;
const INTEGERS_PER_BATCH = 25;

export default function Home() {
  const [sqrs, setSqrs] = useState({});

  useEffect(() => {
    fetchAndUpdateSquares(1); // Start from 1 instead of 0
  }, []);

  const fetchAndUpdateSquares = async (from) => {
    console.log(
      "Fetching and updating squares from",
      from,
      from + INTEGERS_PER_BATCH - 1
    );

    /**
     * Initilize the new sets of squares with null values,  example from 0 - 25
     *  1: { sqr: null }, 2: { sqr: null }, ... ,  25 {sqr: null}}
     */
    const newSqrs = {};
    for (
      let int = from;
      int < from + INTEGERS_PER_BATCH && int <= TOTAL_INTEGERS;
      int++
    ) {
      newSqrs[int] = { sqr: null };
    }
    // Update state with new null-valued squares
    setSqrs((prev) => ({ ...prev, ...newSqrs }));
    

    // Array of un resolved promises
    const promises = Object.keys(newSqrs).map((i) =>
      fetch("/api/square", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ integer: parseInt(i) }),
      }).then((res) => res.json())
    );

    try {
      const results = await Promise.all(promises);

      setSqrs((prev) => {
        const updatedSquares = { ...prev };
        results.forEach((result, index) => {
          const key = from + index;
          updatedSquares[key] = { sqr: result.sqr };
        });
        return updatedSquares;
      });

      console.log(
        `Batch from ${from} to ${
          from + INTEGERS_PER_BATCH - 1
        } has been updated`
      );
    } catch (error) {
      console.error("Error updating squares:", error);
    }
  };

  // Function to fetch more squares as user scrolls
  const fetchMoreRows = () => {
    const nextBatch = Object.keys(sqrs).length + 1;
    if (nextBatch <= TOTAL_INTEGERS) {
      fetchAndUpdateSquares(nextBatch);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-3xl bg-gray-950 shadow-lg rounded-lg overflow-hidden">
        <TableVirtuoso
          className="w-full"
          data={Object.entries(sqrs)}
          useWindowScroll
          endReached={fetchMoreRows}
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
          itemContent={(index, [key, value]) => (
            <>
              <td className="py-2 px-6 border-b border-gray-800">{key}</td>
              <td className="py-2 px-6 border-b border-gray-800">
                {value.sqr !== null ? value.sqr : "Loading..."}
              </td>
            </>
          )}
        />
      </div>
    </main>
  );
}
