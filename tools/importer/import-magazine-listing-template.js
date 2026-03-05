/* eslint-disable */
/* global WebImporter */

import columnsParser from './parsers/columns.js';
import cardsParser from './parsers/cards.js';
import teaserListParser from './parsers/teaser-list.js';

import wkndCleanupTransformer from './transformers/wknd-cleanup.js';

const parsers = {
  'columns': columnsParser,
  'cards': cardsParser,
  'teaser-list': teaserListParser,
};

const transformers = [
  wkndCleanupTransformer,
];

const PAGE_TEMPLATE = {
  name: 'magazine-listing-template',
  description: 'Magazine listing page with featured article teaser, article image cards list, and gated members-only teaser cards',
  urls: ['https://wknd.site/us/en/magazine.html'],
  blocks: [
    {
      name: 'columns',
      instances: ['.teaser.cmp-teaser--featured'],
    },
    {
      name: 'cards',
      instances: ['.image-list.list'],
    },
    {
      name: 'teaser-list',
      instances: ['.teaser.cmp-teaser--list'],
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
