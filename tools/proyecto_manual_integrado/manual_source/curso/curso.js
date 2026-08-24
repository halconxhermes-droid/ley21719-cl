/* ============================================================
   Mini curso Ley 21.719 — SPA principal
   ============================================================ */
'use strict';

const STATE_KEY = 'curso_app_v1';
const THEME_KEY = 'curso_theme_v1';
const EXAM_THRESHOLD = 0.8;
const EXAM_QUESTIONS = 20;

/* -------------------- Datos cargados dinámicamente -------------------- */
let MODULOS = null;
let PREGUNTAS = null;
let EXAMEN_BANCO = null;

/* -------------------- Estado -------------------- */
function defaultState() {
  return {
    version: 1,
    usuario: { nombre: '', empresa: '' },
    progreso: {},
    examen: { intentos: 0, mejorScore: 0, aprobado: false, preguntas: [], respuestas: [], ts: null },
    auditoria: { industria: '', respuestas: {} },
    actualizado: null,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return defaultState();
    const s = JSON.parse(raw);
    if (!s.version) return defaultState();
    return Object.assign(defaultState(), s);
  } catch (e) {
    return defaultState();
  }
}

function saveState() {
  state.actualizado = new Date().toISOString();
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch (e) { /* ignore */ }
}

let state = loadState();

function resetState() {
  if (!confirm('¿Borrar todo el progreso del curso? Esta acción no se puede deshacer.')) return;
  state = defaultState();
  saveState();
  route();
  showToast('Progreso reiniciado', 'success');
}

/* -------------------- Tema (dark mode) -------------------- */
function applyTheme() {
  const theme = localStorage.getItem(THEME_KEY) || 'light';
  document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') || 'light';
  const next = cur === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
  syncThemeIcons(next);
}

function syncThemeIcons(theme) {
  const icon = theme === 'light' ? '🌙' : '☀️';
  document.querySelectorAll('.curso-theme-toggle').forEach(b => { b.textContent = icon; });
}

