const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request) {
  const res = await request.json();

  const { integer } = res;

  const sqr = integer**2

  // Simulate a slow response of 2seconds
  await sleep(2000);

  return Response.json({sqr});
}

