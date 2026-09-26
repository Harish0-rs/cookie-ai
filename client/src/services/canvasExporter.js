/**
 * Canvas Video Exporter using HTML5 Canvas & MediaRecorder
 * Records synchronized video background, voiceover audio, background music,
 * and word-highlighted captions directly in the browser!
 */

export async function exportVideoFromCanvas({
  videoElement,
  voiceAudioElement,
  musicAudioElement,
  words,
  captionStyle,
  duration,
  onProgress
}) {
  return new Promise(async (resolve, reject) => {
    try {
      const width = 720;
      const height = 1280;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // Set up AudioContext for mixing
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      const dest = audioCtx.createMediaStreamDestination();

      if (voiceAudioElement) {
        try {
          const voiceSource = audioCtx.createMediaElementSource(voiceAudioElement);
          voiceSource.connect(dest);
          voiceSource.connect(audioCtx.destination);
        } catch (e) {
          // Already connected in some cases
        }
      }

      if (musicAudioElement) {
        try {
          const musicSource = audioCtx.createMediaElementSource(musicAudioElement);
          musicSource.connect(dest);
          musicSource.connect(audioCtx.destination);
        } catch (e) {
          // Already connected
        }
      }

      const canvasStream = canvas.captureStream(30);
      // Combine video stream with mixed audio tracks
      dest.stream.getAudioTracks().forEach(track => canvasStream.addTrack(track));

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const recorder = new MediaRecorder(canvasStream, {
        mimeType,
        videoBitsPerSecond: 4000000
      });

      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        resolve({ url, blob, mimeType });
      };

      // Reset playback
      if (videoElement) {
        videoElement.currentTime = 0;
        videoElement.play();
      }
      if (voiceAudioElement) {
        voiceAudioElement.currentTime = 0;
        voiceAudioElement.play();
      }
      if (musicAudioElement) {
        musicAudioElement.currentTime = 0;
        musicAudioElement.play();
      }

      recorder.start();

      const startTime = performance.now();
      const totalMs = (duration || 10) * 1000;

      function renderFrame() {
        const elapsed = performance.now() - startTime;
        const currentSec = elapsed / 1000.0;
        const progressPct = Math.min(100, Math.round((elapsed / totalMs) * 100));

        if (onProgress) onProgress(progressPct);

        // 1. Draw video background
        if (videoElement && videoElement.readyState >= 2) {
          // Fill 9:16 aspect ratio
          const vWidth = videoElement.videoWidth || 720;
          const vHeight = videoElement.videoHeight || 1280;
          const targetRatio = width / height;
          const videoRatio = vWidth / vHeight;

          let sx, sy, sWidth, sHeight;
          if (videoRatio > targetRatio) {
            sHeight = vHeight;
            sWidth = vHeight * targetRatio;
            sx = (vWidth - sWidth) / 2;
            sy = 0;
          } else {
            sWidth = vWidth;
            sHeight = vWidth / targetRatio;
            sx = 0;
            sy = (vHeight - sHeight) / 2;
          }
          ctx.drawImage(videoElement, sx, sy, sWidth, sHeight, 0, 0, width, height);
        } else {
          ctx.fillStyle = '#0B0C10';
          ctx.fillRect(0, 0, width, height);
        }

        // 2. Draw styled subtitles with active word highlight
        if (words && words.length > 0) {
          drawCaptions(ctx, words, currentSec, captionStyle, width, height);
        }

        if (elapsed < totalMs) {
          requestAnimationFrame(renderFrame);
        } else {
          recorder.stop();
          if (videoElement) videoElement.pause();
          if (voiceAudioElement) voiceAudioElement.pause();
          if (musicAudioElement) musicAudioElement.pause();
        }
      }

      requestAnimationFrame(renderFrame);
    } catch (err) {
      reject(err);
    }
  });
}

export function drawCaptions(ctx, words, currentSec, style = {}, width = 720, height = 1280) {
  const wordsPerLine = style.words_per_line || 3;
  const uppercase = style.uppercase !== false;
  const primaryColor = style.primary_color || '#FFFFFF';
  const highlightColor = style.highlight_color || '#FFE500';
  const strokeColor = style.stroke_color || '#000000';
  const strokeWidth = style.stroke_width || 4;
  const yOffsetPct = style.y_offset_pct || 55;

  // Find active word
  let activeIndex = -1;
  for (let i = 0; i < words.length; i++) {
    if (currentSec >= words[i].start && currentSec <= words[i].end) {
      activeIndex = i;
      break;
    }
  }

  if (activeIndex === -1) {
    // If between words or before/after, find nearest recent
    for (let i = words.length - 1; i >= 0; i--) {
      if (currentSec >= words[i].end && (i === words.length - 1 || currentSec < words[i + 1].start)) {
        activeIndex = i;
        break;
      }
    }
  }

  if (activeIndex === -1) return;

  // Determine current active chunk of words
  const chunkStart = Math.floor(activeIndex / wordsPerLine) * wordsPerLine;
  const chunk = words.slice(chunkStart, chunkStart + wordsPerLine);

  ctx.save();

  // Typography settings
  const fontSize = 54;
  const fontFam = style.font_family?.includes('Montserrat')
    ? 'Montserrat, sans-serif'
    : style.font_family?.includes('Bebas')
    ? '"Bebas Neue", sans-serif'
    : 'Impact, sans-serif';

  ctx.font = `900 ${fontSize}px ${fontFam}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const centerY = height * (yOffsetPct / 100);

  // Measure word widths to layout horizontally
  const renderedWords = chunk.map((wItem, idx) => {
    const rawWord = uppercase ? wItem.word.toUpperCase() : wItem.word;
    const isHighlighted = (chunkStart + idx) === activeIndex;
    const metrics = ctx.measureText(rawWord + ' ');
    return {
      text: rawWord,
      isHighlighted,
      width: metrics.width
    };
  });

  const totalWidth = renderedWords.reduce((sum, w) => sum + w.width, 0);
  let startX = (width - totalWidth) / 2;

  // Render each word
  renderedWords.forEach((item) => {
    const wordCenterX = startX + (item.width / 2);

    ctx.save();
    if (item.isHighlighted) {
      // Dynamic scale pop effect
      ctx.translate(wordCenterX, centerY);
      ctx.scale(1.12, 1.12);
      ctx.translate(-wordCenterX, -centerY);
      ctx.fillStyle = highlightColor;
    } else {
      ctx.fillStyle = primaryColor;
    }

    // Heavy outline stroke
    ctx.lineWidth = strokeWidth * 2;
    ctx.strokeStyle = strokeColor;
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;
    ctx.strokeText(item.text, wordCenterX, centerY);

    // Drop shadow
    ctx.shadowColor = 'rgba(0,0,0,0.85)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // Fill word text
    ctx.fillText(item.text, wordCenterX, centerY);
    ctx.restore();

    startX += item.width;
  });

  ctx.restore();
}
