const weirdRoot = document.querySelector(":root");
const universal = document.getElementById("universal")
const archive   = document.querySelector("main");
const gallery   = archive.querySelector(".gallery");
const details   = archive.querySelector(".details");
const explorer  = document.querySelector(".explorer");
const viewer    = document.querySelector("#viewer");
const searchBar = gallery.querySelector(".search");
const scrubBar  = viewer.querySelector(".search");

const tagsBar           = document.getElementById("tagsBar");
const infoBox           = document.getElementById("infoBox").querySelector(".infobox");
const overlay           = document.getElementById("overlay");

const placeholder_img   = "media/0.jpg";

var mediaCSVData        = []; // Data parsed from the CSV.
var mediaProcessedData  = new Object(); // Contains all media objects.
var mediaProcessedArr   = []; // Only exists because it's easier to iterate.
var mediaDisplayed      = []; // IDs of all displayed medias.
var mediaOrdered        = []; // When searching, is filled with every media matching searched-for tag, we break this up into pages with page(#).
var searchingFor        = []; // Array of tags we are searching for!
var perPage             = undefined;
var pageCount;

var currentPage = 1;
var currentImageExpanded = undefined;
var activeMenu;

const listCharacters = ["qu3stion", "qu3stion2", "exclamation", "c0mma", "amp3rsand", "creator", "green", "peri0d"];

let tagsType = new Map();
tagsType.set("character",   {name: "Characters",                color: "#FFFFFF", order: 2});
tagsType.set("date",        {name: "Date",                      color: "black",     order: 3});
tagsType.set("meta",        {name: "Metadata",                  color: "#000",    order: 1});
tagsType.set("info",        {name: "Information",               color: "#56db21", order: 4});
tagsType.set("gags",        {name: "Running Gags / References", color: "#ebbd29", order: 8});
tagsType.set("arc",         {name: "Arcs",                      color: "#f01c1c", order: 5});
tagsType.set("audience",    {name: "Audience",                  color: "#ee6cdd", order: 7}); // Audience does/shares things with Qu3stion
tagsType.set("events",      {name: "Events",                    color: "#185ddf", order: 6}); // Moments / events
tagsType.set("misc",        {name: "Miscellaneous",             color: "#6e15b8", order: 9});

let tagsAll = new Map();
tagsAll.set("?", {name: "Qu3stion",     class: "qu3stion",   type: "character", color: "#15c1c3", description: ""});
tagsAll.set("¿", {name: "Old Qu3stion", class: "qu3stion2",  type: "character", color: "#124193", description: ""});
tagsAll.set("!", {name: "3xclamation",  class: "exclamation",type: "character", color: "#cc265a", description: ""});
tagsAll.set(",", {name: "C0mma",        class: "c0mma",      type: "character", color: "#3e6ab7", description: ""});
tagsAll.set("&", {name: "Amp3rsand",    class: "amp3rsand",  type: "character", color: "#cb993e", description: ""});
tagsAll.set("G", {name: "Green",        class: "green",      type: "character", color: "#0e9368", description: ""});
tagsAll.set(".", {name: "...Peri0d??",  class: "peri0d",     type: "character", color: "#9deb44",      description: ""});
tagsAll.set(":", {name: "Creator",      class: "creator",    type: "character", color: "#252b2b20", description: ""});
tagsAll.set("|", {name: "Answ3r",       class: "answ3r",     type: "character", color: "#00000020",      description: ""});
//
tagsAll.set("*", {name: "Lore",                 class: "lore",       color: "type", type: "info", description: "Contains important lore pieces!"});
tagsAll.set("^", {name: "Trivia",               class: "trivia",     color: "type", type: "info", description: "Fun facts about Qu3stion; not as important as the lore tidbits."});
tagsAll.set("_", {name: "Intro",                class: "intro",      color: "type", type: "info", description: "First time a character appears!"});
tagsAll.set("s", {name: "Cute :3",              class: "cute",       color: "type", type: "misc", description: "All Qu3stion is Cute Medias... but some Medias are more Cuter than others..."});
tagsAll.set("z", {name: "Spooky",               class: "spooky",     color: "type", type: "misc", description: ""});
tagsAll.set("m", {name: "MEAN.. >:]",           class: "mean",       color: "type", type: "audience", description: "WHEN THEY'RE MEAN TO QU3STION    ON TWITTER: | (Includes pranks)"});
tagsAll.set("k", {name: "Stickers",             class: "stickers",   color: "type", type: "gags", description: "All Qu3stion is Cute Medias... but some Medias are more Cuter than others..."});
tagsAll.set("n", {name: "Nice!",                class: "nice",       color: "type", type: "audience", description: "WHEN THEY'RE [Nice! :3] TO QU3STION    ON TWITTER:"});
tagsAll.set("x", {name: "Explosion",            class: "explosion",  color: "type", type: "gags", description: ""});
tagsAll.set("f", {name: "Fish",                 class: "fish",       color: "type", type: "gags", description: "Running gag about Qu3stion's pet fish(es)... only medias that focus on the fish are tagged, but they do appear in the background in many posts!"});
tagsAll.set("g", {name: "Gaming",               class: "gaming",     color: "type", type: "gags", description: ""});
tagsAll.set("=", {name: "Drawings",             class: "drawings",   color: "type", type: "events", description: ""});
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
tagsAll.set("[", {name: "Image",                class: "img",        color: "type", type: "meta", description: ""});
tagsAll.set("]", {name: "Video",                class: "vid",        color: "type", type: "meta", description: ""});
tagsAll.set("#", {name: "Audio Warning!",       class: "warning",    color: "#FF0000", type: "meta", description: ""});

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

