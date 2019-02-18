declare module 'google-material-color' {
  interface Palette {
    get(color: string, shade?: string): string;
    palette: {
      [name: string]: string[];
    }
  }

  const palette: Palette;
  export default palette;
}
