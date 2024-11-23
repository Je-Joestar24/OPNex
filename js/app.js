/**
 * ES6+ Features Showcased in Project:
 * - Modules (import/export)
 * - Classes with inheritance
 * - Arrow functions
 * - Template literals
 * - Destructuring assignment
 * - Async/await
 * - Promises
 * - Object shorthand notation
 * - Rest/spread operators
 * - Default parameters
 * - Block scoping (let/const)
 */

window.onload = async () => {

  /**
   * loading the navigation and app template components
   *  */
  const [{ default: Navigation }, { default: AppTemplate }] = await Promise.all([
    import('./components/navitation.js'),
    import('./components/apptemplate.js')
  ]);

  const appContent = new AppTemplate().getTemplate(); // get the complete template

  document.getElementById('app').innerHTML = appContent; // insert the template into the app container

  // ALL page initialization are inside the Navigation since Navigation controlls the page, and also to hanle the async operations properly
  new Navigation();
};
