import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout } from "node:timers/promises";

const root = fileURLToPath(new URL("../", import.meta.url));
const iconsOnly = process.argv.includes("--icons-only");
const output = `${root}/docs/screenshots`;
await mkdir(output, { recursive: true });
const profile = await mkdtemp(join(tmpdir(), "locale-assets-"));
const app = iconsOnly
  ? undefined
  : spawn(
      process.execPath,
      [
        "node_modules/next/dist/bin/next",
        "start",
        "--hostname",
        "127.0.0.1",
        "--port",
        "3137",
      ],
      {
        cwd: root,
        stdio: "ignore",
        env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
      },
    );
let chrome;
let socket;
const errors = [];

async function waitFor(url) {
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch {}
    await setTimeout(100);
  }
  throw new Error(`Timed out: ${url}`);
}

try {
  if (!iconsOnly) await waitFor("http://127.0.0.1:3137/en");
  chrome = spawn(
    process.env.CHROME_PATH ||
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    [
      "--headless=new",
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-extensions",
      "--disable-background-networking",
      "--hide-scrollbars",
      "--remote-debugging-address=127.0.0.1",
      "--remote-debugging-port=9223",
      `--user-data-dir=${profile}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );
  await waitFor("http://127.0.0.1:9223/json/version");
  const pages = await (await fetch("http://127.0.0.1:9223/json/list")).json();
  socket = new WebSocket(
    pages.find((page) => page.type === "page").webSocketDebuggerUrl,
  );
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  let nextId = 0;
  const pending = new Map();
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject, timer } = pending.get(message.id);
      clearTimeout(timer);
      pending.delete(message.id);
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolve(message.result);
    }
    if (message.method === "Runtime.exceptionThrown")
      errors.push(
        message.params.exceptionDetails.text +
          " " +
          (message.params.exceptionDetails.exception?.description ?? ""),
      );
    if (
      message.method === "Runtime.consoleAPICalled" &&
      message.params.type === "error"
    )
      errors.push(
        message.params.args
          .map((argument) => argument.value ?? argument.description)
          .join(" "),
      );
  });
  function send(method, params = {}) {
    const id = ++nextId;
    return new Promise((resolve, reject) => {
      const timer = globalThis.setTimeout(() => {
        pending.delete(id);
        reject(new Error(`CDP timeout: ${method}`));
      }, 20000);
      pending.set(id, { resolve, reject, timer });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }
  async function evaluate(expression) {
    const result = await send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
      userGesture: true,
    });
    if (result.exceptionDetails)
      throw new Error(
        result.exceptionDetails.exception?.description ??
          result.exceptionDetails.text,
      );
    return result.result.value;
  }
  async function click(selector) {
    const point = await evaluate(
      `(() => { const element = ${selector}; if (!element) throw new Error('Element not found: ' + ${JSON.stringify(selector)}); element.scrollIntoView({block:'center',behavior:'instant'}); const rect = element.getBoundingClientRect(); return {x:rect.x+rect.width/2,y:rect.y+rect.height/2}; })()`,
    );
    await send("Input.dispatchMouseEvent", {
      type: "mousePressed",
      button: "left",
      clickCount: 1,
      ...point,
    });
    await send("Input.dispatchMouseEvent", {
      type: "mouseReleased",
      button: "left",
      clickCount: 1,
      ...point,
    });
    await setTimeout(100);
  }
  async function navigate(pathname) {
    await send("Page.navigate", { url: `http://127.0.0.1:3137${pathname}` });
    await evaluate(
      "new Promise(resolve => document.readyState === 'complete' ? resolve() : addEventListener('load', resolve, { once: true }))",
    );
    await evaluate("document.fonts.ready.then(() => true)");
    await setTimeout(600);
  }
  async function screenshot(name, fullPage = false) {
    const dimensions = await evaluate(
      "({width:innerWidth,height:innerHeight,fullHeight:document.documentElement.scrollHeight})",
    );
    const result = await send("Page.captureScreenshot", {
      format: "webp",
      quality: 85,
      captureBeyondViewport: fullPage,
      ...(fullPage
        ? {
            clip: {
              x: 0,
              y: 0,
              width: dimensions.width,
              height: dimensions.fullHeight,
              scale: 1,
            },
          }
        : {}),
    });
    await writeFile(
      `${output}/${name}.webp`,
      Buffer.from(result.data, "base64"),
    );
  }
  // Rasterize the editable SVG at native sizes; package PNG frames into an ICO.
  const svg = await readFile(`${root}/public/brand/globe.svg`, "utf8");
  const frames = [];
  for (const size of [16, 32, 48, 180, 192, 512]) {
    const data = await evaluate(`(async () => {
      const image = new Image();
      image.src = 'data:image/svg+xml;base64,' + ${JSON.stringify(Buffer.from(svg).toString("base64"))};
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = ${size};
      canvas.getContext('2d').drawImage(image, 0, 0, ${size}, ${size});
      return canvas.toDataURL('image/png').split(',')[1];
    })()`);
    const png = Buffer.from(data, "base64");
    if (size < 64) frames.push({ size, png });
    else
      await writeFile(
        `${root}/public/${size === 180 ? "apple-touch-icon" : size === 192 ? "icon-192" : "icon"}.png`,
        png,
      );
  }
  const header = Buffer.alloc(6 + frames.length * 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);
  let offset = header.length;
  frames.forEach(({ size, png }, index) => {
    const entry = 6 + index * 16;
    header[entry] = header[entry + 1] = size;
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(png.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += png.length;
  });
  await writeFile(
    `${root}/app/favicon.ico`,
    Buffer.concat([header, ...frames.map(({ png }) => png)]),
  );
  if (iconsOnly) {
    console.log("Generated favicon.ico and 180/192/512px PNG icons.");
    process.exitCode = 0;
  } else {
    await send("Page.enable");
    await send("Runtime.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 1120,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send("Emulation.setEmulatedMedia", {
      features: [
        { name: "prefers-color-scheme", value: "light" },
        { name: "prefers-reduced-motion", value: "reduce" },
      ],
    });
    await navigate("/en?view=playground");
    assert.equal(await evaluate("document.documentElement.lang"), "en");
    const links = await evaluate(
      "Array.from(document.head.querySelectorAll('link[rel=icon], link[rel=apple-touch-icon], link[rel=manifest]')).map(link => link.getAttribute('href'))",
    );
    for (const asset of [
      "/favicon.ico",
      "/brand/globe.svg",
      "/icon.png",
      "/apple-touch-icon.png",
      "/manifest.json",
    ]) {
      assert.ok(links.includes(asset), `Missing metadata link: ${asset}`);
      const response = await fetch(`http://127.0.0.1:3137${asset}`);
      assert.equal(response.status, 200, asset);
    }
    const manifest = await (
      await fetch("http://127.0.0.1:3137/manifest.json")
    ).json();
    for (const icon of manifest.icons)
      assert.equal(
        (await fetch(`http://127.0.0.1:3137${icon.src}`)).status,
        200,
      );
    await screenshot("desktop-light", true);
    await evaluate(
      "(() => { const input = document.querySelector('input[type=text]'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, 'Jordan'); input.dispatchEvent(new Event('input', { bubbles: true })); })()",
    );
    await setTimeout(100);
    assert.ok(
      await evaluate(
        "Array.from(document.querySelectorAll('p[aria-live]')).some(element => element.textContent.includes('Jordan'))",
      ),
    );
    await click(
      "document.querySelector('button[aria-label=\"Add one item\"]')",
    );
    assert.match(
      await evaluate("document.querySelector('output').textContent"),
      /3 items/,
    );
    await click(
      "Array.from(document.querySelectorAll('button')).find(element => element.textContent.trim() === 'RTL')",
    );
    assert.equal(
      await evaluate("document.querySelector('[data-direction-preview]').dir"),
      "rtl",
    );
    await evaluate(
      "(() => { const select = document.querySelector('select'); select.value = 'EUR'; select.dispatchEvent(new Event('change', { bubbles: true })); })()",
    );
    await setTimeout(100);
    assert.match(
      await evaluate("document.querySelector('dd[aria-live]').textContent"),
      /€/,
    );
    await evaluate("document.querySelector('[role=tab]').focus()");
    await send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key: "ArrowRight",
      code: "ArrowRight",
      windowsVirtualKeyCode: 39,
    });
    await send("Input.dispatchKeyEvent", {
      type: "keyUp",
      key: "ArrowRight",
      code: "ArrowRight",
      windowsVirtualKeyCode: 39,
    });
    assert.equal(
      await evaluate(
        "document.querySelector('[role=tab][aria-selected=true]').textContent",
      ),
      "Source code",
    );
    await click(
      "document.querySelector('button[aria-label=\"Choose color theme\"]')",
    );
    await click(
      "Array.from(document.querySelectorAll('[role=menuitemradio]')).find(element => element.textContent.trim() === 'Dark')",
    );
    assert.equal(
      await evaluate("document.documentElement.dataset.theme"),
      "dark",
    );
    await navigate("/en?view=playground");
    assert.equal(
      await evaluate("document.documentElement.dataset.theme"),
      "dark",
    );
    await screenshot("desktop-dark", true);
    await click(
      "document.querySelector('button[aria-label=\"Change Language\"]')",
    );
    await click("document.querySelector('a[hreflang=fa]')");
    await setTimeout(700);
    assert.equal(
      await evaluate("location.pathname + location.search"),
      "/fa?view=playground",
    );
    assert.equal(await evaluate("document.documentElement.dir"), "rtl");
    assert.equal(
      await evaluate("document.documentElement.dataset.theme"),
      "dark",
    );
    await evaluate("document.fonts.ready.then(() => true)");
    await screenshot("persian-dark", true);
    await click(
      "document.querySelector('button[aria-label=\"انتخاب پوستهٔ رنگی\"]')",
    );
    await click(
      "Array.from(document.querySelectorAll('[role=menuitemradio]')).find(element => element.textContent.trim() === 'روشن')",
    );
    await screenshot("persian-light", true);
    await send("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
    });
    assert.ok(
      await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"),
    );
    await navigate("/en");
    assert.ok(
      await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"),
    );
    await send("Emulation.setDeviceMetricsOverride", {
      width: 320,
      height: 740,
      deviceScaleFactor: 1,
      mobile: true,
    });
    await evaluate(
      "document.querySelector('pre').scrollIntoView({block:'center',behavior:'instant'})",
    );
    await evaluate(
      "document.querySelectorAll('[role=tablist]')[1].scrollIntoView({block:'center',behavior:'instant'})",
    );
    assert.ok(
      await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"),
    );
    const buttonBounds = await evaluate(
      "Array.from(document.querySelector('header').querySelectorAll('button')).map(element => ({label:element.getAttribute('aria-label'),left:element.getBoundingClientRect().left,right:element.getBoundingClientRect().right}))",
    );
    assert.ok(
      buttonBounds.every((button) => button.left >= 0 && button.right <= 320),
      JSON.stringify(buttonBounds),
    );
    assert.deepEqual(errors, [], "No browser or hydration errors");
    console.log(
      JSON.stringify(
        {
          passed: [
            "live greeting",
            "plural counter",
            "RTL layout override",
            "currency selection",
            "keyboard tabs",
            "theme persistence",
            "query-preserving language navigation",
            "Persian RTL",
            "390px and 320px layouts",
            "no hydration errors",
          ],
          screenshots: output,
        },
        null,
        2,
      ),
    );
  }
} finally {
  socket?.close();
  chrome?.kill("SIGTERM");
  app?.kill("SIGTERM");
  if (chrome && chrome.exitCode === null)
    await new Promise((resolve) => chrome.once("exit", resolve));
  await rm(profile, { recursive: true, force: true });
}
