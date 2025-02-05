import { Plugin } from 'vite';

type Tags = Record<string, string[]>;
interface Options {
    tags?: Tags;
}
declare function viteHtmlResolveAliasPlugin(options?: Options): Plugin;

export { type Options, viteHtmlResolveAliasPlugin as default };
