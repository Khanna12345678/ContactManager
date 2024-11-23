import express from "express";
import cors from "cors";
import path from "path"; // Import 'path' to handle directory paths
import { fileURLToPath } from "url";
import { dirname } from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());


// Trie Node and Trie Class
class TrieNode {
  constructor() {
    this.children = new Array(10).fill(null); // Digits 0-9
    this.isEndOfNumber = false;
    this.contactName = "";
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(phoneNumber, contactName) {
    let node = this.root;
    for (let digit of phoneNumber) {
      let index = parseInt(digit);
      if (!node.children[index]) {
        node.children[index] = new TrieNode();
      }
      node = node.children[index];
    }
    node.isEndOfNumber = true;
    node.contactName = contactName;
  }

  search(phoneNumber) {
    let node = this.root;
    for (let digit of phoneNumber) {
      let index = parseInt(digit);
      if (!node.children[index]) {
        return "Number not found";
      }
      node = node.children[index];
    }
    if (node.isEndOfNumber) {
      return node.contactName;
    } else {
      return "Number not found";
    }
  }

  deleteAllContacts() {
    this.root = new TrieNode();
  }
}

const contacts = new Trie();

app.use(express.json());

// Serve the static frontend build files

app.use(express.static(path.join(__dirname, "./frontend/build"))); // Serve 'build' folder

// API Endpoints
app.post("/contacts", (req, res) => {
  const { phoneNumber, contactName } = req.body;
  if (!phoneNumber || !contactName) {
    return res
      .status(400)
      .json({ message: "Phone number and contact name are required" });
  }
  contacts.insert(phoneNumber, contactName);
  res.status(201).json({ message: "Contact added" });
});

app.get("/contacts/:phoneNumber", (req, res) => {
  const phoneNumber = req.params.phoneNumber;
  const contactName = contacts.search(phoneNumber);
  res.json({ contactName });
});

app.get("/contacts", (req, res) => {
  const allContacts = [];

  function traverse(node, currentNumber) {
    if (node.isEndOfNumber) {
      allContacts.push({ phoneNumber: currentNumber, contactName: node.contactName });
    }
    for (let i = 0; i < 10; i++) {
      if (node.children[i]) {
        traverse(node.children[i], currentNumber + String(i));
      }
    }
  }

  traverse(contacts.root, "");
  res.json(allContacts);
});

app.delete("/contacts", (req, res) => {
  contacts.deleteAllContacts();
  res.json({ message: "All contacts have been deleted" });
});

app.delete("/contacts/:phoneNumber", (req, res) => {
  const { phoneNumber } = req.params;
  let node = contacts.root;
  let path = [];
  let found = true;

  for (let digit of phoneNumber) {
    let index = parseInt(digit);
    if (!node.children[index]) {
      found = false;
      break;
    }
    path.push({ node, index });
    node = node.children[index];
  }

  if (found && node.isEndOfNumber) {
    node.isEndOfNumber = false;
    node.contactName = "";
    res.json({ message: "Contact deleted" });
  } else {
    res.status(404).json({ message: "Number not found" });
  }
});

// Catch-all route to serve React frontend for unhandled routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend/build/index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
