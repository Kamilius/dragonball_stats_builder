var LEVEL_CAP = 80,
    LEVEL = 1,
    POINTS_PER_LEVEL = 3,
    TOTAL_POINTS = LEVEL * POINTS_PER_LEVEL,
    POINTS_DESTRIBUTED = 0,
    RACE = "majin",
    GENDER = "male",
    CHANGE_TIMER,
    //stats taken from here:
    //http://www.tentonhammer.com/guides/dragonball-z-xenoverse/dragonball-z-xenoverse-stat-and-race-guide
    DEFAULT_ATTRIBUTES = {
      'majin': {
        'male': {
          'hea': 8,
          'ki': 25,
          'stm': 25,
          'atk': 5,
          'str': 5,
          'bla': 8
        },
        'female': {
          'hea': 8,
          'ki': 25,
          'stm': 25,
          'atk': 5,
          'str': 5,
          'bla': 8
        }
      },
      'saiyan': {
        'male': {
          'hea': 8,
          'ki': 25,
          'stm': 25,
          'atk': 5,
          'str': 5,
          'bla': 8
        },
        'female': {
          'hea': 8,
          'ki': 25,
          'stm': 25,
          'atk': 5,
          'str': 5,
          'bla': 8
        }
      },
      'earthling': {
        'male': {
          'hea': 8,
          'ki': 25,
          'stm': 25,
          'atk': 5,
          'str': 5,
          'bla': 8
        },
        'female': {
          'hea': 8,
          'ki': 25,
          'stm': 25,
          'atk': 5,
          'str': 5,
          'bla': 8
        }
      },
      'namekian': {
        'male': {
          'hea': 8,
          'ki': 25,
          'stm': 25,
          'atk': 5,
          'str': 5,
          'bla': 8
        }
      },
      'frieza': {
        'male': {
          'hea': 25,
          'ki': 0,
          'stm': 0,
          'atk': 0,
          'str': 0,
          'bla': 0
        }
      }
    },
    CUSTOM_ATTRIBUTES = {
      'hea': 0,
      'ki': 0,
      'stm': 0,
      'atk': 0,
      'str': 0,
      'bla': 0
    };

//123 = distance from center of graph to atribute corner
//125 = max possible value for each attribute
function getAttributeGraphRatio(attribute) {
  return 123 / 125 * attribute;
}

function Point(x, y) {
  this.x = x;
  this.y = y;
}

function drawBackground(ctx, attributeCoordinates) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(attributeCoordinates['hea'].x, attributeCoordinates['hea'].y);
    ctx.lineTo(attributeCoordinates['ki'].x, attributeCoordinates['ki'].y);
    ctx.lineTo(attributeCoordinates['stm'].x, attributeCoordinates['stm'].y);
    ctx.lineTo(attributeCoordinates['atk'].x, attributeCoordinates['atk'].y);
    ctx.lineTo(attributeCoordinates['str'].x, attributeCoordinates['str'].y);
    ctx.lineTo(attributeCoordinates['bla'].x, attributeCoordinates['bla'].y);
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = "#9FA498";
    ctx.beginPath();
    ctx.moveTo(attributeCoordinates['hea'].x, attributeCoordinates['hea'].y);
    ctx.lineTo(attributeCoordinates['atk'].x, attributeCoordinates['atk'].y);

    ctx.moveTo(attributeCoordinates['ki'].x, attributeCoordinates['ki'].y);
    ctx.lineTo(attributeCoordinates['str'].x, attributeCoordinates['str'].y);

    ctx.moveTo(attributeCoordinates['stm'].x, attributeCoordinates['stm'].y);
    ctx.lineTo(attributeCoordinates['bla'].x, attributeCoordinates['bla'].y);
    ctx.closePath();

    ctx.stroke();
}

function getAttributeCoordinates(attr, attributeCoordinates) {
  var attrLabelPoint = attributeCoordinates[attr],
      centerPoint = attributeCoordinates['center'],
      attrX, attrY,
      defAttrValue = getAttributeGraphRatio(DEFAULT_ATTRIBUTES[RACE][GENDER][attr]),
      customAttrValue = getAttributeGraphRatio(CUSTOM_ATTRIBUTES[attr]);

  var distance = Math.sqrt(Math.pow(attrLabelPoint.x - centerPoint.x, 2) + Math.pow(attrLabelPoint.y - centerPoint.y, 2));
  var ratio = (defAttrValue + customAttrValue) / distance;

  attrX = ratio * attrLabelPoint.x + (1 - ratio) * centerPoint.x;
  attrY = ratio * attrLabelPoint.y + (1 - ratio) * centerPoint.y;

  console.log("Distance: %d, Ratio: %d, X: %d, Y: %d", distance, ratio, attrX, attrY);

  return new Point(attrX, attrY);
}

