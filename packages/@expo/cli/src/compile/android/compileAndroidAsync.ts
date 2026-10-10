import * as Log from '../../log';
import type { ResolvedOptions } from '../resolveOptions';
import { resolveOptions } from './resolveOptions';

export async function compileAndroidAsync(projectRoot: string, options: ResolvedOptions) {
  resolveOptions(projectRoot, options);

  Log.exit(`expo compile:android is not available yet.`);
}
