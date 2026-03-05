/* eslint-disable */
/* global WebImporter */

import contentFragmentParser from './parsers/content-fragment.js';
import bylineParser from './parsers/byline.js';
import heroParser from './parsers/hero.js';

import wkndCleanupTransformer from './transformers/wknd-cleanup.js';

const parsers = {
  'content-fragment': contentFragmentParser,
  'byline': bylineParser,
  'hero': heroParser,
};

const transformers = [
  wkndCleanupTransformer,
];

const PAGE_TEMPLATE = {
  name: 'magazine-article-template',
  description: 'Magazine article page with hero image, breadcrumb, long-form content fragment body, author byline, and sidebar with sharing and related articles',
  urls: ['https://wknd.site/us/en/magazine/arctic-surfing.html'],
  blocks: [
    {
      name: 'hero',
      instances: ['main > .container > .aem-Grid > .image > .cmp-image'],
    },
    {
      name: 'content-fragment',
      instances: ['article.contentfragment'],
    },
    {
      name: 'byline',
      instances: ['.byline.image'],
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
