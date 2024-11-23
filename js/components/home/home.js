/**
 * Home Class
 * This class handles the home page and its sections
 * 
 * Key Features:
 * - Loading sections from JSON files
 * - Generating HTML for each section
 * - Handling modal loading for character details
 * - Managing visibility of home container
 * 
 * The home page is divided into 4 main sections:
 * 1. Hero - Main landing section with call-to-action
 * 2. About - Information about the application/service
 * 3. Benefits - Key features and benefits
 * 4. CTA - Final call-to-action section
 */

class Home {
  /**
   * Creates a new Home instance
   * @param {string} id - The ID of the home container element
   */
  constructor(id) {
    // This id refers to the home container, which is the div with the id of home
    this.id = id;

    // Initialize empty section objects that will be populated with JSON data
    this.sections = {
      hero: {},      // Landing section data
      about: {},     // About section data  
      benefits: {},  // Benefits section data
      cta: {}        // Call-to-action section data
    }
  }
  
  /**
   * Loads all sections asynchronously from JSON files
   * Uses combined async/await and promises pattern
   * @param {Function} loadModal - Optional callback for modal loading
   */
  async loadSections(loadModal = async () => {}) {
    // Get container reference and clear existing content
    this.container = document.getElementById(this.id);
    this.container.innerHTML = '';

    const container = this.container;

    // Load hero section from section1.json
    await fetch('./json/home/section1.json')
      .then(res => res.json())
      .then(data => {
        this.sections.hero = data;
        container.innerHTML += this.getHeroSection();
      });

    // Load about section from section2.json
    await fetch('./json/home/section2.json')
      .then(res => res.json())
      .then(data => {
        this.sections.about = data;
        container.innerHTML += this.getAboutSection();
      });

    // Load benefits section from section3.json
    await fetch('./json/home/section3.json')
      .then(res => res.json())
      .then(data => {
        this.sections.benefits = data;
        container.innerHTML += this.getBenefitsSection();
      });

    // Load CTA section from section4.json
    await fetch('./json/home/section4.json')
      .then(res => res.json())
      .then(data => {
        this.sections.cta = data;
        container.innerHTML += this.getCtaSection();
      });

    // Execute modal loading callback after all sections are loaded
    await loadModal();
  }

  /**
   * Generates HTML for the hero section
   * This section serves as the main landing area of the home page
   * 
   * Layout Structure:
   * - Hero section wrapper
   *   - Content container with flexbox
   *     - Text content (left side)
   *       - H1 title
   *       - Description paragraph
   *       - CTA button
   *     - Image content (right side)
   *       - Onepiece image with lazy loading
   *   - Decorative mini-footer
   * 
   * Features:
   * - Hero title and description text
   * - Call-to-action button that triggers signup modal
   * - Onepiece hero image with lazy loading
   * - Responsive layout with flexbox
   * - Decorative footer element
   * 
   * 
   * @returns {string} Hero section HTML with responsive layout
   */
  getHeroSection() {
    const { id, title, description, buttonText, image } = this.sections.hero;
    return `
          <section id="${id}" class="hero-section">
            <div class="hero-content">
              <!-- Hero Text Content -->
              <div>
                <h1>${title}</h1>
                <p>
                ${description}
                </p>
                <button class='get-started signup-modal'>${buttonText}</button>
              </div>
              <!-- Hero Logo/Image -->
              <div class="hero-logo flex justify-center lazy-load">
                <img
                  src="${image}"
                  alt="One Piece Hero Image"
                  class="rounded-full w-32 h-32 object-cover"
                        loading="lazy"
                        onload="this.classList.add('loaded'); this.closest('.lazy-load').classList.remove('lazy-load')"
                />
              </div>
            </div>
          </section>
          <!-- Decorative Footer Element -->
          <div class="mini-footer"></div>
    `;
  }

