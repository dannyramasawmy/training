// =============================================================================
// Containers
// =============================================================================

function DataCard(english, romanian, data, isRoot = false) {
    this.English = english;
    this.Romanian = romanian;
    this.Data = data;

    this.Parent = [];
    this.Child = [];

    this.IsRoot = isRoot;

    this.AddChild = function (dataCard) {
        this.Child.push(dataCard);
        this.Child.sort(SortEnglish);
    }

    this.SetParent = function (dataCard) {
        this.Parent = dataCard;
    }
}

function SearchableDictionary() {
    this.Romanian = {};
    this.English = {};

    this.GetDataCards = function (searchString) {
        var words = G_displayLanguageIsEnglish
            ? Object.getOwnPropertyNames(this.English)
            : Object.getOwnPropertyNames(this.Romanian);

        var wordMask = words.map((x) => x.includes(searchString.toLowerCase()));
        var filteredWords = words.filter((x, i) => wordMask[i]);

        var filteredDataCards = filteredWords.map(
            x => G_displayLanguageIsEnglish
                ? this.English[x]
                : this.Romanian[x]);

        return filteredDataCards
    }

    this.GetDataCardFromState = function (state) {
        return this.English[state];
    };
}

function VerbTemplate(
    presentI,
    presentYou,
    presentHeShe,
    presentWe,
    presentYouPlural,
    presentThey,
    past, infinitive, relfexivePast = "", reflexiveFuture = "") {
    return (`
        <h2>Present</h2>
        Eu ${presentI} <br>
        Tu ${presentYou} <br>
        El/Ea ${presentHeShe} <br>
        Noi ${presentWe} <br>
        Voi ${presentYouPlural} <br>
        Ei/Ele ${presentThey} <br>
        <h2>Past</h2>
        Eu ${relfexivePast} am ${past} <br>
        Tu ${relfexivePast} ai ${past} <br>
        El/Ea ${relfexivePast} a ${past} <br>
        Noi ${relfexivePast} am ${past} <br>
        Voi ${relfexivePast} ați ${past} <br>
        Ei/Ele ${relfexivePast} au ${past} <br>
        <h2>Future</h2>
        Eu ${reflexiveFuture} voi ${infinitive} <br>
        Tu ${reflexiveFuture} vei ${infinitive} <br>
        El/Ea ${reflexiveFuture} va ${infinitive} <br>
        Noi ${reflexiveFuture} vom ${infinitive} <br>
        Voi ${reflexiveFuture} veți ${infinitive} <br>
        Ei/Ele ${reflexiveFuture} vor ${infinitive} <br>
        <h2>Conditional mood (you would)</h2>
        Eu aș ${infinitive} <br>
        Tu ai ${infinitive} <br>
        El/Ea ar ${infinitive} <br>
        Noi am ${infinitive} <br>
        Voi ați ${infinitive} <br>
        Ei/Ele ar ${infinitive} <br>
        <br> <br>`);
}

function ReflexiveVerbTemplateSe(presentI, presentYou, presentHeShe, presentWe,
    presentYouPlural, presentThey, past, infinitive) {
    return VerbTemplate(
        "mă " + presentI,
        "te " + presentYou,
        "se " + presentHeShe,
        "ne " + presentWe,
        "vă " + presentYouPlural,
        "se " + presentThey,
        past, infinitive, "(-) ", "(-) ");
}

function ReflexiveVerbTemplateSi(presentI, presentYou, presentHeShe, presentWe,
    presentYouPlural, presentThey, past, infinitive) {
    return VerbTemplate(
        "îmi " + presentI,
        "îți " + presentYou,
        "își " + presentHeShe,
        "ne " + presentWe,
        "vă " + presentYouPlural,
        "își " + presentThey,
        past, infinitive, "(-) ", "(-) ");
}

function NounTemplateFemale(singluar, plural, definiteArticle, definitePlural) {
    return (`
        o ${singluar} <br>
        două ${plural} <br>
        ${definiteArticle} <br>
        ${definitePlural} <br>
    `)
};

