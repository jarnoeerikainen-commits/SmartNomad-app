// Build-time stub for @heygen/streaming-avatar.
// The published package on npm is missing its compiled `lib/` output, so Vite
// can't resolve it for production builds. We alias the import to this file via
// vite.config so the bundle resolves. AuroraIntro is gated behind a HeyGen API
// key and is not used in the guided tour or main app flow, so the stubbed
// runtime is acceptable until the package ships a real build.

class StreamingAvatar {
  constructor(_opts) {}
  on() { return this; }
  off() { return this; }
  async createStartAvatar() { throw new Error('HeyGen streaming avatar SDK is unavailable in this build.'); }
  async speak() { return; }
  async stopAvatar() { return; }
  async closeVoiceChat() { return; }
}

export default StreamingAvatar;
export const StreamingEvents = {};
export const AvatarQuality = { Low: 'low', Medium: 'medium', High: 'high' };
export const VoiceEmotion = {};
export const TaskType = { TALK: 'talk', REPEAT: 'repeat' };
export const TaskMode = { SYNC: 'sync', ASYNC: 'async' };
