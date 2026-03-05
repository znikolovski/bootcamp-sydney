/* eslint-disable */
/* global WebImporter */

/**
 * Parser for contributor block (team member cards)
 *
 * Source: https://wknd.site/us/en/about-us.html
 * Base Block: cards (image | name + role)
 *
 * Source HTML Pattern:
 * <section class="experiencefragment cmp-experience-fragment--contributor">
 *   <div class="cmp-experiencefragment">
 *     <div class="cmp-container">
 *       <div class="image"><img src="..." alt="..."></div>
 *       <div class="title"><h3>Name</h3></div>
 *       <div class="title cmp-title--black"><h5>Role</h5></div>
 *       <div class="buildingblock cmp-buildingblock--btn-list">
 *         <a class="cmp-button" href="#"><span class="cmp-button__text">Facebook</span></a>
 *       </div>
 *     </div>
 *   </div>
 * </section>
 */
export default function parse(element, { document }) {
  const img = element.querySelector('.cmp-image__image, .cmp-image img');
  const nameEl = element.querySelector('h3.cmp-title__text, h3');
  const roleEl = element.querySelector('h5.cmp-title__text, h5');

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
  if (nameEl) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = nameEl.textContent.trim();
    p.appendChild(strong);
    contentCell.appendChild(p);
  }
  if (roleEl) {
    const p = document.createElement('p');
    p.textContent = roleEl.textContent.trim();
    contentCell.appendChild(p);
  }

  // Extract social links
  const socialLinks = element.querySelectorAll('.cmp-button');
  if (socialLinks.length > 0) {
    const p = document.createElement('p');
    socialLinks.forEach((link, i) => {
      if (i > 0) p.appendChild(document.createTextNode(' | '));
      const a = document.createElement('a');
      a.href = link.href || '#';
      const text = link.querySelector('.cmp-button__text');
      a.textContent = text ? text.textContent.trim() : 'Link';
      p.appendChild(a);
    });
    contentCell.appendChild(p);
  }

  const cells = [[imageCell, contentCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });
  element.replaceWith(block);
}
