// Add type="module" to your script tag in HTML, or use this alternative approach:
window.onload = async () => {
  const { default: Home } = await import('./components/home.js');
  const home = new Home('home');
};
