import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { REGISTRY_PORT } from "../config";

export type Node = { 
  nodeId: number; 
  pubKey: string 
  lastReceivedEncryptedMessage: string | null; // Dernier message reçu en version chiffrée
  lastReceivedDecryptedMessage: string | null; // Dernier message reçu en version déchiffrée
  lastMessageDestination: number | null; // Dernière destination du dernier message reçu
};

let nodes: Node[] = [];

export type RegisterNodeBody = {
  nodeId: number;
  pubKey: string;
};

export type GetNodeRegistryBody = {
  nodes: Node[];
};

export async function launchRegistry() {
  const _registry = express();
  _registry.use(express.json());
  _registry.use(bodyParser.json());

  // TODO implement the status route
  _registry.get("/status", (req, res) => {
    res.send("live");
  });

  // Route to get the last received encrypted message for a node
  _registry.get("/getLastReceivedEncryptedMessage/:nodeId", (req, res) => {
    const nodeId = parseInt(req.params.nodeId);
    const node = nodes.find((n) => n.nodeId === nodeId);
    if (node) {
      res.json({ result: node.lastReceivedEncryptedMessage });
    } else {
      res.status(404).json({ error: "Node not found" });
    }
  });

  // Route to get the last received decrypted message for a node
  _registry.get("/getLastReceivedDecryptedMessage/:nodeId", (req, res) => {
    const nodeId = parseInt(req.params.nodeId);
    const node = nodes.find((n) => n.nodeId === nodeId);
    if (node) {
      res.json({ result: node.lastReceivedDecryptedMessage });
    } else {
      res.status(404).json({ error: "Node not found" });
    }
  });

  // Route to get the last message destination for a node
  _registry.get("/getLastMessageDestination/:nodeId", (req, res) => {
    const nodeId = parseInt(req.params.nodeId);
    const node = nodes.find((n) => n.nodeId === nodeId);
    if (node) {
      res.json({ result: node.lastMessageDestination });
    } else {
      res.status(404).json({ error: "Node not found" });
    }
  });

  
  const server = _registry.listen(REGISTRY_PORT, () => {
    console.log(`registry is listening on port ${REGISTRY_PORT}`);
  });

  return server;
}
