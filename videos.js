const explorer = document.querySelector(".explorer");
const spyglass = document.querySelector("#viewer");
const message = document.querySelector("#status");
// "eram" is my function testing dummy!!
const placeholder_img = "media/0.jpg";

var mediaCSVData = [];
// Data parsed from the CSV.
var mediaProcessedData = new Object();
// Contains all media objects.
var mediaProcessedArr = [];
var mediaDisplayed = [];
// IDs of all displayed medias.
var mediaOrdered = [];
// When searching, is filled with every media matching searched-for tag.
// We break this up into pages with page(#).
var searchingFor = [];
// Array of tags we are searching for!
var searchMode = "AND";
// "OR" = 
// "AND" = Media needs both tags

var mediaTotal = 851;
let perPage = 20;
var page_count;

var currentPage = 1;

const listCharacters = ["qu3stion", "qu3stion2", "3xclamation", "c0mma", "amp3rsand", "creator", "ivy", "peri0d"];

let tagsType = new Map();
tagsType.set("character",   {name: "Characters", color: "#FFFFFF"});
tagsType.set("meta",        {name: "Metadata", color: "#000"});
tagsType.set("info",        {name: "Information", color: "#56db21"});
tagsType.set("gags",        {name: "Running Gags / References", color: "#ebbd29"});
tagsType.set("arc",         {name: "Arcs", color: "#f01c1c"});
tagsType.set("audience",    {name: "Audience", color: "#ee6cdd"}); // Audience does/shares things with Qu3stion
tagsType.set("date",        {name: "Date", color: "black"});
tagsType.set("events",      {name: "Events", color: "#185ddf"}); // Moments / events
tagsType.set("misc",        {name: "Miscellaneous", color: "#6e15b8"});

let tagsAll = new Map();
tagsAll.set("?", {name: "Qu3stion",     class: "qu3stion",   type: "character", color: "#15c1c3", description: ""});
tagsAll.set("¿", {name: "Old Qu3stion", class: "qu3stion2",  type: "character", color: "#124193", description: ""});
tagsAll.set("!", {name: "3xclamation",  class: "3xclamation",type: "character", color: "#cc265a", description: ""});
tagsAll.set(",", {name: "C0mma",        class: "c0mma",      type: "character", color: "#3e6ab7", description: ""});
tagsAll.set("&", {name: "Amp3rsand",    class: "amp3rsand",  type: "character", color: "#cb993e", description: ""});
tagsAll.set(":", {name: "Creator",      class: "creator",    type: "character", color: "#252b2b", description: ""});
tagsAll.set("G", {name: "Ivy",          class: "ivy",        type: "character", color: "#0e9368", description: ""});
tagsAll.set(".", {name: "...Peri0d??",  class: "peri0d",     type: "character", color: "#9deb44",      description: ""});
tagsAll.set("|", {name: "Answ3r",       class: "answ3r",     type: "character", color: "#000000",      description: ""});
//
tagsAll.set("*", {name: "Lore",                 class: "lore",       color: "type", type: "info", description: "Contains important lore pieces!"});
tagsAll.set("^", {name: "Trivia",               class: "lore",       color: "type", type: "info", description: "Fun facts about Qu3stion; not as important as the lore tidbits."});
tagsAll.set("_", {name: "Intro",                class: "intro",      color: "type", type: "events", description: "First time a character appears!"});
tagsAll.set("s", {name: "Cute :3",              class: "cute",       color: "type", type: "misc", description: "All Qu3stion is Cute Medias... but some Medias are more Cuter than others..."});
tagsAll.set("z", {name: "Spooky",               class: "spooky",     color: "type", type: "misc", description: ""});
tagsAll.set("m", {name: "MEAN.. >:]",           class: "mean",       color: "type", type: "audience", description: "WHEN THEY'RE MEAN TO QU3STION    ON TWITTER: | (Includes pranks)"});
tagsAll.set("k", {name: "Stickers",             class: "stickers",   color: "type", type: "gags", description: "All Qu3stion is Cute Medias... but some Medias are more Cuter than others..."});
tagsAll.set("n", {name: "Nice!",                class: "nice",       color: "type", type: "audience", description: "WHEN THEY'RE [Nice! :3] TO QU3STION    ON TWITTER:"});
tagsAll.set("x", {name: "Explosion",            class: "explosion",  color: "type", type: "gags", description: ""});
tagsAll.set("f", {name: "Fish",                 class: "fish",       color: "type", type: "gags", description: "Running gag about Qu3stion's pet fish(es)... only medias that focus on the fish are tagged, but they do appear in the background in many posts!"});
tagsAll.set("g", {name: "Gaming",               class: "gaming",     color: "type", type: "gags", description: ""});
tagsAll.set("=", {name: "Drawings",             class: "fanart",     color: "type", type: "events", description: ""});
tagsAll.set("/", {name: "Fanart Galleries",     class: "fanart",     color: "type", type: "audience", description: ""});
tagsAll.set("c", {name: "X-mas",                class: "x-mas",      color: "type", type: "arc", description: ""});
tagsAll.set("h", {name: "Halloween",            class: "halloween",  color: "type", type: "arc", description: ""});
tagsAll.set("w", {name: "Looks Weird",          class: "weird",      color: "type", type: "misc", description: ""});
tagsAll.set("u", {name: "UT/DR",                class: "utdr",       color: "type", type: "gags", description: ""});
tagsAll.set("t", {name: "Cats",                 class: "cats",       color: "type", type: "misc", description: "Discussion of Cats..."});
tagsAll.set("e", {name: "Ears",                 class: "ears",       color: "type", type: "events", description: ""});
tagsAll.set("+", {name: "Audience Interactions",class: "gifts",      color: "type", type: "audience", description: "The audiences gives Qu3stion gives, tries to change her screen color, etc."});
tagsAll.set("-", {name: "Errors/Reboots",       class: "errors",     color: "type", type: "events", description: "Times when Qu3stion's computer crashes / breaks down, and/or resets."});
tagsAll.set("$", {name: "Music",                class: "music",      color: "type", type: "audience", description: "Qu3stion listens to music!"});
tagsAll.set("o", {name: "Cool Tricks",          class: "tricks",     color: "type", type: "events", description: "Qu3stion does some cool tricks with her computers, um, powers! Changing colors, changing her screen, etc."});
tagsAll.set("`", {name: "Other Computerlings",  class: "others",     color: "type", type: "misc", description: "Qu3stion interacts with other computerlings!"});
tagsAll.set("%", {name: "Overheating",          class: "overheating",color: "type", type: "arc", description: ""});
tagsAll.set("a", {name: "Animal Qu3stion",      class: "animal",     color: "type", type: "gags", description: "Qu3stion becomes some kind of animal..."});
tagsAll.set("y", {name: "Yuri- uh, Romance.",   class: "yuri",       color: "type", type: "misc", description: "There are no medias with this tag. Don't look."});
tagsAll.set("[", {name: "Image",                class: "img",       color: "type", type: "meta", description: ""});
tagsAll.set("]", {name: "Video",                class: "vid",       color: "type", type: "meta", description: ""});

