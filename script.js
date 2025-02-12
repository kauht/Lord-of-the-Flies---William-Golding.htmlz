document.addEventListener('DOMContentLoaded', () => {
    // Load saved position
    const savedPosition = localStorage.getItem('bookPosition');
    if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition));
    }
    
    // Save position when scrolling stops
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            localStorage.setItem('bookPosition', window.scrollY.toString());
        }, 100);
    });
});
