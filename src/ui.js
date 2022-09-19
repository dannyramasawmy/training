// =============================================================================
// Global variables
// =============================================================================

// consts in screaming snake case
// gobal vars with G_ prefix
// normal variables with camelCase

const ROOT_NODE = romanian;
const ELEMENT_NAME = "node-display";
const HEADER_NAME = "current-node";
const DATA_NAME = "current-node-data";
const COLOR_WHEEL = new ColorWheel();
var G_displayLanguageIsEnglish = true;
var G_randomSelectionIcons = 0;
var G_searchModeIsActive = false;

// =============================================================================
// Initialise
// =============================================================================

var G_currentNode = ROOT_NODE;
var G_displayList = GetDisplayNodes(G_currentNode);

ClearNodeDisplay(ELEMENT_NAME)
PopulateNodeDisplay(ELEMENT_NAME, HEADER_NAME, DATA_NAME, G_currentNode, G_displayList)

var G_searchable = new SearchableDictionary();
GetSearchableWords(romanian, G_searchable);

document.getElementById("filter").placeholder =
  `Search (${G_searchable.GetDataCards("").length})`;

// =============================================================================
// Events
// =============================================================================

// add history
function pushState(node) {
  history.pushState(node.English.toLowerCase(), null, `?${node.English}`);
}

// set next history state
window.addEventListener('popstate',
  function (event) {

    G_currentNode = event.state == null
      ? ROOT_NODE
      : G_searchable.GetDataCardFromState(event.state);

    SwapImageOnButton("random-card", GetPreviousShuffleIconPath())

    ClearNodeDisplay(ELEMENT_NAME);
    G_displayList = GetDisplayNodes(G_currentNode);
    PopulateNodeDisplay(ELEMENT_NAME, HEADER_NAME, DATA_NAME, G_currentNode, G_displayList)
  });

// clicking
window.addEventListener('click',
  function (event) {

    var clickId = event.composedPath()[0].id;
    var elementName = "node-display";

    for (var idx = 0; idx < event.composedPath().length; idx++) {

      // do nothing for search
      if (event.composedPath()[idx].id == "search-bar")
        return;

      // shuffle current node
      if (event.composedPath()[idx].id == "random-card") {
        // state
        G_currentNode = RandomElementInArray(G_searchable.GetDataCards(""));
        pushState(G_currentNode);
        G_displayList = GetDisplayNodes(G_currentNode);

        SwapImageOnButton("random-card", GetNextShuffleIconPath())

        // display
        ResetSearch();
        ClearNodeDisplay(elementName)
        PopulateNodeDisplay(elementName, HEADER_NAME, DATA_NAME, G_currentNode, G_displayList)
        return;
      }

      // shuffle current node
      if (event.composedPath()[idx].id == "sort-cards") {
        // display
        ResetSearch();
        G_displayList = SortDisplayList(G_displayList);
        ClearNodeDisplay(elementName)
        PopulateNodeDisplay(elementName, HEADER_NAME, DATA_NAME, G_currentNode, G_displayList)
        return;
      }

      // search for card
      if (event.composedPath()[idx].id == "search-button") {
        if (G_searchModeIsActive) {
          HideSearchButtons();
          SwapImageOnButton("search-button", "img/search-icon-1.png");
        }
        else {
          ShowSearchButtons();
          SwapImageOnButton("search-button", "img/search-icon-2.png");
        }

        return;
      }

      // swap language shown
      if (event.composedPath()[idx].id == "swap-language") {
        // state
        G_displayLanguageIsEnglish = G_displayLanguageIsEnglish ? false : true;

        // swap ion
        let url1 = "img/swap-language-icon-1.png";
        let url2 = "img/swap-language-icon-2.png";
        SwapImageOnButton("swap-language", G_displayLanguageIsEnglish ? url1 : url2)

        // display
        ClearNodeDisplay(elementName)

        let nodeToShow = G_searchModeIsActive ? searchPlaceholder : G_currentNode;
        PopulateNodeDisplay(elementName, HEADER_NAME, DATA_NAME, nodeToShow, G_displayList)
        return;
      }

      // go to parent
      if (event.composedPath()[idx].id == "parent-card") {
        G_currentNode = G_currentNode.Parent;
        G_displayList = GetDisplayNodes(G_currentNode);
        pushState(G_currentNode)

        // display
        ResetSearch();
        ClearNodeDisplay(elementName)
        G_displayList = SortDisplayList(G_displayList);
        PopulateNodeDisplay(elementName, HEADER_NAME, DATA_NAME, G_currentNode, G_displayList)
        return;
      }
    }

    // when clicking on a card
    if (G_displayList[clickId] !== undefined) {
      // state
      G_currentNode = G_displayList[clickId];
      G_displayList = GetDisplayNodes(G_currentNode);
      pushState(G_currentNode)

      // display
      ResetSearch();
      ClearNodeDisplay(elementName)
      G_displayList = SortDisplayList(G_displayList);
      PopulateNodeDisplay(elementName, HEADER_NAME, DATA_NAME, G_currentNode, G_displayList)
    }
  })


function keyboardInput() {
  G_displayList = G_searchable.GetDataCards(document.getElementById("filter").value);
  ClearNodeDisplay(ELEMENT_NAME);
  PopulateNodeDisplay(ELEMENT_NAME, HEADER_NAME, DATA_NAME, searchPlaceholder, G_displayList);
};

// =============================================================================
// Cache and service worker
// =============================================================================

// Register service worker to control making site work offline
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/languageTree/sw.js')
    .then(() => { console.log('Service Worker Registered'); });
}

// Code to handle install prompt on desktop
let deferredPrompt;
const addBtn = document.querySelector('.add-button');
addBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  addBtn.style.display = 'block';

  addBtn.addEventListener('click', () => {
    // hide our user interface that shows our A2HS button
    addBtn.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
  });
});
