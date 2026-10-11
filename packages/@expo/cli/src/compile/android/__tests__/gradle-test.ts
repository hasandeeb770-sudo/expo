import spawnAsync from '@expo/spawn-async';

import { buildAsync, getGradleArgs } from '../gradle';

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

describe(buildAsync, () => {
  it(`builds`, async () => {
    await buildAsync('/app', { variant: 'debug' });

    expect(spawnAsync).toHaveBeenCalledWith(
      '/app/android/gradlew',
      getGradleArgs({ variant: 'debug' }),
      { cwd: '/app/android', stdio: 'inherit' }
    );
  });

  it(`throws when gradlew fails`, async () => {
    jest.mocked(spawnAsync).mockRejectedValueOnce(Object.assign(new Error(), { status: 1 }));

    await expect(buildAsync('/app', { variant: 'debug' })).rejects.toThrow(
      'Failed to build Android project. "gradlew" exited with error code 1.'
    );
  });
});
