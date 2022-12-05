# @dr-squatch/lib

This project aims to be a place for shared code (starting off on back-end, but should also be eventually usable on front-end too, if it isn't currently).

This is mostly for use working with Shopify, Recharge, etc, and adhoc scripting/typing with various internal use cases.

This is meant to be a continual work-in-progress. Feel free to add to this, update, add new functionality as it relates to your use case. Just try not to break any existing APIs of this library (as defined in the `src/index.ts` file)... At least, if attempting some crazy refactors, consider bumping the version in package.json (should be major version probably, but minor is fine I think, in beta).

Install with:
```bash
npm i @dr-squatch/lib # latest release
```

or for the cutting-edge/latest in the main branch:

```bash
npm i github:dr-squatch/lib
```

Import with:
```typescript
import { someFunc } from '@dr-squatch/lib';

(async () => {
  const result = await someFunc({ hello: 'world' });
  console.debug('result:', result);
})();
```

## Tips

- When referencing this library in your `package.json`, remember to specify the exact version you want that currently works for your use case.
- Make sure to include the `env vars` that this library would need, in the project you're using this library in.

### Testing

This library is meant to be (implicitly) tested from the consuming codebases, on a per-use-case basis. However, as needed per use-case, we test within this library via [Jest](https://jestjs.io/). The purpose isn't to backfill code-coverage or something, just to test before launching (or to speed up launching) to prod, if/when it may matter. Prefer full integration testing over mock-testing in unit tests; YMMV.

## Useful references while developing / using locally (or published) in projects

- https://medium.com/@debshish.pal/publish-a-npm-package-locally-for-testing-9a00015eb9fd
- https://www.tsmean.com/articles/how-to-write-a-typescript-library/
- https://zellwk.com/blog/publish-to-npm/
- https://stackoverflow.com/questions/28728665/how-to-use-private-github-repo-as-npm-dependency#answer-67642720

### quick-start/hacking
#### in this library (drsquatch-lib)
```bash
npx tsc && npm link # for local development
npm pack # may be useful when/before publishing? WIP
```

#### in consuming code
```bash
npm link drsquatch-lib
```

#### for ease of committing
```bash
cp pre-commit .git/hooks
chmod +x .git/hooks/pre-commit
```

#### publishing

Can be published via `npm publish` when logged into git with our GitHub registry name/owner of `@dr-squatch`.

## Example Repo/Usage

As an example implementation, I'm currently using this library inside the [remorse-period-processing](https://github.com/dr-squatch/remorse-period-processing) service.

## Note / Disclaimer

The SKU Bundle custom mapping files and code are not entirely stable. This is a nice library to house stable versions of such files, but those mapping files aren't currently ready (as of beta launch), proven by my not having used it in any prod services yet, to be blindly consumed from.

### Design Preferences / Rants

- prefer `exponential-backoff` library to `axios-retry` (note exported `exponentialBackoff` function in this library), as the former seems more versatile and customizable; YMMV