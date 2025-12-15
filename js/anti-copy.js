/* Anti-copy client-side helper
   - NOT foolproof: any determined user can bypass this.
   - Owner/dev can disable protections by running:
       localStorage.setItem('devMode', 'true')
     then reload the page.
*/
(function(){
  'use strict';
  try {
    var isDev = localStorage.getItem('devMode') === 'true';
  } catch (e) {
    var isDev = false;
  }

  if (isDev) {
    // Allow full interactions for developer
    console.info('anti-copy: devMode enabled — protections disabled');
    return;
  }

  // Add CSS class to block selection (will be defined in SCSS)
  document.documentElement.classList.add('no-select');

  // Prevent context menu
  window.addEventListener('contextmenu', function(e){
    e.preventDefault();
  }, {passive:false});

  // Prevent selection and dragging
  window.addEventListener('selectstart', function(e){ e.preventDefault(); }, {passive:false});
  window.addEventListener('dragstart', function(e){ e.preventDefault(); }, {passive:false});

  // Block common developer shortcuts
  window.addEventListener('keydown', function(e){
    // F12
    if (e.key === 'F12') { e.preventDefault(); e.stopPropagation(); }

    // Ctrl/Cmd + Shift + I/J/C  (DevTools)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && /[IJC]/i.test(e.key)) {
      e.preventDefault(); e.stopPropagation();
    }

    // Ctrl/Cmd + U / S / P (view source / save / print)
    if ((e.ctrlKey || e.metaKey) && /[USP]/i.test(e.key)) {
      e.preventDefault(); e.stopPropagation();
    }
  }, {capture:true});

  // Small invisible overlay on code blocks could be added if needed.
})();
