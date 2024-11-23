
import CharacterModal from './charModal.js';

/**
 * Characters Component
 * Handles the characters section and its functionalities including:
 * - Loading and displaying character data from JSON
 * - Filtering characters by search, affiliation and status 
 * - Sorting characters by name, status and affiliation
 * - Rendering character cards in a grid layout
 * - Managing character modal interactions
 */
class Characters {
  /**
   * Initialize the Characters component
   * Sets up required DOM elements and state
   */
  constructor() {
    // Arrays to store character data
    this.characters = [];
    this.filteredCharacters = []; // Stores filtered results to avoid re-fetching

    // DOM element references 
    this.container = document.getElementById('characters'); // Characters container
    this.container.innerHTML = this.buildCharacterSection(); // Build characters section
    this.charGrid = this.container.querySelector('.char-grid'); // Characters grid
    this.searchInput = this.container.querySelector('#search-characters'); // Search input
    this.sortSelect = this.container.querySelector('.sort-select'); // Sort select
    this.filterCheckboxes = this.container.querySelectorAll('input[type="checkbox"]'); // Filter checkboxes

    // Initialize character modal for character details
    this.charModal = new CharacterModal();

    this.setupEventListeners(); // Set up event listeners
  }

  /**
   * Builds the HTML structure for the characters section
   * @returns {string} HTML string for the characters section
   */
  buildCharacterSection() {
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
   * Loads character data from JSON file
   * Initializes filtered array and renders characters
   */
  async loadCharacters() {
    try {
      const response = await fetch('json/characters/characters.json');
      this.characters = await response.json();
      this.filteredCharacters = [...this.characters]; // Copy initial data
      this.renderCharacters();
    } catch (error) {
      console.error('Error loading characters:', error);
    }
  }

  /**
   * Applies all active filters and search criteria
   * Filters by search term, affiliation and status
   */
  applyFilters() {
    const searchTerm = this.searchInput.value.toLowerCase().trim();

    // Get selected filter values
    const selectedAffiliations = Array.from(this.container.querySelectorAll('input[name="affiliation"]:checked'))
      .map(checkbox => checkbox.value);
    const selectedStatuses = Array.from(this.container.querySelectorAll('input[name="status"]:checked'))
      .map(checkbox => checkbox.value);

    // Apply filters to character array
    this.filteredCharacters = this.characters.filter(char => {
      // Search across multiple fields
      const matchesSearch = !searchTerm ||
        char.name.toLowerCase().includes(searchTerm) ||
        char.epithet.toLowerCase().includes(searchTerm) ||
        char.affiliation.toLowerCase().includes(searchTerm) ||
        char.status.toLowerCase().includes(searchTerm) ||
        char.id.toLowerCase().includes(searchTerm);

      // Filter by affiliation if any selected
      const matchesAffiliation = selectedAffiliations.length === 0 ||
        selectedAffiliations.includes(char.affiliation);

      // Filter by status if any selected
      const matchesStatus = selectedStatuses.length === 0 ||
        selectedStatuses.includes(char.status);

      return matchesSearch && matchesAffiliation && matchesStatus;
    });

    this.applySorting();
    this.renderCharacters();
  }

  /**
   * Applies sorting to filtered characters
   * Sorts by name (A-Z/Z-A), status, or affiliation
   */
  applySorting() {
    const sortValue = this.sortSelect.value;

    // Sort using localeCompare for proper string comparison
    switch (sortValue) {
      case 'name-asc':
        this.filteredCharacters.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        this.filteredCharacters.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'status':
        this.filteredCharacters.sort((a, b) => b.status.localeCompare(a.status));
        break;
      case 'affiliation':
        this.filteredCharacters.sort((a, b) => a.affiliation.localeCompare(b.affiliation));
        break;
    }
  }

  /**
   * Renders character cards to the grid container
   * Shows "no results" message if no characters match filters
   */
  renderCharacters() {
    if (!this.charGrid) return;

    // Clear the grid container before rendering
    this.charGrid.innerHTML = '';

    // Show message if no characters found
    if (this.filteredCharacters.length === 0) {
      this.charGrid.innerHTML = `
                <div class="no-results">
                    <p>No characters found matching your search.</p>
                </div>
            `;
      return;
    }

    // Render character cards to the grid container
    this.charGrid.innerHTML = this.filteredCharacters
      .map(char => this.characterTemplate(char))
      .join('');
  }

  /**
   * Generates HTML template for character card with lazy loading image
   * @param {Object} char - Character data object
   * @returns {string} HTML template string
   */
  characterTemplate(char) {
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

  /**
   * Sets up event listeners for search, sort, filters and card clicks
   */
  setupEventListeners() {
    if (!this.charGrid) return;

    // Handle character card clicks
    this.charGrid.addEventListener('click', async (e) => {
      const card = e.target.closest('.char-card');
      if (card) {
        await this.charModal.loadCharacterDetails(card.id);
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
   * Loads all sections of the characters component
   */
  async loadSections() {
    await this.loadCharacters();
  }

  /**
   * Hides the characters container
   */
  hide() {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  /**
   * Shows the characters container
   */
  show() {
    if (this.container) {
      this.container.style.display = 'block';
    }
  }
}

export { Characters as default };
