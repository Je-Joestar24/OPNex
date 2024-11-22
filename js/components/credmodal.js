import Modal from './modal.js';

/**
 * CredentialModal Class
 * Extends the base Modal class to handle credential-specific modal functionality.
 * This class manages the display and interaction of login/signup forms in a modal window.
 * 
 * Key Features:
 * - Dynamic form switching between login and signup
 * - JSON-based form configuration loading
 * - Animated modal transitions
 * - Responsive layout handling
 */
class CredentialModal extends Modal {
    /**
     * Constructor
     * Initializes modal elements and sets up the base configuration
     * @param {string} type - The type of modal ('credential')
     * @extends Modal
     */
    constructor(type) {
        super();

        // Button selectors
        this.signupButtons = document.querySelectorAll('.signup-modal');
        this.loginButtons = document.querySelectorAll('.login-modal');

        // Modal element selectors
        this.modal = document.querySelector('#credential-modal');
        this.modalOverlay = this.modal.querySelector('.modal-overlay');
        this.modalContents = this.modal.querySelector('.modal-container');

        // Initial modal structure setup
        this.modalContents.innerHTML = `
            <div class="left">
                 <img src="image/general/wheel.png" alt="modal display">
            </div>
             <div class="right">
                 <!-- Sign up form containing username, email, password and confirm password -->
             </div>
            `;

        // Modal type storage
        this.type = type;

        // Data storage for form configurations
        this.data = { login: {}, signup: {} };

        // Initialize data and modal functionality
        this.init();
    }

    /**
     * Initializes the modal by loading configurations and setting up functionality
     * Ensures all data is loaded before modal becomes functional
     */
    async init() {
        try {
            super.init('#credential-modal');

            // Fetch form configurations
            const [signupConfig, loginConfig] = await Promise.all([
                this.fetchCredentialForm('./json/general/signupModal.json'),
                this.fetchCredentialForm('./json/general/loginModal.json')
            ]);

            // Store configurations
            this.data.signup = signupConfig;
            this.data.login = loginConfig;

            // Initialize modal functionality
            this.initModalFunctionality();
        } catch (error) {
            console.error('Error initializing modal:', error);
        }
    }

    /**
     * Fetches form configuration from JSON files
     * @param {string} path - Path to the JSON configuration file
     * @returns {Promise<Object>} The form configuration object
     */
    async fetchCredentialForm(path) {
        try {
            const response = await fetch(path);
            const modalConfig = await response.json();
            return modalConfig;
        } catch (error) {
            console.error('Error fetching credential form:', error);
        }
    }

    /**
     * Generates modal content HTML based on configuration
     * @param {string} header - Modal header text
     * @param {string} subHeader - Modal subheader text
     * @param {Object} content - Form content configuration
     * @returns {string} Generated HTML content
     */
    initCredentialModal(header, subHeader, content) {
        const modalContents = `
            <!-- the header -->
            <header class="modal-header">
                <div class="header-content">
                    <h2>${header}</h2>
                    <p>${subHeader}</p>
                </div>
                <button class="close-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </header>
            
            <!-- the content -->
            <div class="modal-content">
                <!-- Sign up form containing username, email, password and confirm password -->
                <form class="signup-form" id="signupForm">
                    ${content.formGroups.map(group => `
                        <div class="form-group">
                            <label for="${group.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="${group.icon}"/>
                                </svg>
                                ${group.label}
                            </label>
                            <input 
                                type="${group.type}" 
                                name="${group.name}"
                                placeholder="${group.placeholder}"
                                v-model="${group.model}"
                            >
                        </div>
                    `).join('')}
                    
                    <!-- submit button I set type to button to prevent the form from submitting -->
                    <button type="button" class="submit-button">
                        ${content.submitButton.text}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="${content.submitButton.icon}"/>
                        </svg>
                    </button>
                </form>
                <!-- footer containing Login link -->
                <footer class="login-link">
                    ${content.footer.text} <a id="${content.footer.link.id}" href="${content.footer.link.href}">${content.footer.link.text}</a>
                </footer>
            </div>`;

        return modalContents;
    }

    /**
     * Changes modal content between signup and login forms
     * @param {string} type - The type of form to display ('signup' or 'login')
     */
    changeCredentialModalContent(type) {
        const formContainer = this.modalContents.querySelector('.right');

        // Initialize the modal content based on the type
        if (type === 'signup') {
            formContainer.innerHTML = this.initCredentialModal(
                this.data.signup.header,
                this.data.signup.subHeader,
                this.data.signup.content
            );
            const loginLink = formContainer.querySelector('#loginLink');
            if (loginLink) {
                loginLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.changeCredentialModalContent('login');
                });
            }
        } else if (type === 'login') {
            formContainer.innerHTML = this.initCredentialModal(
                this.data.login.header,
                this.data.login.subHeader,
                this.data.login.content
            );
            const signupLink = formContainer.querySelector('#signupLink');
            if (signupLink) {
                signupLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.changeCredentialModalContent('signup');
                });
            }
        }

        formContainer.querySelector('.close-button').addEventListener('click', () => this.toggle());
    }

    /**
     * Initializes modal event listeners and functionality
     */
    initModalFunctionality() {
        if (this.type === 'credential') {
            this.signupButtons.forEach(button => {
                this.setToggleButton(button, () => this.changeCredentialModalContent('signup'));
            });

            this.loginButtons.forEach(button => {
                this.setToggleButton(button, () => this.changeCredentialModalContent('login'));
            });
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
        const left = this.modalContents.querySelector('.left');
        const right = this.modalContents.querySelector('.right');

        // Toggle left side animations
        left.classList.remove(isOpening ? 'modal-close-left' : 'modal-open-left');
        left.classList.add(isOpening ? 'modal-open-left' : 'modal-close-left');

        // Toggle right side animations
        right.classList.remove(isOpening ? 'modal-close-right' : 'modal-open-right');
        right.classList.add(isOpening ? 'modal-open-right' : 'modal-close-right');
    }
}

export { CredentialModal as default };