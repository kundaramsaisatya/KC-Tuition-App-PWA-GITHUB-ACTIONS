(function(){
  const send=(action,details='')=>fetch('/client-event',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,details})}).catch(()=>{});
  document.addEventListener('contextmenu',e=>e.preventDefault());
  document.addEventListener('copy',e=>{e.preventDefault();send('copy_attempt');});
  document.addEventListener('cut',e=>{e.preventDefault();send('copy_attempt','cut');});
  document.addEventListener('keydown',e=>{
    const k=e.key.toLowerCase();
    if((e.ctrlKey||e.metaKey)&&['p','s','u','c'].includes(k)){e.preventDefault();send(k==='p'?'print_attempt':k==='c'?'copy_attempt':'devtools_hint');}
    if(e.key==='PrintScreen'){send('print_attempt','PrintScreen key');}
    if(e.key==='F12'||(e.ctrlKey&&e.shiftKey&&['i','j','c'].includes(k))){e.preventDefault();send('devtools_hint');}
  });
  window.addEventListener('beforeprint',()=>send('print_attempt'));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)send('visibility_hidden');});
})();
