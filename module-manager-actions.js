(function(){
  function enhanceModuleManager(){
    const list=document.querySelector('#moduleManagerList');
    if(!list)return;
    list.querySelectorAll('.module-manager-item').forEach(item=>{
      if(item.querySelector('[data-mm-delete]'))return;
      const edit=item.querySelector('[data-mm-edit]');
      if(!edit)return;
      const name=decodeURIComponent(edit.dataset.mmEdit||'');
      if(!name||name==='未分类')return;
      const actions=document.createElement('div');
      actions.className='module-actions';
      const del=document.createElement('button');
      del.className='ghost danger module-action-btn';
      del.textContent='删除';
      del.dataset.mmDelete=encodeURIComponent(name);
      del.onclick=e=>{
        e.stopPropagation();
        if(typeof removeModule==='function')removeModule(name);
      };
      edit.parentNode.insertBefore(actions,edit);
      actions.appendChild(edit);
      actions.appendChild(del);
    });
  }

  const original=window.renderModuleManager;
  if(typeof original==='function'){
    window.renderModuleManager=function(){
      original.apply(this,arguments);
      enhanceModuleManager();
    };
  }

  document.addEventListener('click',e=>{
    if(e.target.closest('#manageModulesBtn'))setTimeout(enhanceModuleManager,0);
  });
  setTimeout(enhanceModuleManager,0);
})();
