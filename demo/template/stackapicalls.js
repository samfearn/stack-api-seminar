// This software is derived from code released as part of 
// Stack - http://stack.maths.ed.ac.uk/
//
// Stack is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Stack is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// The GNU General Pubnlic License is available from
// <http://www.gnu.org/licenses/>.

const timeOutHandler = new Object();
const inputPrefix = 'stackapi_input_';
const feedbackPrefix = 'stackapi_fb_';
const validationPrefix = 'stackapi_val_';
let xmlfiles = [];

const apiserverurl_ed = "http://stack-api.maths.ed.ac.uk";
const apiserverurl_local = "http://localhost:3080";

const apiserverurl = apiserverurl_local;

const stackstring = {
  "teacheranswershow_mcq":"A correct answer is: {$a->display}",
  "api_which_typed":"which can be typed as follows",
  "api_valid_all_parts":"Please enter valid answers for all parts of the question.",
  "api_out_of":"out of",
  "api_marks_sub":"Marks for this submission",
  "api_submit":"Submit Answers",
  "generalfeedback":"General feedback",
  "score":"Score",
  "api_response":"Response summary",
  "api_correct":"Correct answers"
};

// Create data for call to API.
async function collectData(qid,qidstring) {
  let res = "";

  for (const file of xmlfiles) {
    await getQuestionFile(file,qid).then((response)=>{
      if (response.questionxml != "<quiz>\nnull\n</quiz>") {
        res = {
          questionDefinition: response.questionxml,
          answers: collectAnswer(qidstring),
          seed: response.seed,
          renderInputs: qidstring + inputPrefix,
          readOnly: false,
        };
      };
    });
  }
  return res
}

function createNoXMLAPICall(qid,qidstring,fileURL){
  return {
    xmlURL: fileURL,
    questionId: qid,
    answers: collectAnswer(qidstring),
    renderInputs: qidstring + inputPrefix,
    readOnly: false,
  }
}

// Get the different input elements by tag and return object with values.
function collectAnswer(qidstring) {
  const inputs = document.getElementsByTagName('input');
  const textareas = document.getElementsByTagName('textarea');
  const selects = document.getElementsByTagName('select');
  let res = {};
  res = processNodes(res, inputs, qidstring);
  res = processNodes(res, textareas, qidstring);
  res = processNodes(res, selects, qidstring);
  return res;
}

// Return object of values of valid entries in an HTMLCollection.
function processNodes(res, nodes, qidstring) {
  for (let i = 0; i < nodes.length; i++) {
    const element = nodes[i];
    if (element.name.indexOf(qidstring+inputPrefix) === 0 && element.name.indexOf('_val') === -1) {
      if (element.type === 'checkbox' || element.type === 'radio') {
        if (element.checked) {
          res[element.name.slice((qidstring+inputPrefix).length)] = element.value;
        }
      } else {
        res[element.name.slice((qidstring+inputPrefix).length)] = element.value;
      }
    }
  }
  return res;
}

