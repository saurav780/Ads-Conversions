// Centralized site scripts (nav, mobile menu, observers, faq)
// Nav scroll
window.addEventListener('scroll',()=>{
  const nav=document.getElementById('nav');
  if(nav) nav.classList.toggle('sc',window.scrollY>30);
});

// Mobile menu
let mo=false;
function setMenu(open){
  mo=open;
  const h=document.getElementById('hbg'), m=document.getElementById('mob');
  if(h) h.classList.toggle('op',mo);
  if(m){
    m.classList.toggle('op',mo);
    m.style.transition='none';
    m.style.width='100vw';
    m.style.maxWidth='100vw';
    m.style.transform=mo?'translate3d(0,0,0)':'translate3d(100vw,0,0)';
  }
  document.body.style.overflow=mo?'hidden':'';
  document.documentElement.style.overflow=mo?'hidden':'';
}
function tmenu(){setMenu(!mo)}
function cmenu(){setMenu(false)}
window.addEventListener('resize',()=>{if(window.innerWidth>1024)cmenu();});

// English copy cleanup + inline SVG icons
const SVG_ICONS={
  rocket:'<path d="M4.5 16.5c-1.2 1.2-1.7 2.7-1.5 4.5 1.8.2 3.3-.3 4.5-1.5"/><path d="M9 15 4.5 10.5 7 8l5 1 3 3 1 5-2.5 2.5L9 15Z"/><path d="M14 5c2-2 4.7-2.2 6-2-0.2 1.3 0 4-2 6l-3 3-4-4 3-3Z"/><path d="M14 5h5v5"/>',
  phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L8 9.5a16 16 0 0 0 6.5 6.5l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.5.6A2 2 0 0 1 22 16.9Z"/>',
  chart:'<path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16v-5"/><path d="M12 16V8"/><path d="M16 16v-9"/>',
  lock:'<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  settings:'<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 3.4-.2-.1a1.7 1.7 0 0 0-2 .2 1.7 1.7 0 0 0-.8 1.5V22H9.2v-.1a1.7 1.7 0 0 0-.8-1.5 1.7 1.7 0 0 0-2-.2l-.2.1-2-3.4.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.4-1.1H3v-3.6h.2A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-3.4.2.1a1.7 1.7 0 0 0 2-.2A1.7 1.7 0 0 0 9.2 2V2h5.6v.1a1.7 1.7 0 0 0 .8 1.5 1.7 1.7 0 0 0 2 .2l.2-.1 2 3.4-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.4 1.1h.2v3.6h-.2a1.7 1.7 0 0 0-1.4 1.2Z"/>',
  pen:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/>',
  bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/>',
  package:'<path d="m3 7 9 5 9-5"/><path d="M12 22V12"/><path d="M21 7v10l-9 5-9-5V7l9-5 9 5Z"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  rupee:'<path d="M6 4h12"/><path d="M6 9h12"/><path d="M7 4h5a4 4 0 0 1 0 8H7l8 8"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  store:'<path d="M4 10h16l-1.5-5h-13L4 10Z"/><path d="M5 10v9h14v-9"/><path d="M9 19v-5h6v5"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  message:'<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/>',
  arrowLeft:'<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  arrowRight:'<path d="m12 5 7 7-7 7"/><path d="M5 12h14"/>'
};
function svgIcon(name){
  const body=SVG_ICONS[name]||SVG_ICONS.check;
  return `<svg class="svg-icon svg-icon-${name}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}
function normaliseCopy(value){
  return String(value||'')
    .replace(/â€”/g,' - ')
    .replace(/â€“/g,'-')
    .replace(/â†’/g,'->')
    .replace(/â‚¹/g,'₹')
    .replace(/Â·/g,'·')
    .replace(/âœ“/g,'✓')
    .replace(/âœ‰ï¸/g,'')
    .replace(/â³/g,'')
    .replace(/ðŸš€/g,'')
    .replace(/ðŸ“ž/g,'')
    .replace(/ðŸ“Š/g,'')
    .replace(/ðŸ”’/g,'')
    .replace(/ðŸ”/g,'')
    .replace(/ðŸŽ¯/g,'')
    .replace(/âš™ï¸/g,'')
    .replace(/âœï¸/g,'')
    .replace(/â­/g,'')
    .replace(/ðŸ’°/g,'')
    .replace(/ðŸ“ˆ/g,'')
    .replace(/ðŸª/g,'')
    .replace(/ðŸŸ |ðŸ”µ|ðŸ©·|ðŸ’œ|ðŸŸ£|âš«|ðŸ”·|â¤ï¸|ðŸŸ¤|ðŸŸ¢/g,'')
    .replace(/âœ…/g,'')
    .replace(/\u00e2\u2020\u0090\s*/g,'')
    .replace(/ðŸ“§/g,'')
    .replace(/ðŸ’¬/g,'')
    .replace(/🔒|🚀|📞|📊|🔍|🎯|⚙️|✍️|⭐|💰|📈|🌐|📦|⚡|✅|🏪|📧|💬/g,'')
    .replace(/\s+/g,' ')
    .trim();
}
function cleanTextNodes(root=document.body){
  const skip=new Set(['SCRIPT','STYLE','SVG','TEXTAREA','INPUT']);
  const visit=node=>{
    node.childNodes.forEach(child=>{
      if(child.nodeType===3){ child.nodeValue=normaliseCopy(child.nodeValue); }
      else if(child.nodeType===1 && !skip.has(child.tagName)){ visit(child); }
    });
  };
  if(root) visit(root);
}
function iconForText(text){
  const t=normaliseCopy(text).toLowerCase();
  if(/call|phone|mobile|support/.test(t)) return 'phone';
  if(/email|mail/.test(t)) return 'mail';
  if(/audit|search|seo/.test(t)) return 'search';
  if(/service|report|tracking|analytics|data|results|roas|conversion/.test(t)) return 'chart';
  if(/lead|campaign|target|funnel|marketplace ads|sponsored/.test(t)) return 'target';
  if(/setup|optimization|optimisation|manage|management|process/.test(t)) return 'settings';
  if(/copy|creative|content|listing/.test(t)) return 'pen';
  if(/speed|performance|fast|cro|testing|scale|growth|grow/.test(t)) return 'bolt';
  if(/web|website|shopify|wordpress|platform/.test(t)) return 'globe';
  if(/marketplace|amazon|flipkart|myntra|nykaa|meesho|ajio|jiomart|tata|etsy/.test(t)) return 'store';
  if(/pricing|budget|spend|revenue|roi|quote/.test(t)) return 'rupee';
  if(/safe|privacy|secure/.test(t)) return 'lock';
  if(/back/.test(t)) return 'arrowLeft';
  if(/time|hours/.test(t)) return 'clock';
  if(/question|message/.test(t)) return 'message';
  if(/start|book|free|explore/.test(t)) return 'rocket';
  return 'check';
}
function setIconText(el, icon, text){
  if(!el || el.dataset.svgReady) return;
  el.dataset.svgReady='1';
  const label=normaliseCopy(text || el.textContent);
  el.innerHTML=`${svgIcon(icon)}<span>${label}</span>`;
}
function injectSvgStyles(){
  if(document.getElementById('svg-icon-styles')) return;
  const css=`
  .svg-icon{width:1.05em;height:1.05em;display:inline-block;flex:0 0 auto;color:currentColor;vertical-align:-.16em}
  .btn .svg-icon,.btn-submit .svg-icon{width:18px;height:18px}
  .svc-card h3,.mp-badge{display:flex;align-items:center;gap:10px}
  .svc-card h3 .svg-icon,.mp-badge .svg-icon{width:22px;height:22px;color:var(--b2)}
  .svc-icon,.feat-icon,.ty-icon,.ty-icon-small{line-height:1}
  .svc-icon .svg-icon{width:34px;height:34px;color:var(--b2)}
  .feat-icon .svg-icon{width:20px;height:20px;color:var(--b2)}
  .ty-icon .svg-icon{width:80px;height:80px;color:var(--green)}
  .ty-icon-small .svg-icon{width:24px;height:24px;color:var(--sky)}
  .hint .svg-icon{width:14px;height:14px;color:var(--b2);margin-right:6px}
  @media(max-width:640px){.ty-icon .svg-icon{width:48px;height:48px}}
  `;
  const style=document.createElement('style');
  style.id='svg-icon-styles';
  style.textContent=css;
  document.head.appendChild(style);
}
function applySvgIcons(){
  document.title=normaliseCopy(document.title);
  injectSvgStyles();
  cleanTextNodes();
  document.querySelectorAll('.btn,.btn-submit').forEach(el=>setIconText(el,iconForText(el.textContent),el.textContent));
  document.querySelectorAll('.svc-card h3').forEach(el=>setIconText(el,iconForText(el.textContent),el.textContent));
  document.querySelectorAll('.mp-badge').forEach(el=>setIconText(el,'store',el.textContent));
  document.querySelectorAll('.hint').forEach(el=>{
    if(el.dataset.svgReady) return;
    el.dataset.svgReady='1';
    el.innerHTML=`${svgIcon('lock')}<span>${normaliseCopy(el.textContent)}</span>`;
  });
  document.querySelectorAll('.svc-icon,.feat-icon,.ty-icon,.ty-icon-small').forEach(el=>{
    if(el.dataset.svgReady) return;
    const icon=iconForText(el.textContent || el.closest('.svc-card,.feat-item,.ty-info-item')?.textContent || 'check');
    el.dataset.svgReady='1';
    el.innerHTML=svgIcon(icon);
  });
  document.querySelectorAll('a[href="tel:+91XXXXXXXXXX"]').forEach(a=>a.setAttribute('href','tel:+918851751427'));
  document.querySelectorAll('a[href^="mailto:hello@adsconversions.com"]').forEach(a=>a.setAttribute('href','mailto:connect@adsconversions.com'));
}
applySvgIcons();
// Fade-up
const obs=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting)x.target.classList.add('vis')}),{threshold:.06,rootMargin:'0px 0px -14px 0px'});
document.querySelectorAll('.fu').forEach(el=>obs.observe(el));

// FAQ
function faq(btn){
  const op=btn.classList.contains('op');
  document.querySelectorAll('.faq-q').forEach(q=>{q.classList.remove('op');if(q.nextElementSibling)q.nextElementSibling.classList.remove('op');});
  if(!op){btn.classList.add('op');if(btn.nextElementSibling)btn.nextElementSibling.classList.add('op');}
}

// Form Submission Handler - Attach after small delay to ensure DOM is ready
function attachFormHandlers(){
  const submitButtons = document.querySelectorAll('button.fsub');
  console.log('Found submit buttons:', submitButtons.length);
  
  submitButtons.forEach(btn=>{
    btn.addEventListener('click',(e)=>{
      e.preventDefault();
      
      // Get parent container with form inputs
      const container = btn.closest('.hform') || btn.closest('div[style*="background"]') || btn.parentElement;
      
      if(!container){
        console.warn('Could not find form container');
        return;
      }
      
      // Collect form data for validation
      const inputs = container.querySelectorAll('input[type="email"], input[type="tel"], input[type="text"]');
      
      // Simple validation - at least email or phone should be filled
      let hasEmail = false, hasPhone = false;
      inputs.forEach(input=>{
        if(input.type === 'email' && input.value.trim()) hasEmail = true;
        if(input.type === 'tel' && input.value.trim()) hasPhone = true;
      });
      
      if(hasEmail || hasPhone){
        // Add loading state
        btn.style.opacity = '0.7';
        btn.style.pointerEvents = 'none';
        const originalText = btn.textContent;
        btn.textContent = 'Submitting...';
        
        // Simulate form submission delay
        setTimeout(()=>{
          window.location.href='thank-you.html';
        },600);
      } else {
        alert('Please fill in at least an email or phone number');
      }
    });
  });
}

// Wait for DOM and fragments to load
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', attachFormHandlers);
} else {
  setTimeout(attachFormHandlers, 100);
}

/* Testimonials Carousel: convert test-grid -> carousel when more than 3 cards */
function injectCarouselStyles(){
  if(document.getElementById('tc-styles')) return;
  const css=`
  .car-container{overflow:hidden;border-radius:var(--r);}
  .car-track{display:flex;gap:24px;transition:transform .45s ease}
  .car-slide{flex:0 0 33.333%;min-width:0}
  .car-btn{position:relative;margin-top:12px;padding:8px 12px;border-radius:6px;border:none;background:var(--b2);color:#fff;cursor:pointer}
  .car-dots{display:flex;justify-content:center;gap:8px;margin-top:14px}
  .car-dot{width:8px;height:8px;border-radius:50%;background:var(--bdr);cursor:pointer}
  .car-dot.active{background:var(--b2)}
  @media(max-width:1024px){.car-slide{flex:0 0 50%}}
  @media(max-width:640px){.car-slide{flex:0 0 100%}}
  `;
  const s=document.createElement('style');s.id='tc-styles';s.appendChild(document.createTextNode(css));document.head.appendChild(s);
}

function initTestimonialsCarousel(){
  injectCarouselStyles();
  document.querySelectorAll('.test-grid').forEach(grid=>{
    // avoid double-init
    if(grid.dataset.tcInit) return;
    const cards = Array.from(grid.querySelectorAll('.test-card'));
    if(cards.length <= 3) return;
    grid.dataset.tcInit = '1';

    // build carousel structure
    const carWrap = document.createElement('div');
    carWrap.className = 'car-wrap';
    const container = document.createElement('div'); container.className = 'car-container';
    const track = document.createElement('div'); track.className = 'car-track';

    cards.forEach(card=>{
      const slide = document.createElement('div'); slide.className = 'car-slide';
      slide.appendChild(card);
      track.appendChild(slide);
    });

    container.appendChild(track);
    carWrap.appendChild(container);

    // controls
    const prev = document.createElement('button'); prev.className='car-btn prev'; prev.innerHTML=svgIcon('arrowLeft');
    const next = document.createElement('button'); next.className='car-btn next'; next.innerHTML=svgIcon('arrowRight');
    carWrap.appendChild(prev); carWrap.appendChild(next);

    // dots
    const dots = document.createElement('div'); dots.className='car-dots';
    cards.forEach((_,i)=>{const d=document.createElement('div');d.className='car-dot';d.dataset.index=i; dots.appendChild(d)});
    carWrap.appendChild(dots);

    // replace original grid with carousel
    grid.parentNode.replaceChild(carWrap, grid);

    // state
    let pos = 0; const total = cards.length;
    let interval = null;
    let isPaused = false;

    function getSlidePct(){const w=window.innerWidth; return w>=1024?33.333: w>=640?50:100}

    function update(){
      const pct = getSlidePct();
      track.style.transform = `translateX(-${pos * pct}%)`;
      dots.querySelectorAll('.car-dot').forEach((d,i)=>d.classList.toggle('active', i===pos));
    }

    function nextSlide(){ pos = (pos+1)%total; update(); }
    function prevSlide(){ pos = (pos-1+total)%total; update(); }

    next.addEventListener('click', ()=>{ nextSlide(); resetAuto(); });
    prev.addEventListener('click', ()=>{ prevSlide(); resetAuto(); });
    dots.querySelectorAll('.car-dot').forEach(d=>d.addEventListener('click', e=>{ pos = Number(e.target.dataset.index); update(); resetAuto(); }));

    function startAuto(){ if(interval) clearInterval(interval); if(!isPaused) interval = setInterval(nextSlide,4000); }
    function stopAuto(){ if(interval) clearInterval(interval); interval = null; }
    function resetAuto(){ stopAuto(); startAuto(); }

    // pause on hover/focus
    const pauseTargets = [container, track, carWrap];
    pauseTargets.forEach(el=>{
      el.addEventListener('mouseenter', ()=>{ isPaused = true; stopAuto(); });
      el.addEventListener('mouseleave', ()=>{ isPaused = false; startAuto(); });
      el.addEventListener('focusin', ()=>{ isPaused = true; stopAuto(); });
      el.addEventListener('focusout', ()=>{ isPaused = false; startAuto(); });
    });

    // basic touch-swipe support
    let startX = 0, currentX = 0, isTouching = false;
    const threshold = 50;

    container.addEventListener('touchstart', (ev)=>{
      if(!ev.touches || !ev.touches.length) return;
      isTouching = true; startX = ev.touches[0].clientX; currentX = startX; isPaused = true; stopAuto();
    }, {passive:true});

    container.addEventListener('touchmove', (ev)=>{
      if(!isTouching || !ev.touches || !ev.touches.length) return;
      currentX = ev.touches[0].clientX;
    }, {passive:true});

    container.addEventListener('touchend', ()=>{
      if(!isTouching) return;
      const dx = currentX - startX;
      if(Math.abs(dx) > threshold){ if(dx < 0) nextSlide(); else prevSlide(); }
      isTouching = false; isPaused = false; resetAuto();
    });

    window.addEventListener('resize', update);
    update(); startAuto();
  });
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded', ()=>{ initTestimonialsCarousel(); });
} else { setTimeout(initTestimonialsCarousel, 200); }
