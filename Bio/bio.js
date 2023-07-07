const jsonDataUrl = 'https://romanguyen.github.io/SZU-test-generator/Bio/bio_data.json';
let jsonData = [];
let generatedQuestions = [];
let questionsGenerated = false;
let generateCount = 0;

function fetchJSONData() {
  fetch(jsonDataUrl)
    .then(response => response.json())
    .then(data => {
      jsonData = data;
    })
    .catch(error => {
      console.error('Error fetching JSON data:', error);
    });
}

function generateQuestions(numQuestions) {
  const questionsContainer = document.getElementById('questions-container');
  questionsContainer.innerHTML = ''; // Clear existing questions

  const resultMessage = document.getElementById('result-message');
  resultMessage.style.display = 'none'; // Hide the result message

  const categoryLimits = {
    biológia: 2,
    metabolizmus: 3,
    evolučná: 2,
    ekológia: 3,
    mikrobiológia: 3,
    huby: 2,
    cytológia: 9,
    botanika: 9,
    genetika: 10,
    populačná: 3,
    zoológia: 10,
    histológia: 5,
    tráviaca: 4,
    dýchacia: 1,
    krv: 3,
    obehová: 2,
    vylučovacia: 1,
    nervová: 2,
    hormóny: 2,
    receptory: 2,
    pohlavná: 2
  };

  const categories = Object.keys(categoryLimits);
  const selectedQuestions = [];

  if (generateCount < 10) {
    categories.forEach((category) => {
      const categoryQuestions = jsonData.filter(question => question.Category === category);
      const unusedCategoryQuestions = categoryQuestions.filter(question => !generatedQuestions.includes(question));
      const shuffledCategoryQuestions = shuffleArray(unusedCategoryQuestions);
      const selectedCategoryQuestions = shuffledCategoryQuestions.slice(0, categoryLimits[category]);
      selectedQuestions.push(...selectedCategoryQuestions);
    });
  } else {
    const unusedQuestions = jsonData.filter(question => !generatedQuestions.includes(question));
    const shuffledQuestions = shuffleArray(unusedQuestions);
    selectedQuestions.push(...shuffledQuestions);
  }

  if (selectedQuestions.length === 0) {
    const generateButton = document.getElementById('generate-button');
    generateButton.disabled = true; // Disable the generate button
  
    const messageElement = document.getElementById('message');
    messageElement.textContent = 'No more questions available. Please use the reset button.'; // Display a message to the user
    return;
  }

  const numQuestionsToGenerate = Math.min(numQuestions, selectedQuestions.length);

  for (let i = 0; i < numQuestionsToGenerate; i++) {
    const question = selectedQuestions[i];

    const questionElement = document.createElement('div');
    questionElement.classList.add('question');

    const questionText = document.createElement('p');
    questionText.textContent = question.Question;
    questionElement.appendChild(questionText);

    const shuffledAnswers = shuffleArray(question.Answers);

    shuffledAnswers.forEach((answer) => {
      const answerElement = document.createElement('div');
      answerElement.classList.add('answer');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `answer-${answer.id}`;
      checkbox.classList.add('answer-checkbox');
      answerElement.appendChild(checkbox);

      const symbolElement = document.createElement('span');
      symbolElement.classList.add('answer-symbol');
      answerElement.appendChild(symbolElement);

      const answerText = document.createElement('label');
      answerText.textContent = answer.text;
      answerText.htmlFor = `answer-${answer.id}`;
      answerElement.appendChild(answerText);

      questionElement.appendChild(answerElement);
    });

    questionsContainer.appendChild(questionElement);
    generatedQuestions.push(question); // Add the newly generated question to the generatedQuestions array
  }

  questionsGenerated = true;
}

