import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import MoreStories from '../../components/more-stories'
import Header from '../../components/header'
import PostHeader from '../../components/post-header'
import SectionSeparator from '../../components/section-separator'
import Layout from '../../components/layout'
import { getAllPostsWithSlug, getPostAndMorePosts, getWPPost } from '../../lib/api'
import PostTitle from '../../components/post-title'
import Head from 'next/head'
import { CMS_NAME } from '../../lib/constants'
import Tags from '../../components/tags'

export default function Post({ wordpressPost, preview }) {
  const router = useRouter()
  // const morePosts = posts?.edges

  if (!router.isFallback && !wordpressPost?.slug) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <>
      <Layout preview={preview}>
        <Head>
          <title>Next.js Blog Example with {CMS_NAME}</title>
        </Head>
        <Container>
          {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article>
              <Head>
                <title>
                  {wordpressPost.title} | Next.js Blog Example with {CMS_NAME}
                </title>
                <meta
                  property="og:image"
                  content={wordpressPost.featuredImage}
                />
              </Head>
              <PostHeader
                title={wordpressPost.title}
                coverImage={wordpressPost.featuredImage}
                // date={wordpressPost.date}
                // author={wordpressPost.author}
                // categories={wordpressPost.categories}
              />
              <PostBody content={wordpressPost.content} />
            </article>

            <SectionSeparator />
          </>
        )}
        </Container>
      </Layout>
    </>
  )
}

export async function getStaticProps({ preview = false, id }) {
  const wordpressPost = await getWPPost(preview, id = 1)
  return {
    props: { wordpressPost, preview, id },
  }
}

export async function getStaticPaths() {
  const wordpressPosts = await getAllPostsWithSlug()
  return {
    paths: wordpressPosts.map((node) => `/posts/${node.slug}`) || [],
    fallback: true,
  }
}
