// Import stylesheets
import './style.css';
import Tiny from './tiny';
// Write Javascript code!

const person = {
  name: 'clarence',
  gender: 'M',
  score: 0,
  address: {
    city: 'mangalore',
    languages: ['Hindi', 'Kannada', 'Tulu', 'Konkani', 'English']
  },
  numbers: []
};

const view = new Tiny({
  state: person,
  selector: '#app',
  templates: {
    langTemplate: item => `<div>${item}</div>`,
    numberTemplate: item => `<div>${item}</div>`
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
    },
    numbers: [...model.numbers, score]
  });
});
