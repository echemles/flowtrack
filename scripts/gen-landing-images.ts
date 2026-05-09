/**
 * gen-landing-images.ts
 * Generates the FlowTrack landing-page hero images via apimart in parallel,
 * then downloads them into apps/web/public/landing/.
 *
 * Reads API_MART_API_KEY from ~/Repositories/taste-lab/mise/.env (no logging).
 */
import { readFileSync, existsSync, writeFileSync, statSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "apps/web/public/landing");

function loadKey(): string {
  const envPath = resolve(process.env.HOME || "", "Repositories/taste-lab/mise/.env");
  if (!existsSync(envPath)) throw new Error(`taste-lab .env not found at ${envPath}`);
  const lines = readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const m = line.match(/^\s*API_MART_API_KEY\s*=\s*(.+?)\s*$/);
    if (m) return m[1].replace(/^['"]|['"]$/g, "");
  }
  throw new Error("API_MART_API_KEY missing in taste-lab .env");
}

const API_KEY = loadKey();
const ENDPOINT = "https://api.apimart.ai/v1/images/generations";
const POLL_BASE = "https://api.apimart.ai/v1/tasks";

type Job = { name: string; prompt: string };

const JOBS: Job[] = [
  {
    name: "hero-port",
    prompt:
      "Cinematic aerial photograph of a vast container shipping port at deep blue dusk. Endless rows of stacked maroon and navy steel containers under dramatic floodlights. Two massive Maersk-style cargo ships docked. Crane silhouettes against a deep navy sky with subtle vermillion light pollution near the horizon. Hyperreal, ultra-detailed, 35mm wide-angle, golden hour edge lighting. No people, no text, no logos. Editorial photography style, Steve McCurry meets Edward Burtynsky.",
  },
  {
    name: "problem-fragments",
    prompt:
      "Overhead photograph of a cluttered logistics manager's desk: paper Bills of Lading half-stacked, two open laptops showing different tracking dashboards (illegible), a phone mid-WhatsApp conversation, post-its with handwritten container numbers, a coffee ring on the desk, late afternoon window light. Hyperreal, top-down, slight depth-of-field. No people. No readable text on screens. Muted navy and bone palette.",
  },
  {
    name: "routes-globe",
    prompt:
      "Dark navy stylized 3D world globe rendered in matte material, viewed from low orbit. Glowing thin red arcs trace shipping routes Asia to Europe and Asia to North America. Subtle continent topography in slightly lighter navy. No country labels. Cinematic, isometric perspective, ambient red rim light. Muted, sophisticated, like a defense-industry briefing graphic.",
  },
  {
    name: "ship-night",
    prompt:
      "A single container ship at sea at night, photographed from a slight low angle. Black water, navy sky, distant horizon. One red and one white running light glow on the bridge. Long exposure, soft mist, lone silhouette. Hyperreal, cinematic, melancholic and powerful. No text.",
  },
];

async function submit(prompt: string, model = "gpt-image-2") {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, prompt, size: "16:9", resolution: "2k", output_format: "jpeg" }),
  });
  return res.json();
}

async function poll(taskId: string, maxAttempts = 80): Promise<string | null> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const res = await fetch(`${POLL_BASE}/${taskId}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await res.json() as any;
    const status = data?.data?.status ?? "unknown";
    if (status === "completed") {
      const images = data?.data?.result?.images;
      if (images?.[0]?.url) return Array.isArray(images[0].url) ? images[0].url[0] : images[0].url;
      return null;
    }
    if (status === "failed" || status === "cancelled") {
      console.error(`[${taskId}] ${status}:`, JSON.stringify(data?.data).slice(0, 300));
      return null;
    }
  }
  return null;
}

async function generateOne(job: Job, attempt = 1): Promise<{ name: string; ok: boolean; bytes?: number; err?: string }> {
  try {
    console.log(`[${job.name}] submitting (attempt ${attempt})…`);
    const submitData: any = await submit(job.prompt);
    let imageUrl: string | null = null;

    const sync = submitData?.data?.[0]?.url;
    if (sync) imageUrl = Array.isArray(sync) ? sync[0] : sync;
    else {
      const taskId = submitData?.data?.[0]?.task_id;
      if (!taskId) throw new Error(`no task_id: ${JSON.stringify(submitData).slice(0, 300)}`);
      console.log(`[${job.name}] task ${taskId} polling…`);
      imageUrl = await poll(taskId);
    }

    if (!imageUrl) throw new Error("no image url");

    const dlRes = await fetch(imageUrl);
    if (!dlRes.ok) throw new Error(`download failed: ${dlRes.status}`);
    const buf = Buffer.from(await dlRes.arrayBuffer());
    const out = join(OUT_DIR, `${job.name}.jpg`);
    writeFileSync(out, buf);
    console.log(`[${job.name}] saved ${(buf.length / 1024).toFixed(1)}KB → ${out}`);
    return { name: job.name, ok: true, bytes: buf.length };
  } catch (e: any) {
    const msg = String(e?.message || e);
    console.error(`[${job.name}] failed:`, msg);
    if (attempt < 2) return generateOne(job, attempt + 1);
    return { name: job.name, ok: false, err: msg };
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const results = await Promise.all(JOBS.map((j) => generateOne(j)));

  console.log("\n=== summary ===");
  for (const r of results) {
    if (r.ok) console.log(`OK  ${r.name}.jpg  ${(r.bytes! / 1024).toFixed(1)}KB`);
    else console.log(`ERR ${r.name}: ${r.err}`);
  }

  const failed = results.filter((r) => !r.ok);
  if (failed.length) {
    const md = `# Missing landing images\n\n${failed.map((f) => `- ${f.name}: ${f.err}`).join("\n")}\n`;
    writeFileSync(join(OUT_DIR, "MISSING-IMAGES.md"), md);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
