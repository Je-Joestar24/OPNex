/* Characters Component, specifically for the characters section and its functionalities */
class Characters {
    constructor() {
        this.characters = [];
        /* For storing filtered results, and everything should have temporary storage to avoid re fetching data from the JSON file */
        this.filteredCharacters = []; 
        this.container = document.getElementById('characters');
        this.charGrid = this.container.querySelector('.char-grid');
        this.searchInput = this.container.querySelector('#search-characters');
        this.sortSelect = this.container.querySelector('.sort-select');
        this.filterCheckboxes = this.container.querySelectorAll('input[type="checkbox"]');
        this.setupEventListeners();
    }

    // Load characters from JSON
    async loadCharacters() {
        try {
            const response = await fetch('json/characters/characters.json');
            this.characters = await response.json();
             // Initialize filtered array by using the shorthand method for copying the characters array
            this.filteredCharacters = [...this.characters];
            this.renderCharacters();
        } catch (error) {
            console.error('Error loading characters:', error);
        }
    }

    // Apply all filters and search
    applyFilters() {

        // Search term trimmed and converted to lowercase to avoid case sensitivity
        const searchTerm = this.searchInput.value.toLowerCase().trim();

        //  mapping the selected affiliations and statuses to an array, using the attribute selector to get the checked checkboxes
        const selectedAffiliations = Array.from(this.container.querySelectorAll('input[name="affiliation"]:checked'))
            .map(checkbox => checkbox.value);
        const selectedStatuses = Array.from(this.container.querySelectorAll('input[name="status"]:checked'))
            .map(checkbox => checkbox.value);

        // Filtering the characters array based on the search term and selected affiliations and statuses
        this.filteredCharacters = this.characters.filter(char => {
            // Search filter one by one
            const matchesSearch = !searchTerm || 
                char.name.toLowerCase().includes(searchTerm) ||
                char.epithet.toLowerCase().includes(searchTerm) ||
                char.affiliation.toLowerCase().includes(searchTerm) ||
                char.status.toLowerCase().includes(searchTerm) ||
                char.id.toLowerCase().includes(searchTerm);

            // Affiliation filter
            const matchesAffiliation = selectedAffiliations.length === 0 || 
                selectedAffiliations.includes(char.affiliation);

            // Status filter
            const matchesStatus = selectedStatuses.length === 0 || 
                selectedStatuses.includes(char.status);

            return matchesSearch && matchesAffiliation && matchesStatus;
        });

        // Apply sorting
        this.applySorting();
        this.renderCharacters();
    }

    // Apply sorting
    applySorting() {
        // Get the current sort value from the select element
        const sortValue = this.sortSelect.value;

        // Sort the filtered characters object using the Array.sort() method with callback
        if (sortValue === 'name-asc') {
            // Sort A-Z
            this.filteredCharacters.sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });
        } else if (sortValue === 'name-desc') {
            // Sort Z-A
            this.filteredCharacters.sort((a, b) => {
                if (a.name > b.name) return -1; 
                if (a.name < b.name) return 1;
                return 0;
            });
        } else if (sortValue === 'status') {
            // Group alive first, then deceased
            this.filteredCharacters.sort((a, b) => {
                if (a.status === 'alive' && b.status === 'deceased') return -1;
                if (a.status === 'deceased' && b.status === 'alive') return 1;
                return 0;
            });
        } else if (sortValue === 'affiliation') {
            // Group marines first, then pirates
            this.filteredCharacters.sort((a, b) => {
                if (a.affiliation === 'marine' && b.affiliation === 'pirate') return -1;
                if (a.affiliation === 'pirate' && b.affiliation === 'marine') return 1;
                return 0;
            });
        }
       
    }

    // Render characters to the grid
    renderCharacters() {
        if (!this.charGrid) return;
        
        // Clear the grid before rendering
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

        // Render filtered characters
        this.charGrid.innerHTML = this.filteredCharacters
            .map(char => this.characterTemplate(char))
            .join('');
    }

    // Template for character card
    characterTemplate(char) {
        return `
            <div class="char-card" id="${char.id}">
                <div class="char-image">
                    <img src="${char.image}" alt="${char.name}">
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

    // Setup event listeners
    setupEventListeners() {
        if (!this.charGrid) return;

        // Card click event
        this.charGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.char-card');
            if (card) {
                alert(`Character ID: ${card.id}`);
            }
        });

        // Search input event with debounce, to avoid multiple calls to applyFilters()
        let debounceTimeout;
        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => {
                clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(() => {
                    this.applyFilters();
                }, 300);
            });
        }

        // Sort select event
        if (this.sortSelect) {
            this.sortSelect.addEventListener('change', () => {
                this.applyFilters();
            });
        }

        // Filter checkbox events
        this.filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.applyFilters();
            });
        });
    }

    // Load all sections
    async loadSections() {
        await this.loadCharacters();
    }

    // Hide characters section
    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
    }

    // Show characters section
    show() {
        if (this.container) {
            this.container.style.display = 'block';
        }
    }
}

export { Characters as default };
