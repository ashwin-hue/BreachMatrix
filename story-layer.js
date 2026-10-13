/**
 * BreachMatrix Story Layer Loader
 * Controls dynamic initialization of the 3D scroll story layer.
 * 
 * HARD CONSTRAINT CONTROL:
 * To turn off the layer and restore 100% pixel-identical baseline:
 * 1. Append `?story=off` in the URL, OR
 * 2. Set `window.__STORY_LAYER = false` before load.
 */
(function () {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('story') === 'off' || window.__STORY_LAYER === false) {
      console.log('[StoryLayer] Deactivated by flag (?story=off). Baseline untouched.');
      return;
    }

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      console.log('[StoryLayer] Deactivated: prefers-reduced-motion detected.');
      return;
    }

    const loadStory = () => {
      import('./story-bundle.js')
        .then((module) => {
          if (module && typeof module.initStoryLayer === 'function') {
            module.initStoryLayer();
          }
        })
        .catch((err) => {
          console.warn('[StoryLayer] Dynamic import skipped:', err);
        });
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadStory, { timeout: 1200 });
    } else {
      window.addEventListener('load', () => setTimeout(loadStory, 150));
    }
  } catch (e) {
    // Fail silently without affecting existing site
  }
})();
