
window.onload = async () => {
    /* loading the home page components */
  const { default: Home } = await import('./components/home.js');
  const home = new Home('home');
};
