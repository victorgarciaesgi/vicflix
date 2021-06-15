import { NuxtOptionsModule } from '@nuxt/types/config/module';
import 'nuxt-typed-router';

const isProd = process.env.NODE_ENV === 'production';

export const modules: NuxtOptionsModule[] = [
  'nuxt-client-init-module',
  'nuxt-typed-router',
  'portal-vue/nuxt',
  'nuxt-i18n',
  '@nuxtjs/robots',
  '@nuxtjs/sitemap',
  ...(isProd
    ? ([
        [
          'nuxt-compress',
          {
            gzip: {
              cache: true,
            },
            brotli: {
              threshold: 10240,
            },
          },
        ],
        [
          'nuxt-rfg-icon',
          {
            masterPicture: './src/static/icon.png',
            iconsPath: '/',
            design: {
              ios: {
                pictureAspect: 'noChange',
                assets: {
                  ios6AndPriorIcons: false,
                  ios7AndLaterIcons: false,
                  precomposedIcons: false,
                  declareOnlyDefaultIcon: true,
                },
              },
              desktopBrowser: {
                design: 'raw',
              },
              windows: {
                pictureAspect: 'noChange',
                backgroundColor: '#da532c',
                onConflict: 'override',
                assets: {
                  windows80Ie10Tile: false,
                  windows10Ie11EdgeTiles: {
                    small: false,
                    medium: true,
                    big: false,
                    rectangle: false,
                  },
                },
              },
              androidChrome: {
                pictureAspect: 'noChange',
                themeColor: '#ffffff',
                manifest: {
                  display: 'standalone',
                  orientation: 'notSet',
                  onConflict: 'override',
                  declared: true,
                },
                assets: {
                  legacyIcon: false,
                  lowResolutionIcons: false,
                },
              },
              safariPinnedTab: {
                pictureAspect: 'blackAndWhite',
                threshold: 64.0625,
                themeColor: '#ff2672',
              },
            },
            settings: {
              scalingAlgorithm: 'Mitchell',
              errorOnImageTooSmall: false,
              readmeFile: false,
              htmlCodeFile: false,
              usePathAsIs: false,
            },
            versioning: {
              paramName: 'v',
              paramValue: '47BWavYqWq',
            },
          },
        ],
      ] as any)
    : []),
];
