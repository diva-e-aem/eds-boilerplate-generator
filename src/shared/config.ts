export interface Config {
  mainTsPath: string;
  mainScssPath: string;
  iconsDirPath: string;
  iconsTypesPath: string;
  fontsScssPath?: string;
  fontsCssPath?: string;
  lazyStylesScssPath?: string;
  lazyStylesCssPath?: string;
  sidekickLibraryStylesScssPath?: string;
  sidekickLibraryStylesCssPath?: string;
  editorTsPath: string;
  lcpBlocks?: string[];
}

export const config: Config = {
  mainTsPath: './src/main.ts',
  mainScssPath: './src/styles/main.scss',
  iconsDirPath: './public/icons',
  iconsTypesPath: './src/types/icons.types.ts',
  fontsScssPath: './src/styles/fonts.scss',
  fontsCssPath: './dist/fonts/fonts.css',
  lazyStylesScssPath: './src/styles/lazy-styles.scss',
  lazyStylesCssPath: './dist/lazyStyles/lazyStyles.css',
  sidekickLibraryStylesScssPath: './src/styles/sidekick-library-styles.scss',
  sidekickLibraryStylesCssPath: './dist/sidekickLibraryStyles/sidekickLibraryStyles.css',
  editorTsPath: './src/app/editor/editor-support.ts',
  lcpBlocks: [],
};
