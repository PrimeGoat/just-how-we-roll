
/**********
 * DATA *
 **********/

const sixes = [];
const doubleSixes = [];
const twelves = [];
const twenties = [];


/*******************************************************************
 * METHOD-Y HELPER FUNCTIONS YOUR BACK-END DEV HAS WRITTEN FOR YOU *
 ******************************************************************/


const getRandomNumber = function(max) {
  const rand = Math.random();
  const range = rand * max;
  const result = Math.ceil(range);

  return result;
}

const sortByNumber = function(arr) {
  const byNumber = function(item1, item2) {
    return item1 - item2;
  }

  return arr.slice().sort(byNumber);
}

const getSrc = function(roll, die = true) {
  if(die) {
    return `images/d6/${roll}.png`;
  } else {
    return `images/numbers/${roll}.png`
  }
}

const update = function(selector, type, data) {
  switch(type) {
    case "text":
      type = "innerText";
      break;
  }
  document.querySelector(selector)[type] = data;
}

const addClick = function(selector, func) {
  document.querySelector(selector).addEventListener("click", func);
}

/******************
 * BUTTON QUERIES *
 ******************/
const getButton = function(name) {
  switch(name) {
    case "d6":
      selector = "#d6-roll";
      break;
    case "2d6":
      selector = "main";
      break;
    case "2d6a":
      selector = "#double-d6-roll-1";
      break;
    case "2d6b":
      selector = "#double-d6-roll-2";
      break;
    case "d12":
      selector = "#d12-roll";
      break;
    case "d20":
      selector = "#d20-roll";
      break;
    case "reset":
      selector = "#reset-button";
      break;
  }

  return selector;
  //return document.querySelector(selector);
}


/******************
 * CLICK HANDLERS *
 ******************/
const roll = function(type) {
  let arr;
  let roll;
  let die;
  switch(type) {
    case "d6":
      roll = getRandomNumber(6);
      arr = sixes;
      die = true;
      break;
    case "double-d6":
      roll = getRandomNumber(6);
      arr = doubleSixes;
      die = true;
      break;
    case "d12":
      roll = getRandomNumber(12);
      arr = twelves;
      die = false;
      break;
    case "d20":
      roll = getRandomNumber(20);
      arr = twenties;
      die = false;
      break;
  }

  if(type == "double-d6") {
    update(getButton("2d6a"), "src", getSrc(roll, die));
    let roll2 = getRandomNumber(6);
    update(getButton("2d6b"), "src", getSrc(roll2, die));
    roll += roll2;
  } else {
    update(getButton(type), "src", getSrc(roll, die));
  }
  arr.push(roll);
  update(`#${type}-rolls-mean`, "text", mean(arr));
  update(`#${type}-rolls-median`, "text", median(arr));
  update(`#${type}-rolls-modes`, "text", modes(arr).join(", "));
}

const reset = function() {
  // Reset images
  update("#d6-roll", "src", "images/start/d6.png");
  update("#double-d6-roll-1", "src", "images/start/d6.png")
  update("#double-d6-roll-2", "src", "images/start/d6.png")
  update("#d12-roll", "src", "images/start/d12.jpg");
  update("#d20-roll", "src", "images/start/d20.jpg");

  // Truncate arrays
  sixes.length = 0;
  doubleSixes.length = 0;
  twelves.length = 0;
  twenties.length = 0;

  // Clear stats
  elements = [...document.querySelectorAll("[id $= -mean]"), ...document.querySelectorAll("[id $= -median]"), ...document.querySelectorAll("[id $= -modes]")];

  for(element of elements) {
    element.innerText = "\n";
  }
}

/*******************
 * EVENT LISTENERS *
 *******************/
addClick(getButton("d6"), roll.bind(null, "d6"));
addClick(getButton("2d6"), roll.bind(null, "double-d6"));
addClick(getButton("d12"), roll.bind(null, "d12"));
addClick(getButton("d20"), roll.bind(null, "d20"));
addClick(getButton("reset"), reset);

/****************
 * MATH SECTION *
 ****************/
const mean = function(nums) {
  let out = nums.reduce((total, cur) => (total + cur), 0) / nums.length;
  return String(out).slice(0, 4);
}

const median = function(nums) {
  nums = sortByNumber(nums);
  return (nums.length % 2 == 0) ? (nums[nums.length / 2] + nums[nums.length / 2 - 1]) / 2 : nums[Math.floor(nums.length / 2)];
}

const modes = function(nums) {
  let stats = {};

  // Create stats object with number counts
  for(num of nums) {
    stats[num] = (stats[num] == undefined) ? 1 : stats[num] + 1;
  }

  // Migrate object to array
  let stat = [];
  for(entry in stats) {
    stat.push([entry, stats[entry]]);
  }

  // Sort array greatest to least
  stat.sort((a, b) => b[1] - a[1]);

  // Create array with highest-counting entries
  let modes = [];
  for(let i = 0; i < stat.length; i++) {
    if(stat[i][1] == stat[0][1]) {
      modes.push(stat[i][0]);
    }
  }

  return modes;
}


/********************
* MATH-AREA QUERIES *
********************/

// Add modes
for(element of document.querySelectorAll("[id $= -averages]")) {
  let newElement = document.createElement("h3");
  newElement.innerText = "Modes";
  element.appendChild(newElement);

  newElement = document.createElement("h3");
  let id = element.id.slice(0, element.id.length - 9);
  newElement.innerText = "\n";
  newElement.id = id + "-rolls-modes";
  element.appendChild(newElement);
}