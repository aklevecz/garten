// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      hunter: string | undefined | null;
      info: any;
      email: string;
      address: string;
      ip: string;
      favoriteArtist: string;
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
