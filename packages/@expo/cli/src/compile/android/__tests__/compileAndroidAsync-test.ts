import type { ResolvedOptions } from '../../resolveOptions';
import { compileAndroidAsync } from '../compileAndroidAsync';
import { buildAsync } from '../gradle';
import type { BuildProps } from '../resolveOptions';
import { resolveOptionsAsync } from '../resolveOptions';

jest.mock('../gradle');
jest.mock('../resolveOptions');

const options: ResolvedOptions = { mode: 'development', outputType: 'apk' };

const props: BuildProps = { ...options, variant: 'debug' };

describe(compileAndroidAsync, () => {
  it(`builds the app`, async () => {
    jest.mocked(resolveOptionsAsync).mockResolvedValueOnce(props);
    await compileAndroidAsync('/app', options);
    expect(resolveOptionsAsync).toHaveBeenCalledWith('/app', options);
    expect(buildAsync).toHaveBeenCalledWith('/app', props);
  });
});
