import type { Linter } from "eslint";

const config: Linter.RulesRecord = {
  // We recommend using TypeScript over `prop-types`, as `prop-types` can add
  // to a project's build size.
  "react/prop-types": "off",

  // Disable requiring React to be imported, as this is no longer required.
  "react/react-in-jsx-scope": "off",

  /**
   * Require an explicit type when using button elements.
   *
   * 🚫 Not fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/button-has-type.md
   */
  "react/button-has-type": [
    "error",
    {
      button: true,
      submit: true,
      reset: true,
    },
  ],

  /**
   * Require consistent function type for function components.
   *
   * 🔧 Fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/HEAD/docs/rules/function-component-definition.md
   */
  "react/function-component-definition": "warn",
  /**
   * Require destructuring and symmetric naming of `useState` hook value and setter variables.
   *
   * 🚫 Not fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/hook-use-state.md
   */
  "react/hook-use-state": "warn",
  /**
   * Require consistent boolean attributes notation in JSX.
   *
   * 🔧 Fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-boolean-value.md
   */
  "react/jsx-boolean-value": "warn",

  /**
   * Disallow unnecessary curly braces in JSX props and children.
   *
   * 🔧 Fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-brace-presence.md
   */
  "react/jsx-curly-brace-presence": "warn",

  /**
   * Require using shorthand form for React fragments, unless required.
   *
   * 🔧 Fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-fragments.md
   */
  "react/jsx-fragments": ["error", "syntax"],

  /**
   * Prevent problematic leaked values from being rendered.
   *
   * 🔧 Fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-leaked-render.md
   */
  "react/jsx-no-leaked-render": "warn",

  /**
   * Prevents usage of unsafe `target='_blank'`.
   *
   * This rule is a part of `react/recommended`, but we've modified it to
   * allow referrer.
   *
   * 🔧 Fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-target-blank.md
   */
  "react/jsx-no-target-blank": [
    "error",
    {
      enforceDynamicLinks: "always",
      allowReferrer: true,
    },
  ],

  /**
   * Disallow empty React fragments.
   *
   * 🔧 Fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-useless-fragment.md
   */
  "react/jsx-no-useless-fragment": ["warn", { allowExpressions: true }],

  /**
   * Require the use of PascalCase for user-defined JSX components.
   *
   * 🚫 Not fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-pascal-case.md
   */
  "react/jsx-pascal-case": [
    "error",
    {
      allowAllCaps: true,
      ignore: [],
    },
  ],

  /**
   * Disallow usage of Array index in keys.
   *
   * 🚫 Not fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-array-index-key.md
   */
  "react/no-array-index-key": "warn",

  /**
   * Disallow creating unstable components inside components.
   *
   * 🚫 Not fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unstable-nested-components.md
   */
  "react/no-unstable-nested-components": "error",

  /**
   * Disallow closing tags for components without children.
   *
   * 🔧 Fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/self-closing-comp.md
   */
  "react/self-closing-comp": "warn",

  // Specify whether double or single quotes should be used in JSX attributes
  // https://eslint.org/docs/rules/jsx-quotes
  "jsx-quotes": ["error", "prefer-double"],

  "class-methods-use-this": [
    "error",
    {
      exceptMethods: [
        "render",
        "getInitialState",
        "getDefaultProps",
        "getChildContext",
        "componentWillMount",
        "UNSAFE_componentWillMount",
        "componentDidMount",
        "componentWillReceiveProps",
        "UNSAFE_componentWillReceiveProps",
        "shouldComponentUpdate",
        "componentWillUpdate",
        "UNSAFE_componentWillUpdate",
        "componentDidUpdate",
        "componentWillUnmount",
        "componentDidCatch",
        "getSnapshotBeforeUpdate",
      ],
    },
  ],

  // This rule enforces onChange or readonly attribute for checked property of input elements.
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/checked-requires-onchange-or-readonly.md
  "react/checked-requires-onchange-or-readonly": [
    "off",
    {
      ignoreMissingProperties: false,
      ignoreExclusiveCheckedAttribute: false,
    },
  ],

  // Prevent missing displayName in a React component definition
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/display-name.md
  "react/display-name": ["off", { ignoreTranspilerName: false }],

  // Forbid certain propTypes (any, array, object)
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/forbid-prop-types.md
  "react/forbid-prop-types": [
    "error",
    {
      forbid: ["any", "array", "object"],
      checkContextTypes: true,
      checkChildContextTypes: true,
    },
  ],

  // Forbid certain props on DOM Nodes
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/forbid-dom-props.md
  "react/forbid-dom-props": ["off", { forbid: [] }],

  // Validate closing bracket location in JSX
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-closing-bracket-location.md
  "react/jsx-closing-bracket-location": ["error", "after-props"],

  // Validate closing tag location in JSX
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-closing-tag-location.md
  "react/jsx-closing-tag-location": "error",

  // Enforce or disallow spaces inside of curly braces in JSX attributes
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-spacing.md
  "react/jsx-curly-spacing": ["error", "never", { allowMultiline: true }],

  // Enforce event handler naming conventions in JSX
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-handler-names.md
  "react/jsx-handler-names": [
    "error",
    {
      eventHandlerPrefix: "on",
      eventHandlerPropPrefix: "on",
    },
  ],

  // Validate props indentation in JSX
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-indent-props.md
  "react/jsx-indent-props": ["error", 2],

  // Validate JSX has key prop when in array or iterator
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-key.md
  // Turned off because it has too many false positives
  "react/jsx-key": "warn",

  // Limit maximum of props on a single line in JSX
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-max-props-per-line.md
  "react/jsx-max-props-per-line": ["error", { maximum: 1, when: "multiline" }],

  // Prevent usage of .bind() in JSX props
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md
  "react/jsx-no-bind": [
    "error",
    {
      ignoreRefs: true,
      allowArrowFunctions: true,
      allowFunctions: false,
      allowBind: false,
      ignoreDOMComponents: true,
    },
  ],

  // Prevent duplicate props in JSX
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-duplicate-props.md
  "react/jsx-no-duplicate-props": ["error", { ignoreCase: true }],

  // Prevent usage of unwrapped JSX strings
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-literals.md
  "react/jsx-no-literals": ["off", { noStrings: true }],

  // Disallow undeclared variables in JSX
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-undef.md
  "react/jsx-no-undef": "error",

  // Deprecated in favor of react/jsx-sort-props
  "react/jsx-sort-prop-types": "off",

  /**
   * Require props to be sorted alphabetically.
   *
   * 🔧 Fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-sort-props.md
   */
  "react/jsx-sort-props": [
    "warn",
    {
      ignoreCase: true,
      callbacksLast: false,
      shorthandFirst: false,
      shorthandLast: false,
      noSortAlphabetically: false,
      reservedFirst: true,
    },
  ],

  // Enforce defaultProps declarations alphabetical sorting
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/jsx-sort-default-props.md
  "react/sort-default-props": [
    "warn",
    {
      ignoreCase: true,
    },
  ],

  // Prevent React to be incorrectly marked as unused
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-uses-react.md
  "react/jsx-uses-react": ["error"],

  // Prevent variables used in JSX to be incorrectly marked as unused
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-uses-vars.md
  "react/jsx-uses-vars": "error",

  // Prevent usage of dangerous JSX properties
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-danger.md
  "react/no-danger": "warn",

  // Prevent usage of deprecated methods
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-deprecated.md
  "react/no-deprecated": ["error"],

  // Prevent usage of setState in componentDidMount
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-did-mount-set-state.md
  // this is necessary for server-rendering
  "react/no-did-mount-set-state": "off",

  // Prevent usage of setState in componentDidUpdate
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-did-update-set-state.md
  "react/no-did-update-set-state": "error",

  // Prevent usage of setState in componentWillUpdate
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-will-update-set-state.md
  "react/no-will-update-set-state": "error",

  // Prevent direct mutation of this.state
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-direct-mutation-state.md
  "react/no-direct-mutation-state": "off",

  // Prevent usage of isMounted
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-is-mounted.md
  "react/no-is-mounted": "error",

  // Prevent multiple component definition per file
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-multi-comp.md
  "react/no-multi-comp": "off",

  // Prevent usage of setState
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-set-state.md
  "react/no-set-state": "off",

  // Prevent using string references
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-string-refs.md
  "react/no-string-refs": "error",

  // Prevent usage of unknown DOM property
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unknown-property.md
  "react/no-unknown-property": "error",

  // Require ES6 class declarations over React.createClass
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prefer-es6-class.md
  "react/prefer-es6-class": ["error", "always"],

  // Require stateless functions when not using lifecycle methods, setState or ref
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md
  "react/prefer-stateless-function": ["error", { ignorePureComponents: true }],

  // Require render() methods to return something
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/require-render-return.md
  "react/require-render-return": "error",

  // Enforce component methods order
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/sort-comp.md
  "react/sort-comp": [
    "error",
    {
      order: [
        "static-variables",
        "static-methods",
        "instance-variables",
        "lifecycle",
        "/^handle.+$/",
        "/^on.+$/",
        "getters",
        "setters",
        "/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/",
        "instance-methods",
        "everything-else",
        "rendering",
      ],
      groups: {
        lifecycle: [
          "displayName",
          "propTypes",
          "contextTypes",
          "childContextTypes",
          "mixins",
          "statics",
          "defaultProps",
          "constructor",
          "getDefaultProps",
          "getInitialState",
          "state",
          "getChildContext",
          "getDerivedStateFromProps",
          "componentWillMount",
          "UNSAFE_componentWillMount",
          "componentDidMount",
          "componentWillReceiveProps",
          "UNSAFE_componentWillReceiveProps",
          "shouldComponentUpdate",
          "componentWillUpdate",
          "UNSAFE_componentWillUpdate",
          "getSnapshotBeforeUpdate",
          "componentDidUpdate",
          "componentDidCatch",
          "componentWillUnmount",
        ],
        rendering: ["/^render.+$/", "render"],
      },
    },
  ],

  // Prevent missing parentheses around multilines JSX
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/jsx-wrap-multilines.md
  "react/jsx-wrap-multilines": [
    "error",
    {
      declaration: "parens-new-line",
      assignment: "parens-new-line",
      return: "parens-new-line",
      arrow: "parens-new-line",
      condition: "parens-new-line",
      logical: "parens-new-line",
      prop: "parens-new-line",
    },
  ],

  // Require that the first prop in a JSX element be on a new line when the element is multiline
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-first-prop-new-line.md
  "react/jsx-first-prop-new-line": ["error", "multiline-multiprop"],

  // Enforce spacing around jsx equals signs
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-equals-spacing.md
  "react/jsx-equals-spacing": ["error", "never"],

  // Enforce JSX indentation
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-indent.md
  "react/jsx-indent": ["error", 2],

  // only ".jsx", ".tsx", or ".mdx" files may have JSX
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
  "react/jsx-filename-extension": [
    "error",
    { extensions: [".jsx", ".tsx", ".mdx"] },
  ],

  // prevent accidental JS comments from being injected into JSX as text
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-comment-textnodes.md
  "react/jsx-no-comment-textnodes": "error",

  // disallow using React.render/ReactDOM.render's return value
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-render-return-value.md
  "react/no-render-return-value": "error",

  // require a shouldComponentUpdate method, or PureRenderMixin
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/require-optimization.md
  "react/require-optimization": ["off", { allowDecorators: [] }],

  // warn against using findDOMNode()
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-find-dom-node.md
  "react/no-find-dom-node": "error",

  // Forbid certain props on Components
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/forbid-component-props.md
  "react/forbid-component-props": ["off", { forbid: [] }],

  // Forbid certain elements
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/forbid-elements.md
  "react/forbid-elements": ["off", { forbid: [] }],

  // Prevent problem with children and props.dangerouslySetInnerHTML
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-danger-with-children.md
  "react/no-danger-with-children": "error",

  // Prevent unused propType definitions
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unused-prop-types.md
  "react/no-unused-prop-types": [
    "error",
    {
      customValidators: [],
      skipShapeProps: true,
    },
  ],

  // Require style prop value be an object or var
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/style-prop-object.md
  "react/style-prop-object": "error",

  // Prevent invalid characters from appearing in markup
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unescaped-entities.md
  "react/no-unescaped-entities": "error",

  // Prevent passing of children as props
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-children-prop.md
  "react/no-children-prop": "error",

  // Validate whitespace in and around the JSX opening and closing brackets
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/jsx-tag-spacing.md
  "react/jsx-tag-spacing": [
    "error",
    {
      closingSlash: "never",
      beforeSelfClosing: "always",
      afterOpening: "never",
      beforeClosing: "never",
    },
  ],

  // Enforce spaces before the closing bracket of self-closing JSX elements
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-space-before-closing.md
  // Deprecated in favor of jsx-tag-spacing
  "react/jsx-space-before-closing": ["off", "always"],

  // Enforce a defaultProps definition for every prop that is not a required prop
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/require-default-props.md
  "react/require-default-props": [
    "error",
    {
      forbidDefaultForRequired: true,
    },
  ],

  // Forbids using non-exported propTypes
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/forbid-foreign-prop-types.md
  // this is intentionally set to "warn". it would be "error",
  // but it's only critical if you're stripping propTypes in production.
  "react/forbid-foreign-prop-types": ["warn", { allowInPropTypes: true }],

  // Prevent void DOM elements from receiving children
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/void-dom-elements-no-children.md
  "react/void-dom-elements-no-children": "error",

  // Enforce all defaultProps have a corresponding non-required PropType
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/9e13ae2c51e44872b45cc15bf1ac3a72105bdd0e/docs/rules/default-props-match-prop-types.md
  "react/default-props-match-prop-types": [
    "error",
    { allowRequiredDefaults: false },
  ],

  // Prevent usage of shouldComponentUpdate when extending React.PureComponent
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/9e13ae2c51e44872b45cc15bf1ac3a72105bdd0e/docs/rules/no-redundant-should-component-update.md
  "react/no-redundant-should-component-update": "error",

  // Prevent unused state values
  // https://github.com/jsx-eslint/eslint-plugin-react/pull/1103/
  "react/no-unused-state": "error",

  // Enforces consistent naming for boolean props
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/boolean-prop-naming.md
  "react/boolean-prop-naming": [
    "off",
    {
      propTypeNames: ["bool", "mutuallyExclusiveTrueProps"],
      rule: "^(is|has)[A-Z]([A-Za-z0-9]?)+",
      message: "",
    },
  ],

  // Prevents common casing typos
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/73abadb697034b5ccb514d79fb4689836fe61f91/docs/rules/no-typos.md
  "react/no-typos": "error",

  // One JSX Element Per Line
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/jsx-one-expression-per-line.md
  "react/jsx-one-expression-per-line": ["error", { allow: "single-child" }],

  // Enforce consistent usage of destructuring assignment of props, state, and context
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/destructuring-assignment.md
  "react/destructuring-assignment": ["error", "always"],

  // Prevent using this.state within a this.setState
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/no-access-state-in-setstate.md
  "react/no-access-state-in-setstate": "error",

  // Ensures inline tags are not rendered without spaces between them
  "react/jsx-child-element-spacing": "off",

  // Prevent this from being used in stateless functional components
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/no-this-in-sfc.md
  "react/no-this-in-sfc": "error",

  // Validate JSX maximum depth
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/abe8381c0d6748047224c430ce47f02e40160ed0/docs/rules/jsx-max-depth.md
  "react/jsx-max-depth": "off",

  // Disallow multiple spaces between inline JSX props
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/ac102885765be5ff37847a871f239c6703e1c7cc/docs/rules/jsx-props-no-multi-spaces.md
  "react/jsx-props-no-multi-spaces": "error",

  // Prevent usage of UNSAFE_ methods
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/157cc932be2cfaa56b3f5b45df6f6d4322a2f660/docs/rules/no-unsafe.md
  "react/no-unsafe": "off",

  // Enforce linebreaks in curly braces in JSX attributes and expressions.
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-newline.md
  "react/jsx-curly-newline": [
    "error",
    {
      multiline: "consistent",
      singleline: "consistent",
    },
  ],

  // Enforce state initialization style
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/state-in-constructor.md
  // TODO: set to "never" once babel-preset-airbnb supports public class fields
  "react/state-in-constructor": ["error", "always"],

  // Enforces where React component static properties should be positioned
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/static-property-placement.md
  // TODO: set to "static public field" once babel-preset-airbnb supports public class fields
  "react/static-property-placement": ["error", "property assignment"],

  // Disallow JSX props spreading
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-props-no-spreading.md
  "react/jsx-props-no-spreading": [
    "off",
    {
      html: "enforce",
      custom: "enforce",
      explicitSpread: "ignore",
      exceptions: [],
    },
  ],

  // Enforce that props are read-only
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prefer-read-only-props.md
  "react/prefer-read-only-props": "off",

  // Prevent usage of `javascript:` URLs
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-script-url.md
  "react/jsx-no-script-url": [
    "error",
    [
      {
        name: "Link",
        props: ["to"],
      },
    ],
  ],

  // Prevent adjacent inline elements not separated by whitespace
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-adjacent-inline-elements.md
  // TODO: enable? semver-major
  "react/no-adjacent-inline-elements": "off",

  // Enforce a new line after jsx elements and expressions
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/e2eaadae316f9506d163812a09424eb42698470a/docs/rules/jsx-newline.md
  "react/jsx-newline": "off",

  // Prevent react contexts from taking non-stable values
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/e2eaadae316f9506d163812a09424eb42698470a/docs/rules/jsx-no-constructed-context-values.md
  "react/jsx-no-constructed-context-values": "error",

  // Enforce that namespaces are not used in React elements
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/8785c169c25b09b33c95655bf508cf46263bc53f/docs/rules/no-namespace.md
  "react/no-namespace": "error",

  // Prefer exact proptype definitions
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/8785c169c25b09b33c95655bf508cf46263bc53f/docs/rules/prefer-exact-props.md
  "react/prefer-exact-props": "error",

  // Lifecycle methods should be methods on the prototype, not class fields
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/21e01b61af7a38fc86d94f27eb66cda8054582ed/docs/rules/no-arrow-function-lifecycle.md
  "react/no-arrow-function-lifecycle": "error",

  // Prevent usage of invalid attributes
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/21e01b61af7a38fc86d94f27eb66cda8054582ed/docs/rules/no-invalid-html-attribute.md
  "react/no-invalid-html-attribute": "error",

  // Prevent declaring unused methods of component class
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/21e01b61af7a38fc86d94f27eb66cda8054582ed/docs/rules/no-unused-class-component-methods.md
  "react/no-unused-class-component-methods": "error",

  // Enforce sandbox attribute on iframe elements
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/c8833f301314dab3e79ef7ac4cf863e4d5fa0019/docs/rules/iframe-missing-sandbox.md
  // TODO: semver-major, enable
  "react/iframe-missing-sandbox": "off",

  // https://github.com/jsx-eslint/eslint-plugin-react/blob/66b58dd4864678eb869a7bf434c72ff7ac530eb1/docs/rules/no-object-type-as-default-prop.md
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/66b58dd4864678eb869a7bf434c72ff7ac530eb1/docs/rules/no-object-type-as-default-prop.md
  // TODO: semver-major, enable
  "react/no-object-type-as-default-prop": "off",

  // https://github.com/jsx-eslint/eslint-plugin-react/blob/66b58dd4864678eb869a7bf434c72ff7ac530eb1/docs/rules/sort-default-props.md
  // https://github.com/jsx-eslint/eslint-plugin-react/blob/66b58dd4864678eb869a7bf434c72ff7ac530eb1/docs/rules/sort-default-props.md
  // TODO: semver-major, enable?
  // "react/sort-default-props": [
  //   "off",
  //   {
  //     ignoreCase: false
  //   }
  // ]
};

export default config;