function NounTemplateMale(singluar, plural, definiteArticle, definitePlural) {
    return (`
        Un ${singluar} <br>
        doi ${plural} <br>
        ${definiteArticle} <br>
        ${definitePlural} <br>
    `)
};

function NounTemplateNeuter(singluar, plural, definiteArticle, definitePlural) {
    return (`
        un ${singluar} <br>
        două ${plural} <br>
        ${definiteArticle} <br>
        ${definitePlural} <br>
    `)
};

// =============================================================================
// Data Functions
// =============================================================================

function SetParentAndChild(parentDataCard, childDataCard) {
    parentDataCard.AddChild(childDataCard);
    childDataCard.SetParent(parentDataCard);
}

function GetSearchableWords(rootDataCard, searchableDictionary) {
    searchableDictionary.English[PrepareEnglishString(rootDataCard.English)] = rootDataCard;
    searchableDictionary.Romanian[PrepareRomanianString(rootDataCard.Romanian)] = rootDataCard;

    if (rootDataCard.Child.length == 0) return;

    for (let i = 0; i < rootDataCard.Child.length; i++)
        GetSearchableWords(rootDataCard.Child[i], searchableDictionary);
    
    return;
}

PrepareEnglishString = (inputString) => inputString.toLowerCase().trim();
PrepareRomanianString = (inputString) => inputString.toLowerCase().trim()
    .replace(/[ăâ]/g, "a").replace(/î/g, "i").replace(/ș/g, "s").replace(/ț/g, "t");

function SortDisplayList(displayList) {
    if (G_displayLanguageIsEnglish) 
        displayList.sort(SortEnglish);
    else
        displayList.sort(SortRomanian);
    return displayList;
}

function SortRomanian(x, y) {
    if (PrepareRomanianString(x.Romanian) < PrepareRomanianString(y.Romanian)) return -1;
    if (PrepareRomanianString(x.Romanian) > PrepareRomanianString(y.Romanian)) return 1;
    return 0;
}

function SortEnglish(x, y) {
    if (PrepareEnglishString(x.English) < PrepareEnglishString(y.English)) return -1;
    if (PrepareEnglishString(x.English) > PrepareEnglishString(y.English)) return 1;
    return 0;
}

RandomRange = (start, end) => (Math.random() * (end - start)) + start;
RandomIntRange = (start, end) => Math.floor(RandomRange(start, end + 1));
RandomElementInArray = (arr) => arr[RandomIntRange(0, arr.length - 1)];

// =============================================================================
// Display Functions
// =============================================================================

function GetDisplayNodes(node) {
    var displayList = [];
    for (var idx = 0; idx < node.Child.length; idx++)
        displayList.push(node.Child[idx])

    return displayList;
}

function ClearNodeDisplay(elementName) {
    var displayDiv = document.getElementById(elementName);
    for (var idx = displayDiv.children.length; idx > 0; idx--)
        displayDiv.removeChild(displayDiv.children[idx - 1]);
}

function ScrollHandler() {
    // https://javascript.info/size-and-scroll-window
    this.ScrollHistory = [];

    this.GetCurrentHeight = () => window.pageYOffset;

    this.AddHistory = () => {
        this.ScrollHistory.push(window.pageYOffset);
    }

    this.GetPreviousHeight = () => {
        if (this.ScrollHistory.length > 0) return this.ScrollHistory.pop();
        return 0;
    }

    this.MaxScrollHeight = () => {
        let scrollHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
          );          
        return scrollHeight;
    } 

    this.PercentageScroll = () => this.GetCurrentHeight() / this.MaxScrollHeight();
}

