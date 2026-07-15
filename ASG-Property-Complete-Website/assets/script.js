document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.enquiryForm').forEach(function(form) {
    const wrap = form.closest('.contact');
    const status = wrap ? wrap.querySelector('.formStatus') : null;
    const frame = wrap ? wrap.querySelector('.submissionFrame') : null;
    const button = form.querySelector('button[type="submit"]');
    let submitted = false;
    form.addEventListener('submit', function () {
      submitted = true;
      button.disabled = true;
      button.textContent = 'Sending…';
      if(status){ status.style.display='block'; status.textContent='Sending your enquiry…'; }
    });
    if(frame) frame.addEventListener('load', function () {
      if(!submitted) return;
      if(status) status.textContent='Thank you. Your enquiry has been received.';
      button.disabled=false; button.textContent='Send enquiry'; form.reset(); submitted=false;
    });
  });

  const search = document.getElementById('academySearch');
  if(search) {
    const cards = Array.from(document.querySelectorAll('[data-search]'));
    search.addEventListener('input', function() {
      const q = this.value.toLowerCase().trim();
      cards.forEach(function(card) {
        card.classList.toggle('hidden', q && !card.dataset.search.toLowerCase().includes(q));
      });
    });
  }
});