/**
 * Navigation Class
 * Handles the main navigation and page routing functionality
 * 
 * This class manages:
 * - Navigation between different pages/sections (Home, Characters)
 * - Loading and initializing page components
 * - Showing/hiding sections based on navigation
 * - Loading the credential modal for authentication
 */
class Navigation {
    // Store navigation link elements
    // Store navigation link elements and display areas
    navLinks = {
        home: null,
        characters: null,
        'devil-fruits': null,
        arcs: null
    };

    displayArea = {
        home: null,
        characters: null,
        'devil-fruits': null,
        arcs: null
    }

    // Navigation items configuration
    navItems = [
        { id: 'home-link', text: 'HOME', href: '#home' },
        { id: 'characters-link', text: 'CHARACTERS', href: '#characters' },
        { id: 'devil-fruits-link', text: 'DEVIL FRUITS', href: '#devil-fruits' },
        { id: 'arcs-link', text: 'ARCS', href: '#arcs' },
        { id: 'login-modal', text: 'LOGIN', href: '#login', class: 'login-modal' },
        { id: 'signup-modal', text: 'SIGNUP', href: '#signup', class: 'signup-modal' }
    ];

    constructor() {
        this.navigation = document.getElementById('navigation');
        this.loadingElement = document.getElementById('loading');
        this.navigation.innerHTML = this.buildNavigation();
        
        // Initialize all nav links
        Object.keys(this.navLinks).forEach(key => {
            this.navLinks[key] = document.getElementById(`${key}-link`);
        });

        // Initialize active nav state and show active page
        this.init();
    }
    
    /**
     * Builds the HTML structure for the navigation
     * @returns {string} HTML string for the navigation
     */
    buildNavigation() {
        return `
            <div class="nav-container">
                <a class="logo" href="index.html">OPNEX</a>
                <ul>
                    ${this.navItems.map(item => `
                        <li class="nav-item ${item.class ? 'button-link' : ''}">
                            <a id="${item.id}" class="${item.class || ''}" href="${item.href}">
                                ${(item.id === 'arcs-link') ? `
                                ` : ''}
                                ${item.text}
                            </a>
                        </li>
                    `).join('')}
                </ul>
                <button id="nav-burger" >
                    <svg  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/>
                    </svg>
                </button>
            </div>
        `;
    }

    /**
     * Shows loading animation
     */
    showLoading() {
        this.loadingElement.style.display = 'flex';
    }

    /**
     * Hides loading animation
     */
    hideLoading() {
        this.loadingElement.style.display = 'none';
    }

    /**
     * Bind click handlers to navigation links
     * Each handler:
     * - Removes active class from all nav links
     * - Adds active class to clicked link
     * - Hides all page sections
     * - Shows the clicked section
     */
    bindNavLinks() {
        // Hide all page sections
        const hideAll = () => {
            Object.values(this.displayArea).forEach(area => {
                if (area && typeof area.hide === 'function') {
                    area.hide();
                }
            });
        }

        // Remove active class from all nav links
        const removeActive = () => {
            this.navigation.querySelectorAll(".nav-item a").forEach(link => {
                link.classList.remove('active');
            });
        };

        // Bind click handlers to each nav link
        Object.values(this.navLinks).forEach(link => {
            if (link && !link.id.includes('arcs')) {
                link.addEventListener('click', async () => {
                    this.showLoading();
                    removeActive();
                    link.classList.add('active');
                    hideAll();
                    const pageId = link.id.replace('-link', '');
                    
                    // Add delay before changing page, for aesthetic effect only
                    await new Promise(resolve => setTimeout(resolve, 300));
                    
                    await this.setActivePage(pageId);
                    localStorage.setItem('activePage', pageId);
                    this.hideLoading();
                });
            }
        });
    }

    /**
     * Sets the active page and updates UI accordingly
     * This method:
     * - Shows the selected page content using displayArea
     * - Adds active class to the corresponding nav link
     * - Used by bindNavLinks() when switching pages
     * 
     * @param {string} pageId - ID of the page to activate (e.g. 'home', 'characters')
     */
    async setActivePage(pageId) {
        await this.displayArea[pageId].show();
        this.navLinks[pageId].classList.add('active');
    }

    /**
     * Initialize navigation by:
     * - Loading required page components
     * - Creating component instances
     * - Loading initial content
     * - Setting up navigation handlers
     * - Setting default active page from localStorage
     */
    async init() {
        this.showLoading();
        // Import all required page modules in parallel
        const [
            { default: Home },
            { default: Characters },
            { default: CredentialModal },
            { default: DevilFruits }
        ] = await Promise.all([
            import('./home/home.js'),
            import('./characters/characters.js'),
            import('./credmodal.js'),
            import('./devil-fruits/devilfruits.js')
        ]);

        // Initialize page components
        this.displayArea.home = new Home('home');
        this.displayArea.characters = new Characters('characters');
        this.displayArea['devil-fruits'] = new DevilFruits('devil-fruits');
        // Load initial content for pages, passing a callback function to load the modal after the home section is loaded
        await this.displayArea.characters.loadSections();
        await this.displayArea['devil-fruits'].loadSections();
        await this.displayArea.home.loadSections(
            async () => { new CredentialModal('credential') }
        );

        // Set up navigation click handlers
        this.bindNavLinks();

        // Set default active page from localStorage or default to home
        const activePage = localStorage.getItem('activePage') || 'home';
        await this.setActivePage(activePage);
        this.hideLoading();
    }
}

export { Navigation as default };
