import * as Log from '../../log';
import type { ResolvedOptions } from '../resolveOptions';
import { resolveOptionsAsync } from './resolveOptions';

export async function compileAndroidAsync(projectRoot: string, options: ResolvedOptions) {
  await resolveOptionsAsync(projectRoot, options);

  Log.exit(`expo compile:android is not available yet.`);
}
