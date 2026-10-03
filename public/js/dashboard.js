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
})();
