// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
var Work = defineDocumentType(() => ({
  name: "Work",
  filePathPattern: "work/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    summary: { type: "string", required: true },
    coverImage: { type: "string", required: true },
    tags: { type: "list", of: { type: "string" }, required: true },
    year: { type: "number", required: true },
    featured: { type: "boolean", default: false },
    liveUrl: { type: "string" },
    githubUrl: { type: "string" }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, "")
    },
    url: {
      type: "string",
      resolve: (doc) => `/work/${doc._raw.sourceFileName.replace(/\.mdx$/, "")}`
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Work]
});
export {
  Work,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-YE6GOO6U.mjs.map
