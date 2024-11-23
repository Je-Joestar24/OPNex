
import GridComponent from '../GridComponent.js';
import DevilFruitModal from './devilfruitModal.js';

/**
 * Devil Fruits Component
 * Extends GridComponent to handle devil fruit-specific grid functionality
 * Manages devil fruit display, filtering, and modal interactions
 */
class DevilFruits extends GridComponent {
  /**
   * Initialize DevilFruits component
   * Sets up configuration and event handlers
   */
  constructor() {
    const config = {
      containerId: 'devil-fruits', // ID of container element
      buildSection: () => DevilFruits.buildDevilFruitsSection(), // Function to build HTML structure
      gridClass: 'fruits-grid', // CSS class for grid container
      searchInputId: 'search-fruits', // ID for search input
      jsonPath: 'json/devil-fruits/devilfruits.json', // Path to devil fruit data
      itemTemplate: (fruit) => DevilFruits.fruitTemplate(fruit), // Template for fruit cards
      searchFields: ['name', 'alias', 'type', 'user'] // Fields to search
    };

    super(config);
    this.devilFruitModal = new DevilFruitModal();

    // Add devil fruit-specific click handler for modal display
    if (this.grid) {
      this.grid.addEventListener('click', async (e) => {
        const card = e.target.closest('.fruit-card');
        if (card) {
          await this.devilFruitModal.loadFruitDetails(card.id);
        }
      });
    }
  }

  /**
   * Builds the main devil fruits section HTML structure
   * Creates a responsive layout with search, filtering and grid display
   * 
   * Structure:
   * - Search bar with text input and icon button
   * - Sort dropdown for name ordering (A-Z, Z-A)
   * - Filter groups:
   *   - Type filters (Paramecia, Logia, Zoan)
   *   - Status filters (Active, Inactive)
   * - Grid container for devil fruit cards
   * 
   * Features:
   * - Real-time search filtering
   * - Multiple filter selection
   * - Responsive grid layout
   * - Accessible form controls with labels
   * - SVG search icon for visual clarity
   * 
   * @returns {string} Complete HTML template string for the devil fruits section
   */
  static buildDevilFruitsSection() {
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
   * Generates HTML template for individual devil fruit cards
   * @param {Object} fruit Devil fruit data object
   * @param {string} fruit.id Unique identifier
   * @param {string} fruit.image Image URL
   * @param {string} fruit.name Devil fruit name
   * @param {string} fruit.alias Devil fruit alias/title
   * @param {string} fruit.type Devil fruit type (paramecia/logia/zoan)
   * @param {string} fruit.status Devil fruit status (active/inactive)
   * @returns {string} HTML template string for devil fruit card
   */
  static fruitTemplate(fruit) {
    return `
      <div class="fruit-card" id="${fruit.id}">
        <div class="fruit-image lazy-load">
          <img 
            src="${fruit.image}" 
            alt="${fruit.name}" 
            loading="lazy"
            onload="this.classList.add('loaded'); this.closest('.lazy-load').classList.remove('lazy-load')"
            class="fruit-img"
          >
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
}

export default DevilFruits;