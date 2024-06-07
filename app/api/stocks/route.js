import OpenAI from "openai";

const openai = new OpenAI({
    organization: "org-PHsg1MSxkjQAEkCiRz0Pg7tx",
    project: "proj_vewYRvuXq4NIZNtNNVMI5oT9",
    apiKey: process.env.OPENAI_API_KEY
});

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

async function generateReport(content) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: `based on this one year old polygon data. recommend the action of this stock one year ago, buy or sell, short version ${content}`}],
    model: "gpt-4o",
  });

  return completion.choices[0];
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get('ticker');
  const apiKey = process.env.POLYGON_API_KEY;
  const today = new Date().toISOString().slice(0,10)
  const oneYearFromNow = [String(Number(today.split('-')[0])-1), today.split('-')[1], today.split('-')[2]].join('-')
  if (!ticker) {
    return new Response(JSON.stringify({ error: 'Please provide ticker' }), { status: 400 });
  }

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${oneYearFromNow}/${oneYearFromNow}?apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error fetching data from Polygon API');
    }
    const result = await response.json();
    const data = (await generateReport(JSON.stringify(result))).message.content
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