/*
UTILITY!
__________________________________
*/
function setCSS(elm, properties) {
    for (property in properties) {
        console.log(property)
        elm.style[property] = properties[property];
    }
}
/*
MOBILE DETECTION!
__________________________________

*/
var CSSvertical = undefined;
async function orientationHandler() {
    if (weirdRoot.clientWidth <= weirdRoot.clientHeight) {
        if (CSSvertical != true) {
            CSSvertical = true;
            orientationApply();
        }
    } else {
        if (CSSvertical != false) {
            CSSvertical = false;
            orientationApply();
        }
    }
}
async function orientationApply() {
    if (CSSvertical == undefined) {
        var check = await orientationHandler();
    }
    var reload = false;
    if (perPage != undefined) {
        reload = true;
    }
    switch (CSSvertical) {
        // ALL OF THIS IS TEMPORARY!!
        // we'll make a separate stylesheet for mobile later.
        case false:
            weirdRoot
                .style.setProperty("--tagsBar-width", "20%");
            archive
                .style.gridTemplateColumns              = "2fr 3fr";
            archive
                .style.gridTemplateRows                 = "100%";
            archive
                .style.height                           = "900px";
            universal
                .style.marginLeft                       = "10%";
            universal
                .style.marginRight                      = "10%";
            explorer
                .style.gridTemplateColumns              = "1fr 1fr 1fr 1fr";
            searchBar
                .style.gridTemplateColumns              = "40% auto";
            searchBar
                .querySelector(".status")
                .style.display                          = "block";
            details
                .style.gridTemplateRows                 = "5% auto";
            infoBox
                .style.marginBottom                     = "0"
            infoBox
                .querySelector(".close2")
                .style.width                            = "20%";
            infoBox
                .querySelector(".close2")
                .style.left                             = "40%";
            infoBox
                .querySelector(".close2")
                .style.height                           = "10%";
            infoBox
                .querySelector(".close2")
                .style.bottom                           = "-10%";
            infoBox
                .querySelector(".info")
                .style.display                          = "grid"
            infoBox
                .querySelector(".drone")
                .style.display                          = "grid";
            infoBox
                .style.gridTemplateAreas                = `"drone title info" "drone strawpage info" "drone feedback info"`;
            infoBox
                .style.gridTemplateColumns              = "1fr 3fr 1fr"
            infoBox
                .style.gridTemplateRows                 = "auto 1fr auto"
            infoBox
                .style.gridTemplateRows                 = "auto 1fr"
            infoBox.parentElement
                .style.padding                          = "10%"
            infoBox.parentElement
                .style.paddingTop                       = "5%"
            perPage                                     = 16;
            break;
        case true:
            weirdRoot
                .style.setProperty("--tagsBar-width", "100%");
            archive
                .style.gridTemplateColumns              = "1fr";
            archive
                .style.gridTemplateRows                 = "auto auto";
            archive
                .style.height                           = "auto";
            universal
                .style.marginLeft                       = "1%";
            universal
                .style.marginRight                      = "1%";
            explorer
                .style.gridTemplateColumns              = "1fr 1fr";
            searchBar
                .style.gridTemplateColumns              = "100% auto";
            searchBar
                .querySelector(".status").style.display = "none";
            details
                .style.gridTemplateRows                 = "1fr auto";
            infoBox
                .style.marginBottom                     = "10vh";
            infoBox
                .querySelector(".close2")
                .style.width                            = "50%";
            infoBox
                .querySelector(".close2")
                .style.left                             = "25%";
            infoBox
                .querySelector(".close2")
                .style.height                           = "5%";
            infoBox
                .querySelector(".close2")
                .style.bottom                           = "-5%";
            infoBox
                .querySelector(".info")
                .style.display                          = "none";
            infoBox
                .querySelector(".drone")
                .style.display                          = "none";
            infoBox
                .style.gridTemplateAreas                = `"title" "strawpage" "feedback"`;
            infoBox
                .style.gridTemplateColumns              = "1fr"
            infoBox
                .style.gridTemplateRows                 = "auto 1fr"
            infoBox.parentElement
                .style.padding                          = "5%";
            perPage                                     = 6;
            break;
    }
    return true;
}
window.onload = (event) => {
    init_all(); 
};
window.onresize = (event) => {
    orientationHandler();
};
async function init_all() {
    var check = await orientationApply();
    if (check) {
        init_media();
    }
}

