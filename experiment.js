// Stroop task: respond with the INK colour of the word.
const jsPsych = initJsPsych({
  on_finish: () => jsPsych.data.displayData(),
});

const colors = [
  { name: '赤', css: 'red', key: 'r' },
  { name: '青', css: 'blue', key: 'b' },
  { name: '緑', css: 'green', key: 'g' },
];

const stimuli = [];
for (const word of colors) {
  for (const ink of colors) {
    stimuli.push({
      stimulus: `<p style="font-size:64px;color:${ink.css}">${word.name}</p>`,
      correct_response: ink.key,
      congruent: word === ink,
    });
  }
}

const instructions = {
  type: jsPsychInstructions,
  pages: [
    '文字の「色」に注目して、できるだけ速く正確にキーを押してください。<br>' +
      '赤: R キー / 青: B キー / 緑: G キー',
  ],
  show_clickable_nav: true,
  button_label_next: '開始',
};

const trial = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: jsPsych.timelineVariable('stimulus'),
  choices: colors.map((c) => c.key),
  data: {
    correct_response: jsPsych.timelineVariable('correct_response'),
    congruent: jsPsych.timelineVariable('congruent'),
  },
  on_finish: (data) => {
    data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
  },
};

const fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p style="font-size:48px">+</p>',
  choices: 'NO_KEYS',
  trial_duration: 500,
};

const block = {
  timeline: [fixation, trial],
  timeline_variables: stimuli,
  randomize_order: true,
  repetitions: 3,
};

jsPsych.run([instructions, block]);