/* -------------------- Routing -------------------- */
function getRoute() {
  const h = (location.hash || '').replace(/^#\/?/, '');
  if (!h) return { name: 'intro', id: 'm0' };
  const parts = h.split('/');
  if (parts[0] === 'm' && parts[1]) return { name: 'modulo', id: 'm' + parts[1] };
  if (parts[0] === 'examen') return { name: 'examen' };
  if (parts[0] === 'cert') return { name: 'cert' };
  if (parts[0] === 'audit') return { name: 'audit' };
  return { name: 'intro', id: 'm0' };
}

function navigate(hash) {
  if (location.hash === hash) {
    route();
  } else {
    location.hash = hash;
  }
}

function route() {
  const r = getRoute();
  const main = document.getElementById('cursoMain');
  if (!main) return;

  if (r.name === 'modulo') {
    const mod = (MODULOS.modulos || []).find(m => m.id === r.id);
    if (mod) {
      if (mod.tipo === 'intro') renderIntro(mod);
      else renderModulo(mod);
    } else {
      main.innerHTML = '<div class="curso-empty">Módulo no encontrado.</div>';
    }
  } else if (r.name === 'examen') {
    renderExamen();
  } else if (r.name === 'cert') {
    renderCertificado();
  } else if (r.name === 'audit') {
    renderAuditoria();
  } else {
    const intro = (MODULOS.modulos || []).find(m => m.id === 'm0');
    if (intro) renderIntro(intro);
    else main.innerHTML = '<div class="curso-empty">Cargando…</div>';
  }

  renderSidebar();
  highlightActiveNav();
  window.scrollTo(0, 0);
  if (typeof closeMobileSidebar === 'function') closeMobileSidebar();
}

/* -------------------- Sidebar -------------------- */
function progressPercent() {
  const mods = (MODULOS.modulos || []).filter(m => m.tipo === 'modulo');
  if (!mods.length) return 0;
  const done = mods.filter(m => state.progreso[m.id] && state.progreso[m.id].completado).length;
  return Math.round((done / mods.length) * 100);
}

function renderSidebar() {
  const list = document.getElementById('cursoNavList');
  if (!list) return;

  const mods = (MODULOS.modulos || []).filter(m => m.tipo !== 'intro');
  const intro = (MODULOS.modulos || []).find(m => m.id === 'm0');

  let html = '';
  if (intro) {
    const isActive = getRoute().id === 'm0';
    html += `<li><a class="curso-nav-item ${isActive ? 'active' : ''}" href="#/m/0">
      <span class="curso-nav-num">★</span><span class="curso-nav-text">${escapeHtml(intro.titulo)}</span>
    </a></li>`;
  }
  html += '<li class="curso-nav-sep">Módulos</li>';
  for (const m of mods) {
    const done = state.progreso[m.id] && state.progreso[m.id].completado;
    const isActive = getRoute().id === m.id;
    html += `<li><a class="curso-nav-item ${isActive ? 'active' : ''} ${done ? 'completed' : ''}" href="#/m/${m.num}">
      <span class="curso-nav-num">${done ? '✓' : m.num}</span>
      <span class="curso-nav-text">${escapeHtml(m.titulo)}</span>
    </a></li>`;
  }
  html += '<li class="curso-nav-sep">Evaluación</li>';
  const examDone = state.examen.aprobado;
  html += `<li><a class="curso-nav-item ${getRoute().name === 'examen' ? 'active' : ''} ${examDone ? 'completed' : ''}" href="#/examen">
    <span class="curso-nav-num">${examDone ? '✓' : 'E'}</span><span class="curso-nav-text">Examen final</span>
  </a></li>`;
  const certShown = examDone;
  html += `<li><a class="curso-nav-item ${getRoute().name === 'cert' ? 'active' : ''} ${certShown ? 'completed' : ''} ${!certShown ? 'locked' : ''}" href="${certShown ? '#/cert' : '#'}" ${certShown ? '' : 'onclick="event.preventDefault();showToast(\'Apruebe el examen para ver el certificado\',\'warn\');"'}>
    <span class="curso-nav-num">${examDone ? '✓' : '🔒'}</span><span class="curso-nav-text">Certificado</span>
  </a></li>`;
  html += `<li><a class="curso-nav-item ${getRoute().name === 'audit' ? 'active' : ''}" href="#/audit">
    <span class="curso-nav-num">🛠</span><span class="curso-nav-text">Auditoría web</span>
  </a></li>`;
  list.innerHTML = html;

  const bar = document.getElementById('cursoProgressBar');
  const pct = document.getElementById('cursoProgressPct');
  const userBox = document.getElementById('cursoUserBox');
  if (bar) bar.style.width = progressPercent() + '%';
  if (pct) pct.textContent = progressPercent() + '%';

  if (userBox) {
    const nombre = state.usuario.nombre || '';
    const empresa = state.usuario.empresa || '';
    userBox.innerHTML = `
      <label class="curso-field">
        <span>Nombre</span>
        <input type="text" id="userNombre" placeholder="Su nombre" value="${escapeAttr(nombre)}" maxlength="80">
      </label>
      <label class="curso-field">
        <span>Empresa (opcional)</span>
        <input type="text" id="userEmpresa" placeholder="Razón social" value="${escapeAttr(empresa)}" maxlength="80">
      </label>
    `;
    const n = document.getElementById('userNombre');
    const e = document.getElementById('userEmpresa');
    n.addEventListener('input', () => { state.usuario.nombre = n.value.trim(); saveState(); });
    e.addEventListener('input', () => { state.usuario.empresa = e.value.trim(); saveState(); });
  }
}

function highlightActiveNav() {
  document.querySelectorAll('.curso-nav-item').forEach(el => el.classList.remove('active'));
  const r = getRoute();
  let sel;
  if (r.name === 'modulo') sel = `.curso-nav-item[href="#/m/${r.id.replace('m','')}"]`;
  else if (r.name === 'examen') sel = `.curso-nav-item[href="#/examen"]`;
  else if (r.name === 'cert') sel = `.curso-nav-item[href="#/cert"]`;
  else if (r.name === 'audit') sel = `.curso-nav-item[href="#/audit"]`;
  if (sel) {
    const el = document.querySelector(sel);
    if (el) el.classList.add('active');
  }
}

/* -------------------- Render: Intro -------------------- */
function renderIntro(mod) {
  const main = document.getElementById('cursoMain');
  main.innerHTML = `
    <article class="curso-modulo">
      <div class="curso-eyebrow">Mini curso · ${escapeHtml(MODULOS.title || '')}</div>
      <h1 class="curso-h1">${escapeHtml(mod.titulo)}</h1>
      <p class="curso-lead">${escapeHtml(mod.lead)}</p>
      ${renderSecciones(mod.secciones)}
      <div class="curso-cta-row">
        <a class="curso-btn curso-btn-primary" href="#/m/1">Comenzar módulo 1 →</a>
        <a class="curso-btn" href="#/examen">Ir al examen final</a>
      </div>
    </article>
  `;
}

/* -------------------- Render: Módulo -------------------- */
function renderModulo(mod) {
  const main = document.getElementById('cursoMain');
  const prog = state.progreso[mod.id] || { score: 0, intentos: 0, completado: false, ts: null };
  const videoBlock = mod.video ? `
    <div class="curso-video-card" data-file="${escapeAttr(mod.video.file)}" data-thumb="${escapeAttr(mod.video.thumb || '')}" data-titulo="${escapeAttr(mod.video.titulo || mod.titulo)}" data-duracion="${escapeAttr(mod.video.duracion || '')}">
      <div class="curso-video-thumb">
        <img src="${escapeAttr(mod.video.thumb || '')}" alt="" loading="lazy" onerror="this.style.display='none'">
        <button class="curso-play-btn" aria-label="Reproducir video" type="button">▶</button>
        <div class="curso-video-meta">
          <span class="curso-video-duration">${escapeHtml(mod.video.duracion || '')}</span>
        </div>
      </div>
      <div class="curso-video-info">
        <div class="curso-video-eyebrow">Video del módulo</div>
        <h3 class="curso-video-title">${escapeHtml(mod.video.titulo || mod.titulo)}</h3>
      </div>
    </div>
  ` : '';

  main.innerHTML = `
    <article class="curso-modulo">
      <div class="curso-eyebrow">Módulo ${mod.num} · 8</div>
      <h1 class="curso-h1">${escapeHtml(mod.titulo)}</h1>
      <p class="curso-lead">${escapeHtml(mod.lead)}</p>
      ${videoBlock}
      ${renderSecciones(mod.secciones)}
      <div class="curso-quiz-wrap" id="cursoQuizWrap" data-modulo="${escapeAttr(mod.id)}">
        ${renderQuizIntro(mod, prog)}
      </div>
      <div class="curso-cta-row">
        ${mod.num > 1 ? `<a class="curso-btn" href="#/m/${mod.num - 1}">← Módulo ${mod.num - 1}</a>` : '<span></span>'}
        ${mod.num < 8 ? `<a class="curso-btn curso-btn-primary" href="#/m/${mod.num + 1}">Módulo ${mod.num + 1} →</a>` : `<a class="curso-btn curso-btn-primary" href="#/examen">Ir al examen →</a>`}
      </div>
    </article>
  `;

  // Attach video play handler
  const vc = main.querySelector('.curso-video-card');
  if (vc) vc.addEventListener('click', () => openVideo(vc.dataset.file, vc.dataset.titulo, vc.dataset.thumb));

  // Attach quiz start handler
  const startBtn = document.getElementById('cursoQuizStart');
  if (startBtn) startBtn.addEventListener('click', () => renderQuiz(mod, prog));
}

function renderSecciones(secciones) {
  if (!secciones || !secciones.length) return '';
  return secciones.map(s => {
    if (s.tipo === 'callout') {
      const v = s.variant || 'violet';
      const title = s.h3 ? `<h3>${escapeHtml(s.h3)}</h3>` : (s.titulo ? `<h3>${escapeHtml(s.titulo)}</h3>` : '');
      return `<div class="curso-callout curso-callout-${v}">
        ${title}
        ${s.html}
      </div>`;
    }
    const title = s.h3 ? `<h3>${escapeHtml(s.h3)}</h3>` : (s.titulo ? `<h3>${escapeHtml(s.titulo)}</h3>` : '');
    return `<div class="curso-section">
      ${title}
      ${s.html}
    </div>`;
  }).join('');
}

/* -------------------- Render: Quiz -------------------- */
function renderQuizIntro(mod, prog) {
  if (!prog.completado) {
    return `
      <div class="curso-quiz-card">
        <div class="curso-quiz-eyebrow">Quiz del módulo</div>
        <h2 class="curso-h2">Repase y valide su comprensión</h2>
        <p>5 preguntas mezclando opción múltiple, verdadero/falso, multi-selección y emparejamiento. Necesita <strong>4 de 5 correctas</strong> para completar el módulo.</p>
        <button class="curso-btn curso-btn-primary" id="cursoQuizStart" type="button">Iniciar quiz del módulo</button>
      </div>
    `;
  }
  return `
    <div class="curso-quiz-card">
      <div class="curso-quiz-eyebrow">Quiz del módulo · completado</div>
      <h2 class="curso-h2">Su mejor resultado: ${prog.score}/${prog.intentos ? '5' : '5'} · ${Math.round((prog.score / 5) * 100)}%</h2>
      <p>Intentos: ${prog.intentos}. Última vez: ${prog.ts ? new Date(prog.ts).toLocaleString('es-CL') : '—'}.</p>
      <button class="curso-btn" id="cursoQuizStart" type="button">Repetir quiz</button>
    </div>
  `;
}

function renderQuiz(mod, prog) {
  const wrap = document.getElementById('cursoQuizWrap');
  if (!wrap) return;
  const qs = (mod.quiz || []).map(id => PREGUNTAS.preguntas[id]).filter(Boolean);
  wrap.innerHTML = `
    <div class="curso-quiz-card">
      <div class="curso-quiz-eyebrow">Quiz · ${escapeHtml(mod.titulo)}</div>
      <h2 class="curso-h2">Responda las 5 preguntas</h2>
      <form id="cursoQuizForm" class="curso-quiz-form" autocomplete="off">
        ${qs.map((q, i) => renderPregunta(q, i)).join('')}
        <div class="curso-quiz-actions">
          <button type="submit" class="curso-btn curso-btn-primary">Enviar respuestas</button>
          <button type="button" class="curso-btn" id="cursoQuizCancel">Cancelar</button>
        </div>
      </form>
    </div>
  `;
  // Attach matching handlers
  wrap.querySelectorAll('.curso-matching').forEach(setupMatching);
  // Attach form submit
  document.getElementById('cursoQuizForm').addEventListener('submit', (ev) => {
    ev.preventDefault();
    submitModuloQuiz(mod, qs);
  });
  document.getElementById('cursoQuizCancel').addEventListener('click', () => renderModulo(mod));
}

function renderPregunta(q, idx) {
  const head = `<div class="curso-q-head"><span class="curso-q-num">Pregunta ${idx + 1}</span><span class="curso-q-tipo">${tipoLabel(q.tipo)}</span></div>`;
  const body = `<div class="curso-q-body">${escapeHtml(q.pregunta)}</div>`;
  let interact = '';
  if (q.tipo === 'mc') {
    interact = '<div class="curso-opts">' + q.opciones.map((opt, i) => `
      <label class="curso-opt">
        <input type="radio" name="q_${idx}" value="${i}">
        <span class="curso-opt-mark"></span>
        <span class="curso-opt-text">${escapeHtml(opt)}</span>
      </label>
    `).join('') + '</div>';
  } else if (q.tipo === 'vf') {
    interact = '<div class="curso-opts">' + [true, false].map((v, i) => `
      <label class="curso-opt">
        <input type="radio" name="q_${idx}" value="${i}">
        <span class="curso-opt-mark"></span>
        <span class="curso-opt-text">${v ? 'Verdadero' : 'Falso'}</span>
      </label>
    `).join('') + '</div>';
  } else if (q.tipo === 'multi') {
    interact = '<div class="curso-opts">' + q.opciones.map((opt, i) => `
      <label class="curso-opt curso-opt-multi">
        <input type="checkbox" name="q_${idx}" value="${i}">
        <span class="curso-opt-mark"></span>
        <span class="curso-opt-text">${escapeHtml(opt)}</span>
      </label>
    `).join('') + '</div>';
  } else if (q.tipo === 'matching') {
    interact = renderMatchingUI(q, idx);
  } else if (q.tipo === 'ordering') {
    interact = '<div class="curso-empty">Tipo ordering pendiente.</div>';
  }
  const feedback = `<div class="curso-q-feedback" data-idx="${idx}" hidden></div>`;
  return `<fieldset class="curso-q" data-idx="${idx}">${head}${body}${interact}${feedback}</fieldset>`;
}

function tipoLabel(t) {
  return ({
    mc: 'Opción múltiple',
    vf: 'Verdadero / Falso',
    multi: 'Multi-selección',
    matching: 'Emparejamiento',
    ordering: 'Ordenar',
  })[t] || t;
}

/* -------------------- Matching -------------------- */
function renderMatchingUI(q, idx) {
  const lefts = q.pares.map(p => p.izq);
  const rights = shuffle(q.pares.map(p => p.der));
  return `
    <div class="curso-matching" data-idx="${idx}">
      <div class="curso-match-cols">
        <div class="curso-match-col">
          <div class="curso-match-col-title">Concepto</div>
          ${lefts.map((l, i) => `<button type="button" class="curso-match-item" data-side="L" data-i="${i}">${escapeHtml(l)}</button>`).join('')}
        </div>
        <div class="curso-match-col">
          <div class="curso-match-col-title">Definición</div>
          ${rights.map((r, j) => `<button type="button" class="curso-match-item" data-side="R" data-i="${j}">${escapeHtml(r)}</button>`).join('')}
        </div>
      </div>
      <div class="curso-match-status">Empareje cada concepto con su definición. Click en un item a la izquierda y luego en uno a la derecha.</div>
    </div>
  `;
}

function setupMatching(el) {
  const state = { pickedL: null, pairs: [] };
  const itemsL = el.querySelectorAll('[data-side="L"]');
  const itemsR = el.querySelectorAll('[data-side="R"]');

  function clearSelection() {
    state.pickedL = null;
    itemsL.forEach(b => b.classList.remove('curso-match-picked'));
    itemsR.forEach(b => b.classList.remove('curso-match-picked'));
  }

  itemsL.forEach(b => {
    b.addEventListener('click', () => {
      if (b.classList.contains('curso-match-paired')) return;
      itemsL.forEach(x => x.classList.remove('curso-match-picked'));
      b.classList.add('curso-match-picked');
      state.pickedL = parseInt(b.dataset.i, 10);
    });
  });

  itemsR.forEach(b => {
    b.addEventListener('click', () => {
      if (b.classList.contains('curso-match-paired')) return;
      if (state.pickedL === null) {
        showToast('Primero seleccione un concepto a la izquierda', 'warn');
        return;
      }
      const rIdx = parseInt(b.dataset.i, 10);
      // Check if R already paired -> unpair (reassign)
      const existing = state.pairs.find(p => p.r === rIdx);
      if (existing) {
        existing.r = -1; // mark as unpaired; we'll re-attach
        const oldL = itemsL[existing.l];
        oldL.classList.remove('curso-match-paired', 'curso-match-correct', 'curso-match-wrong');
        oldL.textContent = oldL.textContent;
      }
      // Check if L already paired -> unpair
      const existingL = state.pairs.find(p => p.l === state.pickedL);
      if (existingL) {
        existingL.l = -1;
        const oldR = itemsR[existingL.r];
        oldR.classList.remove('curso-match-paired', 'curso-match-correct', 'curso-match-wrong');
      }
      // Add or update pair
      const found = state.pairs.find(p => p.l === state.pickedL && p.r === -1);
      if (found) {
        found.r = rIdx;
      } else {
        state.pairs = state.pairs.filter(p => p.l !== state.pickedL && p.r !== rIdx);
        state.pairs.push({ l: state.pickedL, r: rIdx });
      }
      const lBtn = itemsL[state.pickedL];
      const rBtn = itemsR[rIdx];
      lBtn.classList.remove('curso-match-picked');
      lBtn.classList.add('curso-match-paired');
      rBtn.classList.remove('curso-match-picked');
      rBtn.classList.add('curso-match-paired');
      state.pickedL = null;
      // Store as a hidden input for grading
      let input = el.querySelector(`input[name="q_match_${el.dataset.idx}"]`);
      if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = `q_match_${el.dataset.idx}`;
        el.appendChild(input);
      }
      input.value = JSON.stringify(state.pairs.filter(p => p.r !== -1));
    });
  });
}