function drawAttributes(ctx, attributeCoordinates) {
  var curAttrPoint,
      heaAttrPoint = getAttributeCoordinates('hea', attributeCoordinates);

  ctx.strokeStyle = "#325D9B";
  ctx.strokeWidth = 2;
  ctx.fillStyle = "rgba(36, 161, 230, 0.8)";

  ctx.beginPath();
  ctx.moveTo(heaAttrPoint.x, heaAttrPoint.y);
  for(var s in DEFAULT_ATTRIBUTES[RACE][GENDER]) {
    if(s != 'hea') {
      curAttrPoint = getAttributeCoordinates(s, attributeCoordinates);
      ctx.lineTo(curAttrPoint.x, curAttrPoint.y);
    }
  }
  ctx.fill();
  ctx.closePath();
  ctx.stroke();
}

document.addEventListener("DOMContentLoaded", function() {
  var canvas = document.getElementById("attributes"),
      ctx = canvas.getContext('2d'),
      canvasWidth = canvas.width,
      canvasHeight = canvas.height;

  var attributeCoordinates = {
    'center': new Point(canvasWidth/2, canvasHeight/2),
    'hea': new Point(canvasWidth/2, 2),
    'ki': new Point(canvasWidth - 19, canvasHeight * 0.25),
    'stm': new Point(canvasWidth - 19, canvasHeight * 0.75),
    'atk': new Point(canvasWidth/2, canvasHeight - 2),
    'str': new Point(19, canvasHeight * 0.75),
    'bla': new Point(19, canvasHeight * 0.25)
  };

  var $raceSelect = document.querySelector('.race-select'),
      $genderSelect = document.querySelector('.gender-select'),
      $levelInput = document.querySelector('.level-input'),
      $attributesList = document.getElementById('attributes-list'),
      $attributeItems = document.querySelectorAll('.attribute-item'),
      $pointsToSpend = document.querySelector('.points-to-spend');

  function refreshAttributesGraph() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawBackground(ctx, attributeCoordinates);
    drawAttributes(ctx, attributeCoordinates);
  }

  function getPointsToSpendValue() {
    return LEVEL * POINTS_PER_LEVEL - POINTS_DESTRIBUTED;
  }

  function refreshPointsToSpend() {
    POINTS_DESTRIBUTED = 0;

    [].forEach.call(document.querySelectorAll('.attribute-item'), function(item) {
      POINTS_DESTRIBUTED += parseInt(item.value);
    });

    $pointsToSpend.innerHTML = getPointsToSpendValue();
  }

  function validateAndReturnNumber(value, min, max) {
    value = parseInt(value) || 0;

    if(value <= min || value >= max) {
      value = value <= min ? min : max;
    }

    return value;
  }

  function clearChangeTimer() {
      clearTimeout(CHANGE_TIMER);
  }

  function setChangeTimer($element) {
    clearChangeTimer();

    CHANGE_TIMER = setTimeout(function() {
      //curently works only for "LEVEL" input only
      $element.onchange({target: $element});
    }, 1000);
  }

  function startChangeTimerOnKeypress(event) {
    setChangeTimer(event.target);
  }

  refreshAttributesGraph();
  refreshPointsToSpend();

  $raceSelect.onchange = function() {
    RACE = this.value;

    switch(RACE) {
      case 'namekian':
      case 'frieza':
        GENDER = 'male';
        $genderSelect.selectedIndex = 0;
        $genderSelect.setAttribute('disabled', true);
        break;
      default:
        $genderSelect.removeAttribute('disabled');
        break;
    }

    refreshAttributesGraph();
  };

  $genderSelect.onchange = function() {
    GENDER = this.value;
    refreshAttributesGraph();
  };

  $levelInput.onchange = function(event) {
    var $target = event.target;

    LEVEL = validateAndReturnNumber($target.value, 1, 80);
    $target.value = LEVEL;

    refreshPointsToSpend();
  };

  $attributesList.onchange = function(event) {
    var $target = event.target,
        value;
    if($target.classList.contains('attribute-item')) {
      value = validateAndReturnNumber($target.value, 0, 100);

      if (getPointsToSpendValue() - value < 0) {
        value = CUSTOM_ATTRIBUTES[$target.dataset.attribute];
      } else {
        CUSTOM_ATTRIBUTES[$target.dataset.attribute] = value;
      }

      $target.value = value;
      refreshAttributesGraph();
      refreshPointsToSpend();
    }
  };

  $attributesList.onkeypress = function(event) {
    var $target = event.target,
        $attrList = event.currentTarget;

    if($target.classList.contains('attribute-item')) {
      clearChangeTimer();

      CHANGE_TIMER = setTimeout(function() {
        //curently works only for "LEVEL" input only
        $attrList.onchange({target: $target});
      }, 1000);
    }
  };

  $attributesList.onfocusout = function(event) {
    var $target = event.currentTarget;

    if($target.classList.contains('attribute-item')) {
      clearChangeTimer();
    }
  };

  $levelInput.onkeypress = startChangeTimerOnKeypress;
  $levelInput.onfocusout = clearChangeTimer;
});
