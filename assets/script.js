
document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('.year').forEach(el=>el.textContent=new Date().getFullYear());
  document.querySelectorAll('.enquiryForm').forEach(form=>{
    const frame=form.parentElement.querySelector('.submissionFrame');
    const status=form.parentElement.querySelector('.formStatus');
    form.addEventListener('submit',()=>{
      const btn=form.querySelector('button[type="submit"]');
      btn.disabled=true;btn.textContent='Sending...';
      if(status){status.style.display='block';status.textContent='Sending your enquiry...';}
      setTimeout(()=>{
        form.reset();btn.disabled=false;btn.textContent='Send enquiry';
        if(status)status.textContent='Thank you. Your enquiry has been sent and we will be in touch shortly.';
      },1800);
    });
  });
});
