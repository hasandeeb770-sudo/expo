import type { BuildProps } from './resolveOptions';

export function getGradleArgs(props: Pick<BuildProps, 'variant'>): string[] {
  const task = props.variant.charAt(0).toUpperCase() + props.variant.slice(1);
  return [`app:assemble${task}`, '-x', 'lint', '-x', 'test', '--configure-on-demand'];
}
