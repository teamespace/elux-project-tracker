<template>
  <div class="kpi-strip">

    <!-- Card 1: Open Tasks -->
    <div class="kpi-cell">
      <div class="kpi-header">
        <div class="kpi-header-left">
          <div class="kpi-icon kpi-icon-blue">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </div>
          <span class="kpi-label">Open Tasks</span>
        </div>
        <button class="kpi-info-btn">i</button>
      </div>
      <div class="kpi-num-row">
        <span class="kpi-number">42</span>
        <span class="kpi-delta up">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5l7 7H5l7-7z"/></svg>
          12%
        </span>
        <span class="kpi-delta-label">vs last week</span>
      </div>
      <div style="flex:1"></div>
      <div class="kpi-progress">
        <div class="kpi-progress-fill" style="width:68%;background:#22C55E"></div>
      </div>
      <div class="kpi-caption" style="margin-bottom:2px">68% of weekly target complete</div>
    </div>

    <!-- Card 2: At Risk -->
    <div class="kpi-cell">
      <div class="kpi-header">
        <div class="kpi-header-left">
          <div class="kpi-icon kpi-icon-red">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <span class="kpi-label">At Risk</span>
        </div>
        <button class="kpi-info-btn">i</button>
      </div>
      <div class="kpi-num-row">
        <span class="kpi-number" style="color:#DC2626">7</span>
        <span class="kpi-delta up" style="color:#DC2626">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 19l7-7H5l7 7z"/></svg>
          3
        </span>
        <span class="kpi-delta-label">fewer this week</span>
      </div>
      <div class="kpi-mini-bars">
        <div class="kpi-mini-bar-row">
          <span class="kpi-mini-bar-label">Overdue</span>
          <div class="kpi-mini-bar-track">
            <div class="kpi-mini-bar-fill" style="width:71%;background:#EF4444"></div>
          </div>
          <span class="kpi-mini-bar-val">5</span>
        </div>
        <div class="kpi-mini-bar-row">
          <span class="kpi-mini-bar-label">Blocked</span>
          <div class="kpi-mini-bar-track">
            <div class="kpi-mini-bar-fill" style="width:29%;background:#F59E0B"></div>
          </div>
          <span class="kpi-mini-bar-val">2</span>
        </div>
      </div>
    </div>

    <!-- Card 3: Due This Week -->
    <div class="kpi-cell kpi-has-chart">
      <div class="kpi-header">
        <div class="kpi-header-left">
          <div class="kpi-icon kpi-icon-amber">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <span class="kpi-label">Due This Week</span>
        </div>
        <button class="kpi-info-btn">i</button>
      </div>
      <div class="kpi-num-row">
        <span class="kpi-number">11</span>
        <span class="kpi-delta up">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5l7 7H5l7-7z"/></svg>
          5%
        </span>
        <span class="kpi-delta-label">vs last month</span>
      </div>
      <div class="kpi-chart-full">
        <svg viewBox="0 0 300 58" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lgFull" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#22C55E" stop-opacity="0.1"/>
              <stop offset="100%" stop-color="#22C55E" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <line x1="0" y1="32" x2="300" y2="32" stroke="#F3F4F6" stroke-dasharray="5 4" stroke-width="1"/>
          <path d="M 0,48 C 25,46 35,42 60,44 C 85,46 95,36 120,32 C 145,28 155,36 180,30 C 205,24 215,18 240,20 L 300,16 L 300,58 L 0,58 Z" fill="url(#lgFull)"/>
          <path d="M 0,48 C 25,46 35,42 60,44 C 85,46 95,36 120,32 C 145,28 155,36 180,30 C 205,24 215,18 240,20 L 300,16" stroke="#22C55E" stroke-width="1.5" stroke-linecap="round" fill="none"/>
          <circle cx="240" cy="20" r="3.5" fill="#22C55E" stroke="white" stroke-width="2"/>
        </svg>
      </div>
    </div>

    <!-- Card 4: Completion Rate -->
    <div class="kpi-cell">
      <div class="kpi-header">
        <div class="kpi-header-left">
          <div class="kpi-icon kpi-icon-green">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <span class="kpi-label">Completion Rate</span>
        </div>
        <button class="kpi-info-btn">i</button>
      </div>
      <div class="kpi-completion-body">
        <div class="kpi-completion-left">
          <span class="kpi-pct-big">72%</span>
          <div style="display:flex;align-items:center;gap:4px;margin-top:4px">
            <span class="kpi-delta up">↑ 8%</span>
            <span class="kpi-delta-label">this week</span>
          </div>
        </div>
        <div class="kpi-stacked" style="flex:1">
          <div class="kpi-stacked-track">
            <div class="kpi-stacked-seg" style="flex:72;background:#22C55E;border-radius:4px 0 0 4px"></div>
            <div class="kpi-stacked-seg" style="flex:21;background:#3B82F6"></div>
            <div class="kpi-stacked-seg" style="flex:7;background:#F59E0B;border-radius:0 4px 4px 0"></div>
          </div>
          <div class="kpi-stacked-labels" style="margin-top:8px">
            <div class="kpi-stacked-lbl">
              <span class="kpi-stacked-lbl-val" style="color:#16A34A">28</span>
              <span class="kpi-stacked-lbl-text">Done</span>
            </div>
            <div class="kpi-stacked-lbl">
              <span class="kpi-stacked-lbl-val" style="color:#2563EB">9</span>
              <span class="kpi-stacked-lbl-text">Active</span>
            </div>
            <div class="kpi-stacked-lbl">
              <span class="kpi-stacked-lbl-val" style="color:#D97706">5</span>
              <span class="kpi-stacked-lbl-text">At Risk</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div><!-- /kpi-strip -->
</template>