let tagsDate = new Map();
tagsDate.set("0",  {name: "August '25",    class: "august25"   , type: "date", color: "#FFFFFF", description: ""});
tagsDate.set("1",  {name: "September '25", class: "september25", type: "date", color: "#FFFFFF", description: ""});
tagsDate.set("2",  {name: "October '25",   class: "october25"  , type: "date", color: "#FFFFFF", description: ""});
tagsDate.set("3",  {name: "November '25",  class: "november25" , type: "date", color: "#FFFFFF", description: ""});
tagsDate.set("4",  {name: "December '25",  class: "december25" , type: "date", color: "#FFFFFF", description: ""});
tagsDate.set("5",  {name: "January '26",   class: "january26"  , type: "date", color: "#FFFFFF", description: ""});
tagsDate.set("6",  {name: "February '26",  class: "february26" , type: "date", color: "#FFFFFF", description: ""});
tagsDate.set("7",  {name: "March '26",     class: "march26"    , type: "date", color: "#FFFFFF", description: ""});
tagsDate.set("8",  {name: "April '26",     class: "april26"    , type: "date", color: "#FFFFFF", description: ""});
tagsDate.set("9",  {name: "May '26",       class: "may26"      , type: "date", color: "#FFFFFF", description: ""});
tagsDate.set("10", {name: "June '26",      class: "june26"     , type: "date", color: "#FFFFFF", description: ""});
tagsDate.set("11", {name: "July '26",      class: "july26"     , type: "date", color: "#FFFFFF", description: ""});
tagsDate.set("12", {name: "August '26",    class: "august26"   , type: "date", color: "#FFFFFF", description: ""});

const template_img = document.querySelector("#template_img");
const template_vid = document.querySelector("#template_vid");
const template_imgEX = document.querySelector("#template_imgEX");
const template_vidEX = document.querySelector("#template_vidEX");

