import Head from 'next/head'
import Container from '../components/container'
import MoreStories from '../components/more-stories'
import HeroPost from '../components/hero-post'
import Intro from '../components/intro'
import Layout from '../components/layout'
import { getWPPost } from '../lib/api'
import { CMS_NAME } from '../lib/constants'

export default function Index({ wordpressPost, preview }) {
  console.log(wordpressPost)
  return (
    <>
      <Layout preview={preview}>
        <Head>
          <title>Next.js Blog Example with {CMS_NAME}</title>
        </Head>
        <Container>
          <Intro />
          {wordpressPost && (
            <HeroPost
              title={wordpressPost.title}
              coverImage={wordpressPost.featuredImage}
              slug={wordpressPost.slug}
              excerpt={wordpressPost.content}
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
    props: { wordpressPost, preview, id },
  }
}
