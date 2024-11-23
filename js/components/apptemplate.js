/**
 * AppTemplate Class
 * This class handles the main application template structure
 * 
 * Key Features:
 * - Navigation bar template
 * - Main content container with sections
 * - Loading animation
 * - Modal templates for credentials, characters and devil fruits
 * - Footer template
 */
class AppTemplate {
    /**
     * Navigation bar template
     * @type {string}
     */
    navigation = `
        <nav id="navigation" role="navigation">
        </nav>`;

    /**
     * Main content container template
     * Contains sections for home, characters and devil fruits pages
     * @type {string}
     */
    mainContent = `
        <main id="main" class="wrapper" role="main">
          <section id="home" class="page" role="region" aria-label="Home page">
          </section>

          <section id="characters" class="page" role="region" aria-label="Characters page">
          </section>

          <section id="devil-fruits" class="page" role="region" aria-label="Devil Fruits page">
          </section>
        </main>`;

    /**
     * Loading animation template
     * Displays animated squares while content loads
     * @type {string}
     */
    loading = `
        <div id="loading" class="loading" role="status" aria-label="Loading content">
          <div class="loading-squares">
            <div class="square"></div>
            <div class="square"></div>
            <div class="square"></div>
            <div class="square"></div>
          </div>
          <p>Loading content...</p>
        </div>`;

    /**
     * Credential modal template
     * Used for login and registration forms
     * @type {string}
     */
    credentialModal = `
        <div id="credential-modal" class="modal" role="dialog" aria-modal="true" aria-label="Login and registration">
          <div class="modal-overlay"></div>
          <div class="modal-container"></div>
        </div>`;

    /**
     * Character modal template
     * Displays detailed character information
     * @type {string}
     */
    characterModal = `
        <div id="character-modal" class="modal" role="dialog" aria-modal="true" aria-label="Character details">
          <div class="modal-overlay"></div>
          <div class="modal-container"></div>
        </div>`;

    /**
     * Devil fruit modal template
     * Displays detailed devil fruit information
     * @type {string}
     */
    devilFruitModal = `
        <div id="devil-fruit-modal" class="modal" role="dialog" aria-modal="true" aria-label="Devil Fruit details">
          <div class="modal-overlay"></div>
          <div class="modal-container"></div>
        </div>`;

    /**
     * Footer template with copyright information
     * @type {string}
     */
    footer = `
        <footer role="contentinfo">
          <p>&copy; OPNEX - All One Piece content and materials are property of Eiichiro Oda and Shueisha Inc.</p>
        </footer>`;

    /**
     * Creates a new AppTemplate instance
     * Combines all template parts into a single template string
     */
    constructor() {
        this.template = `${this.navigation}${this.mainContent}${this.loading}${this.credentialModal}${this.characterModal}${this.devilFruitModal}${this.footer}`;
    }

    /**
     * Returns the complete template string
     * @returns {string} The complete application template
     */
    getTemplate() {
        return this.template;
    }
}

export default AppTemplate;
