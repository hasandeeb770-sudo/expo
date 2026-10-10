import { CommandError } from '../../utils/errors';
import type { ResolvedOptions } from '../resolveOptions';

export type BuildProps = ResolvedOptions & {
  variant: string;
};

export function resolveOptions(projectRoot: string, options: ResolvedOptions): BuildProps {
  if (options.device) {
    throw new CommandError(
      'BAD_ARGS',
      'Device builds are not supported yet. Omit --device to build for all architectures.'
    );
  }
  if (options.outputType !== 'apk') {
    throw new CommandError(
      'BAD_ARGS',
      `Building an ${options.outputType} is not supported yet. Omit --output-type to build an apk.`
    );
  }

  return {
    ...options,
    variant: options.mode === 'production' ? 'release' : 'debug',
  };
}
