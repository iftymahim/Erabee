/* ================= Utility ================= */
function rand(min,max){ return Math.random()*(max-min)+min; }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

/* soft click sound via WebAudio, no external file needed */
let actx;
function ensureAudio(){ actx = actx || new (window.AudioContext||window.webkitAudioContext)(); return actx; }
function playClick(){
  try{
    const ctx = ensureAudio();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type='sine'; o.frequency.value = 660;
    g.gain.value = 0.05;
    o.connect(g); g.connect(ctx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.25);
    o.stop(ctx.currentTime+0.26);
  }catch(e){}
}

/* ================= Modal ================= */
function openModal(text){
  const box = document.getElementById('modal-text');
  const overlay = document.getElementById('modal-overlay');
  if(!box || !overlay) return;
  box.textContent = text;
  overlay.classList.add('open');
}
function closeModal(){
  const overlay = document.getElementById('modal-overlay');
  if(overlay) overlay.classList.remove('open');
}
document.addEventListener('DOMContentLoaded', ()=>{
  const overlay = document.getElementById('modal-overlay');
  if(overlay) overlay.addEventListener('click', (e)=>{ if(e.target.id==='modal-overlay') closeModal(); });
  const closeBtn = document.getElementById('modal-close');
  if(closeBtn) closeBtn.addEventListener('click', closeModal);
});

/* ================= Time-based greeting + day/night bg ================= */
function updateTimeTheme(){
  const h = new Date().getHours();
  let greeting, sky;
  if(h>=5 && h<12){ greeting="Good Morning, Erabeee ☀️"; sky="linear-gradient(180deg,#FFF6E0,#FFE1C4,#FFD6E4)"; }
  else if(h>=12 && h<17){ greeting="Good Afternoon, Erabeee 🌸"; sky="linear-gradient(180deg,#FFF8F1,#FFD6E4,#E7D9F7)"; }
  else if(h>=17 && h<21){ greeting="Good Evening, Erabeee 🌙"; sky="linear-gradient(180deg,#F7D9E9,#E7D9F7,#C9AEEA)"; }
  else { greeting="Sweet Dreams, Erabeee ✨"; sky="linear-gradient(180deg,#3b2a55,#6a4c86,#C9AEEA)"; }
  const banner = document.getElementById('greeting-banner');
  const bgSky = document.getElementById('bg-sky');
  if(banner) banner.textContent = greeting;
  if(bgSky) bgSky.style.background = sky;
}

/* ================= Ambient floating petals / butterflies ================= */
function spawnPetal(){
  const p = document.createElement('div');
  p.className='petal';
  p.textContent = pick(['🌸','🌷','🌺']);
  p.style.left = rand(0,100)+'vw';
  p.style.top = '-30px';
  p.style.fontSize = rand(14,22)+'px';
  p.style.opacity = 0.8;
  document.body.appendChild(p);
  const duration = rand(9,16);
  p.animate([
    { transform:'translate(0,0) rotate(0deg)' },
    { transform:`translate(${rand(-80,80)}px, 100vh) rotate(${rand(180,540)}deg)` }
  ], { duration: duration*1000, easing:'linear' });
  setTimeout(()=>p.remove(), duration*1000);
}
function spawnButterfly(){
  const b = document.createElement('div');
  b.className='butterfly';
  b.textContent = '🦋';
  b.style.left = '-30px';
  b.style.top = rand(10,80)+'vh';
  b.style.fontSize = rand(18,26)+'px';
  document.body.appendChild(b);
  const duration = rand(10,18);
  b.animate([
    { transform:'translate(0,0)' },
    { transform:`translate(${window.innerWidth+60}px, ${rand(-100,100)}px)` }
  ], { duration: duration*1000, easing:'ease-in-out' });
  setTimeout(()=>b.remove(), duration*1000);
}

