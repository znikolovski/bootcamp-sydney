/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block
 *
 * Source: https://wknd.site/us/en.html
 * Base Block: hero
 *
 * Block Structure (from EDS hero block):
 * - Row 1: background image
 * - Row 2: content (heading, description, CTA)
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="teaser cmp-teaser--hero cmp-teaser--imagebottom">
 *   <div class="cmp-teaser">
 *     <div class="cmp-teaser__content">
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

  // Extract heading
  // VALIDATED: .cmp-teaser__title exists in source DOM as h2
  const heading = element.querySelector('.cmp-teaser__title, h2, h1');

  // Extract description
  // VALIDATED: .cmp-teaser__description exists in source DOM
  const description = element.querySelector('.cmp-teaser__description, [class*="description"]');

  // Extract CTA link
  // VALIDATED: .cmp-teaser__action-link exists in source DOM
  const cta = element.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a');

  const cells = [];

  // Row 1: Background image
  if (img) {
    const imageCell = document.createElement('div');
    const newImg = document.createElement('img');
    newImg.src = img.src;
    newImg.alt = img.alt || '';
    imageCell.appendChild(newImg);
    cells.push([imageCell]);
  }

  // Row 2: Content (heading, description, CTA)
  const contentCell = document.createElement('div');
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
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero', cells });
  element.replaceWith(block);
}
