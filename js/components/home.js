/* The whole home components */
class Home {
    constructor(id) {
        this.id = id;
        this.sections = {
            hero: {},
            about: {},
            benefits: {},
            cta: {}
        }
        
        // Load sections
        this.loadSections();
    }

    /* combined async await and promises to handle the loading of sections */
    async loadSections() {
        const container = document.getElementById(this.id);
        container.innerHTML = '';

        // Load hero section
        await fetch('./js/components/home/section1.json')
            .then(res => res.json())
            .then(data => {
                this.sections.hero = data;
                container.innerHTML += this.getHeroSection();
            });

        // Load about section  
        await fetch('./js/components/home/section2.json')
            .then(res => res.json())
            .then(data => {
                this.sections.about = data;
                container.innerHTML += this.getAboutSection();
            });

        // Load benefits section
        await fetch('./js/components/home/section3.json')
            .then(res => res.json())
            .then(data => {
                this.sections.benefits = data;
                container.innerHTML += this.getBenefitsSection();
            });

        // Load CTA section
        await fetch('./js/components/home/section4.json')
            .then(res => res.json())
            .then(data => {
                this.sections.cta = data;
                container.innerHTML += this.getCtaSection();
            });
    }
    /* Hero Section */
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
                <button class='get-started'>${buttonText}</button>
              </div>
              <!-- Hero Logo/Image -->
              <div class="hero-logo flex justify-center">
                <img
                  src="${image}"
                  alt="One Piece Hero Image"
                  class="rounded-full w-32 h-32 object-cover"
                />
              </div>
            </div>
          </section>
          <!-- Decorative Footer Element -->
          <div class="mini-footer"></div>
    `;
    }
    /* About Section */
    getAboutSection() {
        const { id, title, description, howItWorks, image } = this.sections.about;
        return `
          <section id="${id}" class="about-section">
            <div class="about-content">
              <div class="about-image">
                <img src="${image}" alt="One Piece World Map" />
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

    /* Benefits Section */
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
                    <div class="benefit-image">
                        <img src="${card.image}" alt="${card.title}" />
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

    /* CTA Section */
    getCtaSection() {
        const { id, title, description, buttonText } = this.sections.cta;
        return `
        <section id="${id}" class="cta-section">
            <div class="cta-content">
                <h2>${title}</h2>
                <p>${description}</p>
                <button class="cta-button">
                ${buttonText}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                </button>
            </div>
        </section>
    `;
    }
}

export default Home;
