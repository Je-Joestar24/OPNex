/**
 * Base Grid Component
 * Parent class for grid-based components like Characters and DevilFruits
 * Handles common functionality like filtering, sorting, and rendering
 */
class GridComponent {
  /**
   * @param {Object} config Configuration object
   * @param {string} config.containerId DOM container ID
   * @param {Function} config.buildSection Function that returns section HTML
   * @param {string} config.gridClass CSS class for the grid container
   * @param {string} config.searchInputId ID for search input
   * @param {string} config.jsonPath Path to JSON data file
   * @param {Function} config.itemTemplate Template function for grid items
   */
  constructor(config) {
    this.config = config;// Configuration object
    this.items = [];// Array to store all items
    this.filteredItems = [];// Array to store filtered items inorder to not lose the original items

    // DOM element references
    this.container = document.getElementById(config.containerId);// ID of container element
    this.container.innerHTML = config.buildSection();// Function to build HTML structure
    this.grid = this.container.querySelector(`.${config.gridClass}`); // CSS class for grid container
    this.searchInput = this.container.querySelector(`#${config.searchInputId}`); // ID for search input
    this.sortSelect = this.container.querySelector('.sort-select'); // Sort select element
    this.filterCheckboxes = this.container.querySelectorAll('input[type="checkbox"]'); // Filter checkboxes

    this.setupEventListeners();// Sets up event listeners
  }

  /**
   * Loads data from JSON file
   */
  async loadData() {
    try {
      const response = await fetch(this.config.jsonPath);// Fetches data from JSON file
      this.items = await response.json();
      this.filteredItems = [...this.items];// Copies all items to filteredItems
      this.renderItems();
    } catch (error) {
      console.error(`Error loading ${this.config.containerId}:`, error);// Logs error message
    }
  }
  /**
   * Applies filters based on search and checkboxes
   * Filters items based on search term and selected checkbox filters
   * Then applies sorting and renders the filtered results
   */
  applyFilters() {
    // Get lowercase search term with whitespace trimmed
    const searchTerm = this.searchInput.value.toLowerCase().trim();
    
    // Build object of selected filters grouped by filter name
    const selectedFilters = {};
    this.filterCheckboxes.forEach(checkbox => {
      const filterName = checkbox.name;
      // Initialize empty array for this filter group if not exists
      if (!selectedFilters[filterName]) {
        selectedFilters[filterName] = [];
      }
      // Add checked values to the filter group array
      if (checkbox.checked) {
        selectedFilters[filterName].push(checkbox.value);
      }
    });

    // Filter items based on search and selected filters
    this.filteredItems = this.items.filter(item => {
      // Check if item matches search term across configured search fields
      const matchesSearch = !searchTerm || 
        this.config.searchFields.some(field => 
          item[field].toLowerCase().includes(searchTerm)
        );

      // Check if item matches all selected filter groups
      // Returns true if no filters selected for a group
      const matchesFilters = Object.entries(selectedFilters).every(([filterName, selectedValues]) => 
        selectedValues.length === 0 || selectedValues.includes(item[filterName])
      );

      // Item must match both search and filters to be included
      return matchesSearch && matchesFilters;
    });

    // Apply sorting to filtered results
    this.applySorting();
    // Render the filtered and sorted items
    this.renderItems();
  }

  /**
   * Applies sorting to filtered items
   */
  applySorting() {
    const sortValue = this.sortSelect.value;
    const [field, direction] = sortValue.split('-');

    this.filteredItems.sort((a, b) => {
      const comparison = a[field].localeCompare(b[field]);
      return direction === 'desc' ? -comparison : comparison;
    });
  }

  /**
   * Renders items to the grid
   * Updates the grid container with filtered items using the configured template
   * Shows a "no results" message if no items match the current filters
   */
  renderItems() {
    if (!this.grid) return;

    if (this.filteredItems.length === 0) {
      this.grid.innerHTML = `
        <div class="no-results">
          <p>No items found matching your search.</p>
        </div>
      `;
      return;
    }

    this.grid.innerHTML = this.filteredItems
      .map(item => this.config.itemTemplate(item))
      .join('');
  }

  /**
   * Sets up event listeners for search, sort and filter controls
   * Uses debouncing on search to avoid excessive filter updates
   * Triggers applyFilters() when any control changes
   */
  setupEventListeners() {
    // Debounced search with 300ms delay to avoid rapid re-filtering
    let debounceTimeout;
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => this.applyFilters(), 300);
      });
    }

    // Update filters when sort selection changes
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', () => this.applyFilters());
    }

    // Update filters when any filter checkbox changes
    this.filterCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => this.applyFilters());
    });
  }

  /**
   * Loads initial data for the grid component
   * Must be called after component initialization
   */
  async loadSections() {
    await this.loadData();
  }

  /**
   * Hides the grid container element
   * Used when switching between different views
   */
  hide() {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  /**
   * Shows the grid container element
   * Used when switching between different views
   */
  show() {
    if (this.container) {
      this.container.style.display = 'block';
    }
  }
}

export default GridComponent; 