let currentImageExpanded = undefined;
// mediaTemplateEx object
// when requesting an image to be viewed, we:
// - call this object
// - free it
// - build a new mediaTemplate
// - set currentImageExpanded to that new object


const mediaTemplate = {
    id      : undefined,
    filetype: undefined,
    folder  : "media/",
    tags    : [],
    note    : undefined,
    source  : undefined,
    source2 : undefined,
    built   : false,
    url: function()   {
        return FOLDER + this.id + this.filetype;
    },
    build: function() {
        let clone;
        var metadata = [];
        switch (this.filetype) {
            case ".jpg":
                clone = document.importNode(template_img.content, true);
                break;
            case ".mp4":
                clone = document.importNode(template_vid.content, true);
                break;
        };
        this.source = clone.querySelectorAll(".thumbnail")[0];
        var article = clone.querySelector("article");
        clone.querySelectorAll("button")[0].addEventListener("click", (event) => {
            expand(event, this.id);
        });
        var tagsHolder = clone.querySelectorAll(".tags")[0];
        for (tag of this.tags) {
            tagBuilder(tag, tagsHolder);
            article.classList.add(tag["class"]);
        };
        clone.querySelectorAll(".div_id")[0].innerHTML = "#" + this.id;
        article.id = "div_" + this.id;
        explorer.appendChild(clone);
        built = true;
    },
    free: function() {
        var media = document.getElementById("div_" + this.id);
        if (media) {
            media.querySelectorAll("button")[0].removeEventListener("click", (event) => {
                expand(event, this.id);
            });
            URL.revokeObjectURL(this.source.src);
            this.source.src = null;
            explorer.removeChild(media);
            built = false;
        };
    },
    build_ex: function() { // frees any existing data first, then builds template for expanded image.
        switch (currentImageExpanded) {
            case this.id:
                return;
            case undefined:
                break;
            default:
                URL.revokeObjectURL(spyglass.querySelector(".expanded").src);
                spyglass.querySelector(".expanded").src = null;
                spyglass.innerHTML = null;
                spyglass.innerHTML = "";
        }
        let clone;
        var metadata = [];
        switch (this.filetype) {
            case ".jpg":
                clone = document.importNode(template_imgEX.content, true);

                break;
            case ".mp4":
                clone = document.importNode(template_vidEX.content, true);

                break;
        };
        this.source2 = clone.querySelector(".expanded");
        var tagsHolder = clone.querySelector(".tags");
        var noteHolder = clone.querySelector(".notes");
        for (tag of this.tags) {
            tagBuilder(tag, tagsHolder);
        }
        if (this.note !== undefined) {
            noteHolder.innerHTML = this.note;
        }

        spyglass.appendChild(clone);
        currentImageExpanded = this.id;
    }
}

var counter = 1
function tagReader(dict, tagBlob) {
    var tagsArr = []
    switch (dict) {
        case "tagsAll":
            if (tagBlob != "") {
                for (l = 0; l < tagBlob.length; l++) {
                    var tagID = tagBlob[l];
                    tagsArr.push(tagsAll.get(tagID));
                }
                return tagsArr;
            } else {
                return [];
            }
            break;
        case "tagsDate":
            tagsArr.push(tagsDate.get(tagBlob));
            return tagsArr;
    }
}
function tagBuilder(tag, to) {
    if (tag === undefined) {
        console.warn(this.tag);
        return false;
    }
    var label = document.createElement("label");
    var dot = document.createElement("span");
    dot.innerHTML = "•"
    if (tag["color"] !== null && tag["color"] != "#FFFFFF") {
        if (tag["color"] == "type") {
            label.style.borderColor = tagsType.get(tag["type"])["color"];
            dot.style.color = tagsType.get(tag["type"])["color"];
        } else {
            label.style.borderColor = tag["color"];
            dot.style.color = tag["color"];
        }
    } else {
        label.style.borderColor = "#6495a5";
        dot.style.color = "#6495a5";
    }
    label.appendChild(dot)
    label.innerHTML += tag["name"];
    if (tag["class"] == "answ3r") {
        label.id = "answ3r";
        label.style.display = "none";
    }
    label.classList.add("tag")
    if (to === false) {
        return label;
    } else {
        to.appendChild(label);
        return true;
    }
}
window.onload = init_media;
async function init_media() {
    Papa.parse("media.csv", {
        header: true,
        download: true,
        step: function(row) {
            let data = row.data
            let mediaNew = {};
            if (data["filetype"] !== undefined) {
                mediaNew["id"] = data["id"];
                mediaNew["filetype"] = data["filetype"];
                mediaNew["tags"] = data["tags"];
                switch(data["filetype"]) {
                    case ".jpg":
                        mediaNew["tags"] += "[";
                        break;
                    case ".mp4":
                        mediaNew["tags"] += "]";
                        break;
                }
                mediaNew["date"] = data["date"];
                mediaNew["note"] = data["note"];
                mediaCSVData[counter] = mediaNew;
                counter += 1;
            }
        },
        complete: function() {
            for (x = 1; x < mediaCSVData.length; x++) {
                let template = Object.create(mediaTemplate);
                let data = mediaCSVData[x];
                template["id"] = data["id"];
                template["filetype"] = data["filetype"];
                var arr1 = tagReader("tagsAll", data["tags"]);
                var arr2 = tagReader("tagsDate", data["date"]);
                template["tags"] = arr1.concat(arr2);
                template["note"] = data["note"];
                mediaProcessedData[data["id"]] = template;
                mediaProcessedArr.push(data["id"]);
            }
            load();
        }
    })
}

