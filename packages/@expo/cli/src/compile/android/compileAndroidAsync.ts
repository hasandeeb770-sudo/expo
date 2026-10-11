import { debugEvent, event } from '../events';
import type { ResolvedOptions } from '../resolveOptions';
import { buildAsync } from './gradle';
import { resolveOptionsAsync } from './resolveOptions';

export async function compileAndroidAsync(projectRoot: string, options: ResolvedOptions) {
  const props = await resolveOptionsAsync(projectRoot, options);
  debugEvent('android:build_props', {
    variant: props.variant,
  });

  const doneBuild = event.span();
  try {
    await buildAsync(projectRoot, props);
  } catch (error) {
    event('build:failed', { platform: 'android', error: event.error(error as Error) });
    throw error;
  }
  doneBuild('build:done', { platform: 'android', mode: props.mode });
}
