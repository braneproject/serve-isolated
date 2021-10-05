# serve-isolated

Serve static contents under the `crossOriginIsolated` mode.

See [this post](https://web.dev/why-coop-coep/) for more detail about `crossOriginIsolated`, COOP & COEP

## Usage

The quickest way to get started is to just run `npx serve-isolated` in your project's directory.

If you prefer, you can also install the package globally using Yarn.

```bash
yarn global add serve-isolated
```

Once that's done, you can run this command inside your project's directory...

```bash
serve-isolated
```

...or specify which folder you want to serve:

```bash
serve-isolated folder_name
```

available options:

```txt
--host   Specify listening hostname
--port   Specify listening port
--https  Enable https/http2,
         with automatically generated cert using devcert
         (root permission may required)
```

## License

MIT
