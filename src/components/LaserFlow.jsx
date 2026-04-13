import React, { useEffect, useRef } from 'react';

const hexToRgb = (hex) => ({
  r: parseInt(hex.slice(1, 3), 16),
  g: parseInt(hex.slice(3, 5), 16),
  b: parseInt(hex.slice(5, 7), 16),
});

const LaserFlow = ({
  color = '#5d0404',
  wispDensity = 1,
  flowSpeed = 0.35,
  verticalSizing = 2,
  horizontalSizing = 0.5,
  fogIntensity = 0.45,
  fogScale = 0.3,
  wispSpeed = 15,
  wispIntensity = 5,
  flowStrength = 0.25,
  decay = 1.1,
  horizontalBeamOffset = 0,
  verticalBeamOffset = -0.5,
}) => {
  const canvasRef = useRef(null);
  const stateRef = useRef({ animId: null, time: 0, wisps: [] });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = stateRef.current;
    const rgb = hexToRgb(color);

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const wispCount = Math.max(8, Math.floor(20 * wispDensity));
    state.wisps = Array.from({ length: wispCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0008 * flowSpeed,
      vy: (Math.random() - 0.5) * 0.0005 * flowSpeed,
      size: 40 + Math.random() * 100,
      opacity: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      speed: wispSpeed * (0.4 + Math.random() * 0.8),
    }));

    const draw = () => {
      const { wisps } = state;
      const t = state.time;
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // Fog background
      const fogGrad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * fogScale * 2.5);
      fogGrad.addColorStop(0, `rgba(${Math.min(rgb.r * 2, 80)}, ${rgb.g}, ${rgb.b}, ${fogIntensity * 0.5})`);
      fogGrad.addColorStop(0.6, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${fogIntensity * 0.15})`);
      fogGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, 0, W, H);

      // Central beam position
      const beamY = H * (0.5 + verticalBeamOffset * 0.5);
      const beamX = W * (0.5 + horizontalBeamOffset * 0.5);

      // Wide horizontal glow
      const beamH = H * verticalSizing * 0.12;
      const beamGrad = ctx.createLinearGradient(0, beamY - beamH * 2, 0, beamY + beamH * 2);
      beamGrad.addColorStop(0, 'rgba(0,0,0,0)');
      beamGrad.addColorStop(0.4, `rgba(${Math.min(rgb.r * 3, 180)}, ${rgb.g * 2}, ${rgb.b * 2}, ${flowStrength * 0.5})`);
      beamGrad.addColorStop(0.5, `rgba(${Math.min(rgb.r * 4, 210)}, ${rgb.g * 3}, ${rgb.b * 3}, ${flowStrength * 0.8})`);
      beamGrad.addColorStop(0.6, `rgba(${Math.min(rgb.r * 3, 180)}, ${rgb.g * 2}, ${rgb.b * 2}, ${flowStrength * 0.5})`);
      beamGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = beamGrad;
      ctx.fillRect(0, beamY - beamH * 2, W, beamH * 4);

      // Animated scan line on beam
      const scanT = t * 0.004 * flowSpeed;
      const lineGrad = ctx.createLinearGradient(0, 0, W, 0);
      lineGrad.addColorStop(0, 'rgba(0,0,0,0)');
      lineGrad.addColorStop(Math.max(0, 0.3 + 0.25 * Math.sin(scanT)), `rgba(${Math.min(rgb.r * 6, 255)}, ${rgb.g * 3}, ${rgb.b * 3}, 0.7)`);
      lineGrad.addColorStop(Math.min(1, 0.5 + 0.2 * Math.cos(scanT * 0.8)), `rgba(255, ${rgb.g * 2}, ${rgb.b * 2}, 0.95)`);
      lineGrad.addColorStop(Math.min(1, 0.7 + 0.15 * Math.sin(scanT * 1.2)), `rgba(${Math.min(rgb.r * 6, 255)}, ${rgb.g * 3}, ${rgb.b * 3}, 0.7)`);
      lineGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.save();
      ctx.shadowBlur = 24;
      ctx.shadowColor = `rgba(${Math.min(rgb.r * 5, 255)}, 0, 0, 0.9)`;
      ctx.beginPath();
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 2;
      ctx.moveTo(0, beamY);
      ctx.lineTo(W, beamY);
      ctx.stroke();
      ctx.restore();

      // Secondary thinner line
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255, ${rgb.g * 2}, ${rgb.b * 2}, 0.3)`;
      ctx.lineWidth = 1;
      ctx.moveTo(0, beamY - 4);
      ctx.lineTo(W, beamY - 4);
      ctx.stroke();

      // Wisps
      wisps.forEach((wisp) => {
        wisp.x += wisp.vx + Math.sin(t * 0.008 * wisp.speed * 0.1 + wisp.phase) * 0.0012 * flowSpeed;
        wisp.y += wisp.vy + Math.cos(t * 0.006 * wisp.speed * 0.1 + wisp.phase) * 0.0008 * flowSpeed;
        if (wisp.x < -0.15) wisp.x = 1.15;
        if (wisp.x > 1.15) wisp.x = -0.15;
        if (wisp.y < -0.15) wisp.y = 1.15;
        if (wisp.y > 1.15) wisp.y = -0.15;

        const wx = wisp.x * W;
        const wy = wisp.y * H;
        const baseSize = wisp.size * wispIntensity * 0.12;
        const rw = baseSize * Math.max(0.3, 1 - Math.abs(wisp.y - 0.5) * 0.8);
        const rh = rw / Math.max(1, 1 / horizontalSizing);

        const wg = ctx.createRadialGradient(wx, wy, 0, wx, wy, rw);
        wg.addColorStop(0, `rgba(${Math.min(rgb.r * 4, 220)}, ${rgb.g * 2}, ${rgb.b * 2}, ${wisp.opacity * 0.5})`);
        wg.addColorStop(0.4, `rgba(${rgb.r * 2}, ${rgb.g}, ${rgb.b}, ${wisp.opacity * 0.2})`);
        wg.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.save();
        ctx.scale(horizontalSizing, 1);
        ctx.fillStyle = wg;
        ctx.beginPath();
        ctx.ellipse(wx / horizontalSizing, wy, rw / horizontalSizing, rh, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Vertical center accent
      const vGrad = ctx.createLinearGradient(beamX - W * 0.08, 0, beamX + W * 0.08, 0);
      vGrad.addColorStop(0, 'rgba(0,0,0,0)');
      vGrad.addColorStop(0.5, `rgba(${Math.min(rgb.r * 3, 160)}, ${rgb.g}, ${rgb.b}, ${flowStrength * 0.25})`);
      vGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = vGrad;
      ctx.fillRect(beamX - W * 0.08, 0, W * 0.16, H);

      state.time += 1;
      state.animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(state.animId);
      ro.disconnect();
    };
  }, [color, wispDensity, flowSpeed, verticalSizing, horizontalSizing, fogIntensity, fogScale, wispSpeed, wispIntensity, flowStrength, horizontalBeamOffset, verticalBeamOffset]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  );
};

export default LaserFlow;
