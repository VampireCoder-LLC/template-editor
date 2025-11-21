import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Script to bump the build number in package.json
 */
function bumpBuildNumber() {
  const packageJsonPath = resolve(process.cwd(), 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  
  // Get current build number or default to 0
  const currentBuildNumber = packageJson.buildNumber || 0;
  const newBuildNumber = currentBuildNumber + 1;
  
  // Update build number
  packageJson.buildNumber = newBuildNumber;
  
  // Write back to package.json
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8');
  
  console.log(`✅ Build number bumped: ${currentBuildNumber} → ${newBuildNumber}`);
  console.log(`📦 Version: ${packageJson.version}`);
}

bumpBuildNumber();

