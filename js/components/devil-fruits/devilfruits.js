/**
 * DevilFruits Component
 * Handles the devil fruits section and its functionalities including:
 * - Loading and displaying devil fruit data from JSON
 * - Filtering fruits by search, type and status
 * - Sorting fruits by name
 * - Rendering fruit cards in a grid layout
 */
import DevilFruitModal from './devilfruitModal.js';

class DevilFruits {
    /**
     * Initialize the DevilFruits component
     * Sets up required DOM elements and state
     */
    constructor() {
        // Arrays to store devil fruit data
        this.fruits = [];
        this.filteredFruits = []; // Stores filtered results

        // DOM element references
        this.container = document.getElementById('devil-fruits');
        this.container.innerHTML = this.buildDevilFruitsSection();
        this.fruitsGrid = this.container.querySelector('.fruits-grid');
        this.searchInput = this.container.querySelector('#search-fruits');
        this.sortSelect = this.container.querySelector('.sort-select');
        this.filterCheckboxes = this.container.querySelectorAll('input[type="checkbox"]');

        // Initialize devil fruit modal
        this.devilFruitModal = new DevilFruitModal();
        
        this.setupEventListeners();
    }

    /**
     * Builds the HTML structure for the devil fruits section
     * @returns {string} HTML string for the devil fruits section
     */
    buildDevilFruitsSection() {
        return `
          <div class="fruits-container">
            <!-- Search and Filter Section -->
            <div class="search-filter">
              <!-- Search Bar -->
              <div class="search-bar">
                <input type="text" id="search-fruits" placeholder="Search devil fruits...">
                <button class="search-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                </button>
              </div>

              <!-- Sort and Filter Options -->
              <div class="sort-filters">
                <!-- Sort Dropdown -->
                <div class="sort-group">
                  <label>Sort by:</label>
                  <select class="sort-select">
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                  </select>
                </div>

                <!-- Filter Checkboxes -->
                <div class="filters">
                  <!-- Type Filters -->
                  <div class="filter-group">
                    <label>Type:</label>
                    <label class="checkbox">
                      <input type="checkbox" name="type" value="paramecia">
                      Paramecia
                    </label>
                    <label class="checkbox">
                      <input type="checkbox" name="type" value="logia">
                      Logia
                    </label>
                    <label class="checkbox">
                      <input type="checkbox" name="type" value="zoan">
                      Zoan
                    </label>
                  </div>

                  <!-- Status Filters -->
                  <div class="filter-group">
                    <label>Status:</label>
                    <label class="checkbox">
                      <input type="checkbox" name="status" value="active">
                      Active
                    </label>
                    <label class="checkbox">
                      <input type="checkbox" name="status" value="inactive">
                      Inactive
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Devil Fruits Grid -->
            <div class="fruits-grid"></div>
          </div>
        `;
    }

    /**
     * Loads devil fruit data from JSON file
     */
    async loadFruits() {
        try {
            const response = await fetch('json/devil-fruits/devilfruits.json');
            this.fruits = await response.json();
            this.filteredFruits = [...this.fruits];
            this.renderFruits();
        } catch (error) {
            console.error('Error loading devil fruits:', error);
        }
    }

    /**
     * Applies all active filters and search criteria
     */
    applyFilters() {
        const searchTerm = this.searchInput.value.toLowerCase().trim();
        
        // Get selected filter values
        const selectedTypes = Array.from(this.container.querySelectorAll('input[name="type"]:checked'))
            .map(checkbox => checkbox.value);
        const selectedStatuses = Array.from(this.container.querySelectorAll('input[name="status"]:checked'))
            .map(checkbox => checkbox.value);

        // Apply filters
        this.filteredFruits = this.fruits.filter(fruit => {
            // Search across multiple fields
            const matchesSearch = !searchTerm || 
                fruit.name.toLowerCase().includes(searchTerm) ||
                fruit.alias.toLowerCase().includes(searchTerm) ||
                fruit.type.toLowerCase().includes(searchTerm) ||
                fruit.user.toLowerCase().includes(searchTerm);

            // Filter by type if any selected
            const matchesType = selectedTypes.length === 0 || 
                selectedTypes.includes(fruit.type);

            // Filter by status if any selected
            const matchesStatus = selectedStatuses.length === 0 || 
                selectedStatuses.includes(fruit.status);

            return matchesSearch && matchesType && matchesStatus;
        });

        this.applySorting();
        this.renderFruits();
    }

    /**
     * Applies sorting to filtered fruits
     */
    applySorting() {
        const sortValue = this.sortSelect.value;

        switch(sortValue) {
            case 'name-asc':
                this.filteredFruits.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                this.filteredFruits.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }
    }

    /**
     * Renders fruit cards to the grid
     */
    renderFruits() {
        if (!this.fruitsGrid) return;

        if (this.filteredFruits.length === 0) {
            this.fruitsGrid.innerHTML = `
                <div class="no-results">
                    <p>No devil fruits found matching your search.</p>
                </div>
            `;
            return;
        }

        this.fruitsGrid.innerHTML = this.filteredFruits
            .map(fruit => this.fruitTemplate(fruit))
            .join('');
    }

    /**
     * Generates HTML template for fruit card
     * @param {Object} fruit - Devil Fruit data object
     * @returns {string} HTML template string
     */
    fruitTemplate(fruit) {
        return `
            <div class="fruit-card" id="${fruit.id}">
                <div class="fruit-image">
                    <img src="${fruit.image}" alt="${fruit.name}">
                </div>
                <div class="fruit-info">
                    <h3>${fruit.name}</h3>
                    <p class="fruit-alias">"${fruit.alias}"</p>
                    <div class="fruit-tags">
                        <span class="tag ${fruit.type}">${fruit.type}</span>
                        <span class="tag ${fruit.status}">${fruit.status}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Sets up event listeners
     */
    setupEventListeners() {

        if (!this.fruitsGrid) return;

        this.fruitsGrid.addEventListener('click', async (e) => {
            const card = e.target.closest('.fruit-card');
            if (card) {
                await this.devilFruitModal.loadFruitDetails(card.id);
            }
        });
        // Debounced search input handler

        let debounceTimeout;
        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => {
                clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(() => {
                    this.applyFilters();
                }, 300);
            });
        }

        // Sort select handler
        if (this.sortSelect) {
            this.sortSelect.addEventListener('change', () => {
                this.applyFilters();
            });
        }

        // Filter checkbox handlers
        this.filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.applyFilters();
            });
        });
    }

    /**
     * Loads all sections
     */
    async loadSections() {
        await this.loadFruits();
    }

    /**
     * Hides the devil fruits container
     */
    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
    }

    /**
     * Shows the devil fruits container
     */
    show() {
        if (this.container) {
            this.container.style.display = 'block';
        }
    }
}

export { DevilFruits as default };