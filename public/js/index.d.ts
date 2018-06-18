declare module "util" {
    export const $: ParentNode['querySelector'];
    export const $$: ParentNode['querySelectorAll'];
    export const $new: Document['createElement'];
}
declare module "index" { }
