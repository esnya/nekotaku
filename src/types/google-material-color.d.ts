declare module 'google-material-color' {
  interface Palette {
    get(color: string): string;
  }

  const palette: Palette;
  export default palette;
}