const generateButton = document.getElementById('generate-button');
generateButton.addEventListener('click', () => {
  const numQuestionsInput = document.getElementById('num-questions');
  const numQuestions = 80;

  questionsGenerated = false; // Reset the questionsGenerated flag

  generateQuestions(numQuestions);
  generateCount++;

  const testNumberElement = document.getElementById('test-number');
  testNumberElement.textContent = `Test Number: ${generateCount}`;
   // Generate new questions based on the category

  if (generateCount === 15) {
    const testNumberElement = document.getElementById('test-number');
    testNumberElement.textContent = '';
    const checkButton = document.getElementById('check-button');
    checkButton.disabled = true;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', () => {
  generatedQuestions = []; // Clear the generated questions
  questionsGenerated = false; // Reset the questionsGenerated flag
  generateCount = 0;

  const testNumberElement = document.getElementById('test-number');
  testNumberElement.textContent = '';

  const generateButton = document.getElementById('generate-button');
    generateButton.disabled = false; // Enable the generate button
  const checkButton = document.getElementById('check-button');
    checkButton.disabled = false;
  const messageElement = document.getElementById('message');
    messageElement.textContent = ''; // Display a message to the user
  
});

const checkButton = document.getElementById('check-button');
checkButton.addEventListener('click', checkAnswers);

window.addEventListener('beforeunload', () => {
  generatedQuestions = []; // Clear the generated questions
});

// Function to shuffle an array using the Fisher-Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getSelectedAnswers(questionIndex) {
  const selectedAnswers = [];
  const checkboxes = document.querySelectorAll(`#questions-container .question:nth-child(${questionIndex + 1}) .answer-checkbox:checked`);

  checkboxes.forEach((checkbox) => {
    const answerId = parseInt(checkbox.id.split('-')[2]);
    selectedAnswers.push(answerId);
  });

  return selectedAnswers;
}

function areArraysEqual(array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }
  return true;
}
function checkAnswers() {
  let numQuestions = 80; // Default number of questions

  if (generateCount === 14) {
    numQuestions = 60; // Adjust the number of questions for test number 14
  }

  const resultMessage = document.getElementById('result-message');

  let totalPoints = numQuestions * 4;
  let earnedPoints = 0;

  for (let i = 0; i < numQuestions; i++) {
    const questionElement = document.querySelector(`#questions-container .question:nth-child(${i + 1})`);
    const answerElements = questionElement.querySelectorAll('.answer');
    let questionPoints = 0; // Points for each question
    let earnedQuestionPoints = 0;

    answerElements.forEach((answerElement) => {
      const checkbox = answerElement.querySelector('.answer-checkbox');
      const answerId = parseInt(checkbox.id.split('-')[1]);

      const symbolElement = answerElement.querySelector('.answer-symbol');

      answerElement.classList.remove('correct', 'wrong');
      symbolElement.textContent = '';

      if (checkbox.checked) {
        const question = jsonData.find((item) => item.Question === questionElement.firstChild.textContent);
        const correctAnswers = question.CorrectAnswers;

        if (correctAnswers.includes(answerId)) {
          answerElement.classList.add('correct');
          symbolElement.textContent = '✓';
          earnedQuestionPoints++;
        } else {
          answerElement.classList.add('wrong');
          symbolElement.textContent = '✕';
        }
      } else {
        const question = jsonData.find((item) => item.Question === questionElement.firstChild.textContent);
        const correctAnswers = question.CorrectAnswers;

        if (correctAnswers.includes(answerId)) {
          answerElement.classList.add('wrong');
          symbolElement.textContent = '✕';
        } else {
          answerElement.classList.add('correct');
          symbolElement.textContent = '✓';
          earnedQuestionPoints++;
        }
      }
    });

    
  questionPoints = earnedQuestionPoints;
  earnedPoints += questionPoints;
}

earnedPoints = Math.min(earnedPoints, totalPoints); // Limit earned points to the total points

resultMessage.textContent = `You got ${earnedPoints} out of ${totalPoints} points.`;
resultMessage.style.display = 'block';
}

fetchJSONData(); // Fetch JSON data