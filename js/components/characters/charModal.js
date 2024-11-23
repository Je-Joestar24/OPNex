import Modal from '../modal.js';

/**
 * CharacterModal Class
 * Extends the base Modal class to handle character-specific modal functionality.
 * This class manages the display and interaction of character details in a modal window.
 * 
 * Key Features:
 * - Character data loading from JSON files
 * - Dynamic stat visualization with dots
 * - Animated modal transitions
 * - Responsive layout handling
 */
class CharacterModal extends Modal {
    /**
     * Constructor
     * Initializes modal elements and sets up the base configuration
     * @extends Modal
     */
    constructor() {
        super(); // Initialize parent class
        this.modalId = '#character-modal'; // Modal ID
        this.modal = document.querySelector(this.modalId); // Modal element
        this.modalOverlay = this.modal.querySelector('.modal-overlay'); // Modal overlay
        this.modalContainer = this.modal.querySelector('.modal-container'); // Modal container

        super.init(this.modalId); // Initialize modal
    }

    /**
     * Loads character details from a JSON file
     * @param {string} charId - The unique identifier for the character
     * @throws {Error} When character data cannot be loaded
     */
    async loadCharacterDetails(charId) {
        try {
            const response = await fetch(`json/characters/information/${charId}.json`);
            const charDetails = await response.json();
            this.showCharacterDetails(charDetails);
            this.open();
        } catch (error) {
            console.error('Error loading character details:', error);
        }
    }

    /**
     * Generates HTML for level indicator dots
     * @param {number} level - Current level value
     * @param {number} maxLevel - Maximum possible level
     * @returns {string} HTML string containing dot elements
     */
    generateLevelDots(level, maxLevel) {
        let dots = '';
        for (let i = 0; i < maxLevel; i++) {
            dots += `<span class="level-dot ${i < level ? 'filled' : ''}"></span>`;
        }
        return dots;
    }

    /**
     * Renders character details in the modal
     * Displays character information including image, stats, and background
     * @param {Object} char - Character data object containing all details
     */
    showCharacterDetails(char) {
        const content = `
      <div class="char-modal-content">
        <button class="close-modal">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
        
        <div class="char-profile">
          <div class="char-image lazy-load">
            <img src="${char.image}" alt="${char.name}"
              loading="lazy"
              onload="this.classList.add('loaded'); this.closest('.lazy-load').classList.remove('lazy-load')"
            >
          </div>
          <div class="char-basic-info">
            <h2>${char.name}</h2>
            <p class="epithet">"${char.epithet}"</p>
            <div class="char-tags">
              <span class="tag ${char.affiliation}">${char.affiliation}</span>
              <span class="tag ${char.status}">${char.status}</span>
            </div>
          </div>
        </div>

        <div class="char-details">
          <div class="char-section">
            <h3>Background</h3>
            <p>${char.background}</p>
          </div>

          <div class="char-section">
            <h3>Abilities & Powers</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <h4>Strength</h4>
                <div class="stat-level">
                  ${this.generateLevelDots(char.strength, 5)}
                </div>
              </div>
              
              <div class="stat-item">
                <h4>Haki Mastery</h4>
                <div class="stat-level">
                  ${this.generateLevelDots(char.hakiLevel, 5)}
                </div>
              </div>
              
              ${char.devilFruit ? `
                <div class="stat-item">
                  <h4>Devil Fruit: ${char.devilFruit.name}</h4>
                  <div class="stat-level">
                    ${this.generateLevelDots(char.devilFruit.mastery, 5)}
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;

        // Update modal content and setup close button event listener
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
     * @param {Function|null} callback - Optional callback after opening
     */
    open(callback = null) {
        super.open(callback);
        this.toggleModalClasses(true);
    }

    /**
     * Closes the modal with animation
     * @param {Function|null} callback - Optional callback after closing
     */
    close(callback = null) {
        this.toggleModalClasses(false);
        setTimeout(() => {
            super.close(callback);
        }, 300);
    }

    /**
     * Handles modal opening/closing animations
     * Controls the animation classes for smooth transitions
     * @param {boolean} isOpening - Whether the modal is opening (true) or closing (false)
     */
    toggleModalClasses(isOpening) {
        const modalContainer = this.modal.querySelector('.modal-container');
        const modalOverlay = this.modal.querySelector('.modal-overlay');

        // Toggle animation classes for container and overlay
        modalContainer.classList.remove(isOpening ? 'modal-close' : 'modal-open');
        modalContainer.classList.add(isOpening ? 'modal-open' : 'modal-close');

        modalOverlay.classList.remove(isOpening ? 'modal-close' : 'modal-open');
        modalOverlay.classList.add(isOpening ? 'modal-open' : 'modal-close');

        // Handle modal visibility after animation
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

export { CharacterModal as default };
