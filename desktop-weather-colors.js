(function(){
  var styles={
    'wx-sunny':['#cfeeda','#b8e2c7'],
    'wx-mostly':['#e5f3e9','#d2e8d9'],
    'wx-cloudy':['#e2e9ef','#cbd7df'],
    'wx-fog':['#ececeb','#dededb'],
    'wx-showers':['#fff2c7','#f2dfaa'],
    'wx-rain':['#ffe0c7','#f2c9aa'],
    'wx-snow':['#e5eef7','#ceddea'],
    'wx-storm':['#f8d4d6','#eeb9bd'],
    'wx-unknown':['#f3f5f3','#e5e9e6']
  };
  function stateFromCell(cell){
    var wx=cell.querySelector('.wx');
    var t=(wx?wx.textContent:cell.textContent)||'';
    if(t.includes('☀️')||t.includes('☀'))return'wx-sunny';
    if(t.includes('🌤️')||t.includes('🌤'))return'wx-mostly';
    if(t.includes('☁️')||t.includes('☁'))return'wx-cloudy';
    if(t.includes('🌫️')||t.includes('🌫'))return'wx-fog';
    if(t.includes('🌦️')||t.includes('🌦'))return'wx-showers';
    if(t.includes('🌧️')||t.includes('🌧'))return'wx-rain';
    if(t.includes('🌨️')||t.includes('🌨'))return'wx-snow';
    if(t.includes('⛈️')||t.includes('⛈'))return'wx-storm';
    return'wx-unknown';
  }
  function apply(){
    document.querySelectorAll('.weather').forEach(function(cell){
      var state=stateFromCell(cell);
      ['wx-sunny','wx-mostly','wx-cloudy','wx-fog','wx-showers','wx-rain','wx-snow','wx-storm','wx-unknown'].forEach(function(c){cell.classList.remove(c)});
      cell.classList.add(state);
      var s=styles[state]||styles['wx-unknown'];
      cell.style.setProperty('background',s[0],'important');
      cell.style.setProperty('background-color',s[0],'important');
      cell.style.setProperty('border-color',s[1],'important');
      cell.dataset.weatherState=state;
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
  var target=document.querySelector('#weatherBody')||document.body;
  new MutationObserver(function(){requestAnimationFrame(apply)}).observe(target,{childList:true,subtree:true,characterData:true});
  [100,500,1200,2500,5000].forEach(function(ms){setTimeout(apply,ms)});
})();