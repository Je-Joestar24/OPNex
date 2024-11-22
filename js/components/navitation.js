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

    navLinks = {
        home: null,
        characters: null
    };

    displayArea = {
        home: null,
        characters: null
    }

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
        this.navigation.innerHTML = this.buildNavigation();
        this.navLinks.home = document.getElementById('home-link');
        this.navLinks.characters = document.getElementById('characters-link');

        // Initialize active nav state and show active page
        this.init();
    }


    /**
     * Bind click handlers to navigation links
     * Each handler:
     * - Removes active class from all nav links
     * - Adds active class to clicked link
     * - Hides all page sections
     * - Shows the clicked section
     * 
     */
    bindNavLinks() {

        // Hide all page sections, inner function
        const hideAll = () => {
            Object.values(this.displayArea).forEach(area => area.hide());
        }

        // Remove active class from all nav links, inner function
        const removeActive = () => {
            this.navigation.querySelectorAll(".nav-item a").forEach(link => {
                link.classList.remove('active');
            });
        };

        for (const link of Object.values(this.navLinks)) {
            link.addEventListener('click', async () => {
                removeActive();
                link.classList.add(link.classList.contains('active') ? '' : 'active');
                hideAll();
                const pageId = link.id.split('-')[0];
                this.setActivePage(pageId);
                localStorage.setItem('activePage', pageId);
            });
        }
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
    setActivePage(pageId) {
            this.displayArea[pageId].show();
            this.navLinks[pageId].classList.add('active');
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
                            <a id="${item.id}" class="${item.class || ''}" href="${item.href}">${item.text}</a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
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
        // Import all required page modules in parallel
        const [
            { default: Home },
            { default: Characters },
            { default: CredentialModal }
        ] = await Promise.all([
            import('./home/home.js'),
            import('./characters/characters.js'),
            import('./credmodal.js')
        ]);

        // Initialize page components
        this.displayArea.home = new Home('home');
        this.displayArea.characters = new Characters('characters');

        // Load initial content for pages, passing a callback function to load the modal after the home section is loaded
        await this.displayArea.characters.loadSections();
        await this.displayArea.home.loadSections(
            async () => { new CredentialModal('credential') }
        );

        // Set up navigation click handlers
        this.bindNavLinks();

        // Set default active page from localStorage or default to home
        const activePage = localStorage.getItem('activePage') || 'home';
        this.setActivePage(activePage);
    }


}

export { Navigation as default };
