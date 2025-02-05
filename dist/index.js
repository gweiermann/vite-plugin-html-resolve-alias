import path from 'node:path';
import posthtml from 'posthtml';
import { normalizePath } from 'vite';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const defaultTags = {
    video: ['src', 'poster'],
    source: ['src'],
    img: ['src'],
    image: ['xlink:href', 'href'],
    use: ['xlink:href', 'href'],
    link: ['href'],
    script: ['src'],
};
// rollup-alias matches
function matches(pattern, importee) {
    if (pattern instanceof RegExp) {
        return pattern.test(importee);
    }
    if (importee.length < pattern.length) {
        return false;
    }
    if (importee === pattern) {
        return true;
    }
    return importee.startsWith(`${pattern}/`);
}
function viteHtmlResolveAliasPlugin(options) {
    var _a;
    const tags = (_a = options === null || options === undefined ? undefined : options.tags) !== null && _a !== undefined ? _a : defaultTags;
    let config;
    return {
        name: 'vite-plugin-html-resolve-alias',
        configResolved(resolvedConfig) {
            config = resolvedConfig;
        },
        transformIndexHtml: {
            order: 'pre',
            handler(html_1, _a) {
                return __awaiter(this, arguments, undefined, function* (html, { filename }) {
                    const { resolve: { alias } } = config;
                    const posthtmlTransformPlugin = (tree) => {
                        tree.match(Object.keys(tags).map(tag => ({ tag })), (node) => {
                            Object.entries(node.attrs || {}).forEach(([key, value = '']) => {
                                if (tags[node.tag].includes(key)) {
                                    const matched = alias.find(entry => matches(entry.find, value));
                                    if (!matched) {
                                        return;
                                    }
                                    node.attrs[key] = normalizePath(path.relative(path.dirname(filename), value.replace(matched.find, matched.replacement)));
                                }
                            });
                            return node;
                        });
                    };
                    try {
                        const result = yield posthtml([posthtmlTransformPlugin]).process(html);
                        return result.html;
                    }
                    catch (e) {
                        console.error(`Transform Html error: ${e.message}`);
                    }
                    return null;
                });
            },
        },
    };
}

export { viteHtmlResolveAliasPlugin as default };
