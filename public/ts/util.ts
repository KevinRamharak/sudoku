export const $: ParentNode['querySelector'] = (query: string) =>
    document.querySelector(query);
export const $$: ParentNode['querySelectorAll'] = (query: string) =>
    document.querySelectorAll(query);
export const $new: Document['createElement'] = (tag: string) =>
    document.createElement(tag);
