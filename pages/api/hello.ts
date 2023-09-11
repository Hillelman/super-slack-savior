import type { NextApiRequest, NextApiResponse } from "next";

const SLACK_POST_MESSAGE_URL = "https://slack.com/api/chat.postMessage";
const CHANNEL_ID = "C05SEUQ1532";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ challenge: req.body.challenge || ":(" });
  const { event } = req.body;
  switch (event.type) {
    case "app_mention":
      console.log("Message content: " + event.text);
      // TODO: Process event.text and get a message back;
      const text = "Hello, reply!";
      fetch(SLACK_POST_MESSAGE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BOT_TOKEN}`,
        },
        body: JSON.stringify({
          channel: CHANNEL_ID,
          text,
        }),
      });
      break;
  }
}
