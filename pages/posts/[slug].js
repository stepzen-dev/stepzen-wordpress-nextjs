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
import { CMS_NAME, ENDPOINT_NAME } from '../../lib/constants'

export default function Post({ post, postImage, posts, preview }) {
  const router = useRouter()
  // const morePosts = posts?.edges
  console.log(postImage)
  console.log('all posts', posts)
  
  if (!router.isFallback && !post[0]) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <>
      <Layout preview={preview}>
        <Container>
          {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article>
              <Head>
                <title>
                  {post[0].title} | Next.js Blog Example with {CMS_NAME} and {ENDPOINT_NAME}
                </title>
                <meta
                  property="og:image"
                  content={postImage.url}
                />
              </Head>
              <PostHeader
                title={post[0].title}
                coverImage={postImage.url}
              />
              <PostBody content={post[0].content} />
            </article>

            <SectionSeparator />
            {posts.length > 0 && <MoreStories posts={posts} />}
          </>
        )}
        </Container>
      </Layout>
    </>
  )
}

export async function getStaticProps({ params, preview = false, previewData }) {
  const data = await getPostAndMorePosts(params.slug, preview, previewData)

  return {
    props: {
      preview,
      post: data.wordpressPostsBySlug,
      postImage: data.cloudinaryImage,
      posts: data.wordpressPosts,
    },
  }
}

export async function getStaticPaths() {
  const wordpressPosts = await getAllPostsWithSlug()
  // console.log('requested posts', wordpressPosts)
  return {
    paths: wordpressPosts.map((node) => `/posts/${node.slug}`) || [],
    fallback: true,
  }
}
