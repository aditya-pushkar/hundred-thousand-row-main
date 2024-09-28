const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request) {
  const res = await request.json();

  const { integer } = res;

  // Loop through all the integers and return an array with integers and their square.
  const sqr = integer**2

  // Simulate a slow response of 2-3 seconds
  await sleep(500);

  console.log("in backend int, sqr ", {integer, sqr})

  return Response.json({sqr});
}

