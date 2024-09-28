"use client";

import { useState, useEffect, useRef, useCallback} from "react";
import { TableVirtuoso } from "react-virtuoso";

const TOTAL_INTEGERS = 100_00;
const INTEGERS_PER_BATCH = 20;

export default function Home() {
  const [sqrs, setSqrs] = useState({});
  const batchRendered = useRef(0)

  useEffect(() => {
    //get squares of int from 1-15
    addNewRow(0)
  }, []);

//   console.log(sqrs);

useEffect(()=>{
    if(Object.keys(sqrs).length>0){
        console.log("HHTTYY", Object.keys(sqrs).length)
        fetchSqr(0)
    }
},[sqrs])


  const addNewRow = async(from) =>{
    console.log("FETCING ROW")
    //get squares of int from 1-20 
    const newSqrs = {};
    for (let int = from; int < INTEGERS_PER_BATCH; int++) {
      newSqrs[int] = {sqr: null}
    }
    setSqrs(newSqrs);

 }

const fetchSqr = async (from) => {
    const promises = [];
    for (let i = from; i < from + INTEGERS_PER_BATCH; i++) {
      if (sqrs[i]?.sqr === null) {
        promises.push(
          fetch('/api/square', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ integer: i }),
          }).then(res => res.json())
        );
      }
    }
  
    try {
      const results = await Promise.all(promises);
      setSqrs(prev => {
        const newSquares = { ...prev };
        results.forEach((result, index) => {
          newSquares[from + index].sqr = result.sqr;
        });
        return newSquares;
      });
      
      /**
       * It helps to track the how much batch is renders
       * ex in firt render it will be 20 then 40 then 60
       * total render hoga TOTAL_INTEGER/INTEGERS_PER_BATCH ex 100/20 = 5 render inn
       */
      batchRendered.current = batchRendered.current + INTEGERS_PER_BATCH
    } catch (error) {
      console.error('Error updating squares:', error);
    }
  }


  console.log("sqr0", sqrs)

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-3xl bg-gray-950 shadow-lg rounded-lg overflow-hidden">
        <TableVirtuoso
          className="w-full"
          data={Object.entries(sqrs)}
          useWindowScroll
          totalCount={TOTAL_INTEGERS} // Set the total number of rows
          endReached={(e)=>fetchSqr(e)}
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
          itemContent={(index, [key, value])=>(
            <>
            {/* Dont want 0 */}
              <td className="py-2 px-6 border-b border-gray-800">{index}</td>
              <td className="py-2 px-6 border-b border-gray-800">{value.sqr?value.sqr:"Loading..."}</td>
            </>
          )}
        />
      </div>
    </main>
  );
}