// Display rendered question and solution.
function send(qid,qidstring) {
  const http = new XMLHttpRequest();
  const url = apiserverurl + '/render';
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/json');
  http.onreadystatechange = function() {
    if(http.readyState == 4) {
      try {
        const json = JSON.parse(http.responseText);
        if (json.message) {
          console.log(json);
          document.getElementById(`${qidstring+"errors"}`).innerText = json.message;
          return;
        } else {
          document.getElementById(`${qidstring+"errors"}`).innerText = '';
        }
        renameIframeHolders();
        let question = json.questionrender;
        const inputs = json.questioninputs;
        let correctAnswers = '';
        // Show correct answers.
        for (const [name, input] of Object.entries(inputs)) {
          question = question.replace(`[[input:${name}]]`, input.render);
          // question = question.replaceAll(`${inputPrefix}`,`${qidstring+inputPrefix}`);
          question = question.replace(`[[validation:${name}]]`, `<span name='${qidstring+validationPrefix + name}'></span>`);
          if (input.samplesolutionrender && name !== 'remember') {
            // Display render of answer and matching user input to produce the answer.
            correctAnswers += `<p>
                  stackstring['teacheranswershow_mcq'] \\[{${input.samplesolutionrender}}\\],
                  stackstring['api_which_typed']: `;
            for (const [name, solution] of Object.entries(input.samplesolution)) {
              if (name.indexOf('_val') === -1) {
                correctAnswers += `<span class='correct-answer'>${solution}</span>`;
              }
            }
            correctAnswers += '.</p>';
          } else if (name !== 'remember') {
            // For dropdowns, radio buttons, etc, only the correct option is displayed.
            for (const solution of Object.values(input.samplesolution)) {
              if (input.configuration.options) {
                correctAnswers += `<p class='correct-answer'>${input.configuration.options[solution]}</p>`;
              }
            }
          }
        }
        // Convert Moodle plot filenames to API filenames.
        for (const [name, file] of Object.entries(json.questionassets)) {
          question = question.replace(name, `plots/${file}`);
          json.questionsamplesolutiontext = json.questionsamplesolutiontext.replace(name, `plots/${file}`);
          correctAnswers = correctAnswers.replace(name, `plots/${file}`);
        }

        question = replaceFeedbackTags(question,qidstring);
        qoutput = document.getElementById(`${qidstring+'output'}`);
        qoutput.innerHTML = question;
        // Only display results sections once question retrieved.
        document.getElementById(`${qidstring+'stackapi_qtext'}`).style.display = 'block';
        document.getElementById(`${qidstring+'stackapi_correct'}`).style.display = 'block';

        // Setup a validation call on inputs. Timeout length is reset if the input is updated
        // before the validation call is made.
        for (const inputName of Object.keys(inputs)) {
          const inputElements = document.querySelectorAll(`[name^=${qidstring+inputPrefix + inputName}]`);
          for (const inputElement of Object.values(inputElements)) {
            inputElement.oninput = (event) => {
              const currentTimeout = timeOutHandler[event.target.id];
              if (currentTimeout) {
                window.clearTimeout(currentTimeout);
              }
              console.log(event.target);
              timeOutHandler[event.target.id] = window.setTimeout(validate.bind(null, event.target,qid,qidstring), 1000);
            };
          }
        }
        let sampleText = json.questionsamplesolutiontext;
        if (sampleText) {
          sampleText = replaceFeedbackTags(sampleText,qidstring);
          document.getElementById(`${qidstring+'generalfeedback'}`).innerHTML = sampleText;
          document.getElementById(`${qidstring+'stackapi_generalfeedback'}`).style.display = 'block';
        } else {
          // If the question is updated, there may no longer be general feedback.
          document.getElementById(`${qidstring+'stackapi_generalfeedback'}`).style.display = 'none';
        }
        document.getElementById(`${qidstring+'stackapi_score'}`).style.display = 'none';
        document.getElementById(`${qidstring+'stackapi_validity'}`).innerText = '';
        const innerFeedback = document.getElementById(`${qidstring+'specificfeedback'}`);
        innerFeedback.innerHTML = '';
        innerFeedback.classList.remove('feedback');
        document.getElementById(`${qidstring+'formatcorrectresponse'}`).innerHTML = correctAnswers;

        // Hide General feedback and correct answers for now
        document.getElementById(`${qidstring+'stackapi_generalfeedback'}`).style.display = 'none';
        document.getElementById(`${qidstring+'stackapi_correct'}`).style.display = 'none';

        createIframes(json.iframes);
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
      }
      catch(e) {
        console.log(e);
        document.getElementById(`${qidstring+'errors'}`).innerText = http.responseText;
        return;
      }
    }
  };
  // let data = createNoXMLAPICall(qid,qidstring,'calc.xml');
  // let submitbutton = document.getElementById(`${qidstring + 'stackapi_qtext'}`).querySelector('input[type="button"]');
  // submitbutton.addEventListener('click', function() {answer(qid,qidstring)});
  // http.send(JSON.stringify(data));
  // let questioncontainer = document.getElementById(`${qidstring+'stack'}`).parentElement;
  // if (questioncontainer.getBoundingClientRect().top<0){
  //   questioncontainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // }
  collectData(qid,qidstring).then((data)=>{
    let submitbutton = document.getElementById(`${qidstring + 'stackapi_qtext'}`).querySelector('input[type="button"]');
    submitbutton.addEventListener('click', function() {answer(qid,qidstring,data.seed)});
    http.send(JSON.stringify(data));
    let questioncontainer = document.getElementById(`${qidstring+'stack'}`).parentElement;
    if (questioncontainer.getBoundingClientRect().top<0){
      questioncontainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
  });
}

// Validate an input. Called a set amount of time after an input is last updated.
function validate(element,qid,qidstring) {
  const http = new XMLHttpRequest();
  const url = apiserverurl + '/validate';
  http.open("POST", url, true);
  // Remove API prefix and subanswer id.
  const answerNamePrefixTrim = (qidstring+inputPrefix).length;
  const answerName = element.name.slice(answerNamePrefixTrim).split('_', 1)[0];
  http.setRequestHeader('Content-Type', 'application/json');
  http.onreadystatechange = function() {
    if(http.readyState == 4) {
      try {
        const json = JSON.parse(http.responseText);
        if (json.message) {
          document.getElementById(`${qidstring+'errors'}`).innerText = json.message;
          return;
        } else {
          document.getElementById(`${qidstring+'errors'}`).innerText = '';
        }
        renameIframeHolders();
        const validationHTML = json.validation;
        const element = document.getElementsByName(`${qidstring+validationPrefix + answerName}`)[0];
        console.log(element);
        element.innerHTML = validationHTML;
        if (validationHTML) {
          element.classList.add('validation');
        } else {
          element.classList.remove('validation');
        }
        createIframes(json.iframes);
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
      }
      catch(e) {
        document.getElementById(`${qidstring+'errors'}`).innerText = http.responseText;
        return;
      }
    }
  };
  collectData(qid,qidstring).then((data)=>{
    data.inputName = answerName;
    http.send(JSON.stringify(data));
  });
}

// Submit answers.
function answer(qid,qidstring,seed) {
  const http = new XMLHttpRequest();
  const url = apiserverurl + '/grade';
  http.open("POST", url, true);

  if (!document.getElementById(`${qidstring+'output'}`).innerText) {
    return;
  }

  http.setRequestHeader('Content-Type', 'application/json');
  http.onreadystatechange = function() {
    if(http.readyState == 4) {
      try {
        const json = JSON.parse(http.responseText);
        if (json.message) {
          document.getElementById(`${qidstring+'errors'}`).innerText = json.message;
          return;
        } else {
          document.getElementById(`${qidstring+'errors'}`).innerText = '';
        }
        if (!json.isgradable) {
          document.getElementById(`${qidstring+'stackapi_validity'}`).innerText
              = stackstring["api_valid_all_parts"];
          return;
        }
        renameIframeHolders();
        document.getElementById(`${qidstring+'score'}`).innerText
            = (json.score * json.scoreweights.total).toFixed(2) + ' ' +
            stackstring["api_out_of"] + ' ' + json.scoreweights.total;
        document.getElementById(`${qidstring+'stackapi_score'}`).style.display = 'block';
        document.getElementById(`${qidstring+'response_summary'}`).innerText = json.responsesummary;

        // Show General feedback and correct answers, hide summary
        document.getElementById(`${qidstring+'stackapi_generalfeedback'}`).style.display = 'block';

        document.getElementById(`${qidstring+'stackapi_summary'}`).style.display = 'none';

        const feedback = json.prts;
        const specificFeedbackElement = document.getElementById(`${qidstring+'specificfeedback'}`);
        // Replace tags and plots in specific feedback and then display.
        if (json.specificfeedback) {
          for (const [name, file] of Object.entries(json.gradingassets)) {
            json.specificfeedback = json.specificfeedback.replace(name, `plots/${file}`);
          }
          json.specificfeedback = replaceFeedbackTags(json.specificfeedback,qidstring);
          specificFeedbackElement.innerHTML = json.specificfeedback;
          specificFeedbackElement.classList.add('feedback');
        } else {
          specificFeedbackElement.classList.remove('feedback');
        }
        // Replace plots in tagged feedback and then display.
        for (let [name, fb] of Object.entries(feedback)) {
          for (const [name, file] of Object.entries(json.gradingassets)) {
            fb = fb.replace(name, `plots/${file}`);
          }
          const elements = document.getElementsByName(`${qidstring+feedbackPrefix + name}`);
          if (elements.length > 0) {
            const element = elements[0];
            if (json.scores[name] !== undefined) {
              fb = fb + `<div>${stackstring['api_marks_sub']}:
                    ${(json.scores[name] * json.scoreweights[name] * json.scoreweights.total).toFixed(2)}
                      / ${(json.scoreweights[name] * json.scoreweights.total).toFixed(2)}.</div>`;
            }
            element.innerHTML = fb;
            // if (fb) {
//                   element.classList.add('feedback');
//                 } else {
//                   element.classList.remove('feedback');
//                 }
          }
        }
        createIframes(json.iframes);
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
      }
      catch(e) {
        console.log(e);
        document.getElementById(`${qidstring+'errors'}`).innerText = http.responseText;
        return;
      }
    }
  };
  // Clear previous answers and score.
  const specificFeedbackElement = document.getElementById(`${qidstring+'specificfeedback'}`);
  specificFeedbackElement.innerHTML = "";
  specificFeedbackElement.classList.remove('feedback');
  document.getElementById(`${qidstring+'response_summary'}`).innerText = "";
  document.getElementById(`${qidstring+'stackapi_summary'}`).style.display = 'none';
  const inputElements = document.querySelectorAll(`[name^=${qidstring+feedbackPrefix}]`);
  for (const inputElement of Object.values(inputElements)) {
    inputElement.innerHTML = "";
    inputElement.classList.remove('feedback');
  }
  document.getElementById(`${qidstring+'stackapi_score'}`).style.display = 'none';
  document.getElementById(`${qidstring+'stackapi_validity'}`).innerText = '';
  collectData(qid,qidstring).then((data)=>{
    data.seed = seed;
    http.send(JSON.stringify(data));
  });
}

// Save contents of question editor locally.
function saveState(key, value) {
  if (typeof(Storage) !== "undefined") {
    localStorage.setItem(key, value);
  }
}

// Load locally stored question on page refresh.
function loadState(key) {
  if (typeof(Storage) !== "undefined") {
    return localStorage.getItem(key) || '';
  }
  return '';
}

function renameIframeHolders() {
  // Each call to STACK restarts numbering of iframe holders so we need to rename
  // any old ones to make sure new iframes end up in the correct place.
  for (const iframe of document.querySelectorAll(`[id^=stack-iframe-holder]:not([id$=old]`)) {
    iframe.id = iframe.id + '_old';
  }
}

function createIframes (iframes) {
  for (const iframe of iframes) {
    create_iframe(...iframe);
  }
}

// Replace feedback tags in some text with an approproately named HTML div.
function replaceFeedbackTags(text,qidstring) {
  let result = text;
  const feedbackTags = text.match(/\[\[feedback:.*\]\]/g);
  if (feedbackTags) {
    for (const tag of feedbackTags) {
      // Part name is between '[[feedback:' and ']]'.
      result = result.replace(tag, `<div name='${qidstring+feedbackPrefix + tag.slice(11, -2)}'></div>`);
    }
  }
  return result;
}

async function getQuestionFile(questionURL,questionName) {
  let res = "";
  if (questionURL) {
    await fetch(questionURL)
        .then(result => result.text())
        .then((result) => {
          res = loadQuestionFromFile(result,questionName);
        });
  }
  return res
}

function loadQuestionFromFile(fileContents,questionName) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(fileContents, "text/xml");

  let thequestion = null;
  let randSeed = "";
  for (const question of xmlDoc.getElementsByTagName("question")) {
    if (question.getAttribute('type').toLowerCase() === 'stack' && question.querySelectorAll("name text")[0].textContent === questionName) {
      thequestion = question.outerHTML;
      let seeds = question.querySelectorAll('deployedseed');
      if (seeds.length>0) {
          randSeed = parseInt(seeds[Math.floor(Math.random()*seeds.length)].textContent);
      }
      else {
          randSeed = '';
      }
      break;
    }
  }
  return {questionxml:setQuestion(thequestion),seed:randSeed};
}

