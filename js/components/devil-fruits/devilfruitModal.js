
import Modal from '../modal.js';

/**
 * Devil Fruit Modal Class
 * Handles displaying detailed information about devil fruits in a modal
 * 
 * Features:
 * - Loading fruit details from JSON files
 * - Displaying fruit information with animations
 * - Handling modal open/close transitions
 * - Managing modal state and content updates
 * - Handling user interactions and events
 */
class DevilFruitModal extends Modal {
    /**
     * Initialize modal properties and bind event handlers
     * Sets up modal elements and initializes parent Modal class
     * Configures modal ID, container elements and overlay
     */
    constructor() {
        super(); // Initialize parent class
        this.modalId = '#devil-fruit-modal'; // Modal ID for DOM selection
        this.modal = document.querySelector(this.modalId); // Main modal element reference
        this.modalOverlay = this.modal.querySelector('.modal-overlay'); // Semi-transparent background overlay
        this.modalContainer = this.modal.querySelector('.modal-container'); // Container for modal content
        
        super.init(this.modalId); // Initialize base modal functionality
    }

    /**
     * Loads devil fruit details from JSON file and displays them
     * Fetches fruit-specific data and triggers modal display
     * 
     * @param {string} fruitId - Unique identifier for the devil fruit
     * @throws {Error} If JSON fetch or parsing fails
     */
    async loadFruitDetails(fruitId) {
        try {
            const response = await fetch(`json/devil-fruits/information/${fruitId}.json`);
            const fruitDetails = await response.json();
            this.showFruitDetails(fruitDetails);
            this.open();
        } catch (error) {
            console.error('Error loading devil fruit details:', error);
        }
    }

    /**
     * Generates and displays the devil fruit details in the modal
     * Creates a structured HTML template with fruit information
     * Includes:
     * - Header with name, alias and type
     * - Fruit image with lazy loading
     * - Status and current user information
     * - Description and abilities
     * - Awakening details if available
     * 
     * @param {Object} fruit - Devil fruit data object containing all details
     * @param {string} fruit.name - Name of the devil fruit
     * @param {string} fruit.alias - Alternative name/nickname
     * @param {string} fruit.type - Fruit category (Paramecia/Logia/Zoan)
     * @param {string} fruit.image - URL to fruit image
     * @param {string} fruit.status - Current status (Active/Inactive)
     * @param {string} fruit.user - Current fruit user
     * @param {string} fruit.description - Detailed description
     * @param {Array} fruit.abilities - List of known abilities
     * @param {Object} [fruit.awakening] - Optional awakening information
     */
    showFruitDetails(fruit) {
        const content = `
            <div class="fruit-modal-content">
                <button class="close-modal">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>

                <div class="fruit-header ${fruit.type}">
                    <div class="fruit-title">
                        <h2>${fruit.name}</h2>
                        <p class="fruit-alias">"${fruit.alias}"</p>
                    </div>
                    <div class="fruit-type-badge">
                        <span class="type-icon ${fruit.type}"></span>
                        <span class="type-name">${fruit.type}</span>
                    </div>
                </div>

                <div class="fruit-content">
                    <div class="fruit-showcase">
                        <div class="fruit-image lazy-load">
                            <img src="${fruit.image}" alt="${fruit.name}"
                              loading="lazy"
                              onload="this.classList.add('loaded'); this.closest('.lazy-load').classList.remove('lazy-load')"
                            >
                        </div>
                        <div class="fruit-status">
                            <div class="status-badge ${fruit.status}">
                                <span class="status-dot"></span>
                                ${fruit.status}
                            </div>
                            <div class="current-user">
                                <h4>Current User</h4>
                                <p>${fruit.user}</p>
                            </div>
                        </div>
                    </div>

                    <div class="fruit-info-grid">
                        <div class="info-card description">
                            <h3>Description</h3>
                            <p>${fruit.description || 'No description available.'}</p>
                        </div>
                        
                        <div class="info-card abilities">
                            <h3>Known Abilities</h3>
                            <ul>
                                ${(fruit.abilities || []).map(ability => `
                                    <li>${ability}</li>
                                `).join('')}
                            </ul>
                        </div>

                        ${fruit.awakening ? `
                            <div class="info-card awakening">
                                <h3>Awakening</h3>
                                <div class="awakening-info">
                                    <h4>${fruit.awakening.name}</h4>
                                    <p>${fruit.awakening.description}</p>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        if (this.modalContainer) {
            this.modalContainer.innerHTML = content;
            const closeBtn = this.modalContainer.querySelector('.close-modal');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.close());
            }
        }
    }

    /**
     * Opens the modal with animation
     * Triggers parent class open method and adds animation classes
     * Handles smooth transition for modal appearance
     * 
     * @param {Function} callback - Optional callback function executed after opening
     */
    open(callback = null) {
        super.open(callback);
        this.toggleModalClasses(true);
    }

    /**
     * Closes the modal with animation
     * Triggers animation sequence before actual closure
     * Ensures smooth exit transition
     * 
     * @param {Function} callback - Optional callback function executed after closing
     */
    close(callback = null) {
        this.toggleModalClasses(false);
        setTimeout(() => {
            super.close(callback);
        }, 300);
    }

    /**
     * Handles modal animation classes for open/close transitions
     * Manages CSS classes for both container and overlay animations
     * Controls visibility and cleanup of animation classes
     * 
     * @param {boolean} isOpening - Flag indicating if modal is opening (true) or closing (false)
     */
    toggleModalClasses(isOpening) {
        const modalContainer = this.modal.querySelector('.modal-container');
        const modalOverlay = this.modal.querySelector('.modal-overlay');

        modalContainer.classList.remove(isOpening ? 'modal-close' : 'modal-open');
        modalContainer.classList.add(isOpening ? 'modal-open' : 'modal-close');

        modalOverlay.classList.remove(isOpening ? 'modal-close' : 'modal-open');
        modalOverlay.classList.add(isOpening ? 'modal-open' : 'modal-close');

        if (!isOpening) {
            setTimeout(() => {
                this.modal.style.display = 'none';
                modalContainer.classList.remove('modal-close');
                modalOverlay.classList.remove('modal-close');
            }, 300);
        } else {
            this.modal.style.display = 'flex';
        }
    }
}

export { DevilFruitModal as default };