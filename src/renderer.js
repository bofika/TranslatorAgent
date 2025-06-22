const targetsUl = document.getElementById('targets');
const addBtn = document.getElementById('addTarget');
const startBtn = document.getElementById('start');
const statusDiv = document.getElementById('status');
const sourceInput = document.getElementById('sourceLang');

const PalabraClient = require('./palabraClient');
const config = require('./config');

let targets = [];
let palabraClient = null;
let cfg = config.load();

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
  if (!cfg.palabraKey) {
    cfg.palabraKey = prompt('Enter Palabra API key:') || '';
    config.save(cfg);
  }
  statusDiv.textContent = 'Connecting to Palabra...';

  palabraClient = new PalabraClient(cfg.palabraKey, sourceLang, targets);

  try {
    await palabraClient.connect();
    palabraClient.startSession();
    statusDiv.textContent = 'Session started';

    palabraClient.onTranslation((msg) => {
      console.log('Translation update:', msg);
    });
  } catch (err) {
    console.error('Failed to connect to Palabra:', err);
    statusDiv.textContent = 'Failed to connect to Palabra';
  }
};
