#!/usr/bin/env node
/**
 * Google OAuth Setup for Homepage
 *
 * One-time setup to connect Gmail + Google Calendar.
 * Stores refresh token locally at ~/.homepage/google-tokens.json
 *
 * Usage:
 *   node connect-google.mjs                    # Interactive setup
 *   node connect-google.mjs --status           # Check connection status
 *   node connect-google.mjs --disconnect       # Remove stored tokens
 *
 * Prerequisites:
 *   1. Go to https://console.cloud.google.com/apis/credentials
 *   2. Create OAuth 2.0 Client ID (Desktop app)
 *   3. Enable Gmail API + Google Calendar API
 *   4. Download JSON → save as ~/.homepage/google-credentials.json
 */

import { createServer } from "http";
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { google } from "googleapis";

const CONFIG_DIR = join(homedir(), ".homepage");
const CREDENTIALS_PATH = join(CONFIG_DIR, "google-credentials.json");
const TOKENS_PATH = join(CONFIG_DIR, "google-tokens.json");
const REDIRECT_PORT = 8432;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}/callback`;

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/calendar.readonly",
];

const args = process.argv.slice(2);

mkdirSync(CONFIG_DIR, { recursive: true });

// ─── Status Check ────────────────────────────────────────────────

if (args.includes("--status")) {
  const hasCredentials = existsSync(CREDENTIALS_PATH);
  const hasTokens = existsSync(TOKENS_PATH);

  console.log("\n  Google Connection Status:");
  console.log(`  📋 Credentials: ${hasCredentials ? "✅ Found" : "❌ Missing"}`);
  console.log(`  🔑 Tokens:      ${hasTokens ? "✅ Connected" : "❌ Not connected"}`);

  if (hasTokens) {
    try {
      const tokens = JSON.parse(readFileSync(TOKENS_PATH, "utf8"));
      const expiry = new Date(tokens.expiry_date);
      console.log(`  ⏰ Token expiry: ${expiry.toLocaleString()}`);
      console.log(`  📧 Scopes: ${tokens.scope}`);
    } catch {}
  }

  if (!hasCredentials) {
    console.log("\n  To set up:");
    console.log("  1. Go to https://console.cloud.google.com/apis/credentials");
    console.log("  2. Create OAuth 2.0 Client ID (Desktop app)");
    console.log("  3. Enable Gmail API + Google Calendar API");
    console.log(`  4. Save credentials JSON to: ${CREDENTIALS_PATH}`);
  }

  console.log();
  process.exit(0);
}

// ─── Disconnect ──────────────────────────────────────────────────

if (args.includes("--disconnect")) {
  if (existsSync(TOKENS_PATH)) {
    unlinkSync(TOKENS_PATH);
    console.log("  ✅ Google tokens removed. Run connect-google.mjs to reconnect.");
  } else {
    console.log("  ℹ️  No tokens found.");
  }
  process.exit(0);
}

// ─── Connect Flow ────────────────────────────────────────────────

console.log(`
╔══════════════════════════════════════════════════╗
║                                                  ║
║   🔗 Google Account Setup                        ║
║                                                  ║
║   Connects Gmail + Calendar to your Homepage.    ║
║   Tokens stored locally, never sent anywhere.    ║
║                                                  ║
╚══════════════════════════════════════════════════╝
`);

// Check credentials file
if (!existsSync(CREDENTIALS_PATH)) {
  console.log("  ❌ Credentials file not found!\n");
  console.log("  Please set up Google OAuth first:\n");
  console.log("  1. Go to https://console.cloud.google.com/apis/credentials");
  console.log("  2. Create a project (or select existing)");
  console.log("  3. Enable 'Gmail API' and 'Google Calendar API'");
  console.log("  4. Create OAuth 2.0 Client ID → Desktop app");
  console.log("  5. Download the JSON file");
  console.log(`  6. Save it as: ${CREDENTIALS_PATH}\n`);
  console.log("  Then run this script again.\n");
  process.exit(1);
}

// Load credentials
let credentials;
try {
  const raw = JSON.parse(readFileSync(CREDENTIALS_PATH, "utf8"));
  credentials = raw.installed || raw.web;
  if (!credentials) throw new Error("Invalid credentials format");
} catch (e) {
  console.error(`  ❌ Could not parse credentials: ${e.message}`);
  process.exit(1);
}

// Check if already connected
if (existsSync(TOKENS_PATH)) {
  console.log("  ℹ️  Already connected. Use --disconnect to remove tokens first.\n");
  process.exit(0);
}

// Create OAuth client
const oauth2Client = new google.auth.OAuth2(
  credentials.client_id,
  credentials.client_secret,
  REDIRECT_URI,
);

// Generate auth URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
  prompt: "consent",
});

console.log("  Opening browser for Google sign-in...\n");

// Open browser
const openCmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
const { execSync } = await import("child_process");
try {
  execSync(`${openCmd} "${authUrl}"`);
} catch {
  console.log(`  Could not open browser. Please visit:\n  ${authUrl}\n`);
}

// Start local server to receive callback
const server = createServer(async (req, res) => {
  if (!req.url.startsWith("/callback")) {
    res.writeHead(404);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${REDIRECT_PORT}`);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>❌ Authorization failed</h1><p>You can close this window.</p>");
    console.error(`  ❌ Authorization failed: ${error}`);
    server.close();
    process.exit(1);
  }

  if (code) {
    try {
      const { tokens } = await oauth2Client.getToken(code);
      writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2));

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
        <html><body style="font-family: system-ui; text-align: center; padding: 60px;">
          <h1>✅ Connected!</h1>
          <p>Gmail + Calendar are now linked to your Homepage.</p>
          <p>You can close this window.</p>
        </body></html>
      `);

      console.log("  ✅ Google account connected!");
      console.log(`  🔑 Tokens saved to ${TOKENS_PATH}`);
      console.log("\n  Run the setup agent again to include Gmail + Calendar.\n");
    } catch (e) {
      res.writeHead(500, { "Content-Type": "text/html" });
      res.end(`<h1>❌ Token exchange failed</h1><p>${e.message}</p>`);
      console.error(`  ❌ Token exchange failed: ${e.message}`);
    }

    server.close();
    process.exit(0);
  }
});

server.listen(REDIRECT_PORT, () => {
  console.log(`  Waiting for Google callback on port ${REDIRECT_PORT}...`);
  console.log("  (Press Ctrl+C to cancel)\n");
});