/*
THE ACTUALL STUFF!!
__________________________________

*/
const template_    = document.querySelector("#template_");
const template_img = document.querySelector("#template_img");
const template_vid = document.querySelector("#template_vid");

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
        let clone = document.importNode(template_.content, true);
        var metadata = [];
        this.source = clone.querySelectorAll(".thumbnail")[0];
        var article = clone.querySelector("article");
        clone.querySelectorAll("button")[0].addEventListener("click", (event) => {expand(event, this.id);});
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
            explorer.removeChild(media);
            if (this.source) {
                URL.revokeObjectURL(this.source.src);
            }
            media = null;
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
                URL.revokeObjectURL(this.source2);
                for (child of viewer.children) {
                    child = null;
                }
                viewer.innerHTML = null;
        }
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
        this.source2   = clone.querySelector(".expanded");
        if (this.filetype == ".mp4") {
            this.source2.volume = 0.25;
        }
        var tagsHolder = clone.querySelector(".tags");
        var noteHolder = clone.querySelector(".notes");
        for (tag of this.tags) {
            tagBuilder(tag, tagsHolder);
            if (tag["class"] == "warning" && this.filetype == ".mp4") {
                this.source2.autoplay = false;
            }
        }
        if (this.note !== undefined) {
            noteHolder.innerHTML = this.note;
        }

        viewer.appendChild(clone);
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
    dot.innerHTML = "•";
    label.style.order = tagsType.get(tag["type"])["order"];
    label.classList.add(tag["class"]);
    label.appendChild(dot)
    label.innerHTML += tag["name"];
    label.classList.add("tag");
    label.dataset.tag = tag["class"];
    if (to === false) {
        return label;
    } else {
        to.appendChild(label);
        return true;
    }
}
async function init_media() { // CSV parsing tool by: PapaParse (https://www.papaparse.com/)
    Papa.parse("media.csv", {
        header: true,
        download: true,
        step: function(row) {
            let data = row.data
            let mediaNew = {};
            if (data["filetype"] !== undefined) {
                mediaNew["id"]          = data["id"];
                mediaNew["filetype"]    = data["filetype"];
                mediaNew["tags"]        = data["tags"];
                switch(data["filetype"]) {
                    case ".jpg":
                        mediaNew["tags"] += "[";
                        break;
                    case ".mp4":
                        mediaNew["tags"] += "]";
                        break;
                }
                mediaNew["date"]        = data["date"];
                mediaNew["note"]        = data["note"];
                mediaCSVData[counter]   = mediaNew;
                counter += 1;
            }
        },
        complete: function() {
            for (x = 1; x < mediaCSVData.length; x++) {
                let template                    = Object.create(mediaTemplate);
                let data                        = mediaCSVData[x];
                template["id"]                  = data["id"];
                template["filetype"]            = data["filetype"];
                var arr1                        = tagReader("tagsAll", data["tags"]);
                var arr2                        = tagReader("tagsDate", data["date"]);
                template["tags"]                = arr1.concat(arr2);
                template["note"]                = data["note"];
                mediaProcessedData[data["id"]]  = template;

                mediaProcessedArr.push(data["id"]);
            }
            load();
        }
    })
}
// I know dot notation is the more "correct" way to write it,
// but brackets are easier on my eyes
// (brackets properties are orange in my code viewer since they're string,
// while the var is blue, while dot properties are all blue).
const validPageCharacters = new RegExp("[0-9]")
async function load() {
    let check = await page(0);
    for (bar of [tick, tick2]) {
        bar.addEventListener("keypress", (event) => {
            var elm = event.target;
            var key = event.key;
            if (key != "Enter") {
                if (validPageCharacters.test(key) == false) {
                    event.preventDefault();
                };
                if (elm.value.length == 4) {
                    event.preventDefault();
                }
            } else {
                var requested = elm.value;
                switch (elm.id) {
                    case "pageCounter":
                        if (requested != currentPage) {
                            page(requested - currentPage);
                        }
                        break;
                    case "viewCounter":
                        if (requested != (currentImageExpanded * 1)) {
                            expand(undefined, requested);
                        }
                        break;
                }
            }
        })
        bar.addEventListener("paste", (event) => {
            event.preventDefault();
        })
    }
    window.addEventListener("keypress", (event) => {
        if (event.key == "Enter") {
            switch (document.activeElement.id) {
                case "pageCounter":
                    if (tick.value == 9999) {
                        window.location.href = "assets/other/truth/truth.html"
                    }
                    var currentPageRequested = tick.value;
                    if (currentPageRequested != currentPage) {
                        var dist = currentPageRequested - currentPage;
                        page(dist);
                    }
                    break;
                case "viewCounter":
                    if (tick.value == 9999) {
                        window.location.href = "assets/other/truth/truth.html"
                    }
                    var mediaExpandedRequested = tick2.value;
                    if (mediaExpandedRequested != currentPage) {
                        expand(null, mediaExpandedRequested);
                    }
                    break;
            }
        }
    })
    init_placeholder();
    tagsSearchBuilder();
    tagsCSSBuilder();
    loadForm();
    orientationHandler();
    showHide("infoBox");
};

