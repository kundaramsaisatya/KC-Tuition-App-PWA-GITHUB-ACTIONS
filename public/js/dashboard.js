(function(){
  const sidebar=document.querySelector('.sidebar');
  const menu=document.querySelector('[data-menu]');
  if(menu) menu.addEventListener('click',()=>sidebar?.classList.toggle('open'));
  const buttons=[...document.querySelectorAll('[data-section]')];
  const sections=[...document.querySelectorAll('.section[data-panel]')];
  const languageButton=document.querySelector('[data-language-toggle]');
  let language=localStorage.getItem('kc-language')||'en';
  const originalText=new WeakMap();
  const hindi={
    'Student Portal':'छात्र पोर्टल','My learning':'मेरी पढ़ाई','Overview':'अवलोकन','Homework':'गृहकार्य','Tests & Results':'परीक्षाएँ और परिणाम','Attendance':'उपस्थिति','My Classes':'मेरी कक्षाएँ','Leave Requests':'छुट्टी का अनुरोध','Announcements':'सूचनाएँ','Install App':'ऐप इंस्टॉल करें','Teacher':'शिक्षक','Logout':'लॉग आउट','Quick status':'त्वरित स्थिति','Done':'पूरा','Pending':'बाकी','Based on recorded classes':'दर्ज कक्षाओं के आधार पर','View homework':'गृहकार्य देखें','Available tests':'उपलब्ध परीक्षाएँ','My results':'मेरे परिणाम','Present / Late':'उपस्थित / विलंब','Absent':'अनुपस्थित','Leave':'छुट्टी','Assigned homework':'दिया गया गृहकार्य','Homework status':'गृहकार्य की स्थिति','Mark your work done after completing it.':'काम पूरा करने के बाद गृहकार्य को पूरा चिह्नित करें।','Save homework status':'गृहकार्य की स्थिति सेव करें','No homework assigned.':'कोई गृहकार्य नहीं दिया गया।','No tests available yet.':'अभी कोई परीक्षा उपलब्ध नहीं है।','No marks recorded yet.':'अभी कोई अंक दर्ज नहीं हैं।','Today\'s & upcoming classes':'आज और आने वाली कक्षाएँ','Class information':'कक्षा की जानकारी','Request leave':'छुट्टी का अनुरोध','My requests':'मेरे अनुरोध','Send request':'अनुरोध भेजें','No leave requests.':'कोई छुट्टी अनुरोध नहीं है।','Announcements':'सूचनाएँ','No announcements yet.':'अभी कोई सूचना नहीं है।','Fees':'शुल्क','No fee records yet.':'अभी कोई शुल्क रिकॉर्ड नहीं है।','View material':'सामग्री देखें','View':'देखें','Paper':'प्रश्नपत्र','Type':'प्रकार','Total':'कुल','Date':'तारीख','Test':'परीक्षा','Subject':'विषय','Marks':'अंक','Due date':'नियत तारीख','Status':'स्थिति','Paid date':'भुगतान की तारीख','From':'से','To':'तक','Reason':'कारण','Note':'टिप्पणी','Your learning snapshot.':'आपकी पढ़ाई की संक्षिप्त जानकारी।','View protected study material and update completion status.':'अध्ययन सामग्री देखें और पूरा होने की स्थिति अपडेट करें।','View assigned tests and your published marks.':'अपनी परीक्षाएँ और प्रकाशित अंक देखें।','Review your attendance history.':'अपनी उपस्थिति देखें।','Today\'s and upcoming tuition sessions for your standard.':'आज और आने वाली ट्यूशन कक्षाएँ देखें।','Request leave and check approval status.':'छुट्टी का अनुरोध करें और उसकी स्थिति देखें।','Updates from Kundaram Chandrakala Tuition.':'कुंदराम चंद्रकला ट्यूशन की सूचनाएँ।','See paid and unpaid tuition fees.':'भुगतान किए गए और बाकी शुल्क देखें।'
  };
  function translateTextNodes(){
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      if(node.parentElement?.closest('script,style')) return;
      if(node.nodeValue.trim()==='') return;
      if(!originalText.has(node)) originalText.set(node,node.nodeValue);
      const original=originalText.get(node);
      const key=original.trim();
      if(language==='hi' && hindi[key]) node.nodeValue=original.replace(key,hindi[key]);
      else if(language==='en') node.nodeValue=original;
    });
  }
  function applyLanguage(){
    document.documentElement.lang=language==='hi'?'hi':'en';
    translateTextNodes();
    document.querySelectorAll('[data-en][data-hi]').forEach(el=>{el.textContent=language==='hi'?el.dataset.hi:el.dataset.en;});
    if(languageButton) languageButton.textContent=language==='hi'?'English':'हिन्दी';
    const active=sections.find(s=>s.classList.contains('active'));
    const title=document.querySelector('[data-page-title]'); const desc=document.querySelector('[data-page-desc]');
    if(active){if(title) title.textContent=language==='hi'?(active.dataset.titleHi||active.dataset.title||'Dashboard'):(active.dataset.title||'Dashboard');if(desc) desc.textContent=language==='hi'?(active.dataset.descHi||active.dataset.desc||''):(active.dataset.desc||'');}
  }
  function activate(id){
    sections.forEach(s=>s.classList.toggle('active',s.dataset.panel===id));
    buttons.forEach(b=>b.classList.toggle('active',b.dataset.section===id));
    applyLanguage();
    history.replaceState(null,'','#'+id); sidebar?.classList.remove('open'); window.scrollTo({top:0,behavior:'smooth'});
  }
  buttons.forEach(b=>b.addEventListener('click',()=>activate(b.dataset.section)));
  languageButton?.addEventListener('click',()=>{language=language==='hi'?'en':'hi';localStorage.setItem('kc-language',language);applyLanguage();});
  const initial=location.hash.replace('#',''); activate(sections.some(s=>s.dataset.panel===initial)?initial:(sections[0]?.dataset.panel||'overview'));
})();