/* -------------------- Submit módulo quiz -------------------- */
function submitModuloQuiz(mod, qs) {
  let correct = 0;
  qs.forEach((q, idx) => {
    const fb = document.querySelector(`.curso-q-feedback[data-idx="${idx}"]`);
    const fieldset = document.querySelector(`.curso-q[data-idx="${idx}"]`);
    let isCorrect = false;
    let userAnswer = null;

    if (q.tipo === 'mc' || q.tipo === 'vf') {
      const checked = fieldset.querySelector(`input[name="q_${idx}"]:checked`);
      if (checked) {
        userAnswer = parseInt(checked.value, 10);
        isCorrect = userAnswer === q.correcta;
      }
    } else if (q.tipo === 'multi') {
      const checked = fieldset.querySelectorAll(`input[name="q_${idx}"]:checked`);
      const sel = Array.from(checked).map(c => parseInt(c.value, 10)).sort();
      const cor = (q.correctas || []).slice().sort();
      isCorrect = sel.length === cor.length && sel.every((v, i) => v === cor[i]);
      userAnswer = sel;
    } else if (q.tipo === 'matching') {
      const input = fieldset.querySelector(`input[name="q_match_${idx}"]`);
      const pairs = input && input.value ? JSON.parse(input.value) : [];
      // q.pares is array; pair index i means izq=pares[i].izq must match with pares[i].der
      let matchedRight = 0;
      pairs.forEach(p => {
        if (p.l >= 0 && p.l < q.pares.length && p.r >= 0) {
          // Find the actual der value at index p.r in the shuffled order — but we don't know it.
          // We can recover it from the rendered button text.
          const rBtn = fieldset.querySelector(`[data-side="R"][data-i="${p.r}"]`);
          const rVal = rBtn ? rBtn.textContent.trim() : '';
          if (q.pares[p.l] && q.pares[p.l].der === rVal) matchedRight++;
        }
      });
      isCorrect = matchedRight === q.pares.length;
      userAnswer = pairs;
      // Visual feedback on pairs
      const itemsL = fieldset.querySelectorAll('[data-side="L"]');
      const itemsR = fieldset.querySelectorAll('[data-side="R"]');
      pairs.forEach(p => {
        if (p.l < 0 || p.r < 0) return;
        const lBtn = itemsL[p.l];
        const rBtn = itemsR[p.r];
        if (!lBtn || !rBtn) return;
        const rVal = rBtn.textContent.trim();
        if (q.pares[p.l] && q.pares[p.l].der === rVal) {
          lBtn.classList.add('curso-match-correct');
          rBtn.classList.add('curso-match-correct');
        } else {
          lBtn.classList.add('curso-match-wrong');
          rBtn.classList.add('curso-match-wrong');
        }
      });
    }

    if (isCorrect) correct++;

    if (fb) {
      fb.hidden = false;
      fb.className = 'curso-q-feedback ' + (isCorrect ? 'is-correct' : 'is-wrong');
      fb.innerHTML = `
        <div class="curso-q-feedback-icon">${isCorrect ? '✓' : '✗'}</div>
        <div class="curso-q-feedback-body">
          <div class="curso-q-feedback-title">${isCorrect ? 'Correcto' : 'Incorrecto'}</div>
          <div class="curso-q-feedback-text">${escapeHtml(q.explicacion || '')}</div>
        </div>
      `;
    }
  });

  const passed = correct >= 4;
  const prev = state.progreso[mod.id] || { score: 0, intentos: 0, completado: false, ts: null };
  state.progreso[mod.id] = {
    score: Math.max(prev.score, correct),
    intentos: (prev.intentos || 0) + 1,
    completado: passed || prev.completado,
    ts: new Date().toISOString(),
  };
  saveState();

  // Disable inputs and show final result
  document.querySelectorAll('.curso-quiz-form input, .curso-quiz-form button').forEach(el => {
    if (el.type !== 'submit' && el.id !== 'cursoQuizCancel') el.disabled = true;
  });
  document.querySelectorAll('.curso-match-item').forEach(el => el.style.pointerEvents = 'none');

  const actions = document.querySelector('.curso-quiz-actions');
  if (actions) {
    const summary = document.createElement('div');
    summary.className = 'curso-quiz-summary ' + (passed ? 'is-pass' : 'is-fail');
    summary.innerHTML = `
      <div class="curso-quiz-summary-num">${correct}/5</div>
      <div class="curso-quiz-summary-msg">${passed ? '¡Módulo completado!' : 'Necesita 4/5 para completar el módulo. Repase el contenido e intente de nuevo.'}</div>
      <div class="curso-quiz-summary-actions">
        <button type="button" class="curso-btn" id="cursoQuizRetry">Reintentar quiz</button>
        ${mod.num < 8 ? `<a class="curso-btn curso-btn-primary" href="#/m/${mod.num + 1}">Siguiente módulo →</a>` : `<a class="curso-btn curso-btn-primary" href="#/examen">Ir al examen →</a>`}
      </div>
    `;
    actions.innerHTML = '';
    actions.appendChild(summary);
    document.getElementById('cursoQuizRetry').addEventListener('click', () => renderQuiz(mod, state.progreso[mod.id]));
  }

  renderSidebar();
}

