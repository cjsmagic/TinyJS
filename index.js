// Import stylesheets
import './style.css';
import * as _ from 'lodash';

// Write Javascript code!

const person = {
  name: 'clarence',
  gender: 'M',
  score: 0,
  address: {
    city: 'mangalore',
    languages: ['Hindi', 'Kannada', 'Tulu', 'Konkani', 'English']
  }
};

function Tiny({ state, selector, templates }) {
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
}

const view = new Tiny({
  state: person,
  selector: '#app',
  templates: {
    langTemplate: item => `<div>${item}</div>`
  }
});

const { model, setState } = view;

document.getElementById('increament-btn').addEventListener('click', function() {
  const score = model.score + 1;
  setState({
    score,
    address: {
      city: 'Bangalore',
      internal: {
        score
      },
      languages: ['Hindi', 'Kannada', 'Tulu', 'Konkani', 'English', 'french']
    }
  });
});
