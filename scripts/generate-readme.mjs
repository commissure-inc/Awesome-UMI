#!/usr/bin/env node
/**
 * Regenerates the curated list sections of README.md from umi_devices_data.json.
 *
 * Usage:
 *   node scripts/generate-readme.mjs           write README.md
 *   node scripts/generate-readme.mjs --check   exit 1 if README.md is out of date
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA_PATH = join(ROOT, "umi_devices_data.json");
const README_PATH = join(ROOT, "README.md");

/** Form categories in catalog scope. Keep in sync with CATALOG_FORM_CATEGORIES in web/src/catalog.ts. */
const CATEGORY_HEADINGS = {
  handheld_gripper: "Handheld grippers",
  wearable_hand: "Wearable hands and gloves",
  wearable_arm: "Wearable arms and exoskeletons",
};

const LICENSE_LABELS = {
  mit: "MIT",
  apache: "Apache-2.0",
  mpl_2: "MPL-2.0",
  partial_oss: "partially open source",
  commercial_closed: "proprietary",
  diy_open: "open hardware",
};

const COUNTRY_LABELS = {
  us: "US",
  uk: "UK",
  uae: "UAE",
  china: "China",
  china_global: "China",
  japan: "Japan",
  germany: "Germany",
  russia: "Russia",
  canada: "Canada",
  south_korea: "South Korea",
};

/** Fallback descriptions for entries whose sources give no usable summary. */
const FORM_FACTOR_PHRASES = {
  handheld_parallel_jaw: "Handheld parallel-jaw gripper for robot-free demonstration collection",
  handheld_multi_finger: "Handheld multi-finger gripper for robot-free demonstration collection",
  stick_with_phone: "Handheld stick rig that uses a smartphone as the sensor suite",
  wearable_exoskeleton_hand: "Wearable hand exoskeleton for dexterous demonstration collection",
  wearable_exoskeleton_hand_passive: "Passive wearable hand exoskeleton for dexterous demonstration collection",
  wearable_full_arm: "Wearable full-arm capture system",
  wearable_full_arm_chest: "Chest-mounted wearable full-arm capture system",
  mocap_glove: "Motion-capture glove for dexterous demonstration collection",
  finger_worn: "Finger-worn capture device",
  sensor_pad_module: "Tactile sensor module",
  tactile_sensor_fingertip: "Fingertip tactile sensor module",
  robotic_arm: "Robot arm kit for imitation-learning data collection and deployment",
  bimanual_imitation_kit: "Bimanual imitation-learning kit",
  humanoid_teleop: "Humanoid teleoperation rig",
  seated_teleop: "Seated teleoperation station",
  smart_glasses: "Head-worn capture device",
  ar_virtual: "AR/VR demonstration interface",
  rgb_camera_only: "Camera-only capture setup",
};

const SOURCE_PRIORITY = ["project_page", "product_page", "github", "paper", "documentation", "article", "press"];

/** Sections appended to the table of contents after the generated ones. */
const STATIC_TOC_ENTRIES = [
  ["Web catalog", "#web-catalog"],
  ["Repository layout", "#repository-layout"],
  ["License", "#license"],
  ["Maintainer", "#maintainer"],
];

const MAX_DESCRIPTION_LENGTH = 200;

function titleCase(value) {
  const text = value.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function slugify(heading) {
  return heading
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s/g, "-");
}

function sourceUrl(product, type) {
  return product.sources?.find((source) => source.type === type)?.url;
}

function primaryUrl(product) {
  for (const type of SOURCE_PRIORITY) {
    const url = sourceUrl(product, type);
    if (url) return url;
  }
  return product.sources?.[0]?.url;
}

/** Keeps list items scannable: long multi-sentence summaries are cut to the first sentence. */
function shorten(text) {
  if (text.length <= MAX_DESCRIPTION_LENGTH) return text;
  const firstSentence = text.match(/^.*?[.;](?=\s)/);
  return firstSentence ? firstSentence[0] : text;
}

function words(text) {
  return text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

/**
 * `full_name` is usually the paper title, but for some commercial entries it is just a
 * restatement of the product and vendor name, which makes a useless description.
 */
function usableTitle(product) {
  const title = product.full_name;
  if (!title || title === product.name) return undefined;
  const withoutPrefix = title.replace(/^([^:]{1,40}):\s*/, (match, prefix) =>
    words(prefix).some((word) => words(product.name).includes(word)) ? "" : match,
  );
  const known = new Set([...words(product.name), ...(product.organization ?? []).flatMap(words)]);
  const remaining = words(withoutPrefix.replace(/\([^)]*\)/g, "")).filter(
    (word) => !known.has(word) && word.length > 2,
  );
  return remaining.length >= 3 ? withoutPrefix.trim() : undefined;
}