const tick = document.getElementById("pageCounter");
const tick2 = document.getElementById("viewCounter");

var ordered;
var pageCount;

function pageTick(direction) {
    var mod = document.getElementById("step").value;
    var step = direction * mod;
    page(step);
}
async function page(step) {
    document.getElementById("backwards").disabled = false;
    document.getElementById("forwards").disabled  = false;
    explorer.style.display = "none";
    if (currentPage + step > pageCount) {
        currentPage = pageCount;
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
        pageCount = Math.ceil(mediaOrdered.length / perPage);
        let r = [((currentPage * perPage) - perPage) + 1, (currentPage * perPage)]; // i don't know why i named this button "top" at first...
        for (x = r[0]; x <= r[1]; x++) {
            if (x > mediaOrdered.length) {
                break;
            }
            var tempID = mediaOrdered[x - 1];
            var get = mediaProcessedData[tempID];
            if (get === undefined || get == null) {
                continue;
            }
            get.build();
            let check = await blobGuzzler(get, get["source"], true);
            mediaDisplayed.push(tempID);
        }
        tick.value = currentPage;
        explorer.style.display = "grid";
        switch (currentPage) {
            case 1:
                document.getElementById("backwards").disabled = true;
                break;
            case pageCount:
                document.getElementById("forwards").disabled  = true;
                break;
        }
        var statuses = document.getElementsByClassName("status");
        for (output of statuses) {
            output.innerHTML = "Page " + currentPage+ "/" + pageCount + " (" + mediaOrdered.length + "/" + mediaProcessedArr.length + " files in search)";
        }
        return true;
    }
};


