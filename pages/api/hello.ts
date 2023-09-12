import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Slack API documentation: https://api.slack.com/bot-users
 */
const SLACK_POST_MESSAGE_URL = "https://slack.com/api/chat.postMessage";
const CHANNEL_ID = "C05SEUQ1532";
let response_text = "I don't understand that command. Try again?";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ challenge: req.body.challenge || ":(" });
  const { type, text } = req.body.event;
  console.log("Message content: " + text);

  switch (type) {
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

    // Any A message that was posted to the channel
    case "message":
    break;
  }
}
