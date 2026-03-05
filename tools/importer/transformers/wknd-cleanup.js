/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for WKND website cleanup
 * Purpose: Remove non-content elements (header, footer, navigation, tracking)
 * Applies to: wknd.site (all templates)
 * Tested: /us/en.html
 * Generated: 2026-03-05
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (cleaned.html)
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove header experience fragment
    // EXTRACTED: Found <header class="experiencefragment cmp-experiencefragment--header"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'header.experiencefragment',
    ]);

    // Remove footer experience fragment
    // EXTRACTED: Found <footer class="experiencefragment cmp-experiencefragment--footer"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'footer.experiencefragment',
    ]);

    // Remove language navigation
    // EXTRACTED: Found <nav class="cmp-languagenavigation"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.cmp-languagenavigation',
    ]);

    // Remove sign-in buttons
    // EXTRACTED: Found <div class="wknd-sign-in-buttons"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.wknd-sign-in-buttons',
    ]);

    // Remove carousel navigation controls (handled by EDS carousel block)
    // EXTRACTED: Found <div class="cmp-carousel__actions"> and <ol class="cmp-carousel__indicators"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.cmp-carousel__actions',
      '.cmp-carousel__indicators',
    ]);

    // Remove separator elements
    // EXTRACTED: Found <div class="separator"> with <hr class="cmp-separator__horizontal-rule"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.separator',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining non-content elements
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'iframe',
      'link',
    ]);
  }
}
