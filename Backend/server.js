import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

// Trie Node and Trie Class
class TrieNode {
  constructor() {
    this.children = new Array(10).fill(null);  // Digits 0-9
    this.isEndOfNumber = false;
    this.contactName = "";
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  // Insert phone number and contact name into the trie
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

  // Search for a contact by phone number
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

  // Delete all contacts in the trie
  deleteAllContacts() {
    this.root = new TrieNode();  // Reset the root to a new TrieNode, clearing all contacts
  }
}

const contacts = new Trie();

app.use(cors()); // Enable CORS
app.use(express.json());

// Endpoint to add a contact
app.post('/contacts', (req, res) => {
  const { phoneNumber, contactName } = req.body;
  if (!phoneNumber || !contactName) {
    return res.status(400).json({ message: "Phone number and contact name are required" });
  }
  contacts.insert(phoneNumber, contactName);
  res.status(201).json({ message: 'Contact added' });
});

// Endpoint to search for a contact
app.get('/contacts/:phoneNumber', (req, res) => {
  const phoneNumber = req.params.phoneNumber;
  const contactName = contacts.search(phoneNumber);
  res.json({ contactName });
});

// Endpoint to fetch all contacts
app.get('/contacts', async (req, res) => {
  try {
    const allContacts = [];

    // Function to traverse the trie and gather contacts
    function traverse(node, currentNumber) {
      if (node.isEndOfNumber) {
        allContacts.push({ phoneNumber: currentNumber, contactName: node.contactName });
      }
      for (let i = 0; i < 10; i++) {
        if (node.children[i]) {
          traverse(node.children[i], currentNumber + String(i));  // Ensure digit is a string
        }
      }
    }

    // Start traversal from the root of the trie
    traverse(contacts.root, '');
    res.json(allContacts); // Return all contacts as a JSON array
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Failed to fetch contacts" });
  }
});

// Endpoint to delete all contacts
app.delete('/contacts', (req, res) => {
  try {
    contacts.deleteAllContacts();  // Clears all contacts from the trie
    res.json({ message: "All contacts have been deleted" });
  } catch (error) {
    console.error("Error deleting all contacts:", error);
    res.status(500).json({ message: "Failed to delete all contacts" });
  }
});


// Endpoint to delete a contact by phone number
app.delete('/contacts/:phoneNumber', (req, res) => {
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
      node.contactName = '';
      res.json({ message: 'Contact deleted' });
    } else {
      res.status(404).json({ message: 'Number not found' });
    }
  });
  





// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});