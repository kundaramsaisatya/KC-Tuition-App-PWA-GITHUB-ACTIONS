(function(){
  const el=document.getElementById('doc-viewer'); if(!el)return;
  const mime=el.dataset.mime,url=el.dataset.url,name=el.dataset.name||'';
  document.addEventListener('contextmenu',e=>e.preventDefault());
  document.addEventListener('dragstart',e=>e.preventDefault());
  document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&['s','p','c','u'].includes(e.key.toLowerCase()))e.preventDefault();});
  if(mime.startsWith('image/')){const img=document.createElement('img');img.src=url;img.alt=name;img.draggable=false;img.className='protected-image';el.appendChild(img);return;}
  if(mime==='application/pdf'){
    const loading=document.createElement('div');loading.className='doc-loading';loading.innerHTML='<strong>Loading PDF…</strong><p>Please wait.</p>';el.appendChild(loading);
    const script=document.createElement('script');
    script.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs';
    script.type='module';
    script.onload=async()=>{
      try{
        const pdfjs=window.pdfjsLib || await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs');
        pdfjs.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';
        const res=await fetch(url,{credentials:'same-origin'}); if(!res.ok) throw new Error('Unable to load PDF');
        const data=await res.arrayBuffer(); const pdf=await pdfjs.getDocument({data}).promise;
        el.innerHTML='';
        for(let n=1;n<=pdf.numPages;n++){
          const page=await pdf.getPage(n), viewport=page.getViewport({scale:1.35});
          const wrap=document.createElement('div'); wrap.className='pdf-page';
          const canvas=document.createElement('canvas'); canvas.width=viewport.width; canvas.height=viewport.height; canvas.className='pdf-canvas';
          const label=document.createElement('div'); label.className='small'; label.textContent='Page '+n+' of '+pdf.numPages;
          wrap.appendChild(canvas); wrap.appendChild(label); el.appendChild(wrap);
          await page.render({canvasContext:canvas.getContext('2d',{alpha:false}),viewport}).promise;
        }
      }catch(e){console.error(e);el.innerHTML='<div class="empty">This PDF could not be displayed. Please try again.</div>';}
    };
    script.onerror=()=>{el.innerHTML='<div class="empty">PDF viewer could not load. Please check your internet connection.</div>';};
    document.body.appendChild(script); return;
  }
  if(mime==='application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
    const msg=document.createElement('div');msg.className='doc-loading';msg.innerHTML='<strong>Document preview</strong><p>DOCX preview is being prepared in your browser.</p>';el.appendChild(msg);
    const script=document.createElement('script');script.src='https://unpkg.com/mammoth@1.8.0/mammoth.browser.min.js';script.onload=async()=>{try{const r=await fetch(url),buf=await r.arrayBuffer(),out=await window.mammoth.convertToHtml({arrayBuffer:buf});el.innerHTML='<div class="docx-content">'+out.value+'</div>';}catch(e){el.innerHTML='<div class="empty">This DOCX could not be previewed. Please ask your teacher for a PDF version.</div>';}};script.onerror=()=>{el.innerHTML='<div class="empty">DOCX preview needs an internet connection. Please ask your teacher for a PDF version.</div>';};document.body.appendChild(script);return;}
  el.innerHTML='<div class="empty">This file type cannot be previewed securely. Please ask your teacher to upload it as PDF, DOCX or an image.</div>';
})();
