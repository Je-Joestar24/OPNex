
import Modal from '../modal.js';

/**
 * Devil Fruit Modal Class
 * Handles displaying detailed information about devil fruits in a modal
 * 
 * Features:
 * - Loading fruit details from JSON files
 * - Displaying fruit information with animations
 * - Handling modal open/close transitions
 */
class DevilFruitModal extends Modal {
    /**
     * Initialize modal properties and bind event handlers
     */
    constructor() {
        super();
        this.modalId = '#devil-fruit-modal';
        this.modal = document.querySelector(this.modalId);
        this.modalOverlay = this.modal.querySelector('.modal-overlay');
        this.modalContainer = this.modal.querySelector('.modal-container');
        
        super.init(this.modalId);
    }

    /**
     * Loads devil fruit details from JSON file and displays them
     * @param {string} fruitId - ID of the devil fruit to load
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
     * @param {Object} fruit - Devil fruit data object
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
                        <div class="fruit-image">
                            <img src="${fruit.image}" alt="${fruit.name}">
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
     * @param {Function} callback - Optional callback after opening
     */
    open(callback = null) {
        super.open(callback);
        this.toggleModalClasses(true);
    }

    /**
     * Closes the modal with animation
     * @param {Function} callback - Optional callback after closing
     */
    close(callback = null) {
        this.toggleModalClasses(false);
        setTimeout(() => {
            super.close(callback);
        }, 300);
    }

    /**
     * Handles modal animation classes for open/close transitions
     * @param {boolean} isOpening - Whether modal is opening or closing
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