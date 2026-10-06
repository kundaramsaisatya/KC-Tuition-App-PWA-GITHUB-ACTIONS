(function(){
  const sidebar=document.querySelector('.sidebar');
  const menu=document.querySelector('[data-menu]');
  if(menu) menu.addEventListener('click',()=>sidebar?.classList.toggle('open'));
  const buttons=[...document.querySelectorAll('[data-section]')];
  const sections=[...document.querySelectorAll('.section[data-panel]')];
  function activate(id){
    sections.forEach(s=>s.classList.toggle('active',s.dataset.panel===id));
    buttons.forEach(b=>b.classList.toggle('active',b.dataset.section===id));
    const title=document.querySelector('[data-page-title]'); const desc=document.querySelector('[data-page-desc]');
    const active=sections.find(s=>s.dataset.panel===id);
    if(title&&active) title.textContent=active.dataset.title||'Dashboard';
    if(desc&&active) desc.textContent=active.dataset.desc||'';
    history.replaceState(null,'','#'+id);
    sidebar?.classList.remove('open'); window.scrollTo({top:0,behavior:'smooth'});
  }
  buttons.forEach(b=>b.addEventListener('click',()=>activate(b.dataset.section)));
  const initial=location.hash.replace('#',''); activate(sections.some(s=>s.dataset.panel===initial)?initial:(sections[0]?.dataset.panel||'overview'));
  if(location.pathname==='/student'){
    const send=(action,details)=>fetch('/client-event',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,details}),keepalive:true}).catch(()=>{});
    send('page_view',location.pathname+location.hash);
    let last=Date.now();
    const heartbeat=()=>{send('heartbeat',`route=${location.pathname}${location.hash};visible=${!document.hidden};seconds=${Math.round((Date.now()-last)/1000)}`);last=Date.now();};
    setInterval(heartbeat,30000);
    document.addEventListener('visibilitychange',()=>send(document.hidden?'app_hidden':'app_visible',location.pathname+location.hash));
    window.addEventListener('pagehide',()=>send('app_exit_detected',location.pathname+location.hash));
    window.addEventListener('hashchange',()=>send('page_view',location.pathname+location.hash));
  }
  if(location.pathname==='/student' && 'Notification' in window && Notification.permission==='default'){setTimeout(()=>Notification.requestPermission().catch(()=>{}),1200);}
})();
