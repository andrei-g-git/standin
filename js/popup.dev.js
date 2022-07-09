"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

document.addEventListener('DOMContentLoaded', init);

function init() {
  getDataFromStorage(chrome, "popupDomains").then(function (data) {
    var popupDomains = data["popupDomains"];
    var justDomainGroupArrays = popupDomains.map(function (group) {
      return group.domains;
    });
    var justGroupNames = popupDomains.map(function (group) {
      return group.group;
    });
    var dropdownContainer = document.getElementById("dropdown-container");
    populateDropdownContainer(justDomainGroupArrays, justGroupNames, document, dropdownContainer, chrome, createDropdownAndLabel, createOption, updateStorageOnChange, setSelectedOptions); // let buttonContainer = document.getElementById("standin-button-container");
    // populateSwitchButtonContainer(
    //     buttonContainer, 
    //     "selectedStandins", 
    //     popupDomains, 
    //     chrome, 
    //     document, 
    //     createSwitchButton
    // );       
  });
  var optionsButton = document.getElementById("options-button");

  if (optionsButton) {
    optionsButton.addEventListener("click", function () {
      chrome.tabs.create({
        url: "options.html"
      }, function () {
        return console.log("options page should open");
      });
    });
  }
}

function populateSwitchButtonContainer(buttonContainer, selectedStandinsKey, popupDomains, browser, doc, createSwitchButton) {
  if (buttonContainer) {
    browser.storage.local.get([selectedStandinsKey], function (data) {
      var selectedStandins = data[selectedStandinsKey];
      console.log(JSON.stringify(selectedStandins));

      var _loop = function _loop(i) {
        var standin = selectedStandins[i].standin;
        var groupName = selectedStandins[i].handle;
        var domains = popupDomains[i].domains; //assume that the standin and popupDomain arrays are 1:1, probably a bad idea...

        var buttonWrapper = createSwitchButton(doc, groupName); //I should pass these as callbacks

        var button = buttonWrapper.getElementsByTagName("button")[0];
        buttonContainer.appendChild(buttonWrapper);
        button.addEventListener("click", function (event) {
          var abc = 123;
          createStandinUrl(browser, standin, domains).then(function (newUrl) {
            if (newUrl) {
              browser.tabs.create({
                url: newUrl
              });
            }
          });
        });
      };

      for (var i = 0; i < selectedStandins.length; i++) {
        _loop(i);
      }
    });
  } else {
    console.log("the standin button container has not yet loaded into the document");
  }
}

function createSwitchButton(doc, groupName) {
  console.log("GROUP HANDLE:   " + groupName);
  var buttonWrapper = doc.createElement("div");
  buttonWrapper.setAttribute("class", "switch-site-button");
  buttonWrapper.setAttribute("id", groupName + "-standin-button");
  var icon = doc.createElement("img");
  icon.setAttribute("src", "assets/".concat(groupName, "Standin.png"));
  icon.setAttribute("alt", "btn");
  var button = doc.createElement("button");
  buttonWrapper.appendChild(icon);
  buttonWrapper.appendChild(button);
  return buttonWrapper;
}

function createStandinUrl(browser, standin, domains) {
  return regeneratorRuntime.async(function createStandinUrl$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", new Promise(function (resolve) {
            browser.tabs.query({
              active: true,
              currentWindow: true
            }, function (allTabs) {
              var url = allTabs[0].url;
              var protocol = url.slice(0, 8);

              if (protocol === "https://") {
                var withoutProtocolAndWWW = url.replace(protocol, "").replace("www.", "");
                var slashPos = withoutProtocolAndWWW.indexOf("/");
                var domainName = withoutProtocolAndWWW.slice(0, slashPos);
                console.log("without protocol and www:   " + withoutProtocolAndWWW + "\n" + "slashPos:    " + slashPos + "\n" + "domain name:   " + domainName);

                if (domainName && domainName.length) {
                  var validDomains = domains.filter(function (domain) {
                    return domain.includes(domainName);
                  });
                  console.log("valid domains:   " + validDomains);

                  if (validDomains.length) {
                    var path = withoutProtocolAndWWW.slice(slashPos);
                    var fullStandinUrl = "https://" + standin + path;
                    console.log("full standin url:    " + fullStandinUrl);
                    resolve(fullStandinUrl);
                  }
                }
              }
            });
          }));

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
}

