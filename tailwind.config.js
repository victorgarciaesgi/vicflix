const plugin = require('tailwindcss/plugin');
const colors = require('./src/styles/colors.module');

module.exports = {
  important: false,
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    mode: 'layers',
    layers: ['utilities'],
    enabled: process.env.NODE_ENV === 'production',
    defaultExtractor: (content) => content.match(/[^<>"'`\s]*[^<>"'`\s:!]/g) || [],
    whitelist: ['html', 'body', 'app', '__nuxt', '__layout'],
    whitelistPatterns: [/ProseMirror/, /nuxt/],
    content: [
      './src/components/**/*.vue',
      './src/layouts/**/*.vue',
      './src/pages/**/*.vue',
      './src/plugins/**/*.ts',
    ],
  },
  theme: {
    screens: {
      xl: { max: '1279px' },
      lg: { max: '1023px' },
      md: { max: '767px' },
      sm: { max: '639px' },
      '-sm': { min: '639px' },
      '-md': { min: '767px' },
      '-lg': { min: '1023px' },
      '-xl': { min: '1279px' },
    },
    extend: {
      fontSize: {
        xxs: '0.6rem',
        md: '0.95rem',
      },
      lineHeight: {
        1: '1',
        '1/25': '1.25',
        '1/5': '1.5',
      },
      maxHeight: {
        inh: 'inherit',
      },
      padding: {
        '2px': '2px',
        '3px': '3px',
        '4px': '4px',
        '5p': '5%',
        '10p': '10%',
        '15p': '15%',
        '20p': '20%',
        '25p': '25%',
        '30p': '30%',
        '35p': '35%',
      },
      margin: {
        '5p': '5%',
        '10p': '10%',
        '15p': '15%',
        '20p': '20%',
        '25p': '25%',
        '30p': '30%',
        '35p': '35%',
      },
      spacing: {
        72: '18rem',
        80: '20rem',
        88: '22rem',
        96: '24rem',
        104: '26rem',
      },
      boxShadow: {
        default: '0 0 10px var(--shadow)',
        top: '0 -8px 10px var(--shadow)',
        bottom: '0 8px 10px var(--shadow)',
      },
      zIndex: {
        'm-1': '-1',
      },
      flex: {
        0: '0 0 auto',
      },
      inset: {
        full: '100%',
        header: 'var(--headerHeight)',
        '5p': '5%',
        '10p': '10%',
        '15p': '15%',
        '20p': '20%',
        '25p': '25%',
        '30p': '30%',
        '35p': '35%',
        '50p': '50%',
      },
      colors,
    },
  },
  corePlugins: {},
  variants: {
    backgroundColor: ['responsive', 'hover', 'active', 'dark', 'light', 'important'],
    backgroundOpacity: ['responsive', 'hover', 'active', 'dark', 'light', 'important'],
    display: ['responsive', 'hover', 'dark', 'light', 'important'],
    margin: ['responsive', 'hover', 'first', 'last', 'important'],
    visibility: ['responsive', 'important'],
    width: ['responsive', 'important'],
    height: ['responsive', 'important'],
    padding: ['responsive', 'important'],
    inset: ['responsive', 'important'],
    textColor: ['responsive', 'hover', 'important'],
    fontSize: ['responsive', 'hover', 'important'],
    fontWeight: ['hover', 'important'],
    rotate: ['hover', 'important'],
    borderColor: ['responsive', 'hover', 'important', 'first', 'last'],
    boxShadow: ['responsive', 'hover', 'important', 'dark', 'light'],
  },
  plugins: [
    plugin(({ theme, addVariant, addUtilities, e }) => {
      addUtilities({
        '.grid-col-min-content': {
          gridAutoColumns: 'min-content',
        },
      });

      addVariant('dark', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `body[data-theme='dark'] .${e(`dark${separator}${className}`)}`;
        });
      });
      addVariant('light', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `body[data-theme='light'] .${e(`light${separator}${className}`)}`;
        });
      });
      addVariant('important', ({ container }) => {
        container.walkRules((rule) => {
          rule.selector = `.\\!${rule.selector.slice(1)}`;
          rule.walkDecls((decl) => {
            decl.important = true;
          });
        });
      });
    }),
  ],
};
