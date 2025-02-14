document.addEventListener('DOMContentLoaded', function() {
    // Create main container for scaling and scrolling
    const mainContainer = document.createElement('div');
    mainContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-y: auto;
        overflow-x: hidden;
    `;

    
    // Create content container for scaling
    const contentContainer = document.createElement('div');
    contentContainer.style.cssText = `
        position: relative;
        transform-origin: top center;
        width: fit-content;
        margin: 0 auto;
    `;

    // Move all body content into containers
    while (document.body.firstChild) {
        contentContainer.appendChild(document.body.firstChild);
    }
    mainContainer.appendChild(contentContainer);
    document.body.appendChild(mainContainer);

    // Add page selector
    const pageSelector = document.createElement('input');
    pageSelector.type = 'number';
    pageSelector.min = '1';
    pageSelector.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 60px;
        z-index: 9999;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 3px;
        background: white;
    `;
    document.body.appendChild(pageSelector);

    // Modified setInitialZoom to handle the container
    function setInitialZoom() {
        const page = contentContainer.querySelector('.calibre1');
        if (!page) return;
        
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const pageHeight = page.offsetHeight;
        const pageWidth = page.offsetWidth;
        
        const scale = Math.min(
            viewportHeight / pageHeight,
            viewportWidth / pageWidth
        );
        
        contentContainer.style.transform = `scale(${scale})`;
    }

    // Handle navigation
    document.addEventListener('keydown', function(e) {
        const pages = Array.from(document.querySelectorAll('.calibre1'));
        const currentScroll = window.scrollY;
        
        function findNextPage() {
            const pages = Array.from(document.querySelectorAll('.calibre1'));
            const nextPage = pages.find(page => {
                const rect = page.getBoundingClientRect();
                return rect.top > 1;
            });
            if (nextPage) {
                const pageNum = pages.indexOf(nextPage) + 1;
                pageSelector.value = pageNum;
                return nextPage;
            }
            return null;
        }
        
        function findPrevPage() {
            const pages = Array.from(document.querySelectorAll('.calibre1'));
            pages.reverse();
            const prevPage = pages.find(page => {
                const rect = page.getBoundingClientRect();
                return rect.top < -1;
            });
            if (prevPage) {
                const pageNum = Array.from(document.querySelectorAll('.calibre1')).indexOf(prevPage) + 1;
                pageSelector.value = pageNum;
                return prevPage;
            }
            return null;
        }

        switch(e.key) {
            case ' ':
            case 'ArrowRight':
            case 'PageDown':
                e.preventDefault();
                const nextPage = findNextPage();
                if (nextPage) {
                    nextPage.scrollIntoView();
                }
                break;
                
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault();
                const prevPage = findPrevPage();
                if (prevPage) {
                    prevPage.scrollIntoView();
                }
                break;
        }
    });

    // Update page number on scroll
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            const pages = Array.from(document.querySelectorAll('.calibre1'));
            const currentPage = pages.findIndex(page => {
                const rect = page.getBoundingClientRect();
                return rect.top <= 1 && rect.bottom >= 1;
            });
            if (currentPage >= 0) {
                pageSelector.value = currentPage + 1;
            }
        }, 100);
    });
    
    // Set initial zoom and handle window resizing
    setInitialZoom();
    window.addEventListener('resize', setInitialZoom);
});
