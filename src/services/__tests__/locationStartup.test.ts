import { afterEach, describe, expect, it, vi } from 'vitest';
import { getGPSPosition } from '../locationProviders';

describe('startup location consent', () => {
  afterEach(() => vi.restoreAllMocks());
  const setup = (state: string) => {
    const position = { coords: { latitude: 60, longitude: 24 } };
    const getCurrentPosition = vi.fn((success: (value: unknown) => void) => success(position));
    Object.defineProperty(navigator, 'permissions', { configurable: true, value: { query: vi.fn(async () => ({ state })) } });
    Object.defineProperty(navigator, 'geolocation', { configurable: true, value: { getCurrentPosition } });
    return getCurrentPosition;
  };
  it('does not ask for GPS during startup', async () => {
    const gps = setup('prompt');
    expect(await getGPSPosition()).toBeNull();
    expect(gps).not.toHaveBeenCalled();
  });
  it('uses existing GPS permission without another prompt', async () => {
    const gps = setup('granted');
    await getGPSPosition();
    expect(gps).toHaveBeenCalledOnce();
  });
  it('allows an explicit feature action to request GPS', async () => {
    const gps = setup('prompt');
    await getGPSPosition({ requestPermission: true });
    expect(gps).toHaveBeenCalledOnce();
  });
});