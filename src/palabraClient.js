const WebSocket = require('ws');

class PalabraClient {
  constructor(apiKey, sourceLang, targets) {
    this.apiKey = apiKey;
    this.sourceLang = sourceLang;
    this.targets = targets; // [{lang, preset}]
    this.socket = null;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket('wss://api.palabra.ai/v1/ws', {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      this.socket.on('open', () => resolve());
      this.socket.on('error', (err) => reject(err));
    });
  }

  startSession() {
    if (!this.socket) return;
    const config = {
      action: 'start',
      source_lang: this.sourceLang,
      targets: this.targets,
    };
    this.socket.send(JSON.stringify(config));
  }

  onTranslation(callback) {
    if (!this.socket) return;
    this.socket.on('message', (data) => {
      try {
        const msg = JSON.parse(data);
        callback(msg);
      } catch (err) {
        console.error('Failed to parse message from Palabra:', err);
      }
    });
  }

  close() {
    if (this.socket) this.socket.close();
  }
}

module.exports = PalabraClient;
