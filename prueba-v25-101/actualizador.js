(function(){
  const CURRENT='25.101';
  async function check(){
    try{
      const r=await fetch('./version.json?ts='+Date.now(),{cache:'no-store'});
      if(!r.ok)return;
      const j=await r.json();
      if(j.version && j.version!==CURRENT){
        if('serviceWorker' in navigator){
          const regs=await navigator.serviceWorker.getRegistrations();
          regs.forEach(r=>{try{r.update()}catch(e){}});
        }
        location.replace('./?v='+encodeURIComponent(j.version)+'&refresh='+Date.now());
      }
    }catch(e){}
  }
  window.addEventListener('load',()=>{setTimeout(check,1200);setInterval(check,5*60*1000)});
})();
