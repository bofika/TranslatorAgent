const WebSocket = require('ws');
const { EventEmitter } = require('events');

class PalabraClient extends EventEmitter {
  constructor(apiKey, sourceLang, targets) {
    super();
    this.apiKey = apiKey;
    this.sourceLang = sourceLang;
    this.targets = targets; // [{lang, preset}]
    this.socket = null;
    this.shouldReconnect = false;
    this.reconnectAttempts = 0;
    this.startOnConnect = false;
    this.translationCallbacks = [];
  }

  async connect() {
    this.shouldReconnect = true;
    return this._connect(true);
  }

  _connect(isFirst) {
    return new Promise((resolve, reject) => {
      this.emit('status', isFirst ? 'connecting' : 'reconnecting');
      this.socket = new WebSocket('wss://api.palabra.ai/v1/ws', {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });

      this.socket.once('open', () => {
        this.reconnectAttempts = 0;
        this.emit('status', 'connected');
        this._attachMessageHandlers();
        if (this.startOnConnect) this._sendStart();
        resolve();
      });

      this.socket.once('error', (err) => {
        this.emit('status', 'error');
        if (isFirst) reject(err);
      });

      this.socket.once('close', () => {
        this.emit('status', 'closed');
        if (this.shouldReconnect) this._scheduleReconnect();
      });
    });
  }

  _scheduleReconnect() {
    this.reconnectAttempts += 1;
    const delay = Math.min(10000, 1000 * 2 ** (this.reconnectAttempts - 1));
    setTimeout(() => this._connect(false), delay);
  }

  _sendStart() {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    const config = {
      action: 'start',
      source_lang: this.sourceLang,
      targets: this.targets,
    };
    this.socket.send(JSON.stringify(config));
  }

  startSession() {
    this.startOnConnect = true;
    this._sendStart();
  }

  onTranslation(callback) {
    this.translationCallbacks.push(callback);
    if (this.socket) {
      this.socket.on('message', (data) => {
        try {
          const msg = JSON.parse(data);
          callback(msg);
        } catch (err) {
          console.error('Failed to parse message from Palabra:', err);
        }
      });
    }
  }

  _attachMessageHandlers() {
    for (const cb of this.translationCallbacks) {
      this.socket.on('message', (data) => {
        try {
          const msg = JSON.parse(data);
          cb(msg);
        } catch (err) {
          console.error('Failed to parse message from Palabra:', err);
        }
      });
    }
  }

  close() {
    this.shouldReconnect = false;
    if (this.socket) this.socket.close();
  }
}

module.exports = PalabraClient;
