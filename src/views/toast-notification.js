// Toast Notification Component - Handles displaying toast messages
class ToastNotification {
    constructor(containerId = 'toast-container') {
        this.container = document.getElementById(containerId);
    }

    show(message, type = 'success') {
        // Gracefully handle missing container (e.g., in tests)
        if (!this.container) {
            console.warn('Toast container not found, message:', message);
            return;
        }
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? '✓' : 
                     type === 'error' ? '✕' : 
                     'ℹ';
        
        toast.innerHTML = `
            <span style="font-size: 1.25rem;">${icon}</span>
            <span>${message}</span>
        `;
        
        this.container.appendChild(toast);
        
        // Remove toast after CSS animation completes (no setTimeout needed!)
        toast.addEventListener('animationend', (e) => {
            // Only remove on the fadeOut animation, not slideInRight
            if (e.animationName === 'fadeOut') {
                toast.remove();
            }
        });
    }

    success(message) {
        this.show(message, 'success');
    }

    error(message) {
        this.show(message, 'error');
    }

    info(message) {
        this.show(message, 'info');
    }
}

// ES6 module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToastNotification;
}
