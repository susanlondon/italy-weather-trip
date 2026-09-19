(function(){
  function setup(){
    const wrap=document.querySelector('.table-wrap');
    if(!wrap||document.querySelector('#stickyHScroll'))return;
    wrap.style.overflowX='auto';
    wrap.style.overscrollBehaviorX='contain';

    const bar=document.createElement('div');
    bar.id='stickyHScroll';
    bar.style.cssText='position:fixed;left:0;right:0;bottom:0;height:18px;overflow-x:auto;overflow-y:hidden;z-index:25;background:rgba(255,255,255,.96);border-top:1px solid #e4e9e5;box-shadow:0 -4px 12px rgba(28,54,42,.06);display:none';
    const inner=document.createElement('div');
    inner.style.height='1px';
    bar.appendChild(inner);
    document.body.appendChild(bar);

    let syncing=false;
    function syncWidth(){
      inner.style.width=wrap.scrollWidth+'px';
      bar.scrollLeft=wrap.scrollLeft;
    }
    function updateVisibility(){
      const r=wrap.getBoundingClientRect();
      const needs=wrap.scrollWidth>wrap.clientWidth+2;
      const inView=r.top<window.innerHeight&&r.bottom>0;
      bar.style.display=needs&&inView?'block':'none';
    }
    wrap.addEventListener('scroll',()=>{
      if(syncing)return;
      syncing=true;
      bar.scrollLeft=wrap.scrollLeft;
      requestAnimationFrame(()=>syncing=false);
    },{passive:true});
    bar.addEventListener('scroll',()=>{
      if(syncing)return;
      syncing=true;
      wrap.scrollLeft=bar.scrollLeft;
      requestAnimationFrame(()=>syncing=false);
    },{passive:true});
    wrap.addEventListener('wheel',e=>{
      if(e.shiftKey&&Math.abs(e.deltaY)>Math.abs(e.deltaX)){
        e.preventDefault();
        wrap.scrollLeft+=e.deltaY;
      }
    },{passive:false});
    window.addEventListener('resize',()=>{syncWidth();updateVisibility()});
    window.addEventListener('scroll',updateVisibility,{passive:true});
    const ro=new ResizeObserver(()=>{syncWidth();updateVisibility()});
    ro.observe(wrap);
    const table=wrap.querySelector('table');if(table)ro.observe(table);
    syncWidth();updateVisibility();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(setup,0));
  else setTimeout(setup,0);
})();