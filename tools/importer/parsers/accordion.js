/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion block (FAQ items)
 *
 * Source: https://wknd.site/us/en/faqs.html
 * Base Block: accordion
 *
 * Source HTML Pattern:
 * <div class="accordion panelcontainer">
 *   <div class="cmp-accordion">
 *     <div class="cmp-accordion__item">
 *       <h3 class="cmp-accordion__header">
 *         <button class="cmp-accordion__button">
 *           <span class="cmp-accordion__title">Question</span>
 *         </button>
 *       </h3>
 *       <div class="cmp-accordion__panel">
 *         <div class="cmp-text"><p>Answer</p></div>
 *       </div>
 *     </div>
 *   </div>
 * </div>
 */
export default function parse(element, { document }) {
  const cells = [];

  const items = element.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    const title = item.querySelector('.cmp-accordion__title');
    const panel = item.querySelector('.cmp-accordion__panel');

    const questionCell = document.createElement('div');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      questionCell.appendChild(strong);
    }

    const answerCell = document.createElement('div');
    if (panel) {
      const textEls = panel.querySelectorAll('.cmp-text p, .cmp-text');
      textEls.forEach((el) => {
        if (el.tagName === 'P') {
          const p = document.createElement('p');
          p.innerHTML = el.innerHTML;
          answerCell.appendChild(p);
        }
      });
      // Fallback if no paragraphs found
      if (!answerCell.hasChildNodes()) {
        const p = document.createElement('p');
        p.textContent = panel.textContent.trim();
        answerCell.appendChild(p);
      }
    }

    cells.push([questionCell, answerCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Accordion', cells });
  element.replaceWith(block);
}
