import Head from 'next/head'
import Container from '../components/container'
import MoreStories from '../components/more-stories'
import HeroPost from '../components/hero-post'
import Intro from '../components/intro'
import Layout from '../components/layout'
import { getWPPost } from '../lib/api'
import { CMS_NAME } from '../lib/constants'

export default function Index({ post, preview }) {
  console.log(post)
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
              slug={post.slug}
              excerpt={post.content}
            />
          )}
        </Container>
      </Layout>
    </>
  )
}

export async function getStaticProps({ preview = false, id }) {
  const wordpressPost = await getWPPost(preview, id = 1)
  return {
    props: { 
      post: wordpressPost, 
      preview, 
      id 
    },
  }
}
