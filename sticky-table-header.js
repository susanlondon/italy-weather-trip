(function(){
  let host=null;
  let raf=0;

  function ensureHost(){
    if(host)return host;
    host=document.createElement('div');
    host.id='frozenWeatherHeader';
    host.style.cssText='position:fixed;top:0;z-index:50;display:none;overflow:hidden;background:#fbfcfb;border:1px solid #e4e9e5;border-radius:0 0 12px 12px;box-shadow:0 8px 22px rgba(28,54,42,.12);pointer-events:none;';
    const row=document.createElement('div');
    row.className='frozen-weather-row';
    row.style.cssText='position:relative;width:100%;height:100%;';
    host.appendChild(row);
    document.body.appendChild(host);
    return host;
  }

  function sync(){
    raf=0;
    const wrap=document.querySelector('#tableWrap');
    const header=document.querySelector('#headerRow');
    const table=wrap?.querySelector('table');
    if(!wrap||!header||!table){if(host)host.style.display='none';return;}

    const wr=wrap.getBoundingClientRect();
    const hr=header.getBoundingClientRect();
    const headerH=Math.max(56,Math.round(hr.height));
    const shouldShow=hr.top<0 && wr.bottom>headerH+8 && !wrap.classList.contains('hidden');
    const h=ensureHost();
    if(!shouldShow){h.style.display='none';return;}

    h.style.display='block';
    h.style.left=Math.round(wr.left)+'px';
    h.style.width=Math.round(wr.width)+'px';
    h.style.height=headerH+'px';

    const row=h.firstElementChild;
    row.innerHTML='';
    [...header.children].forEach((th,i)=>{
      const r=th.getBoundingClientRect();
      const c=document.createElement('div');
      c.className='frozen-weather-cell';
      const cs=getComputedStyle(th);
      c.style.cssText=[
        'position:absolute',
        'top:0',
        `left:${Math.round(r.left-wr.left)}px`,
        `width:${Math.round(r.width)}px`,
        `height:${headerH}px`,
        'box-sizing:border-box',
        'display:flex',
        'flex-direction:column',
        'align-items:center',
        'justify-content:center',
        'overflow:hidden',
        `padding:${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
        `background:${cs.backgroundColor||'#fbfcfb'}`,
        `color:${cs.color}`,
        `font-size:${cs.fontSize}`,
        `font-weight:${cs.fontWeight}`,
        `line-height:${cs.lineHeight}`,
        'text-align:center',
        'border-right:1px solid #e4e9e5',
        'border-bottom:1px solid #e4e9e5',
        'white-space:normal'
      ].join(';');
      if(i<2){
        c.style.alignItems='flex-start';
        c.style.textAlign='left';
        c.style.paddingLeft='16px';
        c.style.zIndex='2';
      }
      c.innerHTML=th.innerHTML;
      row.appendChild(c);
    });
  }

  function schedule(){
    if(raf)return;
    raf=requestAnimationFrame(sync);
  }

  function init(){
    ensureHost();
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule,{passive:true});
    const wrap=document.querySelector('#tableWrap');
    if(wrap)wrap.addEventListener('scroll',schedule,{passive:true});
    const header=document.querySelector('#headerRow');
    if(header)new MutationObserver(schedule).observe(header,{childList:true,subtree:true,characterData:true});
    setInterval(schedule,1000);
    schedule();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0));
  else setTimeout(init,0);
})();
