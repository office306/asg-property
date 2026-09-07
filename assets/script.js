// Google Analytics 4 with consent controls. No form-field values or contact details
// are sent to Analytics.
(function(){
  const measurementId='G-H70YT3QCP5';
  const consentKey='asg-analytics-consent';

  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
  window.gtag('consent','default',{
    analytics_storage:'denied',
    ad_storage:'denied',
    ad_user_data:'denied',
    ad_personalization:'denied',
    wait_for_update:500
  });
  window.gtag('js',new Date());
  window.gtag('config',measurementId,{anonymize_ip:true});

  const analyticsScript=document.createElement('script');
  analyticsScript.async=true;
  analyticsScript.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(measurementId);
  document.head.appendChild(analyticsScript);

  const setConsent=choice=>{
    const granted=choice==='granted';
    window.gtag('consent','update',{analytics_storage:granted?'granted':'denied'});
    localStorage.setItem(consentKey,choice);
    document.querySelector('.asg-cookie-banner')?.remove();
  };

  document.addEventListener('DOMContentLoaded',()=>{
    const savedConsent=localStorage.getItem(consentKey);
    if(savedConsent){
      setConsent(savedConsent);
    }else{
      const banner=document.createElement('div');
      banner.className='asg-cookie-banner';
      banner.setAttribute('role','dialog');
      banner.setAttribute('aria-label','Analytics cookies');
      banner.innerHTML='<div><strong>Help us improve this website</strong><p>We use optional analytics cookies to understand which pages are useful. No form details are sent to Analytics. <a href="/privacy.html">Privacy policy</a></p></div><div class="asg-cookie-actions"><button type="button" data-consent="denied">Reject</button><button type="button" data-consent="granted">Accept analytics</button></div>';
      Object.assign(banner.style,{position:'fixed',zIndex:'10000',left:'16px',right:'16px',bottom:'16px',maxWidth:'760px',margin:'auto',padding:'18px',border:'1px solid rgba(255,255,255,.2)',borderRadius:'14px',background:'#101719',color:'#fff',boxShadow:'0 14px 40px rgba(0,0,0,.4)',display:'flex',gap:'18px',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap'});
      banner.querySelector('p').style.margin='6px 0 0';
      banner.querySelector('a').style.color='#63e6d3';
      const actions=banner.querySelector('.asg-cookie-actions');
      Object.assign(actions.style,{display:'flex',gap:'10px',flexWrap:'wrap'});
      actions.querySelectorAll('button').forEach(button=>Object.assign(button.style,{padding:'10px 14px',borderRadius:'9px',border:'1px solid #63e6d3',cursor:'pointer'}));
      actions.querySelector('[data-consent="granted"]').style.background='#63e6d3';
      actions.querySelector('[data-consent="denied"]').style.background='transparent';
      actions.querySelector('[data-consent="denied"]').style.color='#fff';
      banner.addEventListener('click',event=>{
        const button=event.target.closest('[data-consent]');
        if(button)setConsent(button.dataset.consent);
      });
      document.body.appendChild(banner);
    }

    document.addEventListener('click',event=>{
      const link=event.target.closest('a[href]');
      if(!link)return;
      const href=link.getAttribute('href')||'';
      if(href.startsWith('tel:'))window.gtag('event','phone_click');
      if(href.startsWith('mailto:'))window.gtag('event','email_click');
      if(/wa\.me|whatsapp/i.test(href))window.gtag('event','whatsapp_click');
    });

    document.addEventListener('submit',event=>{
      const form=event.target;
      if(form.matches('.enquiryForm,.tenantFullApplicationForm')){
        window.gtag('event','generate_lead',{form_type:form.classList.contains('tenantFullApplicationForm')?'tenant_buyer':'enquiry'});
      }
    });
  });
})();

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
  document.querySelectorAll('.links').forEach(nav=>{
    if(nav.querySelector('a[href="properties-available.html"]'))return;
    const link=document.createElement('a');link.href='properties-available.html';link.textContent='Available Properties';
    const tenantLink=nav.querySelector('a[href="tenant-buyers.html"]');
    tenantLink?.insertAdjacentElement('afterend',link);
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
    if(new URLSearchParams(location.search).get('property')==='oak-lane-pe8'){
      const notes=form.querySelector('textarea[name="entry.135270774"]');
      if(notes&&!notes.value)notes.value='I am interested in the four-bedroom home on Oak Lane, PE8.';
    }
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
