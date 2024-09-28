"use client";

import { useEffect, useState } from "react";
import { TableVirtuoso } from "react-virtuoso";

const TOTAL_INTEGERS = 200;

export default function Home() {
  const [sqrs, setSqrs] = useState(Array(TOTAL_INTEGERS).fill(null)); // Pre-fill with null
  const [status, setStatus] = useState({
    pageLoading: "pending",
    tableLoading: "pending",
  });

  
  // Fetch the square of an individual integer
  const fetchSquare = async (index) => {
    if (sqrs[index] !== null) return; // Skip if the square is already fetched

    const response = await fetch(`/api/square`, {
      method: "POST",
      body: JSON.stringify({ number: index }),
    });

    const data = await response.json();
    const squareValue = data.sqr; // Get the square of the integer

    setSqrs((currentSqrs) => {
      const updatedSqrs = [...currentSqrs];
      updatedSqrs[index] = { int: index, sqr: squareValue };
      return updatedSqrs;
    });

  };

  // Render the table row content
  const renderRow = (index) => {
    console.log("running the row")
    fetchSquare(index); // Fetch square as soon as row is rendered

    const square = sqrs[index];
    console.log(square)
    return (
      <>
        <td className="py-2 px-6 border-b border-gray-800">{index}</td>
        <td className="py-2 px-6 border-b border-gray-800">
          {"Loading..."}
        </td>
      </>
    );
  };

  // Initial loading state

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-3xl bg-gray-950 shadow-lg rounded-lg overflow-hidden">
        <TableVirtuoso
          className="w-full"
          useWindowScroll
          totalCount={TOTAL_INTEGERS} // Set the total number of rows
          itemContent={(index) => renderRow(index)} // Render each row
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
