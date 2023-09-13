import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await fetch('https://ee6f-199-203-191-86.ngrok-free.app/query', {
    method: 'post',
    body: JSON.stringify({query: "How can I resent my vault password?"}),
    headers: {'Content-Type': 'application/json'}
  });
  const data = await response.json();

  console.log(data);

  res.status(200).json({ data })
}
