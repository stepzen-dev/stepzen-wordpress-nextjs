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

export async function getWPPost(preview, id) {
  const data = await fetchAPI(
    `
    query wordpressPost($id: ID!) {
      wordpressPost(id: $id) {
        id
        title
        content
        featuredImage
        slug
      }
    }
  `,
    {
      variables: {
        onlyEnabled: !preview,
        preview,
        id
      },
    }
  )

  return data?.wordpressPost
}