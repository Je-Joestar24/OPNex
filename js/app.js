window.onload = async () => {
  /* loading the home page and modal components */
  const {default: Navigation} = await import('./components/navitation.js');
  // ALL page initialization are inside the Navigation since Navigation controlls the page, and also to hanle the async operations properly
  const navigation = new Navigation();

};
