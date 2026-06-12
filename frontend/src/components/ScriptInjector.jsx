import { useEffect } from 'react';

const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5000';

const ScriptInjector = () => {
  useEffect(() => {
    const loadedScripts = [];

    const loadScripts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/plugins`);
        if (!res.ok) return;
        const plugins = await res.json();

        plugins.forEach((plugin) => {
          // Parse the HTML code block
          const parser = new DOMParser();
          const doc = parser.parseFromString(plugin.code, 'text/html');
          const elements = Array.from(doc.body.childNodes).concat(Array.from(doc.head.childNodes));

          elements.forEach((el) => {
            // Check if element is a script tag
            if (el.tagName && el.tagName.toLowerCase() === 'script') {
              const script = document.createElement('script');
              
              // Copy all attributes (src, async, defer, type, etc.)
              Array.from(el.attributes).forEach((attr) => {
                script.setAttribute(attr.name, attr.value);
              });
              
              // Copy the inner script content
              script.text = el.textContent;
              script.setAttribute('data-plugin-tag', plugin.name);

              // Set placement target
              let target = document.head;
              if (plugin.placement === 'body_start') {
                target = document.body;
              } else if (plugin.placement === 'body_end') {
                target = document.body;
              }

              // Append to DOM
              if (plugin.placement === 'body_start' && target.firstChild) {
                target.insertBefore(script, target.firstChild);
              } else {
                target.appendChild(script);
              }
              
              loadedScripts.push(script);
            } 
            // For other elements (noscript, div widgets, style tags, etc.)
            else if (el.nodeType === Node.ELEMENT_NODE) {
              const clone = el.cloneNode(true);
              clone.setAttribute('data-plugin-tag', plugin.name);

              let target = document.body;
              if (plugin.placement === 'head') {
                target = document.head;
              }

              if (plugin.placement === 'body_start' && target.firstChild) {
                target.insertBefore(clone, target.firstChild);
              } else {
                target.appendChild(clone);
              }

              loadedScripts.push(clone);
            }
          });
        });
      } catch (err) {
        console.error('Failed to load custom script plugins:', err);
      }
    };

    loadScripts();

    // Clean up injected elements on unmount or reload
    return () => {
      loadedScripts.forEach((el) => {
        try { el.remove(); } catch {}
      });
    };
  }, []);

  return null;
};

export default ScriptInjector;
