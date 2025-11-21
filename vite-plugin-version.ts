import { Plugin } from 'vite';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Vite plugin to inject version information into the build
 */
export function versionPlugin(): Plugin {
  let version: string;
  let buildNumber: number;
  let buildTime: string;

  return {
    name: 'version-plugin',
    
    buildStart() {
      // Read package.json
      const packageJsonPath = resolve(process.cwd(), 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      
      version = packageJson.version;
      buildNumber = packageJson.buildNumber || 0;
      buildTime = new Date().toISOString();
      
      console.log(`\n📦 Building version ${version} (build #${buildNumber}) at ${buildTime}\n`);
    },
    
    transform(code: string, id: string) {
      // Only transform the version.ts file
      if (id.includes('src/version.ts')) {
        return {
          code: code
            .replace('__VERSION__', version)
            .replace('__BUILD_NUMBER__', String(buildNumber))
            .replace('__BUILD_TIME__', buildTime),
          map: null,
        };
      }
      return null;
    },
  };
}

