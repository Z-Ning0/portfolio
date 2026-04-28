import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const Work = defineDocumentType(() => ({
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
    githubUrl: { type: "string" },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, ""),
    },
    url: {
      type: "string",
      resolve: (doc) =>
        `/work/${doc._raw.sourceFileName.replace(/\.mdx$/, "")}`,
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Work],
});