async function blobGuzzler(obj, src, getThumbnail) {
    var file;
    var isCached;
    switch (getThumbnail) {
        case false:
            file = obj["folder"] + obj["id"] + obj["filetype"];
            break;
        case true:
            file = obj["folder"] + "thumbnails/" + obj["id"] + ".jpg";
            break;
    }
    var blob = await fetch(file, { cache: "no-cache" })
    .then(response => response.blob())
    if (getThumbnail == true) {
        src.src = URL.createObjectURL(blob);
    } else {
        switch (obj["filetype"]) {
            case ".jpg":
                src.src = URL.createObjectURL(blob);
                break;
            case ".mp4":
                var elm = document.createElement("source");
                elm.src = URL.createObjectURL(blob);
                src     .appendChild(elm);
                src     .load();
                src     = elm;
                break;
        }
    }
    return true;
}
async function expand(event, id) {
    document.getElementById("backwards2").disabled = false;
    document.getElementById("forwards2").disabled  = false;
    if (id > mediaProcessedArr.length) {
        id = mediaProcessedArr.length;
    } else if (id < 1) {
        id = 1;
    }
    let get   = mediaProcessedData[id];
    get.build_ex();
    let src   = viewer.querySelector(".expanded");
    let check = await blobGuzzler(get, src, false);
    tick2.value = id;// i don't know why i named this button "top" at first...
    switch (id) {
        case 1:
            document.getElementById("backwards2").disabled = true;
            break;
        case mediaProcessedArr.length:
            document.getElementById("forwards2").disabled  = true;
            break;
    }
};

function pageViewer(direction) {
    var next = (currentImageExpanded * 1) + direction;
    
    expand(null, next);
}

var animData = {
    "tagsBar" : {
        toggle  : document.getElementById("tagsButton"),
        anims   : {
            on  : "slideIn",
            off : "slideOut",
        },
        type    : "block",
        state   : false,
        disabled: false,
        able() {
            switch(disabled) {
                case true:
                    this.disabled = false;
                    break;
                case false:
                    this.disabled = true;
                    break;
            }
            this.toggle.disabled = this.disabled;
        }
    },
    "infoBox"   : {
        toggle  : document.getElementById("infoButton"),
        anims   : {
            on  : "fadeIn",
            off : "fadeOut",
        },
        type    : "flex",
        state   : false,
        disabled: false,
        able() {
            switch(this.disabled) {
                case true:
                    this.disabled = false;
                    break;
                case false:
                    this.disabled = true;
                    break;
            }
            this.toggle.disabled = this.disabled;
        }
    },
    "overlay"   : {
        toggle  : undefined, // overlay only comes w/ other elements...
        anims   : {
            on  : "fadeIn",
            off : "fadeOut",
        },
        type    : "block",
        state   : false,
    }
}
for (id of ["tagsBar", "infoBox", "overlay"]) {
    const elm = document.getElementById(id);
    elm.addEventListener("animationstart", (event) => {
        elm.style.display = animData[elm.id]["type"];
    })
    elm.addEventListener("animationend", (event) => {
        var data = animData[elm.id];
        switch(event.animationName) {
            case data["anims"]["on"]:
                
                break;
            case data["anims"]["off"]:
                elm.style.display = "none";
                break;
        }
    })
}

