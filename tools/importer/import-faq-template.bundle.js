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

  // tools/importer/import-faq-template.js
  var import_faq_template_exports = {};
  __export(import_faq_template_exports, {
    default: () => import_faq_template_default
  });

  // tools/importer/parsers/accordion.js
  function parse(element, { document }) {
    const cells = [];
    const items = element.querySelectorAll(".cmp-accordion__item");
    items.forEach((item) => {
      const title = item.querySelector(".cmp-accordion__title");
      const panel = item.querySelector(".cmp-accordion__panel");
      const questionCell = document.createElement("div");
      if (title) {
        const strong = document.createElement("strong");
        strong.textContent = title.textContent.trim();
        questionCell.appendChild(strong);
      }
      const answerCell = document.createElement("div");
      if (panel) {
        const textEls = panel.querySelectorAll(".cmp-text p, .cmp-text");
        textEls.forEach((el) => {
          if (el.tagName === "P") {
            const p = document.createElement("p");
            p.innerHTML = el.innerHTML;
            answerCell.appendChild(p);
          }
        });
        if (!answerCell.hasChildNodes()) {
          const p = document.createElement("p");
          p.textContent = panel.textContent.trim();
          answerCell.appendChild(p);
        }
      }
      cells.push([questionCell, answerCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "Accordion", cells });
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

  // tools/importer/import-faq-template.js
  var parsers = {
    "accordion": parse
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "faq-template",
    description: "FAQ page with hero image, intro text, accordion of questions and answers, and sidebar with contact information",
    urls: ["https://wknd.site/us/en/faqs.html"],
    blocks: [
      {
        name: "accordion",
        instances: [".accordion.panelcontainer"]
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
  var import_faq_template_default = {
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
  return __toCommonJS(import_faq_template_exports);
})();
