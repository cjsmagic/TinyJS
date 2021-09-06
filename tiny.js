import * as _ from 'lodash';

export default function Tiny({ state, selector, templates }) {
  const _this = this;
  const parentDom = document.querySelector(selector);
  if (!parentDom) {
    throw new Error('Tiny: selector not found');
  }
  _this.model = state;
  const bindables = {};
  const loopers = {};

  /*
  tiny-bind 
  */
  Array.from(parentDom.querySelectorAll('[tiny-bind]')).forEach(el => {
    const bindKey = el.getAttribute('tiny-bind');
    const value = _.get(_this.model, bindKey);
    if (typeof value !== 'undefined') {
      el.innerText = value;
      bindables[bindKey] = el;
    }
  });

  _this.setState = function(obj) {
    function findAndBind(o, nk) {
      Object.entries(o).forEach(keyValuePair => {
        console.log('running binding');
        const [key, value] = keyValuePair;
        const nestedKey = nk ? `${nk}.${key}` : key;

        if (typeof _this.model[key] !== 'undefined') {
          _this.model[key] = value;
        }
        if (typeof value === 'object' && !Array.isArray(value)) {
          findAndBind(value, nestedKey);
        } else if (
          typeof bindables[nestedKey] !== 'undefined' &&
          bindables[nestedKey].innerText !== value
        ) {
          bindables[nestedKey].innerText = value;
        } else if (typeof loopers[nestedKey] !== 'undefined') {
          _updateLoopers(nestedKey);
        }
      });
    }
    findAndBind(obj);
  };

  /*
  tiny-loop 
  */
  function _updateLoopers(key) {
    const value = _.get(_this.model, key);
    const { templateId, parent } = loopers[key];
    const domParser = new DOMParser();
    parent.innerHTML = '';
    value.forEach(item => {
      const node = domParser.parseFromString(
        templates[templateId](item),
        'text/html'
      ).body.childNodes[0];
      parent.appendChild(node);
    });
  }
  Array.from(parentDom.querySelectorAll('[tiny-loop]')).forEach(el => {
    const bindExpression = el.getAttribute('tiny-loop');
    const { 0: key, 2: templateId } = bindExpression.split(' ');
    loopers[key] = { templateId, parent: el };
    _updateLoopers(key);
  });
}
