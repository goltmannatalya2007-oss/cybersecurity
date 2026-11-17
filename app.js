(()=>{'use strict';
const $=s=>document.querySelector(s),slides=window.LESSON_SLIDES,notes=window.LESSON_NOTES,config=window.LESSON_CONFIG;
let current=Math.min(slides.length-1,Math.max(0,(parseInt(location.hash.slice(1))||1)-1));const revealed=new Map();
const stickerPlan=[
['happy','sticker-br'],['normal','sticker-bl'],['surprised','sticker-br'],['anxiety','sticker-bl'],['stress','sticker-br'],
['peaceful','sticker-bl'],['disappointed','sticker-br'],['surprised','sticker-bl'],['anxiety','sticker-br'],['stress','sticker-bl'],
['normal','sticker-br'],['surprised','sticker-bl'],['anxiety','sticker-br'],['numbness','sticker-tr'],['normal','sticker-br'],
['sleepy','sticker-bl'],['happy','sticker-br'],['surprised','sticker-tr'],['anxiety','sticker-bl'],['peaceful','sticker-br'],
['flutter','sticker-bl'],['anger','sticker-br'],['stress','sticker-bl'],['normal','sticker-br'],['surprised','sticker-bl'],
['peaceful','sticker-br'],['happy','sticker-bl'],['anxiety','sticker-br'],['normal','sticker-bl'],['tired','sticker-br'],
['peaceful','sticker-bl'],['sad','sticker-br'],['pleasure','sticker-bl'],['surprised','sticker-br'],['happy','sticker-bl']
];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const speaker=s=>{if(!s)return 'Preparation';if(['1','2','3.1','3.2'].includes(s))return 'Семён';if(['3.3','3.4','4','5.1'].includes(s))return 'Никита';if(['5.2','5.3','5.4','5.5','6'].includes(s))return 'Баха';if(['7.1','7.2','7.3','7.4'].includes(s))return 'Егор';return 'Пятый выступающий';};
function qr(el,url){if(!el)return;const code=qrcode(0,'M');code.addData(url);code.make();el.innerHTML=code.createSvgTag({cellSize:5,margin:20,scalable:true});el.querySelector('svg').setAttribute('aria-label','QR code: '+url);el.querySelector('svg').setAttribute('role','img');}
function sectionAt(i){return slides.slice(0,i+1).filter(s=>s.group).at(-1)?.group||'';}
function updateReveal(){const remaining=$('#stage').querySelectorAll('.reveal[hidden]').length;$('#reveal-btn').hidden=!remaining;$('#reveal-btn').innerHTML=`Reveal <kbd>${remaining}</kbd>`;if(slides[current].title==='The fake support message'&&(revealed.get(current)||0)>0)$('#stage').classList.add('analyzed');}
function render(){const s=slides[current],sticker=stickerPlan[current];$('#stage').classList.remove('analyzed');$('#stage').innerHTML=`<article class="slide ${s.layout||''}" aria-label="Slide ${current+1}: ${esc(s.title)}">${['intro','cover'].includes(s.layout)||s.title==='Quiz time'?'':`<div class="slide-header"><p class="eyebrow">${esc(sectionAt(current))}</p><h2>${esc(s.title)}</h2></div>`}<div class="slide-body">${s.html}</div><img class="mood-sticker ${sticker[1]}" src="assets/stickers/${sticker[0]}.png" alt="" aria-hidden="true"></article>`;
[...$('#stage').querySelectorAll('.reveal')].slice(0,revealed.get(current)||0).forEach(x=>x.hidden=false);
$('#prev-btn').disabled=current===0;$('#next-btn').disabled=current===slides.length-1;$('#counter').textContent=`${String(current+1).padStart(2,'0')} / ${slides.length}`;$('#section-label').textContent=sectionAt(current);$('#progress-bar').style.width=`${(current+1)/slides.length*100}%`;
qr($('#vocabulary-qr'),config.vocabularyUrl);const slot=$('#quiz-slot');if(slot){if(config.quizUrl){slot.classList.add('ready');slot.innerHTML='<div class="qr"></div><a target="_blank" rel="noopener">Open quiz ↗</a>';qr(slot.querySelector('.qr'),config.quizUrl);slot.querySelector('a').href=config.quizUrl;}else if(config.quizImage){slot.classList.add('ready');const im=document.createElement('img');im.src=config.quizImage;im.alt='Quiz QR code';slot.replaceChildren(im);}}
updateReveal();renderNotes();document.querySelectorAll('.map-button').forEach((b,i)=>{b.classList.toggle('active',i===current);b.setAttribute('aria-current',i===current?'step':'false');});}
function go(i){current=Math.max(0,Math.min(slides.length-1,i));history.replaceState(null,'','#'+(current+1));render();}
function revealNext(){const x=$('#stage').querySelector('.reveal[hidden]');if(x){x.hidden=false;revealed.set(current,(revealed.get(current)||0)+1);updateReveal();}else go(current+1);}
function renderNotes(){const s=slides[current],n=notes[s.section];$('#notes-content').innerHTML=`<div class="notes-meta"><span>${esc(speaker(s.section))}</span><span>${esc(s.time)}</span>${s.section?`<span>Section ${esc(s.section)}</span>`:''}</div><h3>On this slide</h3><p>${esc(s.title)}</p>${s.guide?`<p class="notes-guide">${esc(s.guide)}</p>`:''}${n?`<h3>English script · ${esc(n.time)}</h3><p>${esc(n.en)}</p><h3>Русское пояснение</h3><p>${esc(n.ru)}</p><h3>Заметка из сценария</h3><p>${esc(n.guide)}</p>`:''}`;}
$('#sections-content').innerHTML=slides.map((s,i)=>`${s.group?`<p class="map-group">${esc(s.group)}</p>`:''}<button class="map-button" data-slide="${i}"><span>${esc(s.title)}</span><small>${String(i+1).padStart(2,'0')}</small></button>`).join('');
document.querySelectorAll('[data-slide]').forEach(b=>b.addEventListener('click',()=>{go(Number(b.dataset.slide));$('#sections-dialog').close();}));
function toggleDialog(id){const d=$(id);if(d.open)d.close();else d.showModal();}
$('#prev-btn').onclick=()=>go(current-1);$('#next-btn').onclick=()=>go(current+1);$('#reveal-btn').onclick=revealNext;$('#notes-btn').onclick=()=>toggleDialog('#notes-dialog');$('#sections-btn').onclick=()=>toggleDialog('#sections-dialog');
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right)d.close();}}));
async function full(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{$('#full-btn').textContent='Use browser fullscreen';}}$('#full-btn').onclick=full;
document.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;const open=document.querySelector('dialog[open]');if(open){if(e.key.toLowerCase()==='n'&&open.id==='notes-dialog'){e.preventDefault();open.close();}return;}if(e.altKey||e.ctrlKey||e.metaKey)return;switch(e.key){case'ArrowRight':case'PageDown':e.preventDefault();go(current+1);break;case'ArrowLeft':case'PageUp':e.preventDefault();go(current-1);break;case' ':e.preventDefault();revealNext();break;case'Home':e.preventDefault();go(0);break;case'End':e.preventDefault();go(slides.length-1);break;case'n':case'N':toggleDialog('#notes-dialog');break;case'f':case'F':full();break;}});
window.addEventListener('hashchange',()=>go((parseInt(location.hash.slice(1))||1)-1));render();
})();
