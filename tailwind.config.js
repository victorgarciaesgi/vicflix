const plugin = require('tailwindcss/plugin');
const colors = require('./src/styles/colors.module');

module.exports = {
  important: false,
  darkMode: 'class',
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    mode: 'layers',
    layers: ['utilities'],
    enabled: process.env.NODE_ENV === 'production',
    defaultExtractor: (content) => content.match(/[^<>"'`\s]*[^<>"'`\s:!]/g) || [],

    content: [
      './src/components/**/*.vue',
      './src/layouts/**/*.vue',
      './src/pages/**/*.vue',
      './src/plugins/**/*.ts',
    ],
    options: {
      safelist: {
        standard: [
          'html',
          'body',
          'app',
          '__nuxt',
          '__layout',

          /ProseMirror/,
          /nuxt/,
          /grid-cols-/,
          /grid-cols-/,
          /object-/,
        ],
      },
    },
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
    colors,
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
      maxWidth: {
        12: '12rem',
        xxs: '16rem',
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
        default: '0 0 10px var(--shadowColor)',
        top: '0 -8px 10px var(--shadowColor)',
        bottom: '0 8px 10px var(--shadowColor)',
      },
      zIndex: {
        'm-1': '-1',
      },
      flex: {
        0: '0 0 auto',
      },
      height: {
        '2px': '2px',
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
    },
  },
  corePlugins: {},
  variants: {
    extend: {
      backgroundColor: ['important', 'active'],
      backgroundOpacity: ['important'],
      display: ['important', 'group-hover'],
      margin: ['first', 'last', 'important'],
      visibility: ['responsive', 'important'],
      width: ['important', 'hover'],
      height: ['important', 'hover'],
      padding: ['important'],
      inset: ['important'],
      textColor: ['important'],
      fontSize: ['important'],
      fontWeight: ['important'],
      rotate: ['important'],
      borderColor: ['important', 'first', 'last'],
      boxShadow: ['important'],
      minWidth: ['important'],
      ringColor: ['hover', 'group-hover'],
      ringWidth: ['hover', 'group-hover'],
    },
  },
  plugins: [
    plugin(({ theme, addVariant, addUtilities, e }) => {
      addUtilities({
        '.grid-col-min-content': {
          gridAutoColumns: 'min-content',
        },
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
