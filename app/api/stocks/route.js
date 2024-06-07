// app/api/ticker.js
export const dynamic = 'force-dynamic'; // static by default, unless reading the request

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get('ticker');
  const apiKey = process.env.POLYGON_API_KEY;

  if (!ticker) {
    return new Response(JSON.stringify({ error: 'Please provide ticker' }), { status: 400 });
  }

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/2019-06-07/2024-06-07?apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error fetching data from Polygon API');
    }
    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

