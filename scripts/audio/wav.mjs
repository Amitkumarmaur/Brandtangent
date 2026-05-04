// Minimal RIFF/WAVE writer for raw PCM16 mono/stereo buffers.
// Saves a dependency vs. the `wav` package.

export function pcm16ToWav(pcm, { sampleRate, channels = 1 }) {
  const dataSize = pcm.length;
  const buffer = Buffer.alloc(44 + dataSize);
  let o = 0;

  buffer.write("RIFF", o); o += 4;
  buffer.writeUInt32LE(36 + dataSize, o); o += 4;
  buffer.write("WAVE", o); o += 4;
  buffer.write("fmt ", o); o += 4;
  buffer.writeUInt32LE(16, o); o += 4;            // fmt chunk size
  buffer.writeUInt16LE(1, o); o += 2;             // PCM
  buffer.writeUInt16LE(channels, o); o += 2;
  buffer.writeUInt32LE(sampleRate, o); o += 4;
  buffer.writeUInt32LE(sampleRate * channels * 2, o); o += 4; // byte rate
  buffer.writeUInt16LE(channels * 2, o); o += 2;  // block align
  buffer.writeUInt16LE(16, o); o += 2;            // bits per sample
  buffer.write("data", o); o += 4;
  buffer.writeUInt32LE(dataSize, o); o += 4;

  pcm.copy(buffer, o);
  return buffer;
}
