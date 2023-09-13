import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
/**
 * Slack API documentation: https://api.slack.com/bot-users
 */
const SLACK_POST_MESSAGE_URL = "https://slack.com/api/chat.postMessage";
const SLACK_UPDATE_URL = "https://slack.com/api/chat.update";
// const CHANNEL_ID = "C05SEUQ1532";

interface MyDataYoguev {
  response: string;
}

async function fetcher(q: string) {
  const cleanQuery = q.replace("<@U05RQ8YE98D>", "").trim();
  console.log(cleanQuery);

  const response = await fetch(
    "https://slack-savior.staging-service.newrelic.com/query",
    {
      method: "post",
      body: JSON.stringify({ query: cleanQuery }),
      headers: { "Content-Type": "application/json" },
    }
  );
  const data: MyDataYoguev = (await response.json()) as MyDataYoguev;

  console.log(response);

  return data.response;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { event } = req.body;
    res.status(200).json({"challenge": req.body.challenge || ":(" })

    switch (event.type) {
      // Message events that mention the bot (e.g., @savior)
      case "app_mention":
        const ts = await Loader(event);
        const text = await fetcher(event.text);
        console.log("after fetchData: ", text);

        if (!text) {
          res.status(200).json({ message: "No message to send" });
          return;
        }

        const response = await fetch(SLACK_UPDATE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.BOT_TOKEN}`,
          },
          body: JSON.stringify({
            channel: event.channel,
            thread_ts: event.ts,
            ts,
            text,
          }),
        });
        console.log("after slack post message: ", response);

        if (response.ok) {
          console.log("Message sent successfully:", text);
          res.status(200).json({ message: "Message sent successfully" });
        } else {
          console.log("Failed to send message to Slack");
          res.status(500).json({ message: "Failed to send message to Slack" });
        }
        break;
      default:
        console.log("Unhandled event type:", event.type);
        res.status(200).json({ message: "Unhandled event type" });
        break;
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function Loader(event: any) {
  const response = await fetch(SLACK_POST_MESSAGE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.BOT_TOKEN}`,
    },
    body: JSON.stringify({
      channel: event.channel,
      thread_ts: event.ts,
      text: `Hiyush <@${event.user}>, I'm checking this for you, :hourglass: please give me a sec... or maybe two :stuck_out_tongue_winking_eye:`,
    }),
  });
  return (await response.json() as any).ts;
}
