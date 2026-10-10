import { resolveOptions } from '../resolveOptions';

describe(resolveOptions, () => {
  it.each([
    { mode: 'development', variant: 'debug' },
    { mode: 'production', variant: 'release' },
  ] as const)(`resolves the $variant variant for $mode`, ({ mode, variant }) => {
    expect(resolveOptions('/app', { mode, outputType: 'apk' })).toEqual({
      mode,
      outputType: 'apk',
      variant,
    });
  });

  it(`rejects --device`, () => {
    expect(() =>
      resolveOptions('/app', { mode: 'development', device: 'emulator-5554', outputType: 'apk' })
    ).toThrow('Device builds are not supported yet. Omit --device to build for all architectures.');
  });

  it(`rejects an output type other than apk`, () => {
    expect(() => resolveOptions('/app', { mode: 'development', outputType: 'aab' })).toThrow(
      'Building an aab is not supported yet. Omit --output-type to build an apk.'
    );
  });
});
