(function () {
  'use strict';

  Promise.all([
    fetch('includes/header.html').then(function (r) { return r.text(); }),
    fetch('includes/footer.html').then(function (r) { return r.text(); })
  ])
    .then(function (parts) {
      var headerPlaceholder = document.getElementById('header-placeholder');
      var footerPlaceholder = document.getElementById('footer-placeholder');
      if (headerPlaceholder) headerPlaceholder.outerHTML = parts[0];
      if (footerPlaceholder) footerPlaceholder.outerHTML = parts[1];
      document.dispatchEvent(new CustomEvent('includesLoaded'));
    })
    .then(function () {
      var s = document.createElement('script');
      s.src = 'script.js';
      s.async = false;
      document.body.appendChild(s);
    })
    .catch(function () {
      var s = document.createElement('script');
      s.src = 'script.js';
      document.body.appendChild(s);
    });
})();
