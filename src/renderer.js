const targetsUl = document.getElementById('targets');
const addBtn = document.getElementById('addTarget');
const startBtn = document.getElementById('start');
const statusDiv = document.getElementById('status');
const sourceInput = document.getElementById('sourceLang');
const setCredsBtn = document.getElementById('setCreds');

const PalabraClient = require('./palabraClient');
const config = require('./config');

let targets = [];
let palabraClient = null;
let cfg = config.load();

function promptCredentials() {
  cfg.palabraKey = prompt('Enter Palabra API key:', cfg.palabraKey || '') || cfg.palabraKey || '';
  cfg.livekitUrl = prompt('Enter LiveKit URL:', cfg.livekitUrl || '') || cfg.livekitUrl || '';
  cfg.livekitApiKey = prompt('Enter LiveKit API key:', cfg.livekitApiKey || '') || cfg.livekitApiKey || '';
  cfg.livekitApiSecret = prompt('Enter LiveKit API secret:', cfg.livekitApiSecret || '') || cfg.livekitApiSecret || '';
  config.save(cfg);
}

setCredsBtn.onclick = () => {
  promptCredentials();
};

addBtn.onclick = () => {
  const lang = prompt('Target language code (e.g. es, fr):');
  if (!lang) return;
  const preset = prompt('Preset (transcribe_and_translate | transcribe_and_translate_reliable | transcribe_and_translate_fast):', 'transcribe_and_translate');
  const li = document.createElement('li');
  li.textContent = `${lang} - ${preset}`;
  targetsUl.appendChild(li);
  targets.push({ lang, preset });
};

startBtn.onclick = async () => {
  const sourceLang = sourceInput.value || 'en';
  if (!cfg.palabraKey || !cfg.livekitUrl || !cfg.livekitApiKey || !cfg.livekitApiSecret) {
    promptCredentials();
  }
  statusDiv.textContent = 'Connecting to Palabra...';

  palabraClient = new PalabraClient(cfg.palabraKey, sourceLang, targets);

  palabraClient.on('status', (s) => {
    switch (s) {
      case 'connecting':
        statusDiv.textContent = 'Connecting to Palabra...';
        break;
      case 'connected':
        statusDiv.textContent = 'Connected to Palabra';
        break;
      case 'reconnecting':
        statusDiv.textContent = 'Reconnecting to Palabra...';
        break;
      case 'closed':
        statusDiv.textContent = 'Connection closed';
        break;
      case 'error':
        statusDiv.textContent = 'Connection error';
        break;
    }
  });

  try {
    await palabraClient.connect();
    palabraClient.startSession();

    palabraClient.onTranslation((msg) => {
      console.log('Translation update:', msg);
    });
  } catch (err) {
    console.error('Failed to connect to Palabra:', err);
    statusDiv.textContent = 'Failed to connect to Palabra';
  }
};
