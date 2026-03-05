/* eslint-disable */
/* global WebImporter */

/**
 * Parser for content-fragment block (magazine article body)
 *
 * Source: https://wknd.site/us/en/magazine/arctic-surfing.html
 * Base Block: (default content - no block table needed)
 *
 * Source HTML Pattern:
 * <article class="contentfragment">
 *   <article class="cmp-contentfragment">
 *     <h3 class="cmp-contentfragment__title">Title</h3>
 *     <div class="cmp-contentfragment__elements">
 *       <p>Text paragraphs...</p>
 *       <blockquote>Quotes...</blockquote>
 *       <div class="image"><img src="..."></div>
 *       <div class="title cmp-title--underline"><h2>Section heading</h2></div>
 *     </div>
 *   </article>
 * </article>
 *
 * Strategy: Extract as default content (headings, paragraphs, images, blockquotes)
 * No block table needed - content fragment body becomes default EDS content.
 */
export default function parse(element, { document }) {
  const contentEl = document.createElement('div');

  // Extract all content elements in order
  const cfElements = element.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) {
    element.replaceWith(document.createElement('div'));
    return;
  }

  // Get all paragraphs, images, blockquotes, and section headings
  const walker = document.createTreeWalker(cfElements, 1 /* NodeFilter.SHOW_ELEMENT */);
  let node = walker.nextNode();
  while (node) {
    // Section headings (h2 inside .cmp-title)
    if (node.matches && node.matches('.cmp-title__text')) {
      const h = document.createElement(node.tagName.toLowerCase());
      h.textContent = node.textContent.trim();
      contentEl.appendChild(h);
    }
    // Blockquotes
    else if (node.tagName === 'BLOCKQUOTE') {
      const bq = document.createElement('blockquote');
      bq.textContent = node.textContent.trim();
      contentEl.appendChild(bq);
    }
    // Images
    else if (node.matches && node.matches('.cmp-image__image')) {
      const img = document.createElement('img');
      img.src = node.src;
      img.alt = node.alt || '';
      contentEl.appendChild(img);
    }
    // Paragraphs (direct children of content fragment elements)
    else if (node.tagName === 'P' && node.parentElement && !node.closest('.cmp-title')) {
      const p = document.createElement('p');
      p.innerHTML = node.innerHTML;
      contentEl.appendChild(p);
    }
    // Lists
    else if (node.tagName === 'UL' || node.tagName === 'OL') {
      contentEl.appendChild(node.cloneNode(true));
    }
    node = walker.nextNode();
  }

  element.replaceWith(contentEl);
}
