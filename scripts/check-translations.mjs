import { readFile, readdir } from "node:fs/promises";

const localesDirectory = new URL("../locales/", import.meta.url);

function getKeys(value, path = "") {
  if (typeof value === "string" && value.trim().length > 0) return [path];

  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.keys(value).length === 0
  ) {
    throw new Error(
      `${path || "<root>"}: expected non-empty text or a non-empty object`,
    );
  }

  return Object.entries(value).flatMap(([key, child]) => {
    if (key.includes(".") || key.includes(":")) {
      throw new Error(
        `${path || "<root>"}: key "${key}" contains an i18next separator`,
      );
    }
    return getKeys(child, path ? `${path}.${key}` : key);
  });
}

async function readKeys(locale) {
  const file = new URL(`${locale}/translations.json`, localesDirectory);
  const dictionary = JSON.parse(await readFile(file, "utf8"));
  if (
    !dictionary ||
    typeof dictionary !== "object" ||
    Array.isArray(dictionary)
  ) {
    throw new Error(`${locale}: expected a dictionary object`);
  }
  return new Set(getKeys(dictionary));
}

try {
  const canonicalKeys = await readKeys("en");
  const locales = (await readdir(localesDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const locale of locales) {
    const keys = await readKeys(locale);
    const missing = [...canonicalKeys].filter((key) => !keys.has(key));
    const extra = [...keys].filter((key) => !canonicalKeys.has(key));
    if (missing.length || extra.length) {
      throw new Error(
        `${locale}: missing keys [${missing.join(", ")}]; extra keys [${extra.join(", ")}]`,
      );
    }
  }

  process.stdout.write(
    `Validated ${locales.length} locales (${canonicalKeys.size} translation keys each).\n`,
  );
} catch (error) {
  process.stderr.write(
    `Translation validation failed: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
}