function setQuestion(question) {
  return '<quiz>\n' + question + '\n</quiz>';
}

function createQuestionBlocks() {
  questionBlocks = document.getElementsByClassName("que stack");
  let i=0;

  for (questionblock of questionBlocks){
    i++;
    let questionPrefix = "q"+i.toString()+"_";
    var qidstring = questionblock.dataset.qid;
    questionblock.innerHTML =
        `
                <h2>Try an example question</h2>
                <div class="collapsiblecontent" id=${questionPrefix + "stack"}>
                    <div class="vstack gap-3 ms-3 col-lg-8">
                        <div id=${questionPrefix + "errors"}></div>
                        <div id=${questionPrefix + "stackapi_qtext"} class="col-lg-8" style="display: none">
                          <!--<h2>${stackstring['questiontext']}:</h2>-->
                          <div id=${questionPrefix + "output"} class="formulation"></div>
                          <div id=${questionPrefix + "specificfeedback"}></div>
                          <br>
                          <!-- <input type="button" onclick="answer('${qidstring}','${questionPrefix}')" class="btn btn-primary" value=${stackstring["api_submit"]}/>-->
                          <input type="button" class="btn btn-primary" value=${stackstring["api_submit"]}/>
                          <span id=${questionPrefix + "stackapi_validity"} style="color:darkred"></span>
                        </div>
                        <div id=${questionPrefix + "stackapi_generalfeedback"} class="col-lg-8" style="display: none">
                          <h2>${stackstring['generalfeedback']}:</h2>
                          <div id=${questionPrefix + "generalfeedback"} class="feedback"></div>
                        </div>
                        <h2 id=${questionPrefix + "stackapi_score"} style="display: none">${stackstring['score']}: <span id=${questionPrefix + "score"}></span></h2>
                        <div id=${questionPrefix + "stackapi_summary"} class="col-lg-10" style="display: none">
                          <h2>${stackstring['api_response']}:</h2>
                          <div id=${questionPrefix + "response_summary"} class="feedback"></div>
                        </div>
                        <div id=${questionPrefix + "stackapi_correct"} class="col-lg-10" style="display: none">
                          <h2>${stackstring['api_correct']}:</h2>
                          <div id=${questionPrefix + "formatcorrectresponse"} class="feedback"></div>
                        </div>
                    </div>
                    <div id=${questionPrefix + "newquestionbutton"}>
                      <input type="button" onclick="send('${qidstring}','${questionPrefix}')" class="btn btn-primary" value="Show new example question"/>
                    </div>
                </div>
              `;
  }
}

function addCollapsibles(){
  var collapsibles = document.querySelectorAll(".level2>h2, .stack>h2");
  for (let i=0;i<collapsibles.length;i++) {
    collapsibles[i].addEventListener("click", function(){collapseFunc(this)});
  }
}

function collapseFunc(e){
  e.classList.toggle("collapsed");
}

function stackSetup(files){
  xmlfiles = files;
  createQuestionBlocks();
  addCollapsibles();
}