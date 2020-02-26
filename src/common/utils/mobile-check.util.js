export const isMobile = (() => {
  let check = false;
  (function(a) {
    if (window.screen.width < 768) {
      check = true;
    }
  })(navigator.userAgent || navigator.vendor || window.opera);

  return check;
})();
