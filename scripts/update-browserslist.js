#!/usr/bin/env node
// new approach: directly update the caniuse-lite package instead of
// relying on the `browserslist` CLI which currently invokes `bun`.
//
// This keeps the database current for autoprefixer/etc. and avoids the
// cross-platform bun requirement entirely. Running this script is
// equivalent to `npm install caniuse-lite@latest`.
import { execSync } from 'child_process';

try {
  console.log('installing latest caniuse-lite...');
  execSync('npm install caniuse-lite@latest --save-dev', { stdio: 'inherit' });
  console.log('caniuse-lite has been updated');
} catch (err) {
  console.error('failed to update caniuse-lite:', err);
  process.exit(1);
}