/* ================= Cursor glitter ================= */
let lastGlitter = 0;
function initCursorGlitter(){
  window.addEventListener('pointermove', (e)=>{
    const now = Date.now();
    if(now - lastGlitter < 60) return;
    lastGlitter = now;
    const s = document.createElement('div');
    s.className='sparkle-cursor';
    s.textContent = pick(['✨','⭐','💫']);
    s.style.left = e.clientX+'px';
    s.style.top = e.clientY+'px';
    s.style.fontSize = rand(10,16)+'px';
    s.style.opacity = 0.9;
    document.body.appendChild(s);
    s.animate([
      { transform:'translate(-50%,-50%) scale(1)', opacity:0.9 },
      { transform:'translate(-50%,-50%) scale(0.4) translateY(20px)', opacity:0 }
    ], { duration:700, easing:'ease-out' });
    setTimeout(()=>s.remove(), 720);
  });
}

/* ================= Heart burst (used by hug page + easter egg) ================= */
function burstHearts(count){
  for(let i=0;i<count;i++){
    setTimeout(()=>{
      const h = document.createElement('div');
      h.className='heart-float';
      h.textContent = pick(['💗','💖','💕','💘']);
      h.style.left = rand(0,100)+'vw';
      h.style.bottom = '-30px';
      h.style.fontSize = rand(16,34)+'px';
      h.style.opacity = 0.9;
      h.style.transition = 'transform 3.2s ease-out, opacity 3.2s ease-out';
      document.body.appendChild(h);
      requestAnimationFrame(()=>{
        h.style.transform = `translateY(-${rand(70,100)}vh) translateX(${rand(-60,60)}px) rotate(${rand(-40,40)}deg)`;
        h.style.opacity = 0;
      });
      setTimeout(()=>h.remove(), 3300);
    }, i*35);
  }
}
function fireConfetti(count){
  for(let i=0;i<count;i++){
    setTimeout(()=>{
      const c = document.createElement('div');
      c.className='confetti-piece';
      c.textContent = pick(['🌸','✨','💮','🎀','💗']);
      c.style.left = rand(0,100)+'vw';
      c.style.fontSize = rand(14,24)+'px';
      document.body.appendChild(c);
      c.animate([
        { transform:'translateY(0) rotate(0deg)', opacity:1 },
        { transform:`translateY(100vh) rotate(${rand(200,600)}deg)`, opacity:0.9 }
      ], { duration: rand(2600,4200), easing:'ease-in' });
      setTimeout(()=>c.remove(), 4300);
    }, i*30);
  }
}

/* ================= Secret glowing star (one per page, random spot) ================= */
const secretNotes = [
  "Just in case nobody told you today...\nYou're doing great, Erabeee. 💖",
  "Erabeee, you make this world softer just by being in it.",
  "Tiny reminder: you are allowed to rest, Erabeee. 🌙",
  "You've survived every hard day so far. That's something, Erabeee."
];
function scatterSecretStar(){
  const host = document.querySelector('main');
  if(!host) return;
  const star = document.createElement('button');
  star.className='glow-star';
  star.textContent = '⭐';
  star.style.left = rand(6,90)+'%';
  star.style.top = rand(8,85)+'%';
  star.setAttribute('aria-label','a little secret');
  star.onclick = (e)=>{ e.stopPropagation(); playClick(); openModal(pick(secretNotes)); };
  host.style.position = host.style.position || 'relative';
  host.appendChild(star);
}

/* ================= Easter egg heart (footer, every page) ================= */
function initEasterEgg(){
  const heart = document.getElementById('secret-heart');
  if(!heart) return;
  heart.addEventListener('click', ()=>{
    playClick();
    fireConfetti(60);
    burstHearts(20);
    openModal("Dear Erabeee,\n\nIf today feels difficult, remember this:\nYou are appreciated.\nYou are important.\nYou are beautiful.\nYou are enough.\nYou are loved more than you know.\n\nThis little website exists because someone wanted you to smile.\nNever forget how special you are. 💖");
  });
}

/* =====================================================================
   MUSIC — happier & softer:
   a warm, slow major-chord pad underneath a gentle bell-like melody,
   run through a soft low-pass filter and a light echo so nothing
   sounds sharp or jarring. Preference is remembered between pages.
   ===================================================================== */
let musicPlaying = false;
let musicTimeout = null;
let musicChain = null; // { master, filter, delay, pad:[{o,g}] }

