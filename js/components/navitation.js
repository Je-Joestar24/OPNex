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
        home: null, // Home link
        characters: null, // Characters link
        'devil-fruits': null, // Devil fruits link
        arcs: null // Arcs link
    };

    displayArea = {
        home: null, // Home display area
        characters: null, // Characters display area
        'devil-fruits': null, // Devil fruits display area
    }

    // Navigation items configuration
    navItems = [
        { id: 'home-link', text: 'HOME', href: '#home' }, // Home link
        { id: 'characters-link', text: 'CHARACTERS', href: '#characters' }, // Characters link
        { id: 'devil-fruits-link', text: 'DEVIL FRUITS', href: '#devil-fruits' }, // Devil fruits link
        { id: 'arcs-link', text: 'ARCS', href: '#arcs' }, // Arcs link
        { id: 'login-modal', text: 'LOGIN', href: '#login', class: 'login-modal' }, // Login modal
        { id: 'signup-modal', text: 'SIGNUP', href: '#signup', class: 'signup-modal' } // Signup modal
    ];

    constructor() {
        this.navigation = document.getElementById('navigation'); // Navigation container
        this.loadingElement = document.getElementById('loading'); // Loading element
        this.navigation.innerHTML = this.buildNavigation(); // Build navigation HTML

        // Initialize all nav links
        Object.keys(this.navLinks).forEach(key => {
            this.navLinks[key] = document.getElementById(`${key}-link`); // Initialize nav links
        });

        // Initialize active nav state and show active page
        this.init();
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
        // Import all required page modules in paralleln
        const [
            { default: Home },
            { default: Characters },
            { default: CredentialModal },
            { default: DevilFruits }
        ] = await Promise.all([
            import('./home/home.js'), // Home module
            import('./characters/characters.js'), // Characters module
            import('./credmodal.js'), // Credential modal module
            import('./devil-fruits/devilfruits.js') // Devil fruits module
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
    /**
     * Builds the HTML structure for the navigation
     * @returns {string} HTML string for the navigation
     */
    buildNavigation() {
        return `
            <div class="nav-container">
                <a class="logo" href="index.html">OPNEX</a>
                <ul class="nav-menu">
                    ${this.navItems.map(item => `
                        <li class="nav-item ${item.class ? 'button-link' : ''}">
                            <a id="${item.id}" class="${item.class || ''}" href="${item.href}">
                                ${(item.id === 'arcs-link') ? `
                                <svg class="h-8 w-8 text-red-500"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                </svg>   ` : ''}
                                ${item.text}
                            </a>
                        </li>
                    `).join('')}
                </ul>
                <button id="nav-burger" class="hamburger">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/>
                    </svg>
                </button>
            </div>
            <div class="mobile-menu">
                <ul>
                    ${this.navItems.map(item => `
                        <li class="nav-item ${item.class ? 'mobile-button-link' : ''}">
                            <a id="mobile-${item.id}" class="${item.class || ''}" href="${item.href}">
                                ${item.id === 'arcs-link' ? `
                                <svg class="h-8 w-8 text-red-500"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                </svg>` : ''}
                                ${item.text}
                            </a>
                        </li>
                    `).join('')}
                </ul>
                <div class="mobile-menu-footer"></div>
            </div>
            <div class="mobile-menu-overlay"></div>
        `;
    }

    /**
     * Toggles the mobile menu visibility with animation
     * 
     * When closing:
     * - Adds closing animation class
     * - Hides menu and overlay after animation
     * - Removes closing class
     * 
     * When opening:
     * - Removes closing class
     * - Shows menu and overlay
     */
    toggleMobileMenu() {
        const mobileMenu = this.navigation.querySelector('.mobile-menu');
        const mobileMenuOverlay = this.navigation.querySelector('.mobile-menu-overlay');
        
        const isVisible = mobileMenu.style.display === 'block';
        
        if (isVisible) {
            mobileMenu.classList.add('closing');
            setTimeout(() => {
                mobileMenu.style.display = 'none';
                mobileMenuOverlay.style.display = 'none';
                mobileMenu.classList.remove('closing');
            }, 300);
        } else {
            mobileMenu.classList.remove('closing');
            mobileMenu.style.display = 'block';
            mobileMenuOverlay.style.display = 'block';
        }
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
     * Binds event handlers to navigation links and mobile menu
     * 
     * Desktop navigation:
     * - Handles clicks on main nav links
     * - Updates active states and page visibility
     * - Manages loading states and transitions
     * 
     * Mobile navigation:
     * - Handles mobile menu link clicks 
     * - Toggles mobile menu visibility
     * - Manages page transitions on mobile
     * 
     * Common functionality:
     * - Stores active page in localStorage
     * - Shows/hides loading animation
     * - Adds delay for smooth transitions
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

        // Bind click handlers to mobile nav links
        this.navigation.querySelectorAll('.mobile-menu ul .nav-item a').forEach(link => {
            const linkId = link.id;
            if (!linkId.includes('arcs') && !linkId.includes('login') && !linkId.includes('signup')) {
                link.addEventListener('click', async () => {
                    this.toggleMobileMenu();
                    this.showLoading();
                    const pageId = linkId.replace('-link', '').replace('mobile-', '');
                    hideAll();

                    // Add delay before changing page, for aesthetic effect only
                    await new Promise(resolve => setTimeout(resolve, 300));

                    await this.setActivePage(pageId);
                    localStorage.setItem('activePage', pageId);
                    this.hideLoading();
                });
            }
        });
        // Bind click handlers for mobile menu toggle
        ['#nav-burger', '.mobile-menu-overlay', '#mobile-login-modal', '#mobile-signup-modal'].forEach(selector => {
            this.navigation.querySelector(selector).addEventListener('click', () => {
                this.toggleMobileMenu();
            });
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

}

export { Navigation as default };