function getDataFromStorage(browser) {
  var _len,
      keys,
      _key,
      _args2 = arguments;

  return regeneratorRuntime.async(function getDataFromStorage$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          for (_len = _args2.length, keys = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            keys[_key - 1] = _args2[_key];
          }

          return _context2.abrupt("return", new Promise(function (resolve, reject) {
            browser.storage.local.get([].concat(keys), function (data) {
              resolve(data);
            });
          }));

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function setDefaultStandinDomain(dropdown, key, defaultDomain) {
  return regeneratorRuntime.async(function setDefaultStandinDomain$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", new Promise(function (resolve, reject) {
            chrome.storage.local.get([key], function (data) {
              if (!data[key] || !data[key].length) {
                chrome.storage.local.set(_defineProperty({}, key, defaultDomain));
                dropdown.value = defaultDomain;
              } else {
                dropdown.value = data[key];
              }

              if (!data) reject();
            });
            resolve(dropdown.value);
          }));

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function updateStorageOnChange(dropdown, key, groupHandle) {
  //on fresh install this promise might fail 
  dropdown.addEventListener("change", function _callee(event) {
    return regeneratorRuntime.async(function _callee$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt("return", new Promise(function (resolve, reject) {
              //so there's no point returning a promise here, I don't know how to capture the promise since the anonymous function returns it, not updateStorageOnChange -- I can't call .then() on the latter
              chrome.storage.local.get([key], function (data) {
                var selectedStandins = data[key];

                for (var i = 0; i < selectedStandins.length; i++) {
                  console.log(selectedStandins[i].standin);

                  if (selectedStandins[i].handle === groupHandle) {
                    selectedStandins[i].standin = event.target.value;
                  }
                }

                chrome.storage.local.set({
                  selectedStandins: selectedStandins
                }, function (data) {
                  resolve(data[key]);
                });
              });
            }));

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    });
  });
}

function populateDropdownContainer(popupDomains, groupNames, doc, dropdownContainer, browser, createDropdownAndLabelCallback, createOptionCallback, updateStorageOnChangeCallback, setSelectedOptionsCallback) {
  groupNames.forEach(function (groupName, index) {
    var domains = popupDomains[index];
    var dropdownId = groupName + "-dropdown";
    var dropdownAndLabel = createDropdownAndLabelCallback(dropdownId, groupName, domains, doc, createOptionCallback, updateStorageOnChangeCallback, setSelectedOptionsCallback, browser);
    dropdownContainer.appendChild(dropdownAndLabel);
  });
}

function createDropdownAndLabel(id, name, domains, doc, createOption, updateStorageOnChangeCallback, setSelectedOptionsCallback, browser) {
  //no label, labels aren't trendy
  var dropdown = doc.createElement("select");
  dropdown.setAttribute("id", id);
  dropdown.setAttribute("class", "dropdown");
  updateStorageOnChangeCallback(dropdown, "selectedStandins", name);
  domains.forEach(function (domain) {
    var domainName = domain.replace("https://", "").replace("www.", "");
    var option = createOption(domainName, doc);
    dropdown.appendChild(option);
  }); //new

  var standinButton = createSwitchButton(doc, name);
  var dropdownAndLabel = doc.createElement("div");
  dropdownAndLabel.setAttribute("class", "dropdown-and-label"); //this is just a wrapper for the dropdown so I can remove it's default stylings

  dropdownAndLabel.appendChild(dropdown); //new

  var container = doc.createElement("div");
  container.setAttribute("class", "dropdown-and-label-container");
  container.appendChild(dropdownAndLabel);
  container.appendChild(standinButton); //no bueno

  getDataFromStorage(chrome, "selectedStandins").then(function (data) {
    var selectedStandins = data["selectedStandins"];
    var standinObject = selectedStandins.filter(function (standinObject) {
      return standinObject.handle === name;
    })[0];
    var standin = standinObject.standin;
    standinButton.addEventListener("click", function (event) {
      createStandinUrl(browser, standin, domains).then(function (newUrl) {
        if (newUrl) {
          browser.tabs.create({
            url: newUrl
          });
        }
      });
    });
  });
  setSelectedOptionsCallback("selectedStandins", name, dropdown, browser); //return dropdownAndLabel;

  return container;
}

function createOption(value, doc) {
  var option = doc.createElement("option");
  option.setAttribute("class", "dropdown-option");
  option.setAttribute("value", value); //option.innerHTML = value;

  option.appendChild(doc.createTextNode(value)); //mozilla doesn't like assigning directly to innerhtml, security issues etc

  return option;
}

function setSelectedOptions(key, domainHandle, dropdown, browser) {
  browser.storage.local.get([key], function (data) {
    var selectedStandins = data[key];
    selectedStandins.forEach(function (standinObject) {
      if (standinObject.handle === domainHandle) {
        var standin = standinObject.standin;
        var optionsArray = Array.from(dropdown.options);

        for (var i = 0; i < optionsArray.length; i++) {
          var option = optionsArray[i];

          if (option.innerHTML.includes(standin)) {
            dropdown.selectedIndex = i;
          }
        }
      }
    });
  });
}