"use strict";

var allSelected = {
  selectedStandins: [{
    standin: "youtube.com",
    handle: "youtube" //these are constant

  }, {
    standin: "twitter.com",
    handle: "twitter"
  }, {
    standin: "reddit.com",
    handle: "reddit"
  }, {
    standin: "medium.com",
    handle: "medium"
  }, {
    standin: "tiktok.com",
    handle: "tiktok"
  } // {
  //     standin: "reuters.com",
  //     handle: "reuters"
  // },                              
  ]
};
storeDataToStorage(chrome, {
  domains: getBunchedUpDomains(getSupportedDomains, "supportedDomains")
});
storeDataToStorage(chrome, getSupportedDomains());
storeDataToStorage(chrome, getDefaultPopupDomains());
storeDataToStorage(chrome, allSelected);

function storePossibleDomains(domainsObject, browser, key) {
  getDataFromStorage2(chrome, key).then(function (data) {
    //I DON"T ACTUALLY HAVE TO MAKE SURE I DON"T OVERRIDE, THIS RUNS ON INSTALL SO IT NEVER DOES
    if (!data || !data[key]) {
      storeDataToStorage(browser, domainsObject);
    }
  });
} // function storeDataOnInstall(initialData, browser, key){ 
//     getDataFromStorage2(browser, key)   
//     .then((data) => {
//         if( ! data || ! data[key]){
//             storeDataToStorage(browser, initialData);
//         }
//     });    
// }


function mergeAllDomains() {
  var _Array$prototype;

  var allDomains = (_Array$prototype = Array.prototype).concat.apply(_Array$prototype, arguments);

  console.log(allDomains);
  return allDomains;
}

function getDataFromStorage2(browser) {
  var _len,
      keys,
      _key,
      _args = arguments;

  return regeneratorRuntime.async(function getDataFromStorage2$(_context) {
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

function getSupportedDomains() {
  var supportedDomains = [{
    group: "youtube",
    domains: ["https://youtube.com", //piped
    "https://piped.kavin.rocks", "https://piped.silkky.cloud", "https://piped.tokhmi.xyz", "https://piped.moomoo.me", "https://piped.syncpundit.com", "https://piped.mha.fi", "https://piped.privacy.com.de", //invidious
    "https://yewtu.be", "https://vid.puffyan.us", "https://invidious.snopyta.org", "https://invidious.kavin.rocks", "https://inv.riverside.rocks", "https://invidious.osi.kr", "https://y.com.sb", "https://tube.cthd.icu", "https://invidious.flokinet.to", "https://yt.artemislena.eu", "https://invidious.se...ivacy.com", "https://inv.bp.projectsegfau.lt", "https://invidious.lunar.icu", "https://invidious.xamh.de", //youtu.be
    "https://youtu.be"]
  }, {
    group: "twitter",
    domains: ["https://twitter.com", //nitter
    "https://nitter.net"]
  }, {
    group: "reddit",
    domains: ["https://reddit.com", //reddit
    "https://teddit.net"]
  }, {
    group: "medium",
    domains: ["https://medium.com", //medium
    "https://scribe.rip"]
  }, {
    group: "tiktok",
    domains: ["https://tiktok.com", //ticktock ... god forgive me for I have enabled cancer
    "https://proxitok.herokuapp.com"]
  } //DELETE
  // {
  //     group: "reuters",
  //     domains: [
  //         "https://reuters.com",
  //         "https://boxcat.site", 
  //     ]
  // }    
  ];
  return {
    supportedDomains: supportedDomains
  };
}

function getDefaultPopupDomains() {
  var popupDomains = [{
    group: "youtube",
    domains: ["https://youtube.com", //piped
    "https://piped.kavin.rocks", //invidious
    "https://yewtu.be", "https://invidio.xamh.de", //youtu.be
    "https://youtu.be"]
  }, {
    group: "twitter",
    domains: ["https://twitter.com", //nitter
    "https://nitter.net"]
  }, {
    group: "reddit",
    domains: ["https://reddit.com", //reddit
    "https://teddit.net"]
  }, {
    group: "medium",
    domains: ["https://medium.com", //medium
    "https://scribe.rip"]
  }, {
    group: "tiktok",
    domains: ["https://tiktok.com", //ticktock ... god forgive me for I have enabled cancer
    "https://proxitok.herokuapp.com"]
  } //testing, delete
  //DELETE
  // {
  //     group: "reuters",
  //     domains: [
  //         "https://reuters.com",
  //         "https://boxcat.site", 
  //     ]
  // }                         
  ];
  return {
    popupDomains: popupDomains
  };
}

function getBunchedUpDomains(getDomains, key) {
  var domainData = getDomains();
  var domains = domainData[key];
  var arrayGroups = domains.map(function (object) {
    return object.domains;
  });
  var bunchedUpDomains = [];
  arrayGroups.forEach(function (group) {
    bunchedUpDomains.push.apply(bunchedUpDomains, group);
  });
  console.log("bunched up domains:   " + bunchedUpDomains);
  return bunchedUpDomains;
}