const tick = document.getElementById("page_counter");

var ordered;
var page_count;

function pagecrawl(s) {
    var mod = document.getElementById("step").value;
    var step = s * mod;
    page(step)
}
async function page(step) {
    explorer.style.display = "none";
    if (currentPage + step > page_count) {
        currentPage = page_count;
    } else if (currentPage + step < 1) {
        currentPage = 1;
    } else {
        currentPage = currentPage + step;
    }
    var check2 = await reset();
    if (check2) {
        let ordered;
        if (mediaOrdered[0] == undefined) {
            ordered = false;
            mediaOrdered = mediaProcessedArr;
        } else {
            ordered = true;
        }
        page_count = Math.ceil(mediaOrdered.length / perPage);
        let r = [((currentPage * perPage) - perPage) + 1, (currentPage * perPage)];
        document.getElementById("back").disabled = false;
        document.getElementById("top").disabled = false;
        switch (currentPage) {
            case 1:
                document.getElementById("back").disabled = true;
                break;
            case page_count:
                document.getElementById("top").disabled = true;
                break;
        }
        for (x = r[0]; x <= r[1]; x++) {
            if (x > mediaOrdered.length) {
                break;
            }
            var tempID = mediaOrdered[x - 1];
            var get = mediaProcessedData[tempID];
            if (get === undefined) {
                continue;
            }
            get.build();
            let check = await blobGuzzler(get, get["source"]);
            mediaDisplayed.push(tempID);
        }
        tick.value = currentPage;
        explorer.style.display = "grid";
        return true;
    }
};


