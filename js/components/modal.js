/**
 * Base Modal Class
 * Parent class for all modal components providing core modal functionality
 * 
 * Features:
 * - Modal open/close/toggle functionality
 * - Event handling for escape key and overlay clicks
 * - Optional callbacks before open/close
 * - Background scroll prevention when modal is open
 */
class Modal {
  /**
   * Initialize modal properties and bind event handlers
   */
  constructor() {
    // Core modal elements
    this.modal = null; // Modal element
    this.modalOverlay = null; // Modal overlay
    this.closeButton = null; // Modal close button
    
    // Bind event handlers to maintain context
    this.handleEscapeKey = this.handleEscapeKey.bind(this); // Escape key handler
    this.handleOverlayClick = this.handleOverlayClick.bind(this); // Overlay click handler
  }

  /**
   * Initialize modal with DOM elements and event listeners
   * @param {string} modalId - CSS selector for modal element
   */
  init(modalId) {
    // Query and store modal elements
    this.modal = document.querySelector(modalId);
    if (!this.modal) {
      console.error('Modal element not found');
      return;
    }
    
    this.modalOverlay = this.modal.querySelector('.modal-overlay');
    this.closeButton = this.modal.querySelector('.modal-close');

    // Set up event handling
    this.initEventListeners();
  }

  /**
   * Set up all modal event listeners
   */
  initEventListeners() {
    // Global escape key handler
    document.addEventListener('keydown', this.handleEscapeKey);
    
    // Click handlers for overlay and close button
    if (this.modalOverlay) {
      this.modalOverlay.addEventListener('click', this.handleOverlayClick);
    }

    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.close());
    }
  }

  /**
   * Handle escape key press to close modal
   * @param {KeyboardEvent} event - Keyboard event object
   */
  handleEscapeKey(event) {
    if (event.key === 'Escape' && this.isOpen()) {
      this.close();
    }
  }

  /**
   * Handle overlay click to close modal
   * @param {MouseEvent} event - Click event object
   */
  handleOverlayClick(event) {
    if (event.target === this.modalOverlay) {
      this.close();
    }
  }

  /**
   * Add toggle functionality to a button element
   * @param {HTMLElement} button - Button element to add toggle to
   * @param {Function} callback - Optional callback function
   */
  setToggleButton(button, callback = null) {
    if (!button) return;
    
    button.addEventListener('click', () => {
      this.toggle(callback);
    });
  }

  /**
   * Check if modal is currently open
   * @returns {boolean} True if modal is open
   */
  isOpen() {
    return this.modal && this.modal.style.display === 'flex';
  }

  /**
   * Open the modal
   * @param {Function} beforeOpen - Optional callback before opening
   */
  open(beforeOpen = null) {
    if (this.modal) {
      if (beforeOpen && typeof beforeOpen === 'function') {
        beforeOpen('open');
      }
      this.modal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  }

  /**
   * Close the modal
   * @param {Function} beforeClose - Optional callback before closing
   */
  close(beforeClose = null) {
    if (this.modal) {
      if (beforeClose && typeof beforeClose === 'function') {
        beforeClose('close');
        setTimeout(() => {
          this.modal.style.display = 'none';
          document.body.style.overflow = ''; // Restore scrolling
        }, 300);
      } else {
        this.modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
      }
    }
  }

  /**
   * Toggle modal open/closed state
   * @param {Function} callback - Optional callback function
   */
  toggle(callback = null) {
    if (this.isOpen()) {
      this.close(callback);
    } else {
      this.open(callback);
    }
  }
}

export { Modal as default };
