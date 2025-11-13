import express from "express";
import { Client, MessageMedia, LocalAuth, GroupChat } from "whatsapp-web.js";
import net, { Socket } from "node:net";
import ffmpeg from "fluent-ffmpeg";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";
import QRCode from "qrcode";
import * as utils from "./utils";
import { setUpChatGetters, setUpListGetters } from "./chat";

// --- FIX: Define paths, prioritizing environment variables ---
// 1. Browser Path: Prioritize Render's CHROME_PATH environment variable
const RENDER_CHROME_PATH = process.env.CHROME_PATH || utils.SERVER_CONFIG.CHROME_PATH;

// 2. FFmpeg Path: On Linux systems (like Render), ffmpeg is usually found in the PATH or /usr/bin.
// If the original utility code doesn't install a Linux binary, we override the path.
// If you install FFmpeg via Dockerfile, the path is often just 'ffmpeg' or '/usr/bin/ffmpeg'.
const FFMPEG_PATH = process.env.FFMPEG_PATH || 'ffmpeg'; // Use 'ffmpeg' to rely on the system path
// --- END FIX ---


console.log("[FFmpeg] Using ffmpeg from: ", FFMPEG_PATH);
console.log("Using browser from: ", RENDER_CHROME_PATH);

// --- FIX: Use the new FFMPEG_PATH variable ---
if (!fs.existsSync(FFMPEG_PATH))
  console.log("[Warning] FFmpeg does not exist! Using system PATH.");

ffmpeg.setFfmpegPath(FFMPEG_PATH);
// --- END FIX ---


// Initialize Express app
const app = express();

// Middleware setup
app.use(express.json({ limit: "16mb" }));
app.use(express.urlencoded({ limit: "16mb", extended: true }));

let reInitializeCount = 1;

const client = new Client({
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--log-level=3",
      "--no-default-browser-check",
      "--disable-site-isolation-trials",
      "--no-experiments",
      "--ignore-gpu-blacklist",
      "--ignore-certificate-errors",
      "--ignore-certificate-errors-spki-list",
      "--enable-gpu",
      "--disable-default-apps",
      "--enable-features=NetworkService",
      "--disable-webgl",
      "--disable-threaded-animation",
      "--disable-threaded-scrolling",
      "--disable-in-process-stack-traces",
      "--disable-histogram-customizer",
      "--disable-gl-extensions",
      "--disable-composited-antialiasing",
      "--disable-canvas-aa",
      "--disable-3d-apis",
      "--disable-accelerated-2d-canvas",
      "--disable-accelerated-jpeg-decoding",
      "--disable-accelerated-mjpeg-decode",
      "--disable-app-list-dismiss-on-blur",
      "--disable-accelerated-video-decode",
      "--window-position=-200,-200",
      "--no-proxy-server",
      "--window-size=1,1",
    ],
    // --- FIX: Use the new RENDER_CHROME_PATH variable ---
    executablePath: RENDER_CHROME_PATH,
    // --- END FIX ---
  },
  authStrategy: new LocalAuth(),
});

const TOKENS = {
  SERVER: "3qGT_%78Dtr|&*7ufZoO",
  CLIENT: "vC.I)Xsfe(;p4YB6E5@y",
};

// Utility functions
function reconnect(socket: Socket) {
  console.log(`Attempting to reconnect with ${socket.address}`);
  setTimeout(() => {
    socket.connect(utils.SERVER_CONFIG.PORT, utils.SERVER_CONFIG.HOST, () => {
      console.log(`socket reconnected`);
    });
  }, 5000);
}

function setupWhatsAppEventListeners(socket: Socket) {
  client.setMaxListeners(16);

// ... (Rest of the client.on event listeners remain unchanged) ...

}

global.loggedin = 0;
global.qrDataUrl = null;

// WhatsApp Client event listeners
client.on("qr", async (qr) => {
// ... (Rest of the client event listeners remain unchanged) ...

});

// HTTP Routes
app.get("/", async (_, res) => {
// ... (Rest of the HTTP routes remain unchanged) ...
});

// Socket server setup
const socketServer = net.createServer((socket) => {
// ... (Rest of the socket setup remains unchanged) ...

});

// Start servers
// 1. HTTP API (app) runs on the main port (7300, via utils.SERVER_CONFIG.PORT).
// This port is reliably exposed by Render for the main service URL.
app.listen(utils.SERVER_CONFIG.PORT, utils.SERVER_CONFIG.HOST);

// 2. TCP Socket Server (socketServer) runs on the secondary port (7301, via utils.SERVER_CONFIG.HTTP_PORT).
socketServer.listen(utils.SERVER_CONFIG.HTTP_PORT, utils.SERVER_CONFIG.HOST);

// 3. Initialize the WhatsApp Client
client.initialize();