async function blobGuzzler(obj, src) {
    var blob = await fetch(obj["folder"] + obj["id"] + obj["filetype"], { cache: "no-store" })
    .then(response => response.blob())
    switch (obj["filetype"]) {
        case ".jpg":
            src.src = URL.createObjectURL(blob);
            break;
        case ".mp4":
            var elm = document.createElement("source");
            elm.src = URL.createObjectURL(blob);
            src.appendChild(elm);
            src.load();
            src = elm;
            break;
    }
    return true;
}
async function expand(event, id) {
    let get = mediaProcessedData[id];
    get.build_ex();
    let src = spyglass.querySelector(".expanded");
    let check = await blobGuzzler(get, src);
};
async function load() {
    let check = await page(0);
    console.log("loaded!")
    window.addEventListener("keypress", (event) => {
        if (event.key == "Enter") {
            var currentPageRequested = tick.value;
            if (currentPageRequested != currentPage) {
                var dist = currentPageRequested - currentPage;
                page(dist);
            }
        }
    })
    init_placeholder();
    tagsSearchBuilder();
};
const tagsBar = document.getElementById("tagsBar");
const overlay = document.getElementById("overlay");
tagsBar.style.display = "none";
overlay.style.display = "none";
var sidebar_state = false
tagsBar.addEventListener("animationend", (event) => {
    if (event.animationName == "slideOut") {
        tagsBar.style.display = "none";
        overlay.style.display = "none";
        // it's a little finicky, but
        // when specifically the animation for the sidebar sliding out ends,
        // we hide the tags bar too.
    }
});
function sidebar() {
    switch (sidebar_state) {
        case true:
            tagsBar.classList.remove("in");
            tagsBar.classList.add("out");
            overlay.classList.remove("in");
            overlay.classList.add("out");
            sidebar_state = false;
            break;
        case false:
            tagsBar.style.display = "block";
            overlay.style.display = "block";
            tagsBar.classList.remove("out");
            tagsBar.classList.add("in");
            overlay.classList.remove("out");
            overlay.classList.add("in");
            sidebar_state = true;
            break;
    }
};
function tagsSearchBuilder() {
    var to = tagsBar.querySelector(".tagsMenu");
    tagsType.forEach((value, key, map) => {
        var newLabel = document.createElement("h2");
        newLabel.innerHTML = value["name"];
        var newCategory = document.createElement("div");
        newCategory.classList.add("tags");
        newCategory.classList.add(key);
        to.appendChild(newLabel);
        to.appendChild(newCategory);
    });
    let tagArrs = [tagsAll, tagsDate]
    for (arr of tagArrs) {
        arr.forEach((value) => {
            for (category of to.children) {
                if (category.tagName == "DIV" && category.classList.contains(value["type"])) {
                    var label = tagBuilder(value, false);
                    var newButton = document.createElement("button");
                    newButton.appendChild(label);
                    newButton.classList = value["class"];
                    newButton.addEventListener("click", (event) => {
                        appendToSearch(event);
                    })
                    category.appendChild(newButton);
                } else {
                    continue;
                }
            }
        });
    }
};
function appendToSearch(event) {
    var label = event.target;
    if (label.tagName == "LABEL") {
        var button = label.parentElement;
        var tagClass = button.classList[0];
        var arr = [...searchingFor]; // I <3 Spread Operator...
        if (tagClass == "answ3r") {
            window.location.replace("answ3r.html");
        }
        switch (searchingFor.includes(tagClass)) {
            case true:
                var i = searchingFor.indexOf(tagClass);
                searchingFor = searchingFor.filter((item) => item != tagClass);
                selectedTagCSS(label, false);
                break;
            case false:
                arr.push(tagClass);
                searchingFor = arr;
                selectedTagCSS(label, true);
                break;
            default:
                "WHAT????";
                break;
        }
        console.log(searchingFor);
        search(searchingFor);
    }
}
function selectedTagCSS(elm, bool) {
    var color = getComputedStyle(elm).getPropertyValue("border-color");
    switch (bool) {
        case true:
            elm.style.backgroundColor = color;
            elm.firstElementChild.style.color = "var(--light)";
            elm.style.color = "var(--light)";
            break;
        case false:
            elm.style.color = "#000";
            elm.firstElementChild.style.color = color;
            elm.style.backgroundColor = "transparent";
            break;
    }
}
function well() {
    var check = true;
    for (character of listCharacters) {
        if (searchingFor.includes(character)) {
            // pass.
        } else {
            check = false;
            // fails check.
        }
    }
    switch (check) {
        case false:
            return;
        case true:
            document.getElementById("answ3r").style.display = "flex";
            return;
    }
}
async function search() {
    if (searchingFor.length < 1) {
        console.log("no entries found!")
        mediaOrdered = [];
        page(0);
        return false;
    } else if (searchingFor.length >= 8) {
        well()
    }
    var validArr = [...mediaProcessedArr];
    for (tag of searchingFor) {
        for (id of validArr) {
            var media = mediaProcessedData[id];
            for (x = 0; x < media["tags"].length; x++) {
                var tagReceived = media["tags"][x];
                if (tagReceived["class"] == tag) {
                    break;
                } else if (x + 1 == media["tags"].length) {
                    validArr = validArr.filter((item) => item != id);
                } else {
                    continue;
                }
            }
        }
    };
    if (validArr.length < 1) {
        console.warn("Nothing found.")
        reset();
        return;
    } else if (validArr == mediaOrdered) {
        console.warn("Nothing changed. Because an Array, is just an Array.")
        return;
    } else {
        mediaOrdered = [];
        mediaOrdered = validArr;
        currentPage = 1;
        page(0);
        return true;
    }
}
async function reset() {
    if (mediaDisplayed != []) {
        for (key in mediaDisplayed) {
            var id = mediaDisplayed[key];
            mediaProcessedData[id].free();
        }
        mediaDisplayed = [];
        return true;
    }
};
async function init_placeholder() {
    try {
        let placeholderMedia = Object.create(mediaTemplate);
        placeholderMedia["id"] = "0";
        placeholderMedia["filetype"] = ".jpg";
        placeholderMedia.build_ex();
        let src = spyglass.querySelector(".expanded");
        let check = await blobGuzzler(placeholderMedia, src);
        return true;
    } catch (err) {
        console.error(err)
        return false;
    }
}