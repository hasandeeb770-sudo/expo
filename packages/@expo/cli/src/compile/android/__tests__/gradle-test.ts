import { getGradleArgs } from '../gradle';

describe(getGradleArgs, () => {
  it.each([
    { variant: 'debug', task: 'app:assembleDebug' },
    { variant: 'release', task: 'app:assembleRelease' },
  ])(`returns the $task arguments`, ({ variant, task }) => {
    expect(getGradleArgs({ variant })).toEqual([
      task,
      '-x',
      'lint',
      '-x',
      'test',
      '--configure-on-demand',
    ]);
  });
});
