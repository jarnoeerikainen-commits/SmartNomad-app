import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

/**
 * Lip-Sync Video Generator
 * 
 * Pipeline:
 * 1. Receive text + avatar face (female/male) + gender (woman/man)
 * 2. Generate TTS audio via ElevenLabs
 * 3. Upload audio + avatar image to fal.ai Omnihuman 1.5
 * 4. Return generated video URL
 * 
 * Requires:
 * - ELEVENLABS_API_KEY (already configured)
 * - FAL_KEY (fal.ai API key for Omnihuman 1.5)
 * 
 * Usage from client:
 * POST /functions/v1/lipsync-generator
 * Body: { text: string, face: 'female' | 'male', gender: 'woman' | 'man' }
 * Returns: { videoUrl: string, durationSeconds: number }
 */

// Avatar image URLs — replace with your actual hosted avatar images
const AVATAR_IMAGES = {
  female: '', // Sofia's portrait image URL (must be publicly accessible)
  male: '',   // Marcus's portrait image URL (must be publicly accessible)
};

// ElevenLabs voice IDs
const VOICE_IDS = {
  woman: 'FGY2WhTYpPnrIDTdsKH5', // Laura - warm female
  man: 'JBFqnCBsd6RMkjVDRZzb',   // George - deep male
};

const sanitizeText = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value
    .normalize('NFKC')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 2000);
};

async function generateTTSAudio(
  text: string,
  gender: 'woman' | 'man',
  apiKey: string
): Promise<ArrayBuffer> {
  const voiceId = VOICE_IDS[gender];
  const voiceSettings = gender === 'man'
    ? { stability: 0.6, similarity_boost: 0.82, style: 0.38, use_speaker_boost: true, speed: 0.88 }
    : { stability: 0.52, similarity_boost: 0.78, style: 0.5, use_speaker_boost: true, speed: 0.98 };

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: voiceSettings,
      }),
    }
  );

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`ElevenLabs TTS error [${response.status}]: ${errBody}`);
  }

  return response.arrayBuffer();
}

async function generateLipsyncVideo(
  imageUrl: string,
  audioBuffer: ArrayBuffer,
  falKey: string
): Promise<{ videoUrl: string; durationSeconds: number }> {
  // Upload audio to a temporary hosting via fal.ai upload API
  const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
  
  const uploadResponse = await fetch('https://fal.run/fal-ai/file-upload', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${falKey}`,
      'Content-Type': 'audio/mpeg',
    },
    body: audioBlob,
  });

  if (!uploadResponse.ok) {
    throw new Error(`fal.ai audio upload failed [${uploadResponse.status}]`);
  }

  const { url: audioUrl } = await uploadResponse.json();

  // Submit Omnihuman lip-sync job
  const submitResponse = await fetch('https://queue.fal.run/fal-ai/bytedance/omnihuman/v1.5', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${falKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_url: imageUrl,
      audio_url: audioUrl,
      resolution: '720p',
    }),
  });

  if (!submitResponse.ok) {
    const errBody = await submitResponse.text();
    throw new Error(`fal.ai Omnihuman submit failed [${submitResponse.status}]: ${errBody}`);
  }

  const { request_id } = await submitResponse.json();

  // Poll for completion (max 3 minutes)
  const maxWait = 180_000;
  const pollInterval = 5_000;
  const startTime = Date.now();

  while (Date.now() - startTime < maxWait) {
    await new Promise(resolve => setTimeout(resolve, pollInterval));

    const statusResponse = await fetch(
      `https://queue.fal.run/fal-ai/bytedance/omnihuman/v1.5/requests/${request_id}/status`,
      {
        headers: { 'Authorization': `Key ${falKey}` },
      }
    );

    if (!statusResponse.ok) continue;

    const status = await statusResponse.json();

    if (status.status === 'COMPLETED') {
      // Get the result
      const resultResponse = await fetch(
        `https://queue.fal.run/fal-ai/bytedance/omnihuman/v1.5/requests/${request_id}`,
        {
          headers: { 'Authorization': `Key ${falKey}` },
        }
      );

      if (!resultResponse.ok) {
        throw new Error(`fal.ai result fetch failed [${resultResponse.status}]`);
      }

      const result = await resultResponse.json();
      const videoUrl = result.video?.url || result.output?.url;

      if (!videoUrl) {
        throw new Error('fal.ai returned no video URL');
      }

      return {
        videoUrl,
        durationSeconds: result.video?.duration || result.duration || 0,
      };
    }

    if (status.status === 'FAILED') {
      throw new Error(`fal.ai Omnihuman generation failed: ${status.error || 'Unknown error'}`);
    }
  }

  throw new Error('fal.ai Omnihuman generation timed out (3 minutes)');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY is not configured');
    }

    const FAL_KEY = Deno.env.get('FAL_KEY');
    if (!FAL_KEY) {
      throw new Error('FAL_KEY is not configured. Add your fal.ai API key to generate lip-sync videos.');
    }

    const { text, face = 'female', gender = 'woman' } = await req.json();
    const cleanText = sanitizeText(text);

    if (!cleanText) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const imageUrl = AVATAR_IMAGES[face as keyof typeof AVATAR_IMAGES];
    if (!imageUrl) {
      return new Response(JSON.stringify({ error: 'Avatar image URL not configured for this face' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`[LipSync] Generating for face=${face}, gender=${gender}, text="${cleanText.slice(0, 50)}..."`);

    // Step 1: Generate TTS audio
    console.log('[LipSync] Step 1: Generating TTS audio...');
    const audioBuffer = await generateTTSAudio(cleanText, gender as 'woman' | 'man', ELEVENLABS_API_KEY);
    console.log(`[LipSync] TTS audio generated: ${audioBuffer.byteLength} bytes`);

    // Step 2: Generate lip-sync video via Omnihuman
    console.log('[LipSync] Step 2: Generating lip-sync video via Omnihuman...');
    const { videoUrl, durationSeconds } = await generateLipsyncVideo(imageUrl, audioBuffer, FAL_KEY);
    console.log(`[LipSync] Video generated: ${videoUrl}`);

    return new Response(
      JSON.stringify({
        videoUrl,
        durationSeconds,
        text: cleanText,
        face,
        gender,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[LipSync] Error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
