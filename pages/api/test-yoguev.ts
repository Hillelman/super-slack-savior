import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await fetch('https://slack-savior.staging-service.newrelic.com/query', {
    method: 'post',
    body: JSON.stringify({query: "What is New Relic?"}),
    headers: {'Content-Type': 'application/json'}
  });
  const data = await response.json();

  console.log(data);

  res.status(200).json({ data })
}
