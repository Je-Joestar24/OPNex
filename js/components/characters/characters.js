
import GridComponent from '../GridComponent.js';
import CharacterModal from './charModal.js';
/**
 * Characters Component
 * Extends GridComponent to handle character-specific grid functionality
 * Manages character display, filtering, and modal interactions
 */
class Characters extends GridComponent {
  /**
   * Initialize Characters component
   * Sets up configuration and event handlers
   */
  constructor() {
    const config = {
      containerId: 'characters', // ID of container element
      buildSection: () => Characters.buildCharacterSection(), // Function to build HTML structure
      gridClass: 'char-grid', // CSS class for grid container
      searchInputId: 'search-characters', // ID for search input
      jsonPath: 'json/characters/characters.json', // Path to character data
      itemTemplate: (char) => Characters.characterTemplate(char), // Template for character cards
      searchFields: ['name', 'epithet', 'affiliation', 'status', 'id'] // Fields to search
    };

    super(config);
    this.charModal = new CharacterModal();

    // Add character-specific click handler for modal display
    if (this.grid) {
      this.grid.addEventListener('click', async (e) => {
        const card = e.target.closest('.char-card');
        if (card) {
          await this.charModal.loadCharacterDetails(card.id);
        }
      });
    }
  }

  /**
   * Builds the main character section HTML structure
   * Creates a responsive layout with search, filtering and grid display
   * 
   * Structure:
   * - Search bar with text input and icon button
   * - Sort dropdown for name ordering (A-Z, Z-A, Status, Affiliation)
   * - Filter groups:
   *   - Affiliation filters (Marine, Pirate)
   *   - Status filters (Alive, Deceased)
   * - Grid container for character cards
   * 
   * Features:
   * - Real-time search filtering
   * - Multiple filter selection
   * - Responsive grid layout
   * - Accessible form controls with labels
   * - SVG search icon for visual clarity
   * - Lazy loading of character images
   * 
   * @returns {string} Complete HTML template string for the characters section
   */
  static buildCharacterSection() {
    return `
          <div class="char-container">
            <!-- Search and Filter Section -->
            <div class="search-filter">
              <!-- Search Bar -->
              <div class="search-bar">
                <input
                  id="search-characters"
                  type="text"
                  placeholder="Search characters..."
                />
                <button class="search-btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                    />
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
                    <option value="status">Status</option>
                    <option value="affiliation">Affiliation</option>
                  </select>
                </div>

                <!-- Filter Checkboxes -->
                <div class="filters">
                  <!-- Affiliation Filters -->
                  <div class="filter-group">
                    <label>Affiliation:</label>
                    <label class="checkbox">
                      <input
                        type="checkbox"
                        name="affiliation"
                        value="marine"
                      />
                      Marine
                    </label>
                    <label class="checkbox">
                      <input
                        type="checkbox"
                        name="affiliation"
                        value="pirate"
                      />
                      Pirate
                    </label>
                  </div>

                  <!-- Status Filters -->
                  <div class="filter-group">
                    <label>Status:</label>
                    <label class="checkbox">
                      <input type="checkbox" name="status" value="alive" />
                      Alive
                    </label>
                    <label class="checkbox">
                      <input type="checkbox" name="status" value="deceased" />
                      Deceased
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Characters Grid -->
            <div class="char-grid">
              <!-- Character Card Example -->
              <div class="char-card" id="luffy">
                <div class="char-image">
                  <img src="image/characters/luffy.jpg" alt="Monkey D. Luffy" />
                </div>
                <div class="char-info">
                  <h3>Monkey D. Luffy</h3>
                  <p class="epithet">"Straw Hat"</p>
                  <div class="char-tags">
                    <span class="tag pirate">Pirate</span>
                    <span class="tag alive">Alive</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
  }

  /**
   * Generates HTML template for individual character cards
   * @param {Object} char Character data object
   * @param {string} char.id Unique identifier
   * @param {string} char.image Image URL
   * @param {string} char.name Character name
   * @param {string} char.epithet Character epithet/title
   * @param {string} char.affiliation Character affiliation (marine/pirate)
   * @param {string} char.status Character status (alive/deceased)
   * @returns {string} HTML template string for character card
   */
  static characterTemplate(char) {
    return `
      <div class="char-card" id="${char.id}">
        <div class="char-image lazy-load">
          <img 
            src="${char.image}" 
            alt="${char.name}"
            loading="lazy"
            onload="this.classList.add('loaded'); this.closest('.lazy-load').classList.remove('lazy-load')"
          >
        </div>
        <div class="char-info">
          <h3>${char.name}</h3>
          <p class="epithet">"${char.epithet}"</p>
          <div class="char-tags">
            <span class="tag ${char.affiliation}">${char.affiliation}</span>
            <span class="tag ${char.status}">${char.status}</span>
          </div>
        </div>
      </div>
    `;
  }
}

export default Characters;
