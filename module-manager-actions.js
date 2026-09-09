(function(){
  let undoState=null;
  let undoTimer=null;

  function snapshot(){
    return {
      places: JSON.parse(JSON.stringify(places||[])),
      modules: JSON.parse(JSON.stringify(savedModules||[])),
      favorites: [...(favorites||[])],
      selectedModule: selectedModule||null
    };
  }

  function restore(state){
    if(!state)return;
    places=JSON.parse(JSON.stringify(state.places));
    savedModules=JSON.parse(JSON.stringify(state.modules));
    favorites=new Set(state.favorites||[]);
    selectedModule=state.selectedModule||null;
    savePlaces();
    saveModules();
    localStorage.setItem('italyTripFavorites',JSON.stringify([...favorites]));
    if(typeof renderTable==='function')renderTable();
    if(typeof renderModules==='function')renderModules();
    if(typeof renderModuleManager==='function' && document.querySelector('#moduleManagerModal')?.classList.contains('show'))renderModuleManager();
    if(typeof updateSummary==='function')updateSummary();
    if(typeof updateModuleOptions==='function')updateModuleOptions();
  }

  function showUndo(message,state){
    undoState=state;
    clearTimeout(undoTimer);
    let bar=document.querySelector('#undoBar');
    if(!bar){
      bar=document.createElement('div');
      bar.id='undoBar';
      bar.style.cssText='position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:9999;background:#17221d;color:#fff;padding:10px 12px 10px 16px;border-radius:14px;box-shadow:0 12px 34px rgba(0,0,0,.22);display:flex;align-items:center;gap:14px;font-size:13px;max-width:calc(100vw - 28px)';
      document.body.appendChild(bar);
    }
    bar.innerHTML='';
    const text=document.createElement('span');
    text.textContent=message;
    const btn=document.createElement('button');
    btn.textContent='撤销';
    btn.style.cssText='min-height:30px;border:0;border-radius:9px;padding:0 10px;background:#fff;color:#17221d;font-weight:800;cursor:pointer';
    btn.onclick=()=>{
      restore(undoState);
      undoState=null;
      bar.remove();
      clearTimeout(undoTimer);
    };
    bar.append(text,btn);
    undoTimer=setTimeout(()=>{undoState=null;bar?.remove();},8000);
  }

  window.deletePlace=function(id){
    const p=places.find(x=>x.id===id);
    if(!p)return;
    if(!confirm(`确定删除「${p.name}」吗？`))return;
    const before=snapshot();
    places=places.filter(x=>x.id!==id);
    favorites.delete(id);
    delete weatherCache[id];
    savePlaces();
    localStorage.setItem('italyTripFavorites',JSON.stringify([...favorites]));
    renderTable();
    renderModules();
    updateSummary();
    showUndo(`已删除地点「${p.name}」`,before);
  };

  window.removeModule=function(name){
    if(!name)return;
    const count=places.filter(p=>(p.module||'未分类')===name).length;
    const msg=count
      ? `确定删除模块「${name}」吗？\n\n其中 ${count} 个目的地会保留，并暂时标记为“未分类”。之后可手动加入其他模块。`
      : `确定删除空模块「${name}」吗？`;
    if(!confirm(msg))return;
    const before=snapshot();
    places.forEach(p=>{if((p.module||'未分类')===name)p.module='未分类'});
    savedModules=savedModules.filter(m=>m!==name);
    savePlaces();
    saveModules();
    if(selectedModule===name){selectedModule=null;currentView='modules'}
    if(typeof closeModuleEditor==='function')closeModuleEditor();
    renderModuleManager();
    renderModules();
    renderTable();
    updateSummary();
    updateModuleOptions();
    showUndo(`已删除模块「${name}」`,before);
  };

  function enhanceModuleManager(){
    const list=document.querySelector('#moduleManagerList');
    if(!list)return;
    list.querySelectorAll('.module-manager-item').forEach(item=>{
      const edit=item.querySelector('[data-mm-edit]');
      if(!edit)return;
      const name=decodeURIComponent(edit.dataset.mmEdit||'');
      if(!name)return;
      let actions=item.querySelector('.module-actions');
      if(!actions){
        actions=document.createElement('div');
        actions.className='module-actions';
        edit.parentNode.insertBefore(actions,edit);
        actions.appendChild(edit);
      }
      if(!actions.querySelector('[data-mm-delete]')){
        const del=document.createElement('button');
        del.className='ghost danger module-action-btn';
        del.textContent='删除';
        del.dataset.mmDelete=encodeURIComponent(name);
        del.onclick=e=>{e.stopPropagation();removeModule(name)};
        actions.appendChild(del);
      }
    });
  }

  const originalOpenModuleEditor=window.openModuleEditor;
  if(typeof originalOpenModuleEditor==='function'){
    window.openModuleEditor=function(name){
      originalOpenModuleEditor.apply(this,arguments);
      const del=document.querySelector('#deleteModuleBtn');
      if(del)del.style.visibility='visible';
    };
  }

  const originalRenderModuleManager=window.renderModuleManager;
  if(typeof originalRenderModuleManager==='function'){
    window.renderModuleManager=function(){
      originalRenderModuleManager.apply(this,arguments);
      enhanceModuleManager();
    };
  }

  document.addEventListener('click',e=>{
    if(e.target.closest('#manageModulesBtn'))setTimeout(enhanceModuleManager,0);
  });
  setTimeout(enhanceModuleManager,0);
})();