function PopulateNodeDisplay(elementName, headerName, dataName, currentNode, displayList, yScrollHeight, showAnimation) {

    // set root or parent icon
    if (currentNode.IsRoot)
        SwapImageOnButton("parent-card", ROOT_ICON);
    else if (displayList.length == 0)
        SwapImageOnButton("parent-card", LEAF_ICON);
    else
        SwapImageOnButton("parent-card", PARENT_ICON);

    COLOR_WHEEL.ResetIndex();

    var headerDiv = document.getElementById(headerName);
    headerDiv.innerHTML = G_displayLanguageIsEnglish
        ? `<orange>${currentNode.English}</orange> <blue>${currentNode.Romanian}</blue>`
        : `<blue>${currentNode.Romanian}</blue> <orange>${currentNode.English}</orange>`;

    var dataDiv = document.getElementById(dataName);
    dataDiv.innerHTML = currentNode.Data;

    var displayDiv = document.getElementById(elementName);


    for (var idx = 0; idx < displayList.length; idx++) {
        var newDiv = document.createElement("div");

        newDiv.innerHTML = G_displayLanguageIsEnglish
            ? displayList[idx].English
            : newDiv.innerHTML = displayList[idx].Romanian;

        newDiv.id = idx;
        newDiv.className = "data-card";
        
        // rainbow colors
        newDiv.style.backgroundColor = COLOR_WHEEL.GetNextColor();
        newDiv.style.color = COLOR_WHEEL.TextColor;
        newDiv.style.visibility = "hidden";

        displayDiv.appendChild(newDiv);

        // make sliding in animation
        let noAnimation = G_searchModeIsActive ? 0 : 1;       
        let animationTime = 1 * noAnimation * G_settings_showAnimation * idx/displayList.length;

        // console.log(animationTime)
        newDiv.style.animation = `${animationTime}s slide-in`;
        newDiv.style.visibility = "visible";
    
    }

    window.scrollTo(0, yScrollHeight);
}

function ColorWheel() {
    // https://htmlcolorcodes.com/
    // red -> purple -> blue -> green -> yellow -> orange
    this.Index = 0;
    this.ParentColor = "#1B2631";
    this.TextColor = "#ECF0F1";
    this.Colors = [
        "#C0392BDF", // r
        "#E74C3CDF", // r
        "#9B59B6DF", // p
        "#8E44ADDF", // p
        "#2980B9DF", // b
        "#3498DBDF", // b
        "#1ABC9CDF", // t
        "#16A085DF", // t
        "#27AE60DF", // g
        "#2ECC71DF", // g
        "#F1C40FDF", // y
        "#F39C12DF", // y
        "#E67E22DF", // o
        "#D35400DF"]; //o

    this.ResetIndex = () => this.Index = 5;

    this.GetNextColor = () => {
        this.Index = (this.Index + 1) % this.Colors.length;
        return this.Colors[this.Index];
    }
}

function ResetSearch() {
    // reset input field
    HideSearchButtons();
    searchStringStack = [];
    document.getElementById("filter").value = "";
    SwapImageOnButton("search-button", SEARCH_NOT_ACTIVE_ICON);
}

// =============================================================================
// Buttons
// =============================================================================

function GetShuffleIconPath(increment) {
    G_randomSelectionIcons = (G_randomSelectionIcons + increment) % 4
    return `"img/shuffle-icon-${G_randomSelectionIcons + 1}.png"`;
}

GetNextShuffleIconPath = () => GetShuffleIconPath(1);
GetPreviousShuffleIconPath = () => GetShuffleIconPath(3);

SwapImageOnButton = (elementName, urlToImage) => 
    document.getElementById(elementName).style.backgroundImage = `url(${urlToImage})`;


function ShowSearchButtons() {
    document.querySelector('.search-bar').style.display = 'flex';
    G_searchModeIsActive = true;
    document.getElementById("filter").focus();
}

function HideSearchButtons() {
    document.querySelector('.search-bar').style.display = 'none';
    G_searchModeIsActive = false;
}

// =============================================================================
// Settings
// =============================================================================

var StoreAnimationSettings = (value) => {
    window.localStorage.setItem(`G_settings_showAnimation`, value);
    G_settings_showAnimation = window.localStorage.getItem(`G_settings_showAnimation`);
  }
  