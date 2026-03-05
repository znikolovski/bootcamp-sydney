/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block (image list items)
 *
 * Source: https://wknd.site/us/en.html
 * Base Block: cards
 *
 * Block Structure (from EDS cards block):
 * - Row per card: image column | content column (linked title, description)
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="image-list list">
 *   <ul class="cmp-image-list">
 *     <li class="cmp-image-list__item">
 *       <article class="cmp-image-list__item-content">
 *         <a class="cmp-image-list__item-image-link" href="...">
 *           <div class="cmp-image-list__item-image">
 *             <img class="cmp-image__image" src="..." alt="...">
 *           </div>
 *         </a>
 *         <a class="cmp-image-list__item-title-link" href="...">
 *           <span class="cmp-image-list__item-title">Title</span>
 *         </a>
 *         <span class="cmp-image-list__item-description">Description</span>
 *       </article>
 *     </li>
 *   </ul>
 * </div>
 *
 * Generated: 2026-03-05
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all card items
  // VALIDATED: .cmp-image-list__item exists in source DOM
  const items = element.querySelectorAll('.cmp-image-list__item');

  items.forEach((item) => {
    // Extract image
    // VALIDATED: .cmp-image__image exists in source DOM
    const img = item.querySelector('.cmp-image__image, .cmp-image-list__item-image img');

    // Extract title link
    // VALIDATED: .cmp-image-list__item-title-link and .cmp-image-list__item-title exist in source DOM
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = item.querySelector('.cmp-image-list__item-title');

    // Extract description
    // VALIDATED: .cmp-image-list__item-description exists in source DOM
    const description = item.querySelector('.cmp-image-list__item-description');

    // Build image cell
    const imageCell = document.createElement('div');
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      imageCell.appendChild(newImg);
    }

    // Build content cell with linked title and description
    const contentCell = document.createElement('div');
    if (titleLink && titleSpan) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = titleLink.href;
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      a.appendChild(strong);
      p.appendChild(a);
      contentCell.appendChild(p);
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      contentCell.appendChild(p);
    }

    // Each card is a row with 2 columns: image | content
    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });
  element.replaceWith(block);
}
