// +element+: html::element; Page element
// +location+: string; The name of the key to save under
// +value+: string; The value to save under the given key
// save_options is a function that takes in an html element, location string, and value string
// to save the value to the location
function save_options(element, location, value) {
  var save = {}
  save[location] = value
  chrome.storage.sync.set(save, function() {
    for (i = 0; i <  selectorList.length; i++) {
      removeClass(selectorList[i], 'selected');
    }
    addClass(element, 'selected');
    document.getElementById("webpage_diagram_placeholder").className = element.getAttribute("data-icon-class");
    var status = document.getElementById('status');
    addClass(status, 'updated');
    setTimeout(function() {
      removeClass(status, 'updated');
    }, 1250);
  });

}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    search_engine: 'Google.com'
  }, function(items) {
    for (i = 0; i <  selectorList.length; i++) {
      if (selectorList[i].getAttribute('value') == items.search_engine) {
        addClass(selectorList[i], 'selected');
        document.getElementById("webpage_diagram_placeholder").className = selectorList[i].getAttribute("data-icon-class");
      } else {
        removeClass(selectorList[i], 'selected');
      }
    }
  });
}

//Parses arguments from URL
function getURLVariable(variable){
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}

var selectorList = document.getElementsByClassName('selector');

document.addEventListener('DOMContentLoaded', restore_options);

if (getURLVariable("newinstall") == "yes"){
  var installadvice = document.getElementById('installadvice');
  addClass(installadvice, 'visible');
}


for (i = 0; i <  selectorList.length; i++) {
  selectorList[i].addEventListener('click', function() {
    save_options(this, 'search_engine', this.getAttribute('value'))
  });
  selectorList[i].addEventListener('mouseover', function() {
    handleMouseover(this);
  });
  selectorList[i].addEventListener('mouseleave', function() {
    //handleMouseout(this);
  })
}

document.getElementById('custom_engine_update').addEventListener('click', function() {
  handleUpdateEngine(document.getElementById('custom_engine'));
})

document.getElementById('additional-settings-toggle').addEventListener('click', function() {
  var settingsPane = document.getElementById('expandable_settings_pane');
  if (settingsPane.className.search('open') >= 0) {
    removeClass(settingsPane, 'open');
  } else {
    addClass(settingsPane, 'open');
  }
})

function handleMouseover(element) {
  selectedElements = document.getElementsByClassName('selected');
  for (i = 0; i <  selectedElements.length; i++) {
    removeClass(selectedElements[i], 'selected');
  }
  addClass(element, 'selected');
}

function handleMouseout(element) {
  removeClass(element, 'selected');
  restore_options();
}

function handleUpdateEngine(element) {
  engine = element.value
  //Insert code here to update engine
}

function addClass(element, classNameToAdd) {
  if (!element.className.includes(classNameToAdd)) {
    element.className = element.className + ' ' + classNameToAdd;
  }
}


function removeClass(element, classNameToRemove) {
  if(element.className.search(' ' + classNameToRemove)) {
    element.className = element.className.replace(' ' + classNameToRemove, '');
  } else {
    element.className = element.className.replace(classNameToRemove, '');
  }
}