function buildMusicChain(){
  const ctx = ensureAudio();
  const master = ctx.createGain();
  master.gain.value = 1;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1500; // rounds off harsh edges -> softer tone
  filter.Q.value = 0.3;
  const delay = ctx.createDelay();
  delay.delayTime.value = 0.4;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.22;
  const delayWet = ctx.createGain();
  delayWet.gain.value = 0.25;

  master.connect(filter);
  filter.connect(ctx.destination);
  filter.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(delayWet);
  delayWet.connect(ctx.destination);

  return { ctx, master, filter, delay, pad: [] };
}

function startMusic(){
  const ctx = ensureAudio();
  if(ctx.state === 'suspended') ctx.resume();
  musicPlaying = true;
  localStorage.setItem('erabeee_music', 'on');
  updateMusicButtons();

  musicChain = buildMusicChain();
  const { master } = musicChain;

  // warm sustained major triad underneath everything (C major: C4 E4 G4)
  const padFreqs = [261.63, 329.63, 392.00];
  musicChain.pad = padFreqs.map((f, idx)=>{
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.value = f;
    o.detune.value = idx===1 ? 4 : -4; // gentle chorus-like warmth
    const g = ctx.createGain();
    g.gain.value = 0.0001;
    o.connect(g); g.connect(master);
    o.start();
    g.gain.linearRampToValueAtTime(0.028, ctx.currentTime + 2.5);
    return { o, g };
  });

  // happy, soft pentatonic melody (C D E G A) played slowly with gentle attack/release
  const melody = [523.25, 587.33, 659.25, 783.99, 880.00, 783.99, 659.25, 587.33];
  let i = 0;
  function playNote(){
    if(!musicPlaying || !musicChain) return;
    const now = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = melody[i % melody.length];
    g.gain.value = 0.0001;
    o.connect(g); g.connect(master);
    o.start();
    g.gain.linearRampToValueAtTime(0.06, now + 0.5);   // slow, soft attack (no chime "attack" click)
    g.gain.linearRampToValueAtTime(0.0001, now + 2.1);  // long gentle release
    o.stop(now + 2.2);
    i++;
    musicTimeout = setTimeout(playNote, 1350); // relaxed, unhurried tempo
  }
  playNote();
}

function stopMusic(){
  musicPlaying = false;
  localStorage.setItem('erabeee_music', 'off');
  clearTimeout(musicTimeout);
  updateMusicButtons();
  if(musicChain){
    const ctx = musicChain.ctx;
    musicChain.pad.forEach(({o,g})=>{
      try{
        g.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1);
        setTimeout(()=>{ try{ o.stop(); }catch(e){} }, 1100);
      }catch(e){}
    });
    musicChain = null;
  }
}

function toggleMusic(){
  musicPlaying ? stopMusic() : startMusic();
}

function updateMusicButtons(){
  document.querySelectorAll('.nav-music').forEach(btn=> btn.textContent = musicPlaying ? '🔊' : '🔇');
  const corner = document.getElementById('music-corner-btn');
  if(corner) corner.textContent = musicPlaying ? 'Pause music' : 'Play soft music';
}

function initMusicControls(){
  document.querySelectorAll('.nav-music').forEach(btn=> btn.addEventListener('click', toggleMusic));
  const corner = document.getElementById('music-corner-btn');
  if(corner) corner.addEventListener('click', toggleMusic);
  updateMusicButtons();
  // try to resume automatically if it was playing before navigating to this page
  if(localStorage.getItem('erabeee_music') === 'on'){
    // browsers require a user gesture for audio; attempt on first interaction with the page
    const resume = ()=>{ startMusic(); document.removeEventListener('click', resume); document.removeEventListener('touchstart', resume); };
    document.addEventListener('click', resume, { once:true });
    document.addEventListener('touchstart', resume, { once:true });
  }
}

/* ================= Init shared behaviors on every page ================= */
document.addEventListener('DOMContentLoaded', ()=>{
  updateTimeTheme();
  setInterval(updateTimeTheme, 60000);
  initCursorGlitter();
  setInterval(spawnPetal, 1500);
  setInterval(spawnButterfly, 6500);
  spawnButterfly();
  scatterSecretStar();
  initEasterEgg();
  initMusicControls();
});
