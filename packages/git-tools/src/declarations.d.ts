/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "doctoc/lib/transform" {
  export declare function transform(
    content: string,
    mode?: string,
    maxHeaderLevel?: number,
    title?: string,
    noTitle?: boolean,
    entryPrefix?: string,
    processAll?: boolean,
    updateOnly?: boolean
  ): any;
}

declare module "any-shell-escape" {
  export default function shellescape(args: string[]): string;
}
