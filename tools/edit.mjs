/**
 * `npm run edit` — everything you need to work on the site, in one command.
 *
 * Starts the editing studio and the live preview together, waits until the
 * studio is listening, and opens it in your browser. Press Ctrl-C once to stop
 * both.
 */

import { spawn } from "node:child_process";
import { connect } from "node:net";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const STUDIO_PORT = Number(process.env.PORT) || 4321;
const PREVIEW_URL = "http://localhost:3000";
const STUDIO_URL = `http://127.0.0.1:${STUDIO_PORT}`;

const children = [];

/** Runs an npm script, tagging each of its output lines so the two are tellable apart. */
function start(label, script) {
  const child = spawn("npm", ["run", script], {
    cwd: repoRoot,
    stdio: ["ignore", "pipe", "pipe"],
    env: process.env,
  });

  const tag = (stream) => (chunk) => {
    for (const line of chunk.toString().split(/\r?\n/)) {
      if (line.trim()) stream.write(`  ${label}  ${line}\n`);
    }
  };

  child.stdout.on("data", tag(process.stdout));
  child.stderr.on("data", tag(process.stderr));

  child.on("exit", (code) => {
    if (!stopping && code) console.error(`\n  ${label} stopped unexpectedly (exit ${code}).\n`);
  });

  children.push(child);
  return child;
}

const listening = (port) =>
  new Promise((done) => {
    const socket = connect(port, "127.0.0.1");
    socket.on("connect", () => { socket.destroy(); done(true); });
    socket.on("error", () => done(false));
    socket.setTimeout(700, () => { socket.destroy(); done(false); });
  });

async function waitFor(port, seconds = 30) {
  for (let attempt = 0; attempt < seconds * 4; attempt += 1) {
    if (await listening(port)) return true;
    await new Promise((done) => setTimeout(done, 250));
  }
  return false;
}

function openBrowser(url) {
  const command =
    process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  spawn(command, [url], { stdio: "ignore", detached: true, shell: process.platform === "win32" })
    .on("error", () => {})
    .unref();
}

let stopping = false;
const stop = () => {
  if (stopping) return;
  stopping = true;
  console.log("\n  Stopping…\n");
  for (const child of children) child.kill("SIGTERM");
  setTimeout(() => process.exit(0), 400);
};

process.on("SIGINT", stop);
process.on("SIGTERM", stop);

if (await listening(STUDIO_PORT)) {
  console.log(`\n  The studio is already running at ${STUDIO_URL} — opening it.\n`);
  openBrowser(STUDIO_URL);
  process.exit(0);
}

console.log("\n  Starting the studio and the preview…\n");

start("studio ", "studio");
start("preview", "dev");

if (await waitFor(STUDIO_PORT)) {
  console.log(`\n  Studio    ${STUDIO_URL}   ← edit here`);
  console.log(`  Preview   ${PREVIEW_URL}   ← see the real site`);
  console.log(`\n  Press Ctrl-C to stop both.\n`);
  openBrowser(STUDIO_URL);
} else {
  console.error(`\n  The studio did not start on port ${STUDIO_PORT}.\n`);
  stop();
}
