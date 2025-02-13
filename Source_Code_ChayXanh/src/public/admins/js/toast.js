// Function handle notification
function toast({ title = '', message = '', type = 'info', duration = 3000 }) {
    const main = document.getElementById('toast');
    if (main) {
        const toast = document.createElement('div');

        // Auto remove
        const autoRemove = setTimeout(() => {
            main.removeChild(toast);
        }, duration);

        // Remove when clicked
        toast.onclick = (e) => {
            if (e.target.closest('.toast__close')) {
                main.removeChild(toast);
                clearTimeout(autoRemove);
            }
        };

        const icons = {
            success: 'fa-solid fa-circle-check',
            info: 'fa-solid fa-circle-info',
            waning: 'fa-solid fa-triangle-exclamation',
            error: 'fa-solid fa-circle-xmark',
        };

        const delay = (duration / 1000).toFixed(2);

        toast.classList.add('toast', `toast--${type}`);
        toast.style.animation = `slideInLeft ease 0.3s, fadeOut ease 1s ${delay}s forwards`;
        const icon = icons[type];

        toast.innerHTML = `
            <div class="toast__icon">
                <i class="${icon}"></i>
            </div>
            <div class="toast__body">
                <h3 class="toast__title">${title}</h3>
                <p class="toast__msg">
                    ${message}
                </p>
            </div>
            <div class="toast__close">
                <i class="fa-solid fa-xmark"></i>
            </div>
        `;
        main.appendChild(toast);
    }
}
