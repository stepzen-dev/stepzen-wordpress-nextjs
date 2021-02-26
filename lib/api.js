const API_URL = process.env.STEPZEN_API_URL

async function fetchAPI(query, { variables } = {}) {
  const headers = { 'Content-Type': 'application/json' }

    headers[
      'Authorization'
    ] = `Apikey ${process.env.STEPZEN_AUTH_REFRESH_TOKEN}`

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const json = await res.json()
  if (json.errors) {
    console.error(json.errors)
    throw new Error('Failed to fetch API')
  }
  return json.data
}

export async function getAllPostsWithSlug() {
  const data = await fetchAPI(`
    {
      wordpressPosts {
            slug
          }
    }
  `)
  return data?.wordpressPosts
}

export async function getWPPost(preview, id, slug) {
  const data = await fetchAPI(
    `
    query wordpressPost($id: ID!, $slug: String!) {
      wordpressPost(id: $id) {
        id
        title
        content
        featuredImage
        slug
      }
      cloudinaryImage(publicId: $slug) {
        url
        assetId
        publicId
        format
        bytes
        height
        width
      }
    }
  `,
    {
      variables: {
        onlyEnabled: !preview,
        preview,
        id,
        slug
      },
    }
  )

  return data
}

export async function getPostAndMorePosts(slug, preview, previewData) {
  console.log('this is the slug', slug)

  const mainSlug = slug
  
  const data = await fetchAPI(
    `
    query wordpressPosts($slug: String!) {
      wordpressPosts {
        id
        title
        content
        featuredImage
        slug
      }
      wordpressPostsBySlug(slug: $slug) {
        id
        title
        content
        featuredImage
        slug
      }
      cloudinaryImage(publicId: $slug) {
        url
        assetId
        publicId
        format
        bytes
        height
        width
      }
    }
  `,
    {
      variables: {
        onlyEnabled: !preview,
        preview,
        slug: mainSlug,
      },
    }
  )

  console.log('queried data', data)

  let morePosts = [];
  for (let i = 0; i < data.wordpressPosts.length; i++) {
      // console.log(mainSlug)
      // console.log(data.wordpressPosts[i].slug)
      if (data.wordpressPosts[i].slug !== mainSlug) {
        morePosts.push(data.wordpressPosts[i]);
      }
  }
  data.wordpressPosts = morePosts
  if (data.wordpressPosts.length > 2) data.wordpressPosts.pop()

  return data
}