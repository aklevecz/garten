// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      hunter: string | undefined | null;
      email: string;
      address: string;
      ip: string;
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
