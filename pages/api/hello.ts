import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
/**
 * Slack API documentation: https://api.slack.com/bot-users
 */
const SLACK_POST_MESSAGE_URL = "https://slack.com/api/chat.postMessage";
const CHANNEL_ID = "C05SEUQ1532";

interface MyData {
  text: string;
}

interface MyDataYoguev {
  response: string;
}

async function fetcher(query: string) {
  const response = await fetch('https://ee6f-199-203-191-86.ngrok-free.app/query', {
    method: 'post',
    body: JSON.stringify({query}),
    headers: {'Content-Type': 'application/json'}
  });
  const data: MyData = await response.json() as MyData;

  console.log(data);

  return data.text;
}

async function fetcherYoguev(query: string) {
  const response = await fetch('https://slack-savior.staging-service.newrelic.com/query', {
    method: 'post',
    body: JSON.stringify({query}),
    headers: {'Content-Type': 'application/json'}
  });
  const data: MyDataYoguev = await response.json() as MyDataYoguev;

  console.log(data);

  return data.response;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { event } = req.body;

    console.log('Before switch');
    switch (event.type) {
      // Message events that mention the bot (e.g., @savior)
      case "app_mention":
        console.log('app_mention');
        const text = await fetcherYoguev(event.text);
        console.log('after fetchData: ', text);

        if (!text) {
          console.log('text is bad');
          res.status(200).json({ message: "No message to send" });
          return;
        }

        console.log('text is good');

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
        console.log('after slack post message: ', response);

        if (response.ok) {
          console.log("Message sent successfully:", text);
          res.status(200).json({ message: "Message sent successfully" });
        } else {
          console.log("Failed to send message to Slack");
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
