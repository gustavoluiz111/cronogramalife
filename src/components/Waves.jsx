import React, { useEffect, useRef } from 'react';

const Waves = ({
  lineColor = '#770303',
  backgroundColor = 'transparent',
  waveSpeedX = 0.02,
  waveSpeedY = 0.01,
  waveAmpX = 40,
  waveAmpY = 20,
  friction = 0.9,
  tension = 0.01,
  maxCursorMove = 120,
  xGap = 12,
  yGap = 36,
}) => {
  const canvasRef = useRef(null);
  const stateRef = useRef({ mouse: { x: -9999, y: -9999 }, time: 0, animId: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = stateRef.current;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMouseMove = (e) => {
      const r = canvas.getBoundingClientRect();
      state.mouse.x = e.clientX - r.left;
      state.mouse.y = e.clientY - r.top;
    };
    window.addEventListener('mousemove', onMouseMove);

    const draw = () => {
      const { mouse, time } = state;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const rows = Math.ceil(canvas.height / yGap) + 2;
      const cols = Math.ceil(canvas.width / xGap) + 2;

      for (let r = 0; r < rows; r++) {
        const baseY = r * yGap;
        ctx.beginPath();
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 0.9;
        ctx.globalAlpha = 0.18 + (r / rows) * 0.45;

        for (let c = 0; c < cols; c++) {
          const x = c * xGap;
          const dx = x - mouse.x;
          const dy = baseY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influence = Math.max(0, 1 - dist / maxCursorMove);

          const wave =
            Math.sin(c * 0.35 + time * waveSpeedX * 55 + r * 0.55) * waveAmpY * 0.65 +
            Math.cos(r * 0.42 + time * waveSpeedY * 55) * waveAmpX * 0.3;
          const cursorPush = influence * (-dy / Math.max(dist, 1)) * 28;

          const py = baseY + wave + cursorPush;
          c === 0 ? ctx.moveTo(x, py) : ctx.lineTo(x, py);
        }
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      state.time += 1;
      state.animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(state.animId);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [lineColor, backgroundColor, waveSpeedX, waveSpeedY, waveAmpX, waveAmpY, xGap, yGap, maxCursorMove]);

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

export default Waves;