function overlayToggle() {
    switch(animData["overlay"]["state"]) {
        case false:
            overlay.style.display = animData["overlay"]["type"];
            overlay.classList.add("in");
            overlay.classList.remove("out");
            animData["overlay"]["state"] = true;
            break;
        case true:
            overlay.classList.add("out");
            overlay.classList.remove("in");
            animData["overlay"]["state"] = false;
            break;
    }
}
function showHide(menuID) {
    var menu = document.getElementById(menuID);
    var data = animData[menuID];
    if (activeMenu !== undefined && menuID != activeMenu) {
        showHide(activeMenu);
    }
    if (menuID == "tagsBar") {
        document
            .getElementById("search_tagsbutton")
            .style
            .zIndex = 101;
    } else {
        document
            .getElementById("search_tagsbutton")
            .style
            .zIndex = "auto";
    }
    switch (data["state"]) {
        case true:
            menu.classList.add("out");
            menu.classList.remove("in");
            overlayToggle();
            data["state"] = false;
            activeMenu = undefined;
            data["toggle"].classList.remove("hovered");
            break;
        case false:
            menu.style.display = data["type"];
            menu.classList.add("in");
            menu.classList.remove("out");
            overlayToggle();
            data["state"] = true;
            activeMenu = menuID;
            data["toggle"].classList.add("hovered");
            break;
    }
};
function tagsSearchBuilder() {
    var to = tagsBar.querySelector(".tagsMenu");
    tagsType.forEach((value, key, map) => {
        var newLabel       = document.createElement("h2");
        newLabel.innerHTML = value["name"];
        var newCategory    = document.createElement("div");
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
            window.location.replace("assets/other/someone/answ3r.html");
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
const selectedClasses = new Map();

function getLabelByData(tagClass) {
    return tagsBar.querySelector(".tagsMenu").querySelector("[data-tag='" + tagClass + "']")
}
function tagsCSSBuilder() {
    const style = document.createElement("style");
    style.id = "tags"
    for (arr of [tagsAll, tagsDate]) {
        arr.forEach((value, key, map) => {
            var tagLabel = getLabelByData(value["class"]);
            var newClass          = "label." + value["class"];
            var newClass_selected = "label." + value["class"] + ".selected";
            var color;
            if (value["color"] !== null && value["color"] != "#FFFFFF") {
                if (value["color"] == "type") {
                    color = tagsType.get(value["type"])["color"];
                } else {
                    color = value["color"];
                }
            } else {
                color = "#6495a5";
            }
            var coloredText;
            var color2;
            if (value["class"] == "creator") {
                coloredText = `${color}`
                color2 = coloredText.slice(0, 7);
            } else if (value["class"] == "answ3r") {
                coloredText = `${color}`
                tagLabel.id = "answ3r";
                tagLabel.style.display = "none";
                color2 = coloredText.slice(0, 7);
            } else {
                coloredText = `#000`
                color2 = color;
            }
            var rules =
            `${newClass} { border-color: ${color}; color: ${coloredText}} ${newClass} > span { color: ${color}; }` +
            `${newClass_selected} { background-color: ${color2}; color: var(--light); transition-duration : 0.2s; } ${newClass_selected} > span { color: var(--light); }`
            style.innerHTML += rules;
            tagLabel.addEventListener("mouseover", (event) => {
                var label = event.target;
                if (label.classList.contains("searched") == false && label.classList.contains("selected") == false) {
                    label.classList.add("selected");
                }
            })
            tagLabel.addEventListener("mouseout", (event) => {
                var label = event.target;
                if (label.classList.contains("searched") == false && label.classList.contains("selected") == true) {
                    label.classList.remove("selected");
                }
            })
        })
    }
    document.head.appendChild(style);
}
function selectedTagCSS(elm, bool) {
    switch (bool) {
        case true:
            elm.classList.add("selected");
            elm.classList.add("searched");
            break;
        case false:
            elm.classList.remove("selected");
            elm.classList.remove("searched");
            break;
    }
}
function well() {
    var check = true;
    console.log(searchingFor);
    for (character of listCharacters) {
        console.log(character)
        if (searchingFor.includes(character)) {
            // pass.
        } else {
            check = false;
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
        mediaOrdered = [];
        page(0);
        return false;
    } else if (searchingFor.length >= 8) {
        well();
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
        console.warn("Nothing found.");
        var statuses = document.getElementsByClassName("status");
        for (output of statuses) {
            output.innerHTML = "No files found in search.";
        }
        explorer.style.display = "none";
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
        let placeholderMedia         = Object.create(mediaTemplate);
        placeholderMedia["id"]       = "0";
        placeholderMedia["filetype"] = ".jpg";
        placeholderMedia.build_ex();
        let src                      = viewer.querySelector(".expanded");
        let check                    = await blobGuzzler(placeholderMedia, src, false);
        tick2.value = 0;
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}
async function scrub(step) {

}
/*
CODING BY: QNAWAVE & DRONE #4 !!!!!!!!
CSV parsing tool by: PapaParse (https://www.papaparse.com/)
*/
function loadForm() {
    const feedback = infoBox.querySelector(".strawpage");
    var iframe = document.createElement("iframe");
    iframe.src = "https://forms.gle/ehuYV8dXh23B2arw5";
    feedback.appendChild(iframe);
}
