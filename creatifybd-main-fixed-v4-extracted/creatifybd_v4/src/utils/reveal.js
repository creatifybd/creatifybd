export const observeElements = () => {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { 
      if (e.isIntersecting) {
        e.target.classList.add('vis');
        io.unobserve(e.target); // Once visible, stop observing
      }
    });
  }, { threshold: 0.1 });

  const revealElements = document.querySelectorAll('.sr');
  revealElements.forEach(el => io.observe(el));
};
