/* eslint-disable */
/* global WebImporter */

/**
 * Parser for teaser-list block (gated/members-only teaser cards)
 *
 * Source: https://wknd.site/us/en/magazine.html
 * Base Block: cards
 *
 * Source HTML Pattern:
 * <div class="teaser cmp-teaser--list cmp-teaser--secure">
 *   <div class="cmp-teaser">
 *     <div class="cmp-teaser__content">
 *       <h2 class="cmp-teaser__title">Title</h2>
 *       <div class="cmp-teaser__description"><p>Description</p></div>
 *       <div class="cmp-teaser__action-container">
 *         <a class="cmp-teaser__action-link" href="...">Read More</a>
 *       </div>
 *     </div>
 *     <div class="cmp-teaser__image"><img src="..." alt="..."></div>
 *   </div>
 * </div>
 */
export default function parse(element, { document }) {
  const img = element.querySelector('.cmp-teaser__image img, .cmp-image__image');
  const title = element.querySelector('.cmp-teaser__title, h2');
  const description = element.querySelector('.cmp-teaser__description');
  const cta = element.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a');

  // Build image cell
  const imageCell = document.createElement('div');
  if (img) {
    const newImg = document.createElement('img');
    newImg.src = img.src;
    newImg.alt = img.alt || '';
    imageCell.appendChild(newImg);
  }

  // Build content cell
  const contentCell = document.createElement('div');
  if (title) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = title.textContent.trim();
    p.appendChild(strong);
    contentCell.appendChild(p);
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

  const cells = [[imageCell, contentCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });
  element.replaceWith(block);
}
