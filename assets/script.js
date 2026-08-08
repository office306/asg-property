document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('.year').forEach(el=>el.textContent=new Date().getFullYear());
  document.querySelectorAll('span').forEach(el=>{
    if(el.textContent.trim()==='ASG PROPERTY LTD')el.textContent='ASG PROPERTY';
    if(/^© \d{4} ASG Property Ltd$/.test(el.textContent.trim()))el.textContent=el.textContent.replace('ASG Property Ltd','ASG Property');
  });
  document.querySelectorAll('.footer .legal').forEach(legal=>{
    const ownership=document.createElement('span');
    ownership.textContent='ASG Property is a trading name of Adeena Property Ltd.';
    legal.insertBefore(ownership,legal.lastElementChild);
  });
  document.querySelectorAll('.enquiryForm').forEach(form=>{
    const frame=form.parentElement.querySelector('.submissionFrame');
    const status=form.parentElement.querySelector('.formStatus');
    const btn=form.querySelector('button[type="submit"]');
    let submitted=false;
    let confirmationTimer;

    const finishSubmission=success=>{
      if(!submitted)return;
      submitted=false;
      clearTimeout(confirmationTimer);
      btn.disabled=false;
      btn.textContent='Send enquiry';

      if(success){
        form.reset();
        if(status)status.textContent='Thank you. Your enquiry has been received and we will be in touch shortly.';
      }else if(status){
        status.textContent='We could not send your enquiry. Please try again or call 07378 169004.';
      }
    };

    window.addEventListener('message',event=>{
      if(!submitted)return;

      let result=event.data;
      if(typeof result==='string'){
        try{result=JSON.parse(result);}catch{return;}
      }

      if(!result||result.type!=='asg-enquiry-result')return;
      finishSubmission(result.success===true);
    });

    frame?.addEventListener('load',()=>{
      if(submitted)finishSubmission(true);
    });

    form.addEventListener('submit',()=>{
      submitted=true;
      btn.disabled=true;btn.textContent='Sending...';
      if(status){status.style.display='block';status.textContent='Sending your enquiry...';}
      confirmationTimer=setTimeout(()=>finishSubmission(false),15000);
    });
  });
});
