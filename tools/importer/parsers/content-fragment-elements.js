/* eslint-disable */
/* global WebImporter */

/**
 * Parser for content-fragment-elements block (adventure metadata)
 *
 * Source: https://wknd.site/us/en/adventures/bali-surf-camp.html
 * Base Block: columns (label | value) - renders as key-value pairs
 *
 * Source HTML Pattern:
 * <div class="contentfragment cmp-contentfragment--elements">
 *   <article class="cmp-contentfragment">
 *     <dl class="cmp-contentfragment__elements">
 *       <div class="cmp-contentfragment__element">
 *         <dt class="cmp-contentfragment__element-title">Activity</dt>
 *         <dd class="cmp-contentfragment__element-value">Surfing</dd>
 *       </div>
 *     </dl>
 *   </article>
 * </div>
 */
export default function parse(element, { document }) {
  const cells = [];

  const elements = element.querySelectorAll('.cmp-contentfragment__element');
  elements.forEach((el) => {
    const dt = el.querySelector('.cmp-contentfragment__element-title');
    const dd = el.querySelector('.cmp-contentfragment__element-value');

    const labelCell = document.createElement('div');
    if (dt) {
      const strong = document.createElement('strong');
      strong.textContent = dt.textContent.trim();
      labelCell.appendChild(strong);
    }

    const valueCell = document.createElement('div');
    if (dd) {
      const p = document.createElement('p');
      p.textContent = dd.textContent.trim();
      valueCell.appendChild(p);
    }

    cells.push([labelCell, valueCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });
  element.replaceWith(block);
}
