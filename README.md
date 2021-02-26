# A statically generated blog example using StepZen, Next.js and WordPress

This example showcases Next.js's [Static Generation](https://nextjs.org/docs/basic-features/pages) feature using [StepZen](https://stepzen.com) as the GraphQL data source and [WordPress](https://wordpress.org) as the CMS.

## Demo

### [https://next-blog-wordpress.now.sh](https://next-blog-wordpress.now.sh)
![Add new plugin](./docs/homepage-demo.png)

## Deploy your own

Once you have access to [the environment variables you'll need](#step-4-nextjs-configurations), deploy the example using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/cms-wordpress&project-name=cms-wordpress&repository-name=cms-wordpress&env=STEPZEN_API_URL&envDescription=Required%20to%20connect%20the%20app%20with%20WordPress&envLink=https://vercel.link/cms-wordpress-env)

## How to use
Table of Contents  
1. Spin up wordpress environment
2. Populate Content
3. Import StepZen schemas
4. Connect Nextjs to StepZen
5. Add authentication to Wordpress Environment (optional)   

<hr/>

## Configuration

### Step 1. Prepare your WordPress site

First, you need a WordPress site. There are many solutions for WordPress hosting, such as [WP Engine](https://wpengine.com/) and [WordPress.com](https://wordpress.com/). [DigitalOcean.com](https://www.digitalocean.com/) has a one-click wordpress installation.

Once the site is ready, the two highly recommended plugins for a scalable wordpress Headless CMS is [Advanced Custom Fields](https://www.advancedcustomfields.com/) and [Yoast SEO](https://yoast.com/wordpress/plugins/seo/) plugin. Follow these steps to install it:

- Inside your WordPress admin, go to **Plugins** and then click **Add New**. Install the ACF and Yoast SEO plugins.

![Add new plugin](./docs/plugins-add-new.png)

- Once the plugin has been added, activate it from either the **Activate Plugin** button displayed after uploading or from the **Plugins** page.

### Add the following code to `functions.php` in appearance > theme editor. If you choose not to add it, the front-end will fail and you will need to substitute the featuredImage data in the /pages/index.js and /lib/api.js files.

```bash
// Expose featuredImage
function register_rest_images(){
    register_rest_field( array('post'),
        'featuredImage',
        array(
            'get_callback'    => 'get_rest_featured_image',
            'update_callback' => null,
            'schema'          => null,
        )
    );
}
function get_rest_featured_image( $object, $field_name, $request ) {
    if( $object['featured_media'] ){
        $img = wp_get_attachment_image_src( $object['featured_media'], 'app-thumb' );
        return $img[0];
    }
    return false;
}

add_action('rest_api_init', 'register_rest_images' );
```

Expose ACF on the RestAPI (optional)
```
function create_ACF_meta_in_REST() {
    $postypes_to_exclude = ['acf-field-group','acf-field'];
    $extra_postypes_to_include = ["page", "post"];
    $post_types = array_diff(get_post_types(["_builtin" => false], 'names'),$postypes_to_exclude);
    array_push($post_types, $extra_postypes_to_include);
    foreach ($post_types as $post_type) {
        register_rest_field( $post_type, 'fields', [
            'get_callback'    => 'expose_ACF_fields',
            'schema'          => null,
       ]
     );
    }
}
function expose_ACF_fields( $object ) {
    $ID = $object['id'];
    return get_fields($ID);
}
add_action( 'rest_api_init', 'create_ACF_meta_in_REST' );
```

> **Note:** After populating content, visit http://your_site.com/wp-json/wp/v2/pages/$id?_embed and `cmd+f` to ensure your `fields` and `featuredImage` are populating.

### Step 2. Populate Content

Inside your WordPress admin, go to **Posts** and start adding new posts:

- We recommend creating at least **2 posts**
- Use dummy data for the content. 
- Create custom fields or import `./acf-sample.json` preconfigured acf field group into your wordpress environment.  
`https://your-site.com/wp-admin/edit.php?post_type=acf-field-group&page=acf-tools`
- Pick an author from your WordPress users
- Add a **Featured Image**. You can download one from [Unsplash](https://unsplash.com/)
- Fill the **Excerpt** field

![New post](./docs/new-post.png)

When you’re done, make sure to **Publish** the posts.

> **Note:** Only **published** posts and public fields will be rendered by the app unless [Preview Mode](https://nextjs.org/docs/advanced-features/preview-mode) is enabled.

### Step 3. StepZen Import

a. Import the wordpress schema.  This should confirm that the StepZen CLI is running the schema on `localhost:5000`.

```bash
npm install -g stepzen
mkdir wp-stepzen
cd wp-stepzen
stepzen import wordpress cloudinary
# Add the auth configs for cloudinary. You can also add the configs later in your config.yaml
# The auth configurations are optional for wordpress. Press [Enter] to skip through those for now.
```
b. The index.graphql SDL should look like this. 

```bash
schema
  @sdl(
    files: [
      "wordpress/posts.graphql"
      "wordpress/pages.graphql"
      # If you don't want to include cloudinary, comment it out.
      "cloudinary/cloudinary.graphql"
    ]
  ) {
  query: Query
}
```

c. Start up your Stepzen server

```bash
# In your root folder, run...
stepzen start
```

### Step 4. Setting up Cloudinary or Wordpress FeaturedImages

If you want to use FeaturedImages rather than Cloudinary Images, remove all the `cloudinaryImage` queries found in `/lib/api.js`.

#### Adding Cloudinary Images
1. Add all the images you want to feature on your pages with the slug of the matching post and page.  
```
Post url - https://yoursite.com/post/hello-world
Cloudinary Image Name (PublicId) - hello-world
```
2. Uncomment the `cloudinaryImage` data found on `index.js` and `[slug].js` for `getStaticProps` and `coverImage`.
3. Delete `{post.featuredImage}` found on `index.js` and `[slug].js`.
4. Save the project. 

### Step 5. Nextjs Configurations

Copy the `.env.local.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.local.example .env.local
```

Then open `.env.local` and set `STEPZEN_API_URL` to be the URL to your GraphQL endpoint in WordPress. For example: `https://{stepzenid}.stepzen.net/tutorials/helloworld/__graphql`.

Your `.env.local` file should look like this:

```bash
STEPZEN_API_URL=...
STEPZEN_AUTH_REFRESH_TOKEN=
```

### Step 4. Run Next.js in development mode

```bash
# Clone the repository and run these commands in the root folder
npm install
npm run dev

# or

yarn install
yarn dev
```

Your blog should be up and running on [http://localhost:3000](http://localhost:3000)! If it doesn't work, post on [GitHub Issues](https://github.com/stepzen-samples/stepzen-next/issues).

### Step 5. Add authentication for Preview Mode (Optional)

**This step is optional.** By default, the blog will work with public posts from your WordPress site. Private content such as unpublished posts and private fields cannot be retrieved. To have access to unpublished posts you'll need to set up authentication.

install the miniOrange RestAPI Authentication, https://www.miniorange.com/wordpress-rest-api-authentication. Select Basic Authentication and choose the `username:password` type. Add the appropriate configuration variables below to your StepZen config.yaml file. 
```bash
  - configuration:
      name: wordpress_config
      username: {{ username }}
      password: {{ password }}
```

**Important:** Redeploy your `stepzen start` endpoint to update the environment variables.

### Step 7. Deploy on Vercel

You can deploy this app to the cloud with [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

#### Deploy Your Local Project

To deploy your local project to Vercel, push it to GitHub/GitLab/Bitbucket and [import to Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example).

**Important**: When you import your project on Vercel, make sure to click on **Environment Variables** and set them to match your `.env.local` file.

#### Deploy from Our Template

Alternatively, you can deploy using our template by clicking on the Deploy button below.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/cms-wordpress&project-name=cms-wordpress&repository-name=cms-wordpress&env=STEPZEN_API_URL&envDescription=Required%20to%20connect%20the%20app%20with%20WordPress&envLink=https://vercel.link/cms-wordpress-env)
