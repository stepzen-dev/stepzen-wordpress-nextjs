import Head from 'next/head'
import Container from '../components/container'
import MoreStories from '../components/more-stories'
import HeroPost from '../components/hero-post'
import Intro from '../components/intro'
import Layout from '../components/layout'
import { getWPPost } from '../lib/api'
import { CMS_NAME } from '../lib/constants'

export default function Index({ post, image, preview }) {
  console.log(post.featuredImage)
  return (
    <>
      <Layout preview={preview}>
        <Head>
          <title>Next.js Blog Example with {CMS_NAME}</title>
        </Head>
        <Container>
          <Intro />
          {post && (
            <HeroPost
              title={post.title}
              coverImage={post.featuredImage}
              // coverImage={image.url}
              slug={post.slug}
              excerpt={post.content}
            />
          )}
        </Container>
      </Layout>
    </>
  )
}

export async function getStaticProps({ preview = false, id, slug }) {
  const data = await getWPPost(preview, id = 1, slug="hello-world")
  return {
    props: { 
      post: data.wordpressPost, 
      // image: data.cloudinaryImage, 
      preview, 
      id,
      slug 
    },
  }
}
