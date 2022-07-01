/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = {
  customSyntax: require('postcss-html')({
    css: 'postcss-safe-parser',
    scss: 'postcss-safe-parser',
  }),
  extends: ['stylelint-config-standard', 'stylelint-config-standard-scss'],
  plugins: ['stylelint-order'],
  rules: {
    // 'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    'scss/selector-no-redundant-nesting-selector': true,
    'scss/dollar-variable-pattern': null,
    'scss/at-function-pattern': null,
    'order/order': ['custom-properties', 'declarations'],
    'order/properties-alphabetical-order': true,
    'color-function-notation': 'modern',
    'string-quotes': 'single',
    // 'indentation': ['tab'],
    'function-name-case': null,
    'selector-class-pattern': null,
    'color-no-invalid-hex': true,
    'font-family-no-duplicate-names': true,
    'font-family-no-missing-generic-family-keyword': true,
    'alpha-value-notation': 'number',
    'no-descending-specificity': true,
    'declaration-block-no-redundant-longhand-properties': true,
    'custom-property-pattern': null,
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global'] }],

    'unit-allowed-list': ['rem', 'em', 'px', 'deg', '%', 'fr', 's', 'ms', 'vh', 'vw'],

    'value-keyword-case': ['lower', { ignoreProperties: ['text-rendering'] }],

    'function-no-unknown': [
      true,
      {
        ignoreFunctions: [
          'math.div',
          'color.adjust',
          'f.divide',
          'f.pxToViewportUnit',
          'f.remToViewportUnit',
        ],
      },
    ],
  },
};
