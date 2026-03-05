/* eslint-disable */
/* global WebImporter */

/**
 * Parser for byline block (article author info)
 *
 * Source: https://wknd.site/us/en/magazine/arctic-surfing.html
 * Base Block: columns (author image | name + role)
 *
 * Source HTML Pattern:
 * <div class="byline image">
 *   <div class="cmp-byline">
 *     <div class="cmp-byline__image">
 *       <img src="..." class="cmp-image__image">
 *     </div>
 *     <h2 class="cmp-byline__name">Author Name</h2>
 *     <p class="cmp-byline__occupations">Role, Title</p>
 *   </div>
 * </div>
 */
export default function parse(element, { document }) {
  const img = element.querySelector('.cmp-byline__image img, .cmp-image__image');
  const name = element.querySelector('.cmp-byline__name');
  const occupations = element.querySelector('.cmp-byline__occupations');

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
  if (name) {
    const h = document.createElement('h3');
    h.textContent = name.textContent.trim();
    contentCell.appendChild(h);
  }
  if (occupations) {
    const p = document.createElement('p');
    p.textContent = occupations.textContent.trim();
    contentCell.appendChild(p);
  }

  const cells = [[imageCell, contentCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });
  element.replaceWith(block);
}
