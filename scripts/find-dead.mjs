// Analiza martwego kodu: BFS po grafie importow od punktow wejsciowych Next.js
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, dirname, resolve, relative } from "path";

const ROOT = process.cwd();
const exts = [".tsx", ".ts", ".jsx", ".js"];

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (exts.some((x) => p.endsWith(x))) out.push(p);
  }
  return out;
}

const allFiles = walk(join(ROOT, "app"));
const norm = (p) => relative(ROOT, p).replace(/\\/g, "/");

function resolveImport(fromFile, spec) {
  let base = null;
  if (spec.startsWith(".")) base = resolve(dirname(fromFile), spec);
  else if (spec.startsWith("@/app/")) base = resolve(ROOT, spec.slice(2));
  else if (spec.startsWith("@/")) base = resolve(ROOT, spec.slice(2));
  else return null; // pakiet npm
  const cands = [base, ...exts.map((e) => base + e), ...exts.map((e) => join(base, "index" + e))];
  for (const c of cands) {
    if (existsSync(c) && statSync(c).isFile()) return c;
  }
  return null;
}

const importRe = /(?:import\s[^"']*?|export\s[^"']*?from\s*|import\s*\(\s*|require\s*\(\s*)["']([^"']+)["']/g;

const graph = new Map();
for (const f of allFiles) {
  const src = readFileSync(f, "utf8");
  const deps = [];
  let m;
  while ((m = importRe.exec(src))) {
    const r = resolveImport(f, m[1]);
    if (r) deps.push(r);
  }
  graph.set(f, deps);
}

// Punkty wejsciowe Next.js App Router
const entryNames = /(\/|^)(page|layout|loading|error|not-found|global-error|template|route|sitemap|robots|manifest|opengraph-image|icon|apple-icon|middleware)\.[jt]sx?$/;
const roots = allFiles.filter((f) => entryNames.test(norm(f)));

const seen = new Set(roots);
const queue = [...roots];
while (queue.length) {
  const f = queue.pop();
  for (const d of graph.get(f) || []) {
    if (!seen.has(d)) {
      seen.add(d);
      queue.push(d);
    }
  }
}

const dead = allFiles.filter((f) => !seen.has(f)).map(norm).sort();
console.log("MARTWE PLIKI (" + dead.length + "):");
dead.forEach((d) => console.log("  " + d));
