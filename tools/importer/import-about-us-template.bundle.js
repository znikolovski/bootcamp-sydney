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

  // tools/importer/import-about-us-template.js
  var import_about_us_template_exports = {};
  __export(import_about_us_template_exports, {
    default: () => import_about_us_template_default
  });

  // tools/importer/parsers/contributor.js
  function parse(element, { document }) {
    const img = element.querySelector(".cmp-image__image, .cmp-image img");
    const nameEl = element.querySelector("h3.cmp-title__text, h3");
    const roleEl = element.querySelector("h5.cmp-title__text, h5");
    const imageCell = document.createElement("div");
    if (img) {
      const newImg = document.createElement("img");
      newImg.src = img.src;
      newImg.alt = img.alt || "";
      imageCell.appendChild(newImg);
    }
    const contentCell = document.createElement("div");
    if (nameEl) {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = nameEl.textContent.trim();
      p.appendChild(strong);
      contentCell.appendChild(p);
    }
    if (roleEl) {
      const p = document.createElement("p");
      p.textContent = roleEl.textContent.trim();
      contentCell.appendChild(p);
    }
    const socialLinks = element.querySelectorAll(".cmp-button");
    if (socialLinks.length > 0) {
      const p = document.createElement("p");
      socialLinks.forEach((link, i) => {
        if (i > 0) p.appendChild(document.createTextNode(" | "));
        const a = document.createElement("a");
        a.href = link.href || "#";
        const text = link.querySelector(".cmp-button__text");
        a.textContent = text ? text.textContent.trim() : "Link";
        p.appendChild(a);
      });
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

  // tools/importer/import-about-us-template.js
  var parsers = {
    "contributor": parse
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "about-us-template",
    description: "About Us page with contributor profile cards showing photo, name, role, and social media links",
    urls: ["https://wknd.site/us/en/about-us.html"],
    blocks: [
      {
        name: "contributor",
        instances: ["section.experiencefragment.cmp-experience-fragment--contributor"]
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
  var import_about_us_template_default = {
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
  return __toCommonJS(import_about_us_template_exports);
})();
