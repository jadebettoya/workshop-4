import bodyParser from "body-parser";
import express from "express";
import { BASE_USER_PORT } from "../config";

export type SendMessageBody = {
  message: string;
  destinationUserId: number;
};

export async function user(userId: number) {
  const _user = express();
  _user.use(express.json());
  _user.use(bodyParser.json());

  let lastReceivedMessage: string | null = null;
  let lastSentMessage: string | null = null;

  // TODO implement the status route
  _user.get("/status", (req, res) => {
    res.send("live");
  });

  // Route to get the last received message by the user
  _user.get("/getLastReceivedMessage", (req, res) => {
    if (lastReceivedMessage) {
      res.json({ result: lastReceivedMessage });
    } else {
      res.status(404).json({ error: "No messages received yet" });
    }
  });

  // Route to get the last sent message by the user
  _user.get("/getLastSentMessage", (req, res) => {
    if (lastSentMessage) {
      res.json({ result: lastSentMessage });
    } else {
      res.status(404).json({ error: "No messages sent yet" });
    }
  });

  // Route to send a message
  _user.post("/sendMessage", (req, res) => {
    const { message, destinationUserId } = req.body as SendMessageBody;
    if (message && destinationUserId) {
      lastSentMessage = message;
      res.json({ success: true, message: "Message sent successfully" });
    } else {
      res.status(400).json({ error: "Invalid message or destination user ID" });
    }
  });

  const server = _user.listen(BASE_USER_PORT + userId, () => {
    console.log(
      `User ${userId} is listening on port ${BASE_USER_PORT + userId}`
    );
  });

  return server;
}
