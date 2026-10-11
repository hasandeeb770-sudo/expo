import { debugEvent, event } from '../../events';
import type { ResolvedOptions } from '../../resolveOptions';
import { compileAndroidAsync } from '../compileAndroidAsync';
import { buildAsync } from '../gradle';
import type { BuildProps } from '../resolveOptions';
import { resolveOptionsAsync } from '../resolveOptions';

jest.mock('../gradle');
jest.mock('../resolveOptions');
jest.mock('../../events', () => {
  const done = jest.fn();
  return {
    event: Object.assign(jest.fn(), {
      span: jest.fn(() => done),
      error: jest.fn((error) => error),
    }),
    debugEvent: jest.fn(),
  };
});

const options: ResolvedOptions = { mode: 'development', outputType: 'apk' };

const props: BuildProps = { ...options, variant: 'debug' };

describe(compileAndroidAsync, () => {
  it(`builds the app`, async () => {
    jest.mocked(resolveOptionsAsync).mockResolvedValueOnce(props);
    await compileAndroidAsync('/app', options);
    expect(resolveOptionsAsync).toHaveBeenCalledWith('/app', options);
    expect(buildAsync).toHaveBeenCalledWith('/app', props);
    expect(debugEvent).toHaveBeenCalledWith('android:build_props', { variant: 'debug' });
    const done = jest.mocked(event.span).mock.results[0]?.value;
    expect(done).toHaveBeenCalledWith('build:done', { platform: 'android', mode: 'development' });
  });

  it(`reports a failed build`, async () => {
    jest.mocked(resolveOptionsAsync).mockResolvedValueOnce(props);
    const error = new Error('build failed');
    jest.mocked(buildAsync).mockRejectedValueOnce(error);
    await expect(compileAndroidAsync('/app', options)).rejects.toBe(error);
    expect(event).toHaveBeenCalledWith('build:failed', { platform: 'android', error });
  });
});
