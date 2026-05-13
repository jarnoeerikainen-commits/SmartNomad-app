// Ambient type shim for @heygen/streaming-avatar — the published package
// in node_modules is missing its build output, so we declare a permissive
// module to keep TypeScript happy. Runtime usage is gated by AuroraIntro,
// which is only mounted post-signup with a HeyGen API key configured.
declare module '@heygen/streaming-avatar' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  class StreamingAvatar { constructor(...args: any[]); [key: string]: any; }
  export default StreamingAvatar;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const StreamingEvents: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const AvatarQuality: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const VoiceEmotion: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const TaskType: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const TaskMode: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type StartAvatarRequest = any;
}
