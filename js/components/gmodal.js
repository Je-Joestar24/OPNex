
/* This contains credential modal functionalities */

export default class Modal {
  /* for storing modal configs */
  data = { login: {}, signup: {} };

  constructor(type) {

    /* for selecting the buttons */
    this.signupButtons = document.querySelectorAll('.signup-modal');
    this.loginButtons = document.querySelectorAll('.login-modal');

    /* for selecting the modal and modal overlay */
    this.modal = document.querySelector('#modal');
    this.modalOverlay = this.modal.querySelector('.modal-overlay');
    this.modalContents = this.modal.querySelector('.modal-container');

    this.modalContents.innerHTML = `
        <div class="left">
             <img src="image/general/wheel.png" alt="modal display">
        </div>
         <div class="right">
             <!-- Sign up form containing username, email, password and confirm password -->
         </div>
        `;
    console.log(this.modalContents);
    /* for determining the type of modal */
    this.type = type;

    // Initialize data and modal functionality
    this.init();
  }

  /* Use to insure all data in the modal <i class="fa fa-address-card-o" aria-hidden="true"></i> loaded before initializing the modal functionality */
  async init() {
    try {
      // modal configs
      const [signupConfig, loginConfig] = await Promise.all([
        this.fetchCredentialForm('./json/general/signupModal.json'),
        this.fetchCredentialForm('./json/general/loginModal.json')
      ]);

      // Store configs in data object
      this.data.signup = signupConfig;
      this.data.login = loginConfig;

      // Initialize modal functionality after data is loaded
      this.initModalFunctionality();
    } catch (error) {
      console.error('Error initializing modal:', error);
    }
  }

  /* for fetching modal configs */
  async fetchCredentialForm(path) {
    try {
      const response = await fetch(path);
      const modalConfig = await response.json();
      return modalConfig;
    } catch (error) {
      console.error('Error fetching credential form:', error);
    }
  }

  /* Modal contents speicifically for Credential forms such as Signup and Login */
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

  /* Initialize modal functionality */
  initModalFunctionality() {
    // Add click handlers to all matching buttons
    this.signupButtons.forEach(button => {
      button.addEventListener('click', () => this.toggleModal('signup'));
    });

    /* for handling the login button */
    this.loginButtons.forEach(button => {
      button.addEventListener('click', () => this.toggleModal('login'));
    });

    // Close modal when clicking overlay
    this.modalOverlay.addEventListener('click', () => this.toggleModal());

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.style.display === 'flex') {
        this.toggleModal();
      }
    });
  }

  /* Toggle modal visibility */
  toggleModal(type) {
    /* for changing the form container content */
    this.changeCredentialModalContent(type);

    /* for changing the modal classes */
    const toggleModalClasses = (isOpening) => {
      /* this will handle the modal animation if the modal type is credential */
      if (this.type === 'credential') {
        const left = this.modalContents.querySelector('.left');
        const right = this.modalContents.querySelector('.right');

        left.classList.remove(isOpening ? 'modal-close-left' : 'modal-open-left');
        left.classList.add(isOpening ? 'modal-open-left' : 'modal-close-left');

        right.classList.remove(isOpening ? 'modal-close-right' : 'modal-open-right');
        right.classList.add(isOpening ? 'modal-open-right' : 'modal-close-right');
      }
    };

    /* for closing the modal */
    const closeModal = () => {
      toggleModalClasses(false);
      setTimeout(() => {
        this.modal.style.display = 'none';
      }, 300);
    };

    /* for opening the modal */
    const openModal = () => {
      this.modal.style.display = 'flex';
      toggleModalClasses(true);
    };

    /* for closing and opening the modal */
    if (this.modal.style.display === 'flex') {
      closeModal();
    } else {
      openModal();
    }
  }

  /* for changing the modal content */
  changeCredentialModalContent(type) {
    /* for selecting the form container since form container is on the right side of the modal */
    const formContainer = this.modalContents.querySelector('.right');
    if (type === 'signup') {
      // initialize credential modal and setting the inner html
      formContainer.innerHTML = this.initCredentialModal(this.data.signup.header, this.data.signup.subHeader, this.data.signup.content);
      // Add click handler for login link
      const loginLink = formContainer.querySelector('#loginLink');
      console.log(formContainer);
      if (loginLink) {
        loginLink.addEventListener('click', (e) => {
          e.preventDefault();
          this.changeCredentialModalContent('login');
        });
      }
    } else if (type === 'login') {
      // initialize credential modal and setting the inner html
      formContainer.innerHTML = this.initCredentialModal(this.data.login.header, this.data.login.subHeader, this.data.login.content);
      // Add click handler for signup link
      const signupLink = formContainer.querySelector('#signupLink');
      if (signupLink) {
        signupLink.addEventListener('click', (e) => {
          e.preventDefault();
          this.changeCredentialModalContent('signup');
        });
      }
    }

    /* for closing the modal - this is only loaded when the modal is opened since it is not needed when the modal is closed */
    formContainer.querySelector('.close-button').addEventListener('click', () => this.toggleModal());
  }

}
