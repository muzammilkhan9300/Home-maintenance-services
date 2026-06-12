import { useEffect } from 'react';
import { getBootstrapData } from '@/lib/bootstrap';

/**
 * ScriptInjector — reads active plugins from the shared bootstrap cache
 * and injects their custom scripts/tags into the DOM exactly once per page load.
 */
const ScriptInjector = () => {
  useEffect(() => {
    const loadedElements = [];

    const injectPlugins = (plugins) => {
      plugins.forEach((plugin) => {
        // Parse the HTML code block
        const parser = new DOMParser();
        const doc = parser.parseFromString(plugin.code, 'text/html');
        const elements = [
          ...Array.from(doc.head.childNodes),
          ...Array.from(doc.body.childNodes),
        ];

        elements.forEach((el) => {
          if (el.tagName && el.tagName.toLowerCase() === 'script') {
            const script = document.createElement('script');

            // Copy all attributes (src, async, defer, type, etc.)
            Array.from(el.attributes).forEach((attr) => {
              script.setAttribute(attr.name, attr.value);
            });
            script.text = el.textContent;
            script.setAttribute('data-plugin-tag', plugin.name);

            let target = document.head;
            if (plugin.placement === 'body_start' || plugin.placement === 'body_end') {
              target = document.body;
            }

            if (plugin.placement === 'body_start' && target.firstChild) {
              target.insertBefore(script, target.firstChild);
            } else {
              target.appendChild(script);
            }

            loadedElements.push(script);
          } else if (el.nodeType === Node.ELEMENT_NODE) {
            const clone = el.cloneNode(true);
            clone.setAttribute('data-plugin-tag', plugin.name);

            let target = document.body;
            if (plugin.placement === 'head') target = document.head;

            if (plugin.placement === 'body_start' && target.firstChild) {
              target.insertBefore(clone, target.firstChild);
            } else {
              target.appendChild(clone);
            }

            loadedElements.push(clone);
          }
        });
      });
    };

    getBootstrapData()
      .then((data) => injectPlugins(data.plugins || []))
      .catch((err) => console.error('Failed to load custom script plugins:', err));

    return () => {
      loadedElements.forEach((el) => {
        try { el.remove(); } catch {}
      });
    };
  }, []); // Run once on mount — bootstrap data is shared & cached

  return null;
};

export default ScriptInjector;
