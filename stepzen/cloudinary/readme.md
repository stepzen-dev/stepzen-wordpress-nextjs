## Setting up your cloudinary API

1. Create a cloudinary account
2. Applying the standard `username:password` to the endpoint in your SDL with the API Key and API Secret.
3. Add the authentication configs along with the cloud name then deploy to StepZen!
```bash
  - configuration:
      name: cloudinary_config
      api_key: {{ api_key }}
      api_secret: {{ api_secret }}
      cloud_name: {{ cloud_name }}
```


Not signed up for StepZen? Try it free here -> https://stepzen.com/request-invite

