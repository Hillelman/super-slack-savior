import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Slack API documentation: https://api.slack.com/bot-users
 */
const SLACK_POST_MESSAGE_URL = "https://slack.com/api/chat.postMessage";
const CHANNEL_ID = "C05SEUQ1532";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ challenge: req.body.challenge || ":(" });
  let response_text = "I don't understand that command. Try again?";
  const { event } = req.body;
  console.log("Event: " + event);
  console.log("Token: " + process.env.BOT_TOKEN);

  switch (event.type) {
    // Message events that mention the bot (e. @savior)
    case "app_mention":
      fetch(SLACK_POST_MESSAGE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BOT_TOKEN}`,
        },
        body: JSON.stringify({
          channel: CHANNEL_ID,
          text: response_text
        }),
      });
    break;
  }
}
