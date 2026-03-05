/**
 * Metadata block - applies page metadata from block content.
 * The block itself is hidden from the page.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  // Metadata is consumed by aem.js during page decoration.
  // Remove only the metadata wrapper, preserving sibling content.
  const section = block.closest('.section');
  const wrapper = block.parentElement;
  if (wrapper) {
    wrapper.remove();
  }
  // If the section is now empty, remove it too
  if (section && section.children.length === 0) {
    section.remove();
  }
}
