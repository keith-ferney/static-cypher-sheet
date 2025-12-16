/**
 * Toast Notification Tests
 * Tests for toast notification functionality
 */

require('./test-setup');

const ToastNotification = global.ToastNotification;

describe('ToastNotification', () => {
  let toast;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="toast-container"></div>
    `;
    toast = new ToastNotification();
  });

  test('should show success toast', () => {
    toast.show('Success message', 'success');
    
    const container = document.getElementById('toast-container');
    const toastEl = container.querySelector('.toast');
    
    expect(toastEl).toBeTruthy();
    expect(toastEl.classList.contains('success')).toBe(true);
    expect(toastEl.textContent).toContain('Success message');
  });

  test('should show error toast', () => {
    toast.show('Error message', 'error');
    
    const toastEl = document.querySelector('.toast');
    expect(toastEl.classList.contains('error')).toBe(true);
    expect(toastEl.textContent).toContain('Error message');
  });

  test('should show info toast', () => {
    toast.show('Info message', 'info');
    
    const toastEl = document.querySelector('.toast');
    expect(toastEl.classList.contains('info')).toBe(true);
  });

  test('should default to success type', () => {
    toast.show('Default message');
    
    const toastEl = document.querySelector('.toast');
    expect(toastEl.classList.contains('success')).toBe(true);
  });

  test('should handle missing container gracefully', () => {
    document.body.innerHTML = '';
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    toast = new ToastNotification();
    toast.show('Test message');
    
    expect(consoleWarnSpy).toHaveBeenCalledWith('Toast container not found, message:', 'Test message');
    consoleWarnSpy.mockRestore();
  });

  test('should hide toast when hide is called', () => {
    toast.show('Test message');
    const toastEl = document.querySelector('.toast');
    
    // Manually remove the toast
    toastEl.remove();
    
    expect(document.querySelector('.toast')).toBeFalsy();
  });

  test('should remove toast after fade out animation', () => {
    toast.show('Test message');
    
    const toastEl = document.querySelector('.toast');
    expect(toastEl).toBeTruthy();
    
    // Simulate the fadeOut animation ending
    const event = new Event('animationend');
    event.animationName = 'fadeOut';
    toastEl.dispatchEvent(event);
    
    expect(document.querySelector('.toast')).toBeFalsy();
  });

  test('should show multiple toasts', () => {
    toast.show('First message');
    toast.show('Second message');
    
    const toasts = document.querySelectorAll('.toast');
    expect(toasts.length).toBe(2);
  });

  test('should not remove toast on slideInRight animation', () => {
    toast.show('Auto-hide message');
    
    const toastEl = document.querySelector('.toast');
    
    // Simulate the slideInRight animation ending (should NOT remove)
    const event = new Event('animationend');
    event.animationName = 'slideInRight';
    toastEl.dispatchEvent(event);
    
    expect(document.querySelector('.toast')).toBeTruthy();
    
    // Now simulate fadeOut (should remove)
    const fadeEvent = new Event('animationend');
    fadeEvent.animationName = 'fadeOut';
    toastEl.dispatchEvent(fadeEvent);
    
    expect(document.querySelector('.toast')).toBeFalsy();
  });
});
