import bodyParser from "body-parser";
import express from "express";
import { REGISTRY_PORT } from "./config";

export type Node = { 
  nodeId: number; 
  pubKey: string;
  lastReceivedEncryptedMessage: string | null;
  lastReceivedDecryptedMessage: string | null;
  lastMessageDestination: number | null;
};

let nodes: Node[] = [];

export async function launchRegistry() {
  const app = express();

  app.use(express.json());
  app.use(bodyParser.json());

  // Implement the status route
  app.get("/status", (req, res) => {
    res.send("live");
  });

  // Route to get the last received encrypted message for a node
  app.get("/getLastReceivedEncryptedMessage/:nodeId", (req, res) => {
    const nodeId = parseInt(req.params.nodeId);
    const node = nodes.find((n) => n.nodeId === nodeId);
    if (node) {
      res.json({ result: node.lastReceivedEncryptedMessage });
    } else {
      res.status(404).json({ error: "Node not found" });
    }
  });

  // Route to get the last received decrypted message for a node
  app.get("/getLastReceivedDecryptedMessage/:nodeId", (req, res) => {
    const nodeId = parseInt(req.params.nodeId);
    const node = nodes.find((n) => n.nodeId === nodeId);
    if (node) {
      res.json({ result: node.lastReceivedDecryptedMessage });
    } else {
      res.status(404).json({ error: "Node not found" });
    }
  });

  // Route to get the last message destination for a node
  app.get("/getLastMessageDestination/:nodeId", (req, res) => {
    const nodeId = parseInt(req.params.nodeId);
    const node = nodes.find((n) => n.nodeId === nodeId);
    if (node) {
      res.json({ result: node.lastMessageDestination });
    } else {
      res.status(404).json({ error: "Node not found" });
    }
  });

  const server = app.listen(REGISTRY_PORT, () => {
    console.log(`Registry is listening on port ${REGISTRY_PORT}`);
  });

  return server;
}
