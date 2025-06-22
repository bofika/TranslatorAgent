# Real-Time Simultaneous Interpretation App

This project aims to create a cross platform desktop application for real-time interpretation. It combines Palabra for speech recognition and translation, LiveKit for audio streaming, and uses SRT to send translated audio to remote endpoints.

## Features

- **Language Management**: choose a source language and multiple target languages. Each target language can be assigned one of Palabra's official presets:
  - `transcribe_and_translate`
  - `transcribe_and_translate_reliable`
  - `transcribe_and_translate_fast`
- **Audio Devices**: select microphone and speaker devices, with hot-swapping support while the session is active.
- **API Validation**: on first launch the user is asked for Palabra and LiveKit credentials which are validated before allowing a session to start.
- **Live Translation**: use Palabra's WebSocket API for real-time STT and translation. Languages and presets can be changed during a session.
- **SRT Streaming**: translated text is converted to speech and streamed to user defined `srt://` endpoints. Each target language can have its own SRT destination.
- **Monitoring**: connection status for Palabra, LiveKit and SRT streams are monitored and displayed in the UI. The app automatically retries on failures.

## Getting Started

The code base uses **Electron** and **Node.js**. Dependencies are declared in `package.json`. To start developing:

```bash
npm install
npm start
```

> The dependencies are placeholders only – actual integration with Palabra, LiveKit and text-to-speech engines still needs to be implemented.

On launch the application asks for your **Palabra** API key. You can obtain a key and view the API schema at [Palabra's OpenAPI docs](https://api.palabra.ai/docs/openapi.json). The key is used when establishing the WebSocket connection for real-time translation.

The key is stored locally in `config.json` so you won't need to re-enter it each time.
LiveKit connection details (`livekitUrl`, `livekitApiKey` and `livekitApiSecret`) are stored in the same file and will be requested if missing.

## Directory Structure

```
src/
  main.js        - Electron main process
  renderer.js    - Browser side logic
  index.html     - Simple UI skeleton
```

## Status

This is a work in progress. Core features such as API interaction, real-time audio transport and SRT output are currently stubs. Pull requests are welcome!

