/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs block
 *
 * Source: https://wknd.site/us/en/adventures/bali-surf-camp.html
 * Base Block: tabs
 *
 * Source HTML Pattern:
 * <div class="tabs panelcontainer">
 *   <div class="cmp-tabs">
 *     <ol class="cmp-tabs__tablist">
 *       <li class="cmp-tabs__tab">Tab Label</li>
 *     </ol>
 *     <div class="cmp-tabs__tabpanel">
 *       <!-- tab content: content fragments, cards, etc. -->
 *     </div>
 *   </div>
 * </div>
 */
export default function parse(element, { document }) {
  const cells = [];

  const tabs = element.querySelectorAll('.cmp-tabs__tab');
  const panels = element.querySelectorAll('.cmp-tabs__tabpanel');

  tabs.forEach((tab, i) => {
    const labelCell = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = tab.textContent.trim();
    labelCell.appendChild(strong);

    const contentCell = document.createElement('div');
    if (panels[i]) {
      // Extract text content from panel (paragraphs, lists, images, bold text)
      const paragraphs = panels[i].querySelectorAll('p, ul, ol, h3, h2, h4, blockquote');
      paragraphs.forEach((p) => {
        const clone = p.cloneNode(true);
        contentCell.appendChild(clone);
      });

      // Extract images
      const images = panels[i].querySelectorAll('.cmp-image__image');
      images.forEach((img) => {
        const newImg = document.createElement('img');
        newImg.src = img.src;
        newImg.alt = img.alt || '';
        contentCell.appendChild(newImg);
      });

      // If no specific content found, get text content
      if (!contentCell.hasChildNodes()) {
        const p = document.createElement('p');
        p.textContent = panels[i].textContent.trim().substring(0, 500);
        contentCell.appendChild(p);
      }
    }

    cells.push([labelCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Tabs', cells });
  element.replaceWith(block);
}
