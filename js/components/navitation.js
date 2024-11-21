class Navigation {

    /* for storing the navigation links */
    navLinks = {
        home: document.getElementById('home-link'),
        characters: document.getElementById('characters-link')
    };

    /* for storing the display areas */
    displayArea = {
        home: null,
        characters: null
    }

    constructor() {
        // Initialize navigation
        this.init();
    }

    async init(){
        // importing the required modules
        const [
            {default: Home},
            {default: Characters},
            {default: Modal}
        ] = await Promise.all([
            import('./home.js'),
            import('./characters.js'),
            import('./gmodal.js')
        ]);

        this.displayArea.home = new Home('home');
        this.displayArea.characters = new Characters('characters');

        // loading the characters section
        await this.displayArea.characters.loadSections();
        // passing a callback function to the loadSections method to load the modal,
        await this.displayArea.home.loadSections(async () => { new Modal('credential')});
        this.bindNavLinks();
    }

    bindNavLinks() {
        /* for binding the home link to the home section */
        this.navLinks.home.addEventListener('click', async () => {
            this.displayArea.characters.hide();
            this.displayArea.home.show();
        });

        /* for binding the characters link to the characters section */
        this.navLinks.characters.addEventListener('click', async () => {
            this.displayArea.home.hide();
            this.displayArea.characters.show();
            //loadModal('credential');
        });
    }


}

export { Navigation as default };
