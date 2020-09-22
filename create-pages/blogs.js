const path = require('path')
const { langPrefixes } = require('./utils')
const langConfig = require('../lang.config.json')
const { queryAllArticles, CATE_BLOG } = require('../src/lib/graphql/blog')

const createBlogPagination = async ({ graphql, createPage }) => {
  const blogsTemplate = path.resolve(`${__dirname}/../src/templates/blogs.js`)
  for (const lang in langConfig.languages) {
    const { blogsPath } = langConfig.languages[lang]

    const result = await queryAllArticles(graphql, blogsPath, CATE_BLOG)

    const blogs = result.data.blogs.edges
    const blogsPerPage = 6
    const numPages = Math.ceil(blogs.length / blogsPerPage)
    Array.from({ length: numPages }).forEach((_, i) => {
      langPrefixes(lang).forEach((prefix) => {
        createPage({
          path: i === 0 ? `/${prefix}blog` : `/${prefix}blog/${i + 1}`,
          component: blogsTemplate,
          context: {
            limit: blogsPerPage,
            skip: i * blogsPerPage,
            numPages,
            currentPage: i + 1,
            language: lang,
            ...langConfig.languages[lang],
          },
        })
      })
    })
  }
}

module.exports = createBlogPagination
