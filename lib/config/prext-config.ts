export type PrextConfig = {
  /**
   * Path to the directory containing your Preact pages.
   * @default "src/pages"
   */
  pages_dir: string;
  /**
   * Path to the directory where static assets (like CSS, images) are located.
   * These will be copied directly to the output public directory.
   * @default "public"
   */
  public_dir: string;
};
