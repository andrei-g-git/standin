"use strict";

document.addEventListener("DOMContentLoaded", init);
var groupLabelSuffix = " standins";

function init() {
  var checkboxContainer = document.getElementById("checkbox-container");

  if (checkboxContainer) {
    getDataFromStorage3(chrome, "supportedDomains", "popupDomains").then(function (data) {
      var domainGroups = data["supportedDomains"];
      var groupsWithDefaultDomains = data["popupDomains"];

      if (domainGroups.length) {
        var groupNames = domainGroups.map(function (group) {
          return group.group;
        });
        var domains = domainGroups.map(function (group) {
          return group.domains;
        });
        var defaultDomains = groupsWithDefaultDomains.map(function (group) {
          return group.domains;
        });
        createCheckboxGroups(document, checkboxContainer, domains, defaultDomains, groupNames);
      } else {
        console.log("did not yet load domains");
      }

      handleAllCheckboxGroups(document, "checkbox-and-label", handleCheckbox);
    })["catch"](function (err) {
      return console.error(err);
    });
  }
}

function createCheckboxGroups(doc, parent, domainGroups, defaultDomainGroup, domainGroupNames) {
  domainGroups.forEach(function (domainGroup, index) {
    var checkboxGroup = doc.createElement("div");
    checkboxGroup.setAttribute("class", "checkbox-group");
    checkboxGroup.setAttribute("value", domainGroupNames[index]);
    checkboxGroup.setAttribute("name", domainGroupNames[index]);
    checkboxGroup = populateCheckboxGroup(doc, checkboxGroup, domainGroup, defaultDomainGroup, index);
    var groupLabel = doc.createElement("label");
    groupLabel.setAttribute("class", "checkbox-group-label");
    groupLabel.setAttribute("for", domainGroupNames[index]);
    groupLabel.setAttribute("value", domainGroupNames[index]); //groupLabel.innerHTML = domainGroupNames[index] + groupLabelSuffix;

    groupLabel.appendChild(doc.createTextNode(domainGroupNames[index] + groupLabelSuffix)); //there are excurity issues with assigning directly to the innerhtml, apparently

    var groupWithLabel = doc.createElement("div");
    groupWithLabel.setAttribute("class", "checkbox-group-and-label");
    groupWithLabel.appendChild(groupLabel);
    groupWithLabel.appendChild(checkboxGroup);
    parent.appendChild(groupWithLabel);
  });
}

function populateCheckboxGroup(doc, checkboxGroup, domainGroup, defaultDomainGroup, groupIndex) {
  for (var i = 0; i < domainGroup.length; i++) {
    checkboxGroup.appendChild(createCheckbox(doc, domainGroup[i], i, groupIndex, defaultDomainGroup
    /* [i] */
    ));
  }

  return checkboxGroup;
}

function createCheckbox(doc, domain, index, groupIndex, defaultDomainGroupS) {
  var checkbox = doc.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("class", "domain-checkbox");
  checkbox.setAttribute("name", "checbox-" + groupIndex + "-" + index);
  checkbox.setAttribute("id", "checbox-" + groupIndex + "-" + index);
  var label = doc.createElement("label");
  label.setAttribute("class", "domain-label");
  label.setAttribute("for", "checbox-" + groupIndex + "-" + index); //label.innerHTML = domain;

  label.appendChild(doc.createTextNode(domain));
  var checkboxAndLabel = doc.createElement("div");
  checkboxAndLabel.setAttribute("class", "checkbox-and-label");
  checkboxAndLabel.setAttribute("id", "checkbox-and-label-" + groupIndex + "-" + index);
  defaultDomainGroupS.forEach(function (group, index) {
    console.log(index);
    console.log(group);
    console.log(domain);

    if (group.includes(domain)) {
      console.log("included");
      checkbox.checked = true;
    }
  });
  checkboxAndLabel.appendChild(checkbox);
  checkboxAndLabel.appendChild(label);
  return checkboxAndLabel;
}

function handleCheckbox(checkboxAndLabel) {
  var checkboxGroup = checkboxAndLabel.parentNode;
  var groupWithLabel = checkboxGroup.parentNode;
  var groupLabel = groupWithLabel.getElementsByTagName("label")[0];
  var label = checkboxAndLabel.getElementsByTagName("label")[0];
  var checkbox = checkboxAndLabel.getElementsByTagName("input")[0];
  checkbox.addEventListener("change", function (event) {
    console.log(groupLabel.innerHTML);
    getDataFromStorage3(chrome, "popupDomains") //setting the browser from here goes against functional programming...
    .then(function (data) {
      var popupDomains = data["popupDomains"];
      var newPopupDomains = null;

      if (event.target.checked) {
        var groupLabelText = groupLabel.innerHTML.replace(groupLabelSuffix, "");
        console.log("group label text without suffix:     " + groupLabelText);
        newPopupDomains = addPopupDomain(popupDomains, label.innerHTML, groupLabelText);
        console.log("true: " + label.innerHTML);
      } else {
        newPopupDomains = removePopupDomain(popupDomains, label.innerHTML);
        console.log("false: " + label.innerHTML);
        console.log(JSON.stringify(newPopupDomains));
      }

      storeDataToStorage(chrome, {
        popupDomains: newPopupDomains
      });
    });
  });
}

function handleAllCheckboxGroups(doc, className, handleCheckboxCallback) {
  var checkboxGroups = doc.getElementsByClassName(className);

  for (var i = 0; i < checkboxGroups.length; i++) {
    handleCheckboxCallback(checkboxGroups[i]);
  }
}

function getDataFromStorage3(browser) {
  var _len,
      keys,
      _key,
      _args = arguments;

  return regeneratorRuntime.async(function getDataFromStorage3$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          for (_len = _args.length, keys = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            keys[_key - 1] = _args[_key];
          }

          return _context.abrupt("return", new Promise(function (resolve, reject) {
            browser.storage.local.get([].concat(keys), function (data) {
              resolve(data);
            });
          }));

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
}

function storeDataToStorage(browser, data) {
  return regeneratorRuntime.async(function storeDataToStorage$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", new Promise(function (resolve, reject) {
            browser.storage.local.set(data, function () {
              resolve("sent");
            });
          }));

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function addPopupDomain(popupDomains, domain, domainGroupName) {
  //mucho repeato
  popupDomains.forEach(function (group) {
    var groupHandle = group.group;
    var realAltGroup = group.domains;

    if (groupHandle === domainGroupName) {
      if (realAltGroup.length && !realAltGroup.includes(domain)) {
        realAltGroup.push(domain);
      }
    }
  });
  return popupDomains;
}

function removePopupDomain(popupDomains, domain) {
  popupDomains.forEach(function (group) {
    var realAltGroup = group.domains;

    if (realAltGroup.length && realAltGroup.includes(domain)) {
      realAltGroup.splice(realAltGroup.indexOf(domain), 1);
    }
  });
  return popupDomains;
}