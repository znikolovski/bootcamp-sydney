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

  // tools/importer/import-magazine-listing-template.js
  var import_magazine_listing_template_exports = {};
  __export(import_magazine_listing_template_exports, {
    default: () => import_magazine_listing_template_default
  });

  // tools/importer/parsers/columns.js
  function parse(element, { document }) {
    const img = element.querySelector(".cmp-teaser__image img, .cmp-image__image");
    const pretitle = element.querySelector('.cmp-teaser__pretitle, [class*="pretitle"]');
    const heading = element.querySelector(".cmp-teaser__title, h2, h1");
    const description = element.querySelector('.cmp-teaser__description, [class*="description"]');
    const cta = element.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a");
    const imageCell = document.createElement("div");
    if (img) {
      const newImg = document.createElement("img");
      newImg.src = img.src;
      newImg.alt = img.alt || "";
      imageCell.appendChild(newImg);
    }
    const contentCell = document.createElement("div");
    if (pretitle) {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = pretitle.textContent.trim();
      p.appendChild(strong);
      contentCell.appendChild(p);
    }
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
    const cells = [
      [imageCell, contentCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "Columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse2(element, { document }) {
    const cells = [];
    const items = element.querySelectorAll(".cmp-image-list__item");
    items.forEach((item) => {
      const img = item.querySelector(".cmp-image__image, .cmp-image-list__item-image img");
      const titleLink = item.querySelector(".cmp-image-list__item-title-link");
      const titleSpan = item.querySelector(".cmp-image-list__item-title");
      const description = item.querySelector(".cmp-image-list__item-description");
      const imageCell = document.createElement("div");
      if (img) {
        const newImg = document.createElement("img");
        newImg.src = img.src;
        newImg.alt = img.alt || "";
        imageCell.appendChild(newImg);
      }
      const contentCell = document.createElement("div");
      if (titleLink && titleSpan) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = titleLink.href;
        const strong = document.createElement("strong");
        strong.textContent = titleSpan.textContent.trim();
        a.appendChild(strong);
        p.appendChild(a);
        contentCell.appendChild(p);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        contentCell.appendChild(p);
      }
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "Cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/teaser-list.js
  function parse3(element, { document }) {
    const img = element.querySelector(".cmp-teaser__image img, .cmp-image__image");
    const title = element.querySelector(".cmp-teaser__title, h2");
    const description = element.querySelector(".cmp-teaser__description");
    const cta = element.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a");
    const imageCell = document.createElement("div");
    if (img) {
      const newImg = document.createElement("img");
      newImg.src = img.src;
      newImg.alt = img.alt || "";
      imageCell.appendChild(newImg);
    }
    const contentCell = document.createElement("div");
    if (title) {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = title.textContent.trim();
      p.appendChild(strong);
      contentCell.appendChild(p);
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
    const cells = [[imageCell, contentCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "Cards", cells });
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

  // tools/importer/import-magazine-listing-template.js
  var parsers = {
    "columns": parse,
    "cards": parse2,
    "teaser-list": parse3
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "magazine-listing-template",
    description: "Magazine listing page with featured article teaser, article image cards list, and gated members-only teaser cards",
    urls: ["https://wknd.site/us/en/magazine.html"],
    blocks: [
      {
        name: "columns",
        instances: [".teaser.cmp-teaser--featured"]
      },
      {
        name: "cards",
        instances: [".image-list.list"]
      },
      {
        name: "teaser-list",
        instances: [".teaser.cmp-teaser--list"]
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
  var import_magazine_listing_template_default = {
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
  return __toCommonJS(import_magazine_listing_template_exports);
})();
