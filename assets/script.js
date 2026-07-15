
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('.enquiryForm').forEach(form=>{
  const box=form.closest('.contact'),status=box?.querySelector('.formStatus'),frame=box?.querySelector('.submissionFrame'),btn=form.querySelector('button[type=submit]');let sent=false;
  form.addEventListener('submit',()=>{sent=true;btn.disabled=true;btn.textContent='Sending…';if(status){status.style.display='block';status.textContent='Sending your enquiry…';}});
  frame?.addEventListener('load',()=>{if(!sent)return;if(status)status.textContent='Thank you. Your enquiry has been received.';btn.disabled=false;btn.textContent='Send enquiry';form.reset();sent=false;});
 });
 const q=document.getElementById('academySearch');if(q){const cards=[...document.querySelectorAll('[data-search]')];q.addEventListener('input',()=>{const v=q.value.toLowerCase().trim();cards.forEach(c=>c.classList.toggle('hidden',v&&!c.dataset.search.toLowerCase().includes(v)));});}
 const calc=document.querySelector('[data-calculator]');if(calc){const f=()=>{const type=calc.dataset.calculator;const n=id=>parseFloat(document.getElementById(id)?.value)||0;const money=v=>'£'+Math.round(v).toLocaleString('en-GB');if(type==='roi'){const profit=n('profit'),cash=n('cash');document.getElementById('roiOut').textContent=cash?((profit/cash)*100).toFixed(1)+'%':'0.0%';}if(type==='yield'){const rent=n('rent'),price=n('price');document.getElementById('yieldOut').textContent=price?((rent*12/price)*100).toFixed(2)+'%':'0.00%';}if(type==='refurb'){const purchase=n('purchase'),refurb=n('refurb'),costs=n('costs'),gdv=n('gdv');const total=purchase+refurb+costs,profit=gdv-total;document.getElementById('totalOut').textContent=money(total);document.getElementById('profitOut').textContent=money(profit);document.getElementById('roiOut').textContent=total?((profit/total)*100).toFixed(1)+'%':'0.0%';}};calc.querySelectorAll('input').forEach(i=>i.addEventListener('input',f));f();}
});
