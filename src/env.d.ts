/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module "@pagefind/default-ui" {
    export class PagefindUI {
        constructor(options: {
            element: string | HTMLElement;
            bundlePath?: string;
            showImages?: boolean;
            showSubResults?: boolean;
            [key: string]: unknown;
        });
        destroy(): void;
    }
}