/* -------------------- Examen final -------------------- */
function renderExamen() {
  const main = document.getElementById('cursoMain');
  const allModsDone = (MODULOS.modulos || []).filter(m => m.tipo === 'modulo').every(m => state.progreso[m.id] && state.progreso[m.id].completado);

  if (!allModsDone) {
    main.innerHTML = `
      <article class="curso-modulo">
        <div class="curso-eyebrow">Examen final</div>
        <h1 class="curso-h1">Complete los 8 módulos primero</h1>
        <p class="curso-lead">Para rendir el examen final debe completar el quiz de los 8 módulos temáticos. Cada módulo requiere 4 de 5 respuestas correctas.</p>
        <div class="curso-callout curso-callout-orange">
          <h3>Su progreso actual: ${progressPercent()}%</h3>
          <p>Termine los módulos pendientes antes de rendir el examen.</p>
        </div>
        <div class="curso-cta-row"><a class="curso-btn curso-btn-primary" href="#/m/1">Ir al primer módulo pendiente</a></div>
      </article>
    `;
    return;
  }

  const ex = state.examen || { intentos: 0, mejorScore: 0, aprobado: false };
  if (ex.aprobado) {
    main.innerHTML = `
      <article class="curso-modulo">
        <div class="curso-eyebrow">Examen final · aprobado</div>
        <h1 class="curso-h1">¡Felicitaciones!</h1>
        <p class="curso-lead">Usted aprobó el examen con <strong>${ex.preguntas.length}</strong> preguntas, obteniendo <strong>${ex.mejorScore}/${ex.preguntas.length}</strong> (${Math.round((ex.mejorScore / ex.preguntas.length) * 100)}%).</p>
        <div class="curso-callout curso-callout-green">
          <h3>Su certificado está listo</h3>
          <p>Descargue o imprima su certificado de aprobación del curso.</p>
        </div>
        <div class="curso-cta-row">
          <a class="curso-btn curso-btn-primary" href="#/cert">Ver certificado →</a>
          <button class="curso-btn" id="examRetry">Rendir nuevo intento</button>
        </div>
      </article>
    `;
    document.getElementById('examRetry').addEventListener('click', () => {
      if (confirm('¿Rendir un nuevo intento del examen?')) startExam();
    });
    return;
  }

  // Show intro to start exam
  main.innerHTML = `
    <article class="curso-modulo">
      <div class="curso-eyebrow">Examen final</div>
      <h1 class="curso-h1">Evaluación final del curso</h1>
      <p class="curso-lead">${EXAM_QUESTIONS} preguntas elegidas al azar del banco de examen. Necesita <strong>${Math.ceil(EXAM_QUESTIONS * EXAM_THRESHOLD)}/${EXAM_QUESTIONS}</strong> (${Math.round(EXAM_THRESHOLD * 100)}%) para aprobar y obtener el certificado.</p>
      <div class="curso-callout curso-callout-violet">
        <h3>Antes de comenzar</h3>
        <p>Confirme que su <strong>nombre</strong> esté correcto (se usará en el certificado). Tendrá un solo intento por sesión; puede volver a rendirlo si no aprueba.</p>
      </div>
      <div class="curso-cta-row">
        <button class="curso-btn curso-btn-primary" id="examStart">Comenzar examen</button>
        ${ex.intentos > 0 ? `<button class="curso-btn" id="examRetry">Reintentar (mejor: ${ex.mejorScore}/${EXAM_QUESTIONS})</button>` : ''}
      </div>
    </article>
  `;
  document.getElementById('examStart').addEventListener('click', () => startExam());
  const r = document.getElementById('examRetry');
  if (r) r.addEventListener('click', () => {
    if (confirm('¿Reiniciar el examen?')) startExam();
  });
}

