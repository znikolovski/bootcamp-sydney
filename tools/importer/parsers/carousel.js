/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel block
 *
 * Source: https://wknd.site/us/en.html
 * Base Block: carousel
 *
 * Block Structure (from EDS carousel block):
 * - Row per slide: image column | content column (heading, description, CTA)
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="cmp-carousel">
 *   <div class="cmp-carousel__content">
 *     <div class="cmp-carousel__item">
 *       <div class="teaser cmp-teaser--hero">
 *         <div class="cmp-teaser">
 *           <div class="cmp-teaser__content">
 *             <h2 class="cmp-teaser__title">...</h2>
 *             <div class="cmp-teaser__description">...</div>
 *             <div class="cmp-teaser__action-container">
 *               <a class="cmp-teaser__action-link" href="...">CTA</a>
 *             </div>
 *           </div>
 *           <div class="cmp-teaser__image">
 *             <img src="..." alt="...">
 *           </div>
 *         </div>
 *       </div>
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-03-05
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all carousel slides
  // VALIDATED: .cmp-carousel__item exists in source DOM
  const slides = element.querySelectorAll('.cmp-carousel__item');

  slides.forEach((slide) => {
    // Extract image from teaser
    // VALIDATED: .cmp-teaser__image img exists in source DOM
    const img = slide.querySelector('.cmp-teaser__image img, .cmp-image__image');

    // Extract heading
    // VALIDATED: .cmp-teaser__title exists in source DOM as h2
    const heading = slide.querySelector('.cmp-teaser__title, h2, h1');

    // Extract description
    // VALIDATED: .cmp-teaser__description exists in source DOM
    const description = slide.querySelector('.cmp-teaser__description, [class*="description"]');

    // Extract CTA link
    // VALIDATED: .cmp-teaser__action-link exists in source DOM
    const cta = slide.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a');

    // Build image cell
    const imageCell = document.createElement('div');
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      imageCell.appendChild(newImg);
    }

    // Build content cell with heading, description, CTA
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

    // Each slide is a row with 2 columns: image | content
    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Carousel', cells });
  element.replaceWith(block);
}
