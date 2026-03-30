// Persistent device identifier for pre-auth user tracking
const DEVICE_ID_KEY = 'supernomad_device_id';

export function getDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = crypto.randomUUID?.() || `dev_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}
