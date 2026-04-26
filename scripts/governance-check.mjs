import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const protectedPaths = [
  'src/pages/Landing.tsx',
  'src/pages/Index.tsx',
  'src/App.tsx',
  'src/components/AppHeader.tsx',
  'src/index.css',
  'tailwind.config.ts',
  'src/integrations/supabase/types.ts',
];

const protectedPrefixes = [
  'src/components/ui/',
  'supabase/migrations/',
];

const allowedEnv = process.env.ALLOW_PROTECTED_CORE_CHANGES === 'true';

function gitOutput(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

const changed = new Set([
  ...gitOutput('git diff --name-only').split('\n'),
  ...gitOutput('git diff --name-only --cached').split('\n'),
  ...gitOutput('git ls-files --others --exclude-standard').split('\n'),
].map((file) => file.trim()).filter(Boolean));

const protectedChanges = [...changed].filter((file) =>
  protectedPaths.includes(file) || protectedPrefixes.some((prefix) => file.startsWith(prefix))
);

const requiredDocs = ['docs/FEATURE_GOVERNANCE.md'];
const missingDocs = requiredDocs.filter((file) => !existsSync(file));

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
const hasScript = Boolean(packageJson.scripts?.['governance:check']);

if (missingDocs.length > 0) {
  console.error(`Missing governance docs: ${missingDocs.join(', ')}`);
  process.exit(1);
}

if (!hasScript) {
  console.error('Missing package script: governance:check');
  process.exit(1);
}

if (protectedChanges.length > 0 && !allowedEnv) {
  console.error('Protected core files changed. Set ALLOW_PROTECTED_CORE_CHANGES=true only when the user explicitly requested core/brand changes.');
  for (const file of protectedChanges) console.error(`- ${file}`);
  process.exit(1);
}

console.log('Governance check passed: protected core is safe and feature governance is documented.');
