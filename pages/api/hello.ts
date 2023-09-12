import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Slack API documentation: https://api.slack.com/bot-users
 */
const SLACK_POST_MESSAGE_URL = "https://slack.com/api/chat.postMessage";
const CHANNEL_ID = "C05SEUQ1532";

async function fetchData(query: string) {
  const url = 'https://ee6f-199-203-191-86.ngrok-free.app/query';
  const headers = new Headers();
  headers.append('accept', 'application/json');
  headers.append('Content-Type', 'application/json');

  const body = JSON.stringify({ query });
  console.log('Body:', body)

  const requestOptions: RequestInit = {
    method: 'POST',
    headers,
    body,
  };

  try {
    const response = await fetch(url, requestOptions);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { event } = req.body;

    switch (event.type) {
      // Message events that mention the bot (e.g., @savior)
      case "app_mention":
        const text = await fetchData(event.text);

        if (!text) {
          res.status(200).json({ message: "No message to send" });
          return;
        }

        const response = await fetch(SLACK_POST_MESSAGE_URL, {
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

        if (response.ok) {
          res.status(200).json({ message: "Message sent successfully" });
        } else {
          res.status(500).json({ message: "Failed to send message to Slack" });
        }
        break;
      default:
        res.status(200).json({ challenge: req.body.challenge || ":(" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
