import { Log } from '../../../log';
import { copyBinaryToOutputAsync } from '../../copyBinaryToOutputAsync';
import { debugEvent, event } from '../../events';
import type { ResolvedOptions } from '../../resolveOptions';
import { compileAndroidAsync } from '../compileAndroidAsync';
import { buildAsync, getApkPath } from '../gradle';
import type { BuildProps } from '../resolveOptions';
import { resolveOptionsAsync } from '../resolveOptions';

jest.mock('../../../log');
jest.mock('../../copyBinaryToOutputAsync');
jest.mock('../gradle');
jest.mock('../resolveOptions');
jest.mock('../../events', () => {
  const done = jest.fn();
  return {
    event: Object.assign(jest.fn(), {
      span: jest.fn(() => done),
      error: jest.fn((error) => error),
      path: jest.fn((path) => path),
    }),
    debugEvent: jest.fn(),
  };
});

const options: ResolvedOptions = { mode: 'development', outputType: 'apk' };

const props: BuildProps = { ...options, variant: 'debug' };

describe(compileAndroidAsync, () => {
  it(`builds the app`, async () => {
    jest.mocked(resolveOptionsAsync).mockResolvedValueOnce(props);
    jest.mocked(getApkPath).mockReturnValueOnce('/app/app-debug.apk');
    await compileAndroidAsync('/app', options);
    expect(resolveOptionsAsync).toHaveBeenCalledWith('/app', options);
    expect(buildAsync).toHaveBeenCalledWith('/app', props);
    expect(debugEvent).toHaveBeenCalledWith('android:build_props', { variant: 'debug' });
    const done = jest.mocked(event.span).mock.results[0]?.value;
    expect(done).toHaveBeenCalledWith('build:done', { platform: 'android', mode: 'development' });
    expect(done).toHaveBeenCalledWith('done', {
      platform: 'android',
      mode: 'development',
      outputType: 'apk',
      outputPath: '/app/app-debug.apk',
    });
    expect(Log.log).toHaveBeenCalledWith(expect.stringContaining('Build complete'));
    expect(Log.log).toHaveBeenCalledWith(expect.stringContaining('Binary: /app/app-debug.apk'));
  });

  it(`copies the app to the output directory`, async () => {
    jest.mocked(resolveOptionsAsync).mockResolvedValueOnce({ ...props, outputDir: '/app/build' });
    jest.mocked(getApkPath).mockReturnValueOnce('/app/app-debug.apk');
    jest.mocked(copyBinaryToOutputAsync).mockResolvedValueOnce('/app/build/app-debug.apk');
    await compileAndroidAsync('/app', options);
    expect(copyBinaryToOutputAsync).toHaveBeenCalledWith('/app/app-debug.apk', '/app/build');
    expect(Log.log).toHaveBeenCalledWith(
      expect.stringContaining('Binary: /app/build/app-debug.apk')
    );
    expect(jest.mocked(event.span).mock.results[0]?.value).toHaveBeenCalledWith(
      'done',
      expect.objectContaining({ outputPath: '/app/build/app-debug.apk' })
    );
  });

  it(`reports a failed build`, async () => {
    jest.mocked(resolveOptionsAsync).mockResolvedValueOnce(props);
    const error = new Error('build failed');
    jest.mocked(buildAsync).mockRejectedValueOnce(error);
    await expect(compileAndroidAsync('/app', options)).rejects.toBe(error);
    expect(event).toHaveBeenCalledWith('build:failed', { platform: 'android', error });
  });
});
