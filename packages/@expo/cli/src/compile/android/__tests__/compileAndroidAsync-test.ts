import type { ResolvedOptions } from '../../resolveOptions';
import { compileAndroidAsync } from '../compileAndroidAsync';
import { resolveOptions } from '../resolveOptions';

jest.mock('../../../log');
jest.mock('../resolveOptions');

const options: ResolvedOptions = { mode: 'development', outputType: 'apk' };

describe(compileAndroidAsync, () => {
  it(`resolves the Android build props`, async () => {
    await expect(compileAndroidAsync('/app', options)).rejects.toThrow(/EXIT_CALLED/);
    expect(resolveOptions).toHaveBeenCalledWith('/app', options);
  });
});
