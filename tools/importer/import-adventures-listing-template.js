/* eslint-disable */
/* global WebImporter */

import heroParser from './parsers/hero.js';
import tabsParser from './parsers/tabs.js';

import wkndCleanupTransformer from './transformers/wknd-cleanup.js';

const parsers = {
  'hero': heroParser,
  'tabs': tabsParser,
};

const transformers = [
  wkndCleanupTransformer,
];

const PAGE_TEMPLATE = {
  name: 'adventures-listing-template',
  description: 'Adventures listing page with hero teaser and tabbed category filter containing adventure image cards',
  urls: ['https://wknd.site/us/en/adventures.html'],
  blocks: [
    {
      name: 'hero',
      instances: ['.teaser.cmp-teaser--hero'],
    },
    {
      name: 'tabs',
      instances: ['.tabs.panelcontainer'],
    },
  ],
};

function executeTransformers(hookName, element, payload) {
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, payload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    executeTransformers('afterTransform', main, payload);

    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
