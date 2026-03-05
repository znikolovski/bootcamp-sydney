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

  // tools/importer/import-adventure-detail-template.js
  var import_adventure_detail_template_exports = {};
  __export(import_adventure_detail_template_exports, {
    default: () => import_adventure_detail_template_default
  });

  // tools/importer/parsers/carousel.js
  function parse(element, { document }) {
    const cells = [];
    const slides = element.querySelectorAll(".cmp-carousel__item");
    slides.forEach((slide) => {
      const img = slide.querySelector(".cmp-teaser__image img, .cmp-image__image");
      const heading = slide.querySelector(".cmp-teaser__title, h2, h1");
      const description = slide.querySelector('.cmp-teaser__description, [class*="description"]');
      const cta = slide.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a");
      const imageCell = document.createElement("div");
      if (img) {
        const newImg = document.createElement("img");
        newImg.src = img.src;
        newImg.alt = img.alt || "";
        imageCell.appendChild(newImg);
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
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "Carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/content-fragment-elements.js
  function parse2(element, { document }) {
    const cells = [];
    const elements = element.querySelectorAll(".cmp-contentfragment__element");
    elements.forEach((el) => {
      const dt = el.querySelector(".cmp-contentfragment__element-title");
      const dd = el.querySelector(".cmp-contentfragment__element-value");
      const labelCell = document.createElement("div");
      if (dt) {
        const strong = document.createElement("strong");
        strong.textContent = dt.textContent.trim();
        labelCell.appendChild(strong);
      }
      const valueCell = document.createElement("div");
      if (dd) {
        const p = document.createElement("p");
        p.textContent = dd.textContent.trim();
        valueCell.appendChild(p);
      }
      cells.push([labelCell, valueCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "Columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs.js
  function parse3(element, { document }) {
    const cells = [];
    const tabs = element.querySelectorAll(".cmp-tabs__tab");
    const panels = element.querySelectorAll(".cmp-tabs__tabpanel");
    tabs.forEach((tab, i) => {
      const labelCell = document.createElement("div");
      const strong = document.createElement("strong");
      strong.textContent = tab.textContent.trim();
      labelCell.appendChild(strong);
      const contentCell = document.createElement("div");
      if (panels[i]) {
        const paragraphs = panels[i].querySelectorAll("p, ul, ol, h3, h2, h4, blockquote");
        paragraphs.forEach((p) => {
          const clone = p.cloneNode(true);
          contentCell.appendChild(clone);
        });
        const images = panels[i].querySelectorAll(".cmp-image__image");
        images.forEach((img) => {
          const newImg = document.createElement("img");
          newImg.src = img.src;
          newImg.alt = img.alt || "";
          contentCell.appendChild(newImg);
        });
        if (!contentCell.hasChildNodes()) {
          const p = document.createElement("p");
          p.textContent = panels[i].textContent.trim().substring(0, 500);
          contentCell.appendChild(p);
        }
      }
      cells.push([labelCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "Tabs", cells });
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

  // tools/importer/import-adventure-detail-template.js
  var parsers = {
    "carousel": parse,
    "content-fragment-elements": parse2,
    "tabs": parse3
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "adventure-detail-template",
    description: "Adventure detail page with image carousel, structured metadata (activity, trip length, price), and tabbed content (overview, itinerary, what to bring)",
    urls: ["https://wknd.site/us/en/adventures/bali-surf-camp.html"],
    blocks: [
      {
        name: "carousel",
        instances: [".carousel.panelcontainer.cmp-carousel--mini"]
      },
      {
        name: "content-fragment-elements",
        instances: [".contentfragment.cmp-contentfragment--elements"]
      },
      {
        name: "tabs",
        instances: [".tabs.panelcontainer"]
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
  var import_adventure_detail_template_default = {
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
  return __toCommonJS(import_adventure_detail_template_exports);
})();