  /**
   * Generates HTML for the about section
   * 
   * Structure:
   * - About section wrapper
   *   - Content container with flexbox
   *     - Image content (left side)
   *       - Onepiece image with lazy loading
   *     - Text content (right side)
   *       - H2 title
   *       - Description list with checkmark icons
   *       - "How it Works" section
   *         - H2 title
   *         - Ordered list with checkmark icons
   * 
   * Features:
   * - Responsive two-column layout
   * - Lazy loaded image
   * - Checkmark icon bullets for list items
   * - Semantic HTML structure with sections and lists
   * - Accessible headings hierarchy
   * 
   * @returns {string} About section HTML with responsive layout
   */
  getAboutSection() {
    const { id, title, description, howItWorks, image } = this.sections.about;
    return `
          <section id="${id}" class="about-section">
            <div class="about-content">
              <div class="about-image lazy-load">
                <img src="${image}" alt="One Piece World Map"
                  loading="lazy"
                  onload="this.classList.add('loaded'); this.closest('.lazy-load').classList.remove('lazy-load')"
                />
              </div>
              <div>
                
                <h2>${title}</h2>                  
                <ol>
                    ${description.map(step => `
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                        <span>${step}</span>
                    </li>
                    `).join('')}
                </ol>
                <h2>${howItWorks.title}</h2>                  
                <ol>
                    ${howItWorks.steps.map(step => `
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                        <span>${step}</span>
                    </li>
                    `).join('')}
                </ol>
              </div>
            </div>
          </section>
    `;
  }

  /**
   * Generates HTML for the benefits section
   * 
   * Features:
   * - Responsive grid layout for benefit cards
   * - Lazy loading of card images for performance
   * - Semantic HTML structure with sections and headings
   * - Accessible image alt text
   * - CSS class hooks for styling
   * 
   * Layout Structure:
   * - Section wrapper with unique ID
   * - Content container for spacing/alignment
   * - Title heading
   * - Grid of benefit cards:
   *   - Card container
   *   - Lazy loaded image
   *   - Card title
   *   - Description text
   * 
   * @param {Object} sections.benefits - Benefits section data
   * @param {string} sections.benefits.id - Section ID
   * @param {string} sections.benefits.title - Section title
   * @param {Array} sections.benefits.cards - Array of benefit card objects
   * @param {string} sections.benefits.cards[].image - Card image URL
   * @param {string} sections.benefits.cards[].title - Card title
   * @param {string} sections.benefits.cards[].description - Card description
   * @returns {string} Benefits section HTML with responsive card grid
   */
  getBenefitsSection() {
    const { id, title, cards } = this.sections.benefits;
    return `
        <!-- benefits sections -->
          <section id="${id}">
            <div class="benefits-content">
              <h2>${title}</h2>
              <div class="benefits-cards">
                ${cards.map(card => `
                    <div class="benefit-card">
                    <div class="benefit-image lazy-load">
                        <img src="${card.image}" alt="${card.title}"
                          loading="lazy"
                          onload="this.classList.add('loaded'); this.closest('.lazy-load').classList.remove('lazy-load')"
                        />
                    </div>
                    <h3>${card.title}</h3>
                    <p>${card.description}</p>
                    </div>
                `).join('')}
                </div>
              </div>
            </div>
          </section>
    `;
  }

  /**
   * Generates HTML for the Call-to-Action (CTA) section
   * Creates a focused section to drive user engagement and signups
   * 
   * Features:
   * - Clean, centered layout with clear hierarchy
   * - Engaging heading and descriptive text
   * - Prominent button with arrow icon
   * - Semantic HTML structure
   * - Accessible button with SVG icon
   * - CSS class hooks for styling
   * 
   * Layout Structure:
   * - Section wrapper with unique ID
   * - Content container for alignment
   * - Title heading
   * - Description paragraph
   * - CTA button with:
   *   - Text label
   *   - Arrow icon SVG
   * 
   * @param {Object} sections.cta - CTA section data
   * @param {string} sections.cta.id - Section ID
   * @param {string} sections.cta.title - Section heading
   * @param {string} sections.cta.description - Section description text
   * @param {string} sections.cta.buttonText - Button label text
   * @returns {string} CTA section HTML with responsive layout
   */
  getCtaSection() {
    const { id, title, description, buttonText } = this.sections.cta;
    return `
        <section id="${id}" class="cta-section">
            <div class="cta-content">
                <h2>${title}</h2>
                <p>${description}</p>
                <button class="cta-button signup-modal">
                ${buttonText}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                </button>
            </div>
        </section>
    `;
  }

  /**
   * Hides the home container
   * Sets display to 'none' if container exists
   */
  hide() {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  /**
   * Shows the home container
   * Sets display to 'block' if container exists
   */
  show() {
    if (this.container) {
      this.container.style.display = 'block';
    }
  }
}

export { Home as default };
