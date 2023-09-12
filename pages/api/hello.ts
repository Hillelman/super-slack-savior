import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Slack API documentation: https://api.slack.com/bot-users
 */
const SLACK_POST_MESSAGE_URL = "https://slack.com/api/chat.postMessage";
const CHANNEL_ID = "C05SEUQ1532";

export default async function bhandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { event } = req.body;
    let response_text = "I don't understand that command. Try again?";

    switch (event.type) {
      // Message events that mention the bot (e.g., @savior)
      case "app_mention":
        const response = await fetch(SLACK_POST_MESSAGE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.BOT_TOKEN}`,
          },
          body: JSON.stringify({
            channel: CHANNEL_ID,
            text: response_text,
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
