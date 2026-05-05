/**
 * AudioWorkletProcessor for PCM conversion.
 * 
 * Takes Float32 samples from the microphone and converts them to
 * 16-bit PCM (Int16) for real-time streaming to Gemini.
 */
class PCMProcessor extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input.length > 0) {
      // Mono input
      const float32 = input[0];
      const int16 = new Int16Array(float32.length);

      for (let i = 0; i < float32.length; i++) {
        const s = Math.max(-1, Math.min(1, float32[i]));
        int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }

      // Send the Int16 buffer back to the main thread
      this.port.postMessage(int16.buffer, [int16.buffer]);
    }
    return true;
  }
}

registerProcessor('pcm-processor', PCMProcessor);
