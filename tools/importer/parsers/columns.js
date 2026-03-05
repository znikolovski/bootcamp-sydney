/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block (featured article teaser)
 *
 * Source: https://wknd.site/us/en.html
 * Base Block: columns
 *
 * Block Structure (from EDS columns block):
 * - Row 1: column 1 (image) | column 2 (pretitle, heading, description, CTA)
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="teaser cmp-teaser--featured">
 *   <div class="cmp-teaser">
 *     <div class="cmp-teaser__content">
 *       <p class="cmp-teaser__pretitle">Featured Article</p>
 *       <h2 class="cmp-teaser__title">...</h2>
 *       <div class="cmp-teaser__description">...</div>
 *       <div class="cmp-teaser__action-container">
 *         <a class="cmp-teaser__action-link" href="...">CTA</a>
 *       </div>
 *     </div>
 *     <div class="cmp-teaser__image">
 *       <img src="..." alt="...">
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-03-05
 */
export default function parse(element, { document }) {
  // Extract image
  // VALIDATED: .cmp-teaser__image img and .cmp-image__image exist in source DOM
  const img = element.querySelector('.cmp-teaser__image img, .cmp-image__image');

  // Extract pretitle
  // VALIDATED: .cmp-teaser__pretitle exists in source DOM
  const pretitle = element.querySelector('.cmp-teaser__pretitle, [class*="pretitle"]');

  // Extract heading
  // VALIDATED: .cmp-teaser__title exists in source DOM as h2
  const heading = element.querySelector('.cmp-teaser__title, h2, h1');

  // Extract description
  // VALIDATED: .cmp-teaser__description exists in source DOM
  const description = element.querySelector('.cmp-teaser__description, [class*="description"]');

  // Extract CTA link
  // VALIDATED: .cmp-teaser__action-link exists in source DOM
  const cta = element.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a');

  // Build image cell (column 1)
  const imageCell = document.createElement('div');
  if (img) {
    const newImg = document.createElement('img');
    newImg.src = img.src;
    newImg.alt = img.alt || '';
    imageCell.appendChild(newImg);
  }

  // Build content cell (column 2) with pretitle, heading, description, CTA
  const contentCell = document.createElement('div');
  if (pretitle) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = pretitle.textContent.trim();
    p.appendChild(strong);
    contentCell.appendChild(p);
  }
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    contentCell.appendChild(h2);
  }
  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    contentCell.appendChild(p);
  }
  if (cta) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = cta.href;
    a.textContent = cta.textContent.trim();
    p.appendChild(a);
    contentCell.appendChild(p);
  }

  // Single row with 2 columns: image | content
  const cells = [
    [imageCell, contentCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });
  element.replaceWith(block);
}
