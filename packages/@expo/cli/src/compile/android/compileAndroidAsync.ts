import type { ResolvedOptions } from '../resolveOptions';
import { buildAsync } from './gradle';
import { resolveOptionsAsync } from './resolveOptions';

export async function compileAndroidAsync(projectRoot: string, options: ResolvedOptions) {
  const props = await resolveOptionsAsync(projectRoot, options);

  await buildAsync(projectRoot, props);
}
