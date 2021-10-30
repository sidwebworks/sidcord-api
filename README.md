## Express + Typescript REST API
A production-ready rest-api template with,

- Error handling
- Folder structure
- Eslint & Prettier (Typescript)
- Typescript Module Aliases
- Dev bundles using blazing fast ESBUILD
- And much more...

  
## Installation

The quickest way to get started is to use `degit` to clone this template.

Run this command in your terminal,

```bash
 npx degit https://github.com/sidwebworks/express-typescript-api.git
```
Alternatively, you can also use `git clone` or directly create a new repo using the template button.    
## Usage/Examples

By default there are 3 main scripts.

#### $ Dev Script
`yarn dev` or `npm run dev`

This command will start a local dev server on the given port (default is `3000`).
It will also watch your `src` directory and re-build on any changes.

#### $ Start Script
`yarn start` or `npm run start`

This command will build your project once and start the server on the given port (default is `3000`).
For production it uses `tsc` for code transpiling instead of esbuild, because ESBUILD doesn't do typechecking. 

#### $ Lint Script
`yarn lint` or `npm run lint`

This command will lint your project using eslint and prettier.




## Running Tests

Coming soon...

  
## License

[MIT](https://choosealicense.com/licenses/mit/)

  