function startExam() {
  // Pick N random unique questions
  const ids = (EXAMEN_BANCO || []).slice();
  const picked = [];
  while (picked.length < EXAM_QUESTIONS && ids.length) {
    const i = Math.floor(Math.random() * ids.length);
    picked.push(ids.splice(i, 1)[0]);
  }
  state.examen = {
    intentos: (state.examen && state.examen.intentos || 0) + 1,
    mejorScore: state.examen ? state.examen.mejorScore : 0,
    aprobado: false,
    preguntas: picked,
    respuestas: [],
    ts: null,
  };
  saveState();
  renderExamForm();
}

function renderExamForm() {
  const main = document.getElementById('cursoMain');
  const ids = state.examen.preguntas || [];
  const qs = ids.map(id => PREGUNTAS.preguntas[id]).filter(Boolean);
  main.innerHTML = `
    <article class="curso-modulo">
      <div class="curso-eyebrow">Examen final · intento ${state.examen.intentos}</div>
      <h1 class="curso-h1">${EXAM_QUESTIONS} preguntas</h1>
      <p class="curso-lead">Responda todas las preguntas y presione "Enviar examen" al terminar.</p>
      <form id="cursoExamForm" class="curso-quiz-form" autocomplete="off">
        ${qs.map((q, i) => renderPregunta(q, i)).join('')}
        <div class="curso-quiz-actions">
          <button type="submit" class="curso-btn curso-btn-primary">Enviar examen</button>
        </div>
      </form>
    </article>
  `;
  main.querySelectorAll('.curso-matching').forEach(setupMatching);
  document.getElementById('cursoExamForm').addEventListener('submit', (ev) => {
    ev.preventDefault();
    submitExam(qs);
  });
  window.scrollTo(0, 0);
}

function submitExam(qs) {
  let correct = 0;
  const respuestas = [];
  qs.forEach((q, idx) => {
    const fieldset = document.querySelector(`.curso-q[data-idx="${idx}"]`);
    let isCorrect = false;
    if (q.tipo === 'mc' || q.tipo === 'vf') {
      const checked = fieldset.querySelector(`input[name="q_${idx}"]:checked`);
      isCorrect = checked && parseInt(checked.value, 10) === q.correcta;
      respuestas.push(checked ? parseInt(checked.value, 10) : null);
    } else if (q.tipo === 'multi') {
      const checked = fieldset.querySelectorAll(`input[name="q_${idx}"]:checked`);
      const sel = Array.from(checked).map(c => parseInt(c.value, 10)).sort();
      const cor = (q.correctas || []).slice().sort();
      isCorrect = sel.length === cor.length && sel.every((v, i) => v === cor[i]);
      respuestas.push(sel);
    } else if (q.tipo === 'matching') {
      const input = fieldset.querySelector(`input[name="q_match_${idx}"]`);
      const pairs = input && input.value ? JSON.parse(input.value) : [];
      let matchedRight = 0;
      pairs.forEach(p => {
        if (p.l >= 0 && p.l < q.pares.length && p.r >= 0) {
          const rBtn = fieldset.querySelector(`[data-side="R"][data-i="${p.r}"]`);
          const rVal = rBtn ? rBtn.textContent.trim() : '';
          if (q.pares[p.l] && q.pares[p.l].der === rVal) matchedRight++;
        }
      });
      isCorrect = matchedRight === q.pares.length;
      respuestas.push(pairs);
    }
    if (isCorrect) correct++;
  });

  state.examen.mejorScore = Math.max(state.examen.mejorScore || 0, correct);
  state.examen.aprobado = (correct / qs.length) >= EXAM_THRESHOLD;
  state.examen.respuestas = respuestas;
  state.examen.ts = new Date().toISOString();
  saveState();

  renderExamResult(correct, qs.length);
}

function renderExamResult(correct, total) {
  const main = document.getElementById('cursoMain');
  const pct = Math.round((correct / total) * 100);
  const passed = (correct / total) >= EXAM_THRESHOLD;
  const minReq = Math.ceil(total * EXAM_THRESHOLD);

  main.innerHTML = `
    <article class="curso-modulo">
      <div class="curso-eyebrow">Resultado del examen</div>
      <h1 class="curso-h1">${passed ? '¡Aprobado!' : 'No aprobado'}</h1>
      <p class="curso-lead">Obtuvo <strong>${correct}/${total}</strong> (${pct}%). Mínimo requerido: <strong>${minReq}/${total}</strong>.</p>
      <div class="curso-callout ${passed ? 'curso-callout-green' : 'curso-callout-red'}">
        <h3>${passed ? 'Certificado disponible' : 'Necesita repasar'}</h3>
        <p>${passed ? 'Descargue o imprima su certificado. También puede rendir nuevos intentos para mejorar su puntaje.' : 'Revise los módulos y vuelva a intentarlo. Necesita 80% de respuestas correctas.'}</p>
      </div>
      <div class="curso-cta-row">
        ${passed ? `<a class="curso-btn curso-btn-primary" href="#/cert">Ver certificado →</a>` : ''}
        <button class="curso-btn" id="examRetry">Rendir nuevo intento</button>
        <a class="curso-btn" href="#/m/1">Repasar módulos</a>
      </div>
    </article>
  `;
  document.getElementById('examRetry').addEventListener('click', () => {
    if (confirm('¿Rendir un nuevo intento del examen?')) startExam();
  });
}

/* -------------------- Certificado -------------------- */
function renderCertificado() {
  const main = document.getElementById('cursoMain');
  if (!state.examen.aprobado) {
    main.innerHTML = `
      <article class="curso-modulo">
        <div class="curso-eyebrow">Certificado</div>
        <h1 class="curso-h1">Aún no disponible</h1>
        <p class="curso-lead">Debe aprobar el examen final (80% mínimo) para acceder al certificado.</p>
        <div class="curso-cta-row"><a class="curso-btn curso-btn-primary" href="#/examen">Ir al examen →</a></div>
      </article>
    `;
    return;
  }
  const nombre = state.usuario.nombre || 'Participante';
  const empresa = state.usuario.empresa || '';
  const score = state.examen.mejorScore;
  const total = state.examen.preguntas.length;
  const pct = Math.round((score / total) * 100);
  const fecha = new Date(state.examen.ts || Date.now()).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
  const codigo = generateCertCode(nombre, fecha);

  main.innerHTML = `
    <article class="curso-modulo">
      <div class="curso-eyebrow no-print">Certificado de aprobación</div>
      <h1 class="curso-h1 no-print">Su certificado está listo</h1>
      <p class="curso-lead no-print">Use el botón "Imprimir / Guardar PDF" para obtener una copia en PDF desde el diálogo del navegador.</p>

      <div class="curso-cert" id="cursoCert">
        <div class="curso-cert-border">
          <div class="curso-cert-corner tl"></div>
          <div class="curso-cert-corner tr"></div>
          <div class="curso-cert-corner bl"></div>
          <div class="curso-cert-corner br"></div>
          <div class="curso-cert-eyebrow">Certificado de Aprobación</div>
          <h2 class="curso-cert-title">Ley N° 21.719 · Protección de Datos Personales</h2>
          <div class="curso-cert-sub">Mini curso interactivo</div>
          <div class="curso-cert-sep"></div>
          <div class="curso-cert-given">Se otorga el presente certificado a</div>
          <div class="curso-cert-name">${escapeHtml(nombre)}</div>
          ${empresa ? `<div class="curso-cert-empresa">${escapeHtml(empresa)}</div>` : ''}
          <div class="curso-cert-body">
            por haber completado satisfactoriamente el mini curso sobre la <strong>Ley N° 21.719 de Protección de Datos Personales</strong>, aprobando el examen final con un puntaje de <strong>${score}/${total} (${pct}%)</strong>.
          </div>
          <div class="curso-cert-meta">
            <div class="curso-cert-meta-item">
              <div class="curso-cert-meta-label">Fecha</div>
              <div class="curso-cert-meta-value">${fecha}</div>
            </div>
            <div class="curso-cert-meta-item">
              <div class="curso-cert-meta-label">Código</div>
              <div class="curso-cert-meta-value">${codigo}</div>
            </div>
          </div>
          <div class="curso-cert-foot">Documento autoemitido · Validez verificable por código</div>
        </div>
      </div>

      <div class="curso-cta-row no-print">
        <button class="curso-btn curso-btn-primary" id="certPrint">🖨 Imprimir / Guardar PDF</button>
        <button class="curso-btn" id="certDownload">⬇ Descargar JSON</button>
      </div>
    </article>
  `;

  document.getElementById('certPrint').addEventListener('click', () => window.print());
  document.getElementById('certDownload').addEventListener('click', () => {
    const data = {
      curso: 'Ley 21.719 - Protección de Datos Personales',
      participante: nombre,
      empresa: empresa,
      puntaje: score,
      total: total,
      porcentaje: pct,
      fecha: fecha,
      codigo: codigo,
      emitido: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificado-${codigo}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

function generateCertCode(nombre, fecha) {
  const s = (nombre + fecha).replace(/\s+/g, '').toUpperCase();
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  const hex = Math.abs(h).toString(16).toUpperCase().padStart(6, '0').slice(0, 6);
  const ymd = fecha.replace(/[^\d]/g, '').slice(2, 8);
  return `L21719-${ymd}-${hex}`;
}

/* -------------------- Herramienta de auditoría web -------------------- */
function renderAuditoria() {
  const main = document.getElementById('cursoMain');
  const inds = [
    { id: 'retail', nombre: 'Retail / e-commerce' },
    { id: 'salud', nombre: 'Salud' },
    { id: 'educacion', nombre: 'Educación' },
    { id: 'financiero', nombre: 'Servicios financieros' },
    { id: 'rrhh', nombre: 'Recursos Humanos' },
    { id: 'publicidad', nombre: 'Marketing / Publicidad' },
    { id: 'inmobiliario', nombre: 'Inmobiliario' },
    { id: 'gobierno', nombre: 'Sector público / Municipal' },
  ];
  const checklist = [
    { id: 'aviso', titulo: 'Aviso de privacidad claro y por capas', detalle: 'Debe existir aviso visible antes de cualquier recolección, explicar qué datos, para qué, con quién se comparten y los derechos del titular.' },
    { id: 'consentimiento', titulo: 'Mecanismo de consentimiento granular', detalle: 'Checkbox no pre-marcado, por finalidad, tan fácil de retirar como de otorgar.' },
    { id: 'cookies', titulo: 'Gestión de cookies conforme a ley', detalle: 'Banner con rechazar tan visible como aceptar, no usar cookies innecesarias sin base de licitud.' },
    { id: 'derechos', titulo: 'Canal visible para derechos ARCOP+', detalle: 'Formulario o email dedicado, plazo de respuesta ≤ 15 días hábiles, confirmación de recepción.' },
    { id: 'menores', titulo: 'Verificación de edad y consentimiento parental', detalle: 'Si recoge datos de menores de 14 años, requiere consentimiento verificable del representante legal.' },
  ];
  const indQs = {
    retail: [
      '¿Tiene base de licitud documentada para cada finalidad (compra, marketing, recomendaciones, prevención de fraude)?',
      '¿Los datos de tarjetas son procesados directamente por un PSP con certificación PCI-DSS?',
      '¿El perfilado para recomendaciones tiene base de licitud distinta al consentimiento genérico?',
    ],
    salud: [
      '¿Su base de licitud es la relación médico-paciente o consentimiento específico?',
      '¿Tiene DPA firmado con todos los prestadores de tecnología (laboratorio, imágenes, telemedicina)?',
      '¿Las historias clínicas tienen niveles de acceso por rol y auditoría de accesos?',
    ],
    educacion: [
      '¿Recolecta datos de menores de 14 años? Si sí, ¿cómo verifica el consentimiento parental?',
      '¿La base de licitud para matrícula es ejecución de contrato, y para marketing es consentimiento?',
      '¿Comparte datos con plataformas externas (LMS, pago, transporte) bajo DPA?',
    ],
    financiero: [
      '¿Tiene DPIA para scoring crediticio y tratamiento automatizado?',
      '¿El DPO está designado formalmente y comunicado a la Agencia?',
      '¿Los datos se comparten con bureaus bajo contrato y finalidad definida?',
    ],
    rrhh: [
      '¿Separa base de licitud para: selección, contratación, remuneración, evaluación, desvinculación?',
      '¿Tiene política de retención para datos de postulantes no contratados?',
      '¿Los datos de ex-empleados se eliminan o anonimizan al cumplir el plazo legal?',
    ],
    publicidad: [
      '¿Cada campaña publicitaria tiene su propia base de licitud documentada?',
      '¿Los perfiles para remarketing tienen consentimiento específico, no genérico?',
      '¿Las listas de email tienen prueba de opt-in y mecanismo de unsubscribe operativo?',
    ],
    inmobiliario: [
      '¿La base de licitud para corredores es mandato (no consentimiento genérico)?',
      '¿Comparte datos con portales inmobiliarios bajo DPA?',
      '¿Tiene base de licitud para mostrar datos del propietario en publicaciones?',
    ],
    gobierno: [
      '¿El RAT está publicado y actualizado conforme al art. 18?',
      '¿Las bases de licitud son las del art. 6 (obligación legal, interés público)?',
      '¿El DPO es funcionario designado y comunicado formalmente?',
    ],
  };

  const aud = state.auditoria || { industria: '', respuestas: {} };

  main.innerHTML = `
    <article class="curso-modulo">
      <div class="curso-eyebrow">Herramienta práctica</div>
      <h1 class="curso-h1">Auditoría rápida de su sitio web</h1>
      <p class="curso-lead">Responda las 5 preguntas universales y las preguntas específicas de su industria. Al final obtendrá un plan de remediación priorizado.</p>

      <div class="curso-audit-section">
        <h2 class="curso-h2">1. Seleccione su industria</h2>
        <div class="curso-audit-industrias">
          ${inds.map(i => `
            <label class="curso-audit-ind ${aud.industria === i.id ? 'selected' : ''}">
              <input type="radio" name="industria" value="${i.id}" ${aud.industria === i.id ? 'checked' : ''}>
              <span>${escapeHtml(i.nombre)}</span>
            </label>
          `).join('')}
        </div>
      </div>

      <div class="curso-audit-section">
        <h2 class="curso-h2">2. Checklist universal (5 puntos)</h2>
        ${checklist.map(c => {
          const ans = aud.respuestas[c.id];
          return `
            <div class="curso-audit-item" data-id="${c.id}">
              <div class="curso-audit-item-head">
                <h3>${escapeHtml(c.titulo)}</h3>
                <div class="curso-audit-btns">
                  <button type="button" class="curso-audit-btn ${ans === 'si' ? 'active si' : ''}" data-val="si">Sí</button>
                  <button type="button" class="curso-audit-btn ${ans === 'parcial' ? 'active parcial' : ''}" data-val="parcial">Parcial</button>
                  <button type="button" class="curso-audit-btn ${ans === 'no' ? 'active no' : ''}" data-val="no">No</button>
                </div>
              </div>
              <p class="curso-audit-detalle">${escapeHtml(c.detalle)}</p>
            </div>
          `;
        }).join('')}
      </div>

      <div class="curso-audit-section" id="cursoAuditIndSection" ${!aud.industria ? 'hidden' : ''}>
        <h2 class="curso-h2">3. Preguntas por industria</h2>
        ${(indQs[aud.industria] || []).map((q, i) => `
          <div class="curso-audit-indq">
            <label class="curso-audit-indq-label">${escapeHtml(q)}</label>
            <textarea class="curso-audit-indq-text" data-indq="${i}" rows="2" placeholder="Anote su situación actual, evidencia o dudas...">${escapeHtml(aud.respuestas['indq_' + i] || '')}</textarea>
          </div>
        `).join('')}
      </div>

      <div class="curso-cta-row">
        <button class="curso-btn curso-btn-primary" id="auditGen">Generar plan de remediación</button>
        <button class="curso-btn" id="auditReset">Reiniciar auditoría</button>
      </div>

      <div id="cursoAuditPlan" class="curso-audit-plan" hidden></div>
    </article>
  `;

  // Industry selector
  main.querySelectorAll('input[name="industria"]').forEach(r => {
    r.addEventListener('change', () => {
      aud.industria = r.value;
      state.auditoria = aud;
      saveState();
      renderAuditoria();
    });
  });

  // Checklist buttons
  main.querySelectorAll('.curso-audit-item').forEach(item => {
    item.querySelectorAll('.curso-audit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        aud.respuestas[item.dataset.id] = btn.dataset.val;
        state.auditoria = aud;
        saveState();
        item.querySelectorAll('.curso-audit-btn').forEach(b => b.classList.remove('active', 'si', 'parcial', 'no'));
        btn.classList.add('active', btn.dataset.val);
      });
    });
  });

  // Industry question textareas
  main.querySelectorAll('.curso-audit-indq-text').forEach(ta => {
    ta.addEventListener('input', () => {
      aud.respuestas['indq_' + ta.dataset.indq] = ta.value;
      state.auditoria = aud;
      saveState();
    });
  });

  document.getElementById('auditGen').addEventListener('click', () => generateAuditPlan(aud, inds, checklist, indQs));
  document.getElementById('auditReset').addEventListener('click', () => {
    if (!confirm('¿Borrar respuestas de la auditoría?')) return;
    state.auditoria = { industria: '', respuestas: {} };
    saveState();
    renderAuditoria();
  });
}

function generateAuditPlan(aud, inds, checklist, indQs) {
  const planEl = document.getElementById('cursoAuditPlan');
  const indName = (inds.find(i => i.id === aud.industria) || { nombre: 'General' }).nombre;

  // Score: si = 2, parcial = 1, no = 0. Max = 10.
  let score = 0;
  const items = [];
  checklist.forEach(c => {
    const v = aud.respuestas[c.id];
    const pts = v === 'si' ? 2 : v === 'parcial' ? 1 : 0;
    score += pts;
    items.push({ ...c, val: v || 'no', pts });
  });

  const nivel = score >= 9 ? 'verde' : score >= 6 ? 'amarillo' : 'rojo';
  const nivelLabel = { verde: 'Cumplimiento alto', amarillo: 'Cumplimiento parcial — requiere remediación', rojo: 'Cumplimiento crítico — exposición alta' }[nivel];

  // Priority items (no = critical, parcial = high)
  const criticos = items.filter(i => i.val === 'no').map(i => i.titulo);
  const altos = items.filter(i => i.val === 'parcial').map(i => i.titulo);

  let planHtml = `
    <div class="curso-audit-plan-head">
      <div class="curso-audit-plan-eyebrow">Plan de remediación</div>
      <h2 class="curso-h2">${escapeHtml(indName)} · ${score}/10 · ${nivelLabel}</h2>
    </div>
  `;

  if (criticos.length) {
    planHtml += `
      <div class="curso-callout curso-callout-red">
        <h3>🔴 Acción inmediata (críticos)</h3>
        <ul>${criticos.map(t => `<li><strong>${escapeHtml(t)}</strong></li>`).join('')}</ul>
      </div>
    `;
  }
  if (altos.length) {
    planHtml += `
      <div class="curso-callout curso-callout-orange">
        <h3>🟠 Acción a 30 días (altos)</h3>
        <ul>${altos.map(t => `<li><strong>${escapeHtml(t)}</strong></li>`).join('')}</ul>
      </div>
    `;
  }
  if (!criticos.length && !altos.length) {
    planHtml += `
      <div class="curso-callout curso-callout-green">
        <h3>🟢 Sin brechas críticas</h3>
        <p>Mantenga la documentación actualizada y revise trimestralmente. Considere una DPIA para nuevos tratamientos.</p>
      </div>
    `;
  }

  // Recommended next steps
  planHtml += `
    <div class="curso-callout curso-callout-violet">
      <h3>Pasos siguientes sugeridos</h3>
      <ol>
        <li><strong>Documente</strong> las brechas en su RAT y agende remediación con responsables y plazos.</li>
        <li><strong>Evalúe</strong> si necesita DPIA para los tratamientos de mayor riesgo (datos sensibles, perfilado, datos de menores).</li>
        <li><strong>Designe</strong> un DPO si trata datos sensibles, monitorea sistemáticamente o procesa a gran escala.</li>
        <li><strong>Formalice</strong> DPAs con todos los proveedores que tratan datos personales en su nombre.</li>
        <li><strong>Capacite</strong> al equipo en los derechos ARCOP+ y los plazos de respuesta.</li>
      </ol>
    </div>
    <div class="curso-cta-row">
      <button class="curso-btn curso-btn-primary" id="auditPrint">Imprimir / Guardar PDF</button>
      <button class="curso-btn" id="auditDownload">Descargar JSON</button>
    </div>
  `;

  planEl.innerHTML = planHtml;
  planEl.hidden = false;
  planEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

  document.getElementById('auditPrint').addEventListener('click', () => window.print());
  document.getElementById('auditDownload').addEventListener('click', () => {
    const data = {
      industria: indName,
      puntaje: score,
      maximo: 10,
      nivel: nivelLabel,
      checklist: items.map(i => ({ item: i.titulo, valor: i.val })),
      respuestasIndustria: (indQs[aud.industria] || []).map((q, i) => ({ pregunta: q, respuesta: aud.respuestas['indq_' + i] || '' })),
      generado: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria-${aud.industria || 'web'}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

/* -------------------- Video dialog -------------------- */
function openVideo(file, titulo, thumb) {
  const dlg = document.getElementById('cursoVideoDialog');
  if (!dlg) return;
  const player = document.getElementById('cursoVideoPlayer');
  const titleEl = document.getElementById('cursoVideoTitle');
  player.src = file;
  player.poster = thumb || '';
  titleEl.textContent = titulo || '';
  if (typeof dlg.showModal === 'function') {
    dlg.showModal();
  } else {
    dlg.setAttribute('open', '');
  }
  player.play().catch(() => {});
}

function closeVideo() {
  const dlg = document.getElementById('cursoVideoDialog');
  const player = document.getElementById('cursoVideoPlayer');
  if (player) { player.pause(); player.src = ''; }
  if (dlg) dlg.close();
}

/* -------------------- UI helpers -------------------- */
function showToast(msg, type) {
  const c = document.getElementById('cursoToastContainer');
  if (!c) return;
  const t = document.createElement('div');
  t.className = 'curso-toast curso-toast-' + (type || 'info');
  t.setAttribute('role', 'status');
  t.textContent = msg;
  c.appendChild(t);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('is-visible')));
  setTimeout(() => { t.classList.remove('is-visible'); }, 2800);
  setTimeout(() => { if (t.parentNode) t.parentNode.removeChild(t); }, 3300);
}

function toggleMobileSidebar() {
  document.body.classList.toggle('curso-sidebar-open');
}

function closeMobileSidebar() {
  document.body.classList.remove('curso-sidebar-open');
}

/* -------------------- Utils -------------------- */
function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}
function escapeAttr(s) {
  if (s == null) return '';
  return String(s).replace(/"/g, '&quot;');
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* -------------------- Init -------------------- */
function loadData() {
  /* Carga datos desde los <script type="application/json"> embebidos en el HTML.
     Funciona tanto en file:// como en HTTP — no requiere fetch(). */
  const mEl = document.getElementById('modulosData');
  const qEl = document.getElementById('preguntasData');
  if (!mEl || !qEl) return null;
  try {
    return {
      MODULOS: JSON.parse(mEl.textContent),
      PREGUNTAS: JSON.parse(qEl.textContent),
    };
  } catch (e) {
    return null;
  }
}

function showCorruptError() {
  document.getElementById('cursoMain').innerHTML =
    '<div class="curso-empty">' +
    '<h2>Error: archivo curso.html da&ntilde;ado</h2>' +
    '<p>Los datos del curso est&aacute;n embebidos en este archivo pero no se pudieron parsear.</p>' +
    '<p>Re-descargue el paquete completo desde la fuente original.</p>' +
    '</div>';
}

async function init() {
  applyTheme();
  const data = loadData();
  if (!data) {
    showCorruptError();
    return;
  }
  MODULOS = data.MODULOS;
  PREGUNTAS = data.PREGUNTAS;
  EXAMEN_BANCO = PREGUNTAS.examen_banco || [];

  // Theme toggle (mobile + desktop sincronizados)
  const curTheme = document.documentElement.getAttribute('data-theme') || 'light';
  syncThemeIcons(curTheme);
  document.querySelectorAll('.curso-theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  // Mobile sidebar toggle
  const hamb = document.getElementById('cursoHamburger');
  if (hamb) hamb.addEventListener('click', toggleMobileSidebar);

  // Reset button
  const reset = document.getElementById('cursoReset');
  if (reset) reset.addEventListener('click', resetState);

  // Export button
  const exp = document.getElementById('cursoExport');
  if (exp) exp.addEventListener('click', () => {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progreso-curso-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // Video dialog close handlers
  const closeBtn = document.getElementById('cursoVideoClose');
  if (closeBtn) closeBtn.addEventListener('click', closeVideo);
  const dlg = document.getElementById('cursoVideoDialog');
  if (dlg) dlg.addEventListener('click', (e) => { if (e.target === dlg) closeVideo(); });

  window.addEventListener('hashchange', route);
  route();
}

document.addEventListener('DOMContentLoaded', init);
