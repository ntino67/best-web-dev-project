document.querySelectorAll('.line-effect').forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.classList.add('hover');
    });

    link.addEventListener('mouseleave', () => {
        link.classList.remove('hover');
    });
});
