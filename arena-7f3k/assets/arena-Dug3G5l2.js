import{A as I}from"./main-_UEwIDad.js";const y={warrior:"🛡",priest:"✚",mage:"✦",archer:"➶",thief:"🗡"},N=`
.arena{max-width:980px;margin:0 auto;padding:16px;font-family:Nunito,system-ui,sans-serif;color:#eef1f5}
.arena h1{font-family:Cinzel,serif;font-size:22px;margin:0 0 4px}
.arena .sub{opacity:.7;font-size:13px;margin-bottom:14px}
.arena button{font:inherit;background:#1b2a6b;color:#eef1f5;border:1px solid #3d55b8;border-radius:8px;padding:7px 12px;cursor:pointer}
.arena button:disabled{opacity:.4;cursor:default}
.arena button.on{background:#c9821f;border-color:#f0b35a}
.arena .row{display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start}
.arena .board-wrap{overflow-x:auto;max-width:100%}
.arena .board{display:grid;gap:2px;background:#0a1250;padding:4px;border-radius:10px;user-select:none}
.arena .c{width:var(--cs);height:var(--cs);background:#1a2a5e;border-radius:4px;position:relative;cursor:pointer}
.arena .c.wall{background:#3b3f55;cursor:default}
.arena .c.reach{background:#2a6a8e}
.arena .c.tgt{background:#9a5a1a}
.arena .u{position:absolute;inset:3px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:calc(var(--cs)*.42);font-weight:800}
.arena .u.hero{background:#2f7d4f}.arena .u.foe{background:#8e2f3a}.arena .u.boss{inset:0;background:#b0242f}
.arena .u.cur{outline:3px solid #ffd76a}
.arena .hp{position:absolute;left:3px;right:3px;bottom:1px;height:4px;background:#000a;border-radius:2px}
.arena .hp i{display:block;height:100%;background:#6be38a;border-radius:2px}
.arena .u.foe+.hp i{background:#ff6b6b}
.arena .panel{flex:1;min-width:240px;background:#0d1650;border-radius:10px;padding:12px}
.arena .spells{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}
.arena .log{font-size:12px;opacity:.85;max-height:220px;overflow:auto;margin-top:8px;line-height:1.5}
.arena .order{display:flex;flex-wrap:wrap;gap:4px;font-size:12px;margin:6px 0}
.arena .order span{padding:2px 6px;border-radius:6px;background:#1b2a6b}
.arena .order span.cur{background:#c9821f}.arena .order span.dead{opacity:.35;text-decoration:line-through}
.arena .pick{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:6px;margin:10px 0}
.arena .pick label{background:#0d1650;border-radius:8px;padding:8px;display:flex;gap:8px;align-items:center;cursor:pointer}
.arena .err{color:#ff8a8a;min-height:18px;font-size:13px}
`;async function D(L,g){document.head.appendChild(Object.assign(document.createElement("style"),{textContent:N}));const l=Object.assign(document.createElement("div"),{className:"arena"});if(L.replaceChildren(l),!await g.resume()){l.innerHTML='<h1>Tactical Arena</h1><p>Sign in to the game first, then open this link again.</p><p><a href="./" style="color:#f0b35a">Open the game</a></p>';return}let p;try{p=await g.call("GET","/arena")}catch(e){l.innerHTML=`<h1>Tactical Arena</h1><p>${e instanceof I&&e.status===404?"The arena is not open on this server.":"Could not reach the server."}</p>`;return}let s=null,h="",$=0;const v=[],b=async(e,a)=>{try{const r=await g.post(e,a);r.ok?(p=r,h=""):h=r.reason.replace(/_/g," ")}catch(r){h=r instanceof Error?r.message:String(r)}x()},c=(e,a)=>{const r=e.units.find(n=>n.id===a);return r?r.side==="hero"?`${y[r.classId??""]??""} ${r.classId}`:r.name:a??"?"},T=(e,a)=>{var r,n;switch(a.kind){case"turn":return`— ${c(e,a.src)}'s turn (round ${a.round})`;case"move":return`${c(e,a.src)} moves (${a.amount} MP)`;case"cast":return`${c(e,a.src)} casts ${((r=p.spells[a.spell??""])==null?void 0:r.name)??a.spell}`;case"hit":return`${c(e,a.dst)} takes ${a.amount}${a.dot?` (${a.dot})`:a.collide?" (collision)":""}`;case"heal":return`${c(e,a.dst)} heals ${a.amount}`;case"push":return`${c(e,a.dst)} is pushed ${a.amount}`;case"death":return`${c(e,a.dst)} falls`;case"buff":return a.dot?`${c(e,a.dst)} gets ${a.dot}`:`${c(e,a.dst)}: ${((n=p.spells[a.spell??""])==null?void 0:n.name)??"buff"}`;case"end":return a.result==="win"?"🏆 Victory!":"💀 Defeat";default:return null}};async function C(){const e=await g.state().catch(()=>null),a=(e==null?void 0:e.account.heroes)??[];l.innerHTML=`<h1>Tactical Arena</h1><div class="sub">Practice — turn-based fight on a grid. No cost, no reward. Pick up to 4 heroes.</div>
      <div class="pick">${a.map(n=>`<label><input type="checkbox" value="${n.id}"> ${y[n.classId]??""} ${n.classId} · ${n.rarity} · Lv ${n.level}</label>`).join("")}</div>
      <p>Boss: <select class="boss">${p.bosses.map(n=>`<option value="${n.id}">${n.name}</option>`).join("")}</select></p>
      <div class="err">${h}</div><button class="go">Start fight</button>`;const r=Array.from(l.querySelectorAll(".pick input"));for(const n of r)n.onchange=()=>{r.filter(u=>u.checked).length>4&&(n.checked=!1)};l.querySelector(".go").onclick=()=>{const n=r.filter(u=>u.checked).map(u=>u.value);$=0,v.length=0,b("/arena/start",{heroIds:n,boss:l.querySelector(".boss").value})}}function M(e){var A,E,q;for(;$<e.events.length;$++){const t=T(e,e.events[$]);t&&v.push(t)}const a=e.units.find(t=>t.id===e.current),r=!e.over&&a.side==="hero";s&&!e.targets[s]&&(s=null);const n=new Set(e.walls.map(t=>`${t.x},${t.y}`)),u=new Map(e.reach.map(t=>[`${t.x},${t.y}`,t.cost])),k=new Set((s?e.targets[s]??[]:[]).map(t=>`${t.x},${t.y}`)),P=`min(52px, calc((100vw - 48px) / ${e.width}))`;let w="";for(let t=0;t<e.height;t++)for(let o=0;o<e.width;o++){const d=`${o},${t}`,i=e.units.find(f=>f.alive&&f.x===o&&f.y===t),m=n.has(d)?"wall":s?k.has(d)?"tgt":"":u.has(d)?"reach":"",z=i?`<div class="u ${i.side}${i.boss?" boss":""}${i.id===e.current?" cur":""}" title="${c(e,i.id)} ${i.hp}/${i.maxHp}">${i.side==="hero"?y[i.classId??""]??"?":i.boss?"☠":"•"}</div><div class="hp"><i style="width:${Math.round(100*i.hp/i.maxHp)}%"></i></div>`:"";w+=`<div class="c ${m}" data-x="${o}" data-y="${t}">${z}</div>`}const j=a.spells.map(t=>{var m;const o=p.spells[t],d=a.cooldowns[t]??0,i=r&&(((m=e.targets[t])==null?void 0:m.length)??0)>0;return`<button data-spell="${t}" class="${s===t?"on":""}" ${i?"":"disabled"}>${o.name} · ${o.ap} AP${d?` · ⏳${d}`:""}</button>`}).join(""),H=e.order.map(t=>{const o=e.units.find(d=>d.id===t);return`<span class="${t===e.current?"cur":""}${o.alive?"":" dead"}">${c(e,t)} ${o.hp}</span>`}).join("");l.innerHTML=`<h1>Tactical Arena</h1><div class="sub">Round ${e.round} · ${e.over?e.over==="win"?"Victory":"Defeat":r?"Your turn":"Enemy turn"}</div>
      <div class="row"><div class="board-wrap"><div class="board" style="--cs:${P};grid-template-columns:repeat(${e.width},var(--cs))">${w}</div></div>
      <div class="panel"><b>${c(e,a.id)}</b> — HP ${a.hp}/${a.maxHp} · <b>${a.ap}</b> AP · <b>${a.mp}</b> MP${a.guard?" · 🛡 guard":""}
      <div class="spells">${r?j:""}</div>
      <div class="err">${h}</div>
      ${e.over?'<button class="again">New fight</button>':`<button class="end" ${r?"":"disabled"}>End turn</button> <button class="quit">Leave</button>`}
      <div class="order">${H}</div>
      <div class="log">${v.slice(-40).reverse().join("<br>")}</div></div></div>
      <div class="sub" style="margin-top:10px">Click a blue cell to walk (1 MP a cell, more to leave a cell next to an enemy). Pick a spell, then an orange cell.</div>`,l.querySelectorAll(".c").forEach(t=>{t.onclick=()=>{if(!r)return;const o={x:Number(t.dataset.x),y:Number(t.dataset.y)},d=`${o.x},${o.y}`;if(s&&k.has(d)){const i=s;s=null,b("/arena/act",{kind:"cast",spell:i,at:o})}else!s&&u.has(d)?b("/arena/act",{kind:"move",to:o}):s&&(s=null,x())}}),l.querySelectorAll("[data-spell]").forEach(t=>{t.onclick=()=>{s=s===t.dataset.spell?null:t.dataset.spell,x()}}),(A=l.querySelector(".end"))==null||A.addEventListener("click",()=>{s=null,b("/arena/act",{kind:"end"})});const S=()=>void b("/arena/act",{kind:"quit"});(E=l.querySelector(".quit"))==null||E.addEventListener("click",S),(q=l.querySelector(".again"))==null||q.addEventListener("click",S)}function x(){p.fight?M(p.fight):C()}x()}export{D as openArena};
