var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-magazine-article-template.js
  var import_magazine_article_template_exports = {};
  __export(import_magazine_article_template_exports, {
    default: () => import_magazine_article_template_default
  });

  // tools/importer/parsers/content-fragment.js
  function parse(element, { document }) {
    const contentEl = document.createElement("div");
    const cfElements = element.querySelector(".cmp-contentfragment__elements");
    if (!cfElements) {
      element.replaceWith(document.createElement("div"));
      return;
    }
    const walker = document.createTreeWalker(
      cfElements,
      1
      /* NodeFilter.SHOW_ELEMENT */
    );
    let node = walker.nextNode();
    while (node) {
      if (node.matches && node.matches(".cmp-title__text")) {
        const h = document.createElement(node.tagName.toLowerCase());
        h.textContent = node.textContent.trim();
        contentEl.appendChild(h);
      } else if (node.tagName === "BLOCKQUOTE") {
        const bq = document.createElement("blockquote");
        bq.textContent = node.textContent.trim();
        contentEl.appendChild(bq);
      } else if (node.matches && node.matches(".cmp-image__image")) {
        const img = document.createElement("img");
        img.src = node.src;
        img.alt = node.alt || "";
        contentEl.appendChild(img);
      } else if (node.tagName === "P" && node.parentElement && !node.closest(".cmp-title")) {
        const p = document.createElement("p");
        p.innerHTML = node.innerHTML;
        contentEl.appendChild(p);
      } else if (node.tagName === "UL" || node.tagName === "OL") {
        contentEl.appendChild(node.cloneNode(true));
      }
      node = walker.nextNode();
    }
    element.replaceWith(contentEl);
  }

  // tools/importer/parsers/byline.js
  function parse2(element, { document }) {
    const img = element.querySelector(".cmp-byline__image img, .cmp-image__image");
    const name = element.querySelector(".cmp-byline__name");
    const occupations = element.querySelector(".cmp-byline__occupations");
    const imageCell = document.createElement("div");
    if (img) {
      const newImg = document.createElement("img");
      newImg.src = img.src;
      newImg.alt = img.alt || "";
      imageCell.appendChild(newImg);
    }
    const contentCell = document.createElement("div");
    if (name) {
      const h = document.createElement("h3");
      h.textContent = name.textContent.trim();
      contentCell.appendChild(h);
    }
    if (occupations) {
      const p = document.createElement("p");
      p.textContent = occupations.textContent.trim();
      contentCell.appendChild(p);
    }
    const cells = [[imageCell, contentCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "Columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero.js
  function parse3(element, { document }) {
    const img = element.querySelector(".cmp-teaser__image img, .cmp-image__image");
    const heading = element.querySelector(".cmp-teaser__title, h2, h1");
    const description = element.querySelector('.cmp-teaser__description, [class*="description"]');
    const cta = element.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a");
    const cells = [];
    if (img) {
      const imageCell = document.createElement("div");
      const newImg = document.createElement("img");
      newImg.src = img.src;
      newImg.alt = img.alt || "";
      imageCell.appendChild(newImg);
      cells.push([imageCell]);
    }
    const contentCell = document.createElement("div");
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      contentCell.appendChild(h2);
    }
    if (description) {
      const p = document.createElement("p");
      p.textContent = description.textContent.trim();
      contentCell.appendChild(p);
    }
    if (cta) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = cta.href;
      a.textContent = cta.textContent.trim();
      p.appendChild(a);
      contentCell.appendChild(p);
    }
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "Hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.experiencefragment"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer.experiencefragment"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".cmp-languagenavigation"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".wknd-sign-in-buttons"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".cmp-carousel__actions",
        ".cmp-carousel__indicators"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".separator"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "noscript",
        "iframe",
        "link"
      ]);
    }
  }

  // tools/importer/import-magazine-article-template.js
  var parsers = {
    "content-fragment": parse,
    "byline": parse2,
    "hero": parse3
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "magazine-article-template",
    description: "Magazine article page with hero image, breadcrumb, long-form content fragment body, author byline, and sidebar with sharing and related articles",
    urls: ["https://wknd.site/us/en/magazine/arctic-surfing.html"],
    blocks: [
      {
        name: "hero",
        instances: ["main > .container > .aem-Grid > .image > .cmp-image"]
      },
      {
        name: "content-fragment",
        instances: ["article.contentfragment"]
      },
      {
        name: "byline",
        instances: [".byline.image"]
      }
    ]
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
            section: blockDef.section || null
          });
        });
      });
    });
    return pageBlocks;
  }
  var import_magazine_article_template_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_magazine_article_template_exports);
})();
