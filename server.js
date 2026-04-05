const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware - allow connections from local network
app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.use(express.static(__dirname));

// Path to cheatsheets file
const CHEATSHEETS_FILE = path.join(__dirname, 'cheatsheets-data', 'cheatsheets.json');
const CHEATSHEETS_DIR = path.join(__dirname, 'cheatsheets-data');

// Ensure directory exists
if (!fs.existsSync(CHEATSHEETS_DIR)) {
  fs.mkdirSync(CHEATSHEETS_DIR, { recursive: true });
}

// Load cheatsheets from file
function loadCheatsheets() {
  try {
    if (fs.existsSync(CHEATSHEETS_FILE)) {
      const data = fs.readFileSync(CHEATSHEETS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading cheatsheets:', err);
  }
  return [];
}

// Save cheatsheets to file
function saveCheatsheets(cheatsheets) {
  try {
    fs.writeFileSync(CHEATSHEETS_FILE, JSON.stringify(cheatsheets, null, 2), 'utf8');
    console.log('Cheatsheets saved to:', CHEATSHEETS_FILE);
    return true;
  } catch (err) {
    console.error('Error saving cheatsheets:', err);
    return false;
  }
}

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// API Routes

// Get all cheatsheets
app.get('/api/cheatsheets', (req, res) => {
  const cheatsheets = loadCheatsheets();
  res.json(cheatsheets);
});

// Add new cheatsheet
app.post('/api/cheatsheets', (req, res) => {
  const cheatsheets = loadCheatsheets();
  const newCheatsheet = {
    id: Date.now(),
    ...req.body
  };
  cheatsheets.push(newCheatsheet);

  if (saveCheatsheets(cheatsheets)) {
    res.json({ success: true, data: newCheatsheet });
  } else {
    res.status(500).json({ success: false, error: 'Failed to save' });
  }
});

// Update cheatsheet
app.put('/api/cheatsheets/:id', (req, res) => {
  const cheatsheets = loadCheatsheets();
  const id = parseInt(req.params.id);
  const index = cheatsheets.findIndex(cs => cs.id === id);

  if (index !== -1) {
    cheatsheets[index] = { id, ...req.body };
    if (saveCheatsheets(cheatsheets)) {
      res.json({ success: true, data: cheatsheets[index] });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save' });
    }
  } else {
    res.status(404).json({ success: false, error: 'Not found' });
  }
});

// Delete cheatsheet
app.delete('/api/cheatsheets/:id', (req, res) => {
  const cheatsheets = loadCheatsheets();
  const id = parseInt(req.params.id);
  const filtered = cheatsheets.filter(cs => cs.id !== id);

  if (filtered.length < cheatsheets.length) {
    if (saveCheatsheets(filtered)) {
      res.json({ success: true });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save' });
    }
  } else {
    res.status(404).json({ success: false, error: 'Not found' });
  }
});

// Save all cheatsheets (bulk update)
app.post('/api/cheatsheets/save', (req, res) => {
  const cheatsheets = req.body;
  if (Array.isArray(cheatsheets)) {
    if (saveCheatsheets(cheatsheets)) {
      res.json({ success: true });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save' });
    }
  } else {
    res.status(400).json({ success: false, error: 'Invalid data' });
  }
});

// Start server
const localIP = getLocalIP();
app.listen(PORT, HOST, () => {
  console.log('');
  console.log('========================================');
  console.log('  WEP-Blocknot Server запущено!');
  console.log('========================================');
  console.log('');
  console.log('  Локально:  http://localhost:' + PORT);
  console.log('  Мережа:    http://' + localIP + ':' + PORT);
  console.log('');
  console.log('  З телефону/планшета відкрийте:');
  console.log('  http://' + localIP + ':' + PORT);
  console.log('');
  console.log('  Cheatsheets: ' + CHEATSHEETS_FILE);
  console.log('========================================');
  console.log('');
});
