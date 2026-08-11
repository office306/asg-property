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

  if(document.querySelector('.tenantFormCard')&&!document.querySelector('.tenantFullApplicationForm')){
    document.querySelectorAll('a[href="#apply"]').forEach(link=>link.href='tenant-buyer-application.html');
    const card=document.querySelector('.tenantFormCard');
    card.innerHTML='<div class="formCardHeading"><span class="formStep">ASG Tenant Buyer</span><h3>Start your application</h3><p>Complete our secure three-stage application in a few minutes. Your answers go directly to the ASG team for assessment.</p></div><a class="btn formSubmit" href="tenant-buyer-application.html">Start my application →</a><div class="applicationReassurance"><span>✓ No obligation</span><span>✓ Secure enquiry</span><span>✓ Reviewed by ASG</span></div>';
  }

  document.querySelectorAll('.tenantFullApplicationForm').forEach(form=>{
    const correctedFieldNames={
      'entry.580749950':'entry.246502702',
      'entry.135270774':'entry.164494162',
      'entry.246502702':'entry.568137211',
      'entry.164494162':'entry.1791243014',
      'entry.568137211':'entry.937044322',
      'entry.937044322':'entry.1586986225',
      'entry.1791243014':'entry.166637531',
      'entry.166637531':'entry.2107073247',
      'entry.2107073247':'entry.1460724022',
      'entry.1586986225':'entry.580749950',
      'entry.1460724022':'entry.674011893',
      'entry.674011893':'entry.135270774'
    };
    [...form.elements].forEach(field=>{if(correctedFieldNames[field.name])field.dataset.correctName=correctedFieldNames[field.name];});
    [...form.elements].forEach(field=>{if(field.dataset.correctName)field.name=field.dataset.correctName;});
    const stages=[...form.querySelectorAll('.applicationStage')];
    const progress=form.closest('.bespokeApplicationCard')?.querySelector('.applicationProgress');
    const sideSteps=[...document.querySelectorAll('.applicationAside li')];
    const frame=form.parentElement.querySelector('.formResponseFrame');
    let current=0,submitted=false;
    const showStage=index=>{
      current=index;
      stages.forEach((stage,i)=>stage.classList.toggle('active',i===index));
      sideSteps.forEach((step,i)=>step.classList.toggle('active',i===index));
      if(progress){progress.querySelector('b').textContent=index+1;progress.querySelector('i').style.width=((index+1)/stages.length*100)+'%';}
      form.scrollIntoView({behavior:'smooth',block:'start'});
    };
    const validStage=stage=>{
      const invalid=[...stage.querySelectorAll('input,select,textarea')].find(field=>!field.checkValidity());
      if(invalid){invalid.reportValidity();invalid.focus();return false;}
      return true;
    };
    form.querySelectorAll('.nextStage').forEach(button=>button.addEventListener('click',()=>{if(validStage(stages[current]))showStage(current+1);}));
    form.querySelectorAll('.backStage').forEach(button=>button.addEventListener('click',()=>showStage(Math.max(0,current-1))));
    form.addEventListener('submit',event=>{
      if(!validStage(stages[current])){event.preventDefault();return;}
      submitted=true;
      const button=form.querySelector('.submitApplication');
      button.disabled=true;button.textContent='Sending application…';
      const leadFrame=document.createElement('iframe');
      leadFrame.name='tenant-lead-response-'+Date.now();
      leadFrame.className='formResponseFrame';
      document.body.appendChild(leadFrame);
      const leadForm=document.createElement('form');
      leadForm.method='post';
      leadForm.action='https://docs.google.com/forms/u/0/d/e/1FAIpQLSfCIhjXujI_MAonBbyGyKZxgVvUXx16wz5Bwk1wcIJo51YHdQ/formResponse';
      leadForm.target=leadFrame.name;
      const leadFields={
        'entry.1029801545':form.querySelector('[name="entry.988995317"]').value,
        'entry.1119170376':form.querySelector('[name="entry.2018621011"]').value,
        'entry.193637968':form.querySelector('[name="entry.553183338"]').value,
        'entry.2034330816':form.querySelector('[name="entry.1248601910"]').value,
        'entry.1430671076':'I agree that ASG Property may use my details to contact me about Tenant Buyer opportunities. I have read the ASG Property Privacy Policy.'
      };
      Object.entries(leadFields).forEach(([name,value])=>{const input=document.createElement('input');input.type='hidden';input.name=name;input.value=value;leadForm.appendChild(input);});
      document.body.appendChild(leadForm);
      leadForm.submit();
      setTimeout(()=>{leadForm.remove();leadFrame.remove();},20000);
    });
    frame?.addEventListener('load',()=>{
      if(!submitted)return;
      submitted=false;
      stages.forEach(stage=>stage.classList.remove('active'));
      if(progress)progress.style.display='none';
      form.querySelector('.applicationComplete').classList.add('active');
      sideSteps.forEach(step=>step.classList.remove('active'));
      form.scrollIntoView({behavior:'smooth',block:'center'});
    });
  });
});