function describe(product) {
  const specs = product.specs ?? {};
  const raw =
    product.key_innovation ??
    specs.significance ??
    specs.description ??
    usableTitle(product) ??
    FORM_FACTOR_PHRASES[product.form_factor] ??
    titleCase(product.form_factor ?? product.form_category ?? "device");
  const text = shorten(raw.trim()).replace(/[.;,]$/, "");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function credit(product) {
  const parts = [];
  const organizations = product.organization ?? (product.specs?.provider ? [product.specs.provider] : []);
  if (organizations.length === 1) parts.push(organizations[0]);
  else if (organizations.length > 1) parts.push(`${organizations[0]} et al.`);
  if (product.year_first) parts.push(String(product.year_first));
  const license = LICENSE_LABELS[product.license];
  if (license) parts.push(license);
  return parts.join(", ");
}

function extraLinks(product, primary) {
  const links = [];
  const paper = sourceUrl(product, "paper");
  const code = sourceUrl(product, "github");
  if (paper && paper !== primary) links.push(`[paper](${paper})`);
  if (code && code !== primary) links.push(`[code](${code})`);
  return links;
}

function productLine(product) {
  const url = primaryUrl(product);
  const name = product.name;
  const segments = [describe(product)];
  const meta = credit(product);
  const links = extraLinks(product, url);
  if (meta) segments.push(links.length ? `${meta} (${links.join(", ")})` : meta);
  else if (links.length) segments.push(links.join(", "));
  const description = `${segments.join(" — ")}.`;
  return url ? `- [${name}](${url}) - ${description}` : `- **${name}** - ${description}`;
}

function datasetLine(dataset) {
  const facts = [];
  if (dataset.trajectories) facts.push(`${dataset.trajectories} trajectories`);
  if (dataset.episodes) facts.push(`${dataset.episodes} episodes`);
  if (dataset.hours) facts.push(`${dataset.hours} hours`);
  if (dataset.tasks) facts.push(`${dataset.tasks} tasks`);
  const segments = [titleCase(dataset.type)];
  if (dataset.provider) segments.push(dataset.provider);
  if (facts.length) segments.push(facts.join(", "));
  return `- [${dataset.name}](${dataset.url}) - ${segments.join(" — ")}.`;
}

function standardLine(standard) {
  const country = standard.country ? COUNTRY_LABELS[standard.country] ?? titleCase(standard.country) : undefined;
  const context = [country, standard.year].filter(Boolean).join(", ");
  const detail = standard.scope
    ? titleCase(standard.scope)
    : (standard.stages ?? []).join("; ");
  return `- **${standard.name}**${context ? ` (${context})` : ""} - ${detail}.`;
}

function mediaLine(item) {
  const context = [item.publisher, item.published_at].filter(Boolean).join(", ");
  const summary = shorten(item.summary ?? "").replace(/[.;,]$/, "");
  const segments = [titleCase(item.kind)];
  if (context) segments.push(context);
  if (summary) segments.push(summary);
  return `- [${item.title}](${item.canonical_url}) - ${segments.join(" — ")}.`;
}

function byYearThenName(a, b) {
  const yearA = a.year_first ?? Number.POSITIVE_INFINITY;
  const yearB = b.year_first ?? Number.POSITIVE_INFINITY;
  if (yearA !== yearB) return yearA - yearB;
  return a.name.localeCompare(b.name);
}

function catalogProducts(data) {
  return data.products.filter((product) => product.form_category in CATEGORY_HEADINGS);
}

function buildSections(data) {
  const order = data.filter_axes?.form_category?.values ?? [];
  const inScope = catalogProducts(data);
  const categories = [...new Set([...order, ...inScope.map((p) => p.form_category)])].filter(
    (category) => category in CATEGORY_HEADINGS,
  );
  const sections = [];

  for (const category of categories) {
    const products = inScope.filter((p) => p.form_category === category).sort(byYearThenName);
    if (products.length === 0) continue;
    sections.push({
      heading: CATEGORY_HEADINGS[category],
      lines: products.map(productLine),
    });
  }

  if (data.datasets?.length) {
    sections.push({ heading: "Datasets", lines: data.datasets.map(datasetLine) });
  }
  if (data.policy_standards?.length) {
    sections.push({ heading: "Standards and policy", lines: data.policy_standards.map(standardLine) });
  }
  if (data.curated_content?.length) {
    sections.push({ heading: "Talks and articles", lines: data.curated_content.map(mediaLine) });
  }
  return sections;
}

function buildToc(sections) {
  const entries = [
    ...sections.map((section) => [section.heading, `#${slugify(section.heading)}`]),
    ...STATIC_TOC_ENTRIES,
  ];
  return entries.map(([label, anchor]) => `- [${label}](${anchor})`).join("\n");
}

function buildList(sections) {
  return sections
    .map((section) => `## ${section.heading}\n\n${section.lines.join("\n")}`)
    .join("\n\n");
}

function buildSummary(data) {
  const { datasets = [] } = data;
  return [`**${catalogProducts(data).length}** devices`, `**${datasets.length}** datasets`].join(" · ");
}

function replaceBlock(markdown, name, body) {
  const pattern = new RegExp(`<!-- BEGIN ${name} -->[\\s\\S]*?<!-- END ${name} -->`);
  if (!pattern.test(markdown)) {
    throw new Error(`Marker "${name}" not found in README.md`);
  }
  return markdown.replace(pattern, `<!-- BEGIN ${name} -->\n${body}\n<!-- END ${name} -->`);
}

function main() {
  const data = JSON.parse(readFileSync(DATA_PATH, "utf8"));
  const sections = buildSections(data);

  const outOfScope = data.products.filter((product) => !(product.form_category in CATEGORY_HEADINGS));
  if (outOfScope.length > 0) {
    console.warn(`Skipping ${outOfScope.length} product(s) outside catalog scope: ${outOfScope.map((p) => p.id).join(", ")}`);
  }

  let markdown = readFileSync(README_PATH, "utf8");
  markdown = replaceBlock(markdown, "SUMMARY", buildSummary(data));
  markdown = replaceBlock(markdown, "TOC", buildToc(sections));
  markdown = replaceBlock(markdown, "LIST", buildList(sections));

  if (process.argv.includes("--check")) {
    if (markdown !== readFileSync(README_PATH, "utf8")) {
      console.error("README.md is out of date. Run: node scripts/generate-readme.mjs");
      process.exit(1);
    }
    console.log("README.md is up to date.");
    return;
  }

  writeFileSync(README_PATH, markdown);
  console.log(`README.md updated (${catalogProducts(data).length} devices, ${sections.length} sections).`);
}

main();
