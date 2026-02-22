/* ═══════════════════════════════════════════════
   IMPACT PAGE — GROWTH CHART
   Chart.js multi-line with milestone annotations
   ═══════════════════════════════════════════════ */

(function () {
  const canvas = document.getElementById('growthChart');
  if (!canvas) return;

  // ── Generate month labels Sept 2021 → Dec 2025 ──
  const labels = [];
  const startYear = 2021, startMonth = 8; // 0-indexed: 8 = Sept
  const endYear = 2025, endMonth = 11;    // 11 = Dec

  for (let y = startYear; y <= endYear; y++) {
    const mStart = (y === startYear) ? startMonth : 0;
    const mEnd   = (y === endYear)   ? endMonth   : 11;
    for (let m = mStart; m <= mEnd; m++) {
      const d = new Date(y, m, 1);
      labels.push(d.toLocaleString('default', { month: 'short' }) + ' ' + y.toString().slice(2));
    }
  }

  const total = labels.length; // 52 months

  // ── Helper: smooth ramp with noise ──
  function ramp(start, end, length, noiseAmt = 0) {
    return Array.from({ length }, (_, i) => {
      const base = start + (end - start) * (i / (length - 1));
      const noise = noiseAmt ? (Math.random() - 0.5) * noiseAmt : 0;
      return parseFloat((base + noise).toFixed(2));
    });
  }

  // ── Revenue ($k) — grows from ~$40k → ~$240k/mo ──
  const revenueData = [
    ...ramp(40, 58, 6, 4),    // Sept–Feb: slow start
    ...ramp(58, 95, 6, 6),    // Mar–Aug: first campaign ramp
    ...ramp(95, 140, 6, 8),   // Sept–Feb 2023: scaling
    ...ramp(140, 180, 6, 10), // Mar–Aug 2023: CRO kicks in
    ...ramp(180, 210, 6, 8),  // Sept–Feb 2024: stable growth
    ...ramp(210, 240, 6, 10), // Mar–Aug 2024: full funnel
    ...ramp(240, 255, 6, 6),  // Sept–Feb 2025: plateau + optimize
    ...ramp(255, 270, 10, 8), // Mar–Dec 2025: continued growth
  ];

  // ── ROAS — grows from 1.1x → 4.2x with dips ──
  const roasData = [
    ...ramp(1.1, 1.4, 6, 0.1),
    ...ramp(1.4, 2.2, 6, 0.15),
    ...ramp(2.2, 2.8, 6, 0.12),
    ...ramp(2.8, 3.5, 6, 0.1),
    ...ramp(3.5, 3.8, 6, 0.08),
    ...ramp(3.8, 4.2, 6, 0.1),
    ...ramp(4.2, 4.0, 6, 0.08),
    ...ramp(4.0, 4.2, 10, 0.06),
  ];

  // ── Monthly Conversions — grows 180 → 1,400 ──
  const convData = [
    ...ramp(180, 260, 6, 20),
    ...ramp(260, 420, 6, 30),
    ...ramp(420, 620, 6, 40),
    ...ramp(620, 880, 6, 50),
    ...ramp(880, 1050, 6, 40),
    ...ramp(1050, 1200, 6, 50),
    ...ramp(1200, 1300, 6, 30),
    ...ramp(1300, 1420, 10, 40),
  ];

  // Trim/pad to total
  const trim = (arr) => arr.slice(0, total);

  // ── Milestone annotations ──
  // Each annotation: { labelIndex, text, yDataset (0=rev,1=roas,2=conv) }
  const milestones = [
    { labelIndex: 0,  text: '▶ Joined — full account audit',    side: 'top'    },
    { labelIndex: 12, text: '⚙ Campaign restructure complete',  side: 'bottom' },
    { labelIndex: 24, text: '🚀 CRO program launched',          side: 'top'    },
    { labelIndex: 40, text: '📈 Full-funnel system operating',   side: 'bottom' },
  ];

  // ── Accent colour ──
  const accent   = '#F2A53B';
  const blue     = '#4A90D9';
  const green    = '#3DB87A';
  const gridCol  = 'rgba(54, 69, 79, 0.08)';
  const textMuted= '#5a7080';

  // ── Custom annotation plugin (drawn on canvas) ──
  const annotationPlugin = {
    id: 'milestoneAnnotations',
    afterDraw(chart) {
      const ctx   = chart.ctx;
      const xAxis = chart.scales.x;
      const yAxis = chart.scales['y-revenue'];

      milestones.forEach(m => {
        const x   = xAxis.getPixelForTick(m.labelIndex);
        const yTop = yAxis.top;
        const yBot = yAxis.bottom;

        if (x === undefined) return;

        // Vertical dashed line
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(242, 165, 59, 0.5)';
        ctx.lineWidth   = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, yTop);
        ctx.lineTo(x, yBot);
        ctx.stroke();
        ctx.restore();

        // Text box
        ctx.save();
        const isTop  = m.side === 'top';
        const boxY   = isTop ? yTop + 12 : yBot - 48;
        const text   = m.text;
        const pad    = 8;
        const fSize  = 11;
        ctx.font = `600 ${fSize}px Inter, sans-serif`;
        const tw = ctx.measureText(text).width;
        const bx = Math.min(Math.max(x - tw / 2 - pad, 4), chart.width - tw - pad * 2 - 4);

        // Box bg
        ctx.fillStyle = 'rgba(245, 244, 241, 0.96)';
        const radius = 5;
        const bw = tw + pad * 2;
        const bh = fSize + pad * 1.5;
        ctx.beginPath();
        ctx.moveTo(bx + radius, boxY);
        ctx.lineTo(bx + bw - radius, boxY);
        ctx.quadraticCurveTo(bx + bw, boxY, bx + bw, boxY + radius);
        ctx.lineTo(bx + bw, boxY + bh - radius);
        ctx.quadraticCurveTo(bx + bw, boxY + bh, bx + bw - radius, boxY + bh);
        ctx.lineTo(bx + radius, boxY + bh);
        ctx.quadraticCurveTo(bx, boxY + bh, bx, boxY + bh - radius);
        ctx.lineTo(bx, boxY + radius);
        ctx.quadraticCurveTo(bx, boxY, bx + radius, boxY);
        ctx.closePath();
        ctx.fill();

        // Box border
        ctx.strokeStyle = 'rgba(242, 165, 59, 0.4)';
        ctx.lineWidth   = 1;
        ctx.setLineDash([]);
        ctx.stroke();

        // Text
        ctx.fillStyle = '#1a2329';
        ctx.fillText(text, bx + pad, boxY + fSize + (pad * 0.75) - 1);
        ctx.restore();
      });
    }
  };

  Chart.register(annotationPlugin);

  // ── Tick count: show every 6th label ──
  const maxTicks = Math.ceil(total / 6);

  new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label:          'Revenue ($k)',
          data:           trim(revenueData),
          yAxisID:        'y-revenue',
          borderColor:    accent,
          backgroundColor:'rgba(242, 165, 59, 0.08)',
          borderWidth:    2.5,
          pointRadius:    0,
          pointHoverRadius: 5,
          tension:        0.4,
          fill:           true,
        },
        {
          label:          'ROAS',
          data:           trim(roasData),
          yAxisID:        'y-roas',
          borderColor:    blue,
          backgroundColor:'transparent',
          borderWidth:    2,
          pointRadius:    0,
          pointHoverRadius: 5,
          tension:        0.4,
          fill:           false,
          borderDash:     [6, 3],
        },
        {
          label:          'Monthly Conversions',
          data:           trim(convData),
          yAxisID:        'y-conversions',
          borderColor:    green,
          backgroundColor:'transparent',
          borderWidth:    2,
          pointRadius:    0,
          pointHoverRadius: 5,
          tension:        0.4,
          fill:           false,
        },
      ],
    },
    options: {
      responsive:          true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(245, 244, 241, 0.97)',
          titleColor:      '#1a2329',
          bodyColor:       '#5a7080',
          borderColor:     'rgba(54, 69, 79, 0.12)',
          borderWidth:     1,
          padding:         12,
          callbacks: {
            label(ctx) {
              const ds = ctx.dataset.label;
              const v  = ctx.parsed.y;
              if (ds.includes('Revenue'))     return `  Revenue: $${v.toFixed(0)}k/mo`;
              if (ds.includes('ROAS'))        return `  ROAS: ${v.toFixed(2)}x`;
              if (ds.includes('Conversions')) return `  Conversions: ${Math.round(v)}/mo`;
              return ctx.formattedValue;
            }
          }
        },
      },
      scales: {
        x: {
          ticks: {
            color:    textMuted,
            font:     { size: 11, family: 'Inter, sans-serif' },
            maxRotation: 45,
            maxTicksLimit: maxTicks,
            autoSkip: true,
          },
          grid: { color: gridCol, drawBorder: false },
        },
        'y-revenue': {
          type:     'linear',
          position: 'left',
          ticks: {
            color: accent,
            font:  { size: 11, family: 'Inter, sans-serif' },
            callback: (v) => `$${v}k`,
          },
          grid: { color: gridCol, drawBorder: false },
          title: {
            display: true, text: 'Revenue ($k)',
            color: accent, font: { size: 11, weight: '600', family: 'Inter, sans-serif' },
          },
        },
        'y-roas': {
          type:     'linear',
          position: 'right',
          ticks: {
            color: blue,
            font:  { size: 11, family: 'Inter, sans-serif' },
            callback: (v) => `${v.toFixed(1)}x`,
          },
          grid:  { drawOnChartArea: false },
          title: {
            display: true, text: 'ROAS',
            color: blue, font: { size: 11, weight: '600', family: 'Inter, sans-serif' },
          },
        },
        'y-conversions': {
          type:     'linear',
          position: 'right',
          ticks: {
            color: green,
            font:  { size: 11, family: 'Inter, sans-serif' },
            callback: (v) => `${Math.round(v)}`,
          },
          grid:  { drawOnChartArea: false },
          offset: true,
          title: {
            display: true, text: 'Conversions',
            color: green, font: { size: 11, weight: '600', family: 'Inter, sans-serif' },
          },
        },
      },
    },
  });
})();
