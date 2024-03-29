// pull in flattenDeep from lodash, which will recursively flattens array
const _ = require('lodash');

const appendIfNotEmpty = (value, arr) => {
  return value && value.length ? [...arr, value] : arr;
};

const getClassNamesForProp = (value, currentProp) => {
  if (Array.isArray(value)) {
    return value.reduce(
      (results, item) =>
        appendIfNotEmpty(getClassNamesForProp(item, currentProp), results),
      [],
    );
  } else if (value instanceof Function) {
    return getClassNamesForProp(value(currentProp));
  }

  return value === true ? currentProp.name : value;
};

const $classNames = (defaultClassName = null) => {
  const props = this.$props;
  const propOptions = this.$options.props;

  if (!propOptions) {
    return null;
  }

  if (!this.$_classNames) {
    this.$_classNames = Object.entries(propOptions).reduce(
      (result, [propName, options]) => {
        const { className } = options;
        const propValue = !!props[propName];

        if (!className || !propValue) {
          return result;
        }

        return appendIfNotEmpty(
          getClassNamesForProp(className, {
            props,
            name: propName,
            value: propValue,
          }),
          result,
        );
      },
      [],
    );
  }

  return this.$_classNames.length
    ? _.flattenDeep(this.$_classNames)
    : defaultClassName;
};

const mixin = {
  methods: { $classNames },
};

module.exports = {
  install: Vue => Vue.mixin(mixin),
  mixin,
};
