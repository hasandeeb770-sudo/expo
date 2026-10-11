import spawnAsync from '@expo/spawn-async';
import path from 'path';

import { CommandError } from '../../utils/errors';
import type { BuildProps } from './resolveOptions';

export function getGradleArgs(props: Pick<BuildProps, 'variant'>): string[] {
  const task = props.variant.charAt(0).toUpperCase() + props.variant.slice(1);
  return [`app:assemble${task}`, '-x', 'lint', '-x', 'test', '--configure-on-demand'];
}

export async function buildAsync(
  projectRoot: string,
  props: Pick<BuildProps, 'variant'>
): Promise<void> {
  const androidProjectRoot = path.join(projectRoot, 'android');
  try {
    await spawnAsync(
      path.join(androidProjectRoot, process.platform === 'win32' ? 'gradlew.bat' : 'gradlew'),
      getGradleArgs(props),
      { cwd: androidProjectRoot, stdio: 'inherit' }
    );
  } catch (error: any) {
    throw new CommandError(
      `Failed to build Android project. "gradlew" exited with error code ${error.status}.`
    );
  }
}
