const explorer = document.querySelector(".explorer");
const spyglass = document.querySelector("#viewer");
const message = document.querySelector("#status");

const FOLDER = "media/"
//const eram = document.querySelector("#eram");

const accepted_file_types = [".jpg", ".mp4"]
// "eram" is my function testing dummy!!

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

let tagsAll = new Map();
tagsAll.set("?", {name: "Qu3stion",     class: "qu3stion",   color: "#15c1c3", description: ""});
tagsAll.set("¿", {name: "Old Qu3stion", class: "qu3stion2",  color: "#124193", description: ""});
tagsAll.set("!", {name: "3xclamation",  class: "3xclamation",color: "#cc265a", description: ""});
tagsAll.set(",", {name: "C0mma",        class: "c0mma",      color: "#3e6ab7", description: ""});
tagsAll.set("&", {name: "Amp3rsand",    class: "amp3rsand",  color: "#cb993e", description: ""});
tagsAll.set(":", {name: "Creator",      class: "creator",    color: "#252b2b", description: ""});
tagsAll.set("G", {name: "Ivy",          class: "ivy",      color: "#0e9368", description: ""});
tagsAll.set(".", {name: "...Peri0d??",  class: "peri0d",     color: "#FFFFFF", description: ""});
tagsAll.set("|", {name: "Answ3r",  class: "answ3r",     color: "#FFFFFF", description: ""});
//
tagsAll.set("*", {name: "Lore",         class: "lore",       color: "#FFFFFF", description: "Contains important lore pieces!"});
tagsAll.set("^", {name: "Trivia",         class: "lore",       color: "#FFFFFF", description: "Fun facts about Qu3stion; not as important as the lore tidbits."});
tagsAll.set("_", {name: "Intro",        class: "intro",      color: "#FFFFFF", description: "First time a character appears!"});
tagsAll.set("s", {name: "Cute :3",       class: "cute",     color: "#FFFFFF", description: "All Qu3stion is Cute Medias... but some Medias are more Cuter than others..."});
tagsAll.set("z", {name: "Spooky",       class: "spooky",     color: "#FFFFFF", description: ""});
tagsAll.set("m", {name: "MEAN.. >:]",         class: "mean",       color: "#FFFFFF", description: "WHEN THEY'RE MEAN TO QU3STION    ON TWITTER: | (Includes pranks)"});
tagsAll.set("k", {name: "Stickers",       class: "stickers",     color: "#FFFFFF", description: "All Qu3stion is Cute Medias... but some Medias are more Cuter than others..."});
tagsAll.set("n", {name: "Nice!",         class: "nice",       color: "#FFFFFF", description: "WHEN THEY'RE [Nice! :3] TO QU3STION    ON TWITTER:"});
tagsAll.set("x", {name: "Explosion",    class: "explosion",  color: "#FFFFFF", description: ""});
tagsAll.set("f", {name: "Fish",         class: "fish",       color: "#FFFFFF", description: "Running gag about Qu3stion's pet fish(es)... only medias that focus on the fish are tagged, but they do appear in the background in many posts!"});
tagsAll.set("g", {name: "Gaming",       class: "gaming",     color: "#FFFFFF", description: ""});
tagsAll.set("=", {name: "Drawings",       class: "fanart",     color: "#FFFFFF", description: ""});
tagsAll.set("/", {name: "Drawing Galleries",       class: "fanart",     color: "#FFFFFF", description: ""});
tagsAll.set("c", {name: "X-mas",        class: "x-mas",      color: "#FFFFFF", description: ""});
tagsAll.set("h", {name: "Halloween",    class: "halloween",  color: "#FFFFFF", description: ""});
tagsAll.set("w", {name: "Looks Weird",  class: "weird",      color: "#FFFFFF", description: ""});
tagsAll.set("u", {name: "UT/DR",        class: "utdr",       color: "#FFFFFF", description: ""});
tagsAll.set("t", {name: "Cats",         class: "cats",       color: "#FFFFFF", description: "Discussion of Cats..."});
tagsAll.set("e", {name: "Ears",         class: "ears",       color: "#FFFFFF", description: ""});
tagsAll.set("+", {name: "Audience Participation",        class: "gifts",      color: "#FFFFFF", description: "The audiences gives Qu3stion gives, tries to change her screen color, etc."});
tagsAll.set("-", {name: "Errors/Reboots",class: "errors",    color: "#FFFFFF", description: "Times when Qu3stion's computer crashes / breaks down, and/or resets."});
tagsAll.set("$", {name: "Music",         class: "music",      color: "#FFFFFF", description: "Qu3stion listens to music!"});
tagsAll.set("o", {name: "Cool Tricks",         class: "tricks",      color: "#FFFFFF", description: "Qu3stion does some cool tricks with her computers, um, powers! Changing colors, changing her screen, etc."});
tagsAll.set("`", {name: "Other Computerlings",         class: "others",      color: "#FFFFFF", description: "Qu3stion interacts with other computerlings!"});
tagsAll.set("%", {name: "Overheating",         class: "overheating",      color: "#FFFFFF", description: ""});
tagsAll.set("a", {name: "Animal Qu3stion",         class: "animal",       color: "#FFFFFF", description: "Qu3stion becomes some kind of animal..."});
tagsAll.set("y", {name: "Yur- Romance.",         class: "yuri",       color: "#FFFFFF", description: "There are no medias with this tag. Don't look."});

let tagsDate = new Map();
tagsDate.set(0,  {name: "August '25",    class: "august25"   });
tagsDate.set(1,  {name: "September '25", class: "september25"});
tagsDate.set(2,  {name: "October '25",   class: "october25"  });
tagsDate.set(3,  {name: "November '25",  class: "november25" });
tagsDate.set(4,  {name: "December '25",  class: "december25" });
tagsDate.set(5,  {name: "January '26",   class: "january26"  });
tagsDate.set(6,  {name: "February '26",  class: "february26" });
tagsDate.set(7,  {name: "March '26",     class: "march26"    });
tagsDate.set(8,  {name: "April '26",     class: "april26"    });
tagsDate.set(9,  {name: "May '26",       class: "may26"      });
tagsDate.set(10, {name: "June '26",      class: "june26"     });
tagsDate.set(11, {name: "July '26",      class: "july26"     });
tagsDate.set(12, {name: "August '26",    class: "august26"   });

const mediaTemplate = {
    id      : undefined,
    filetype: undefined,
    tags    : [],
    note    : undefined,
    source  : undefined,
    url: function()   {
        return FOLDER + this.id + this.filetype;
    },
    build: function() {
        let template;
        let clone;
        switch (this.filetype) {
            case ".jpg":
                template = document.querySelector("#template_image");
                clone = document.importNode(template.content, true);
                this.source = clone.querySelectorAll("img")[0];
                break;
            case ".mp4":
                template = document.querySelector("#template_video");
                clone = document.importNode(template.content, true);
                this.source = clone.querySelectorAll("video")[0];
                break;
        };
        this.source.classList.add("thumbnail");
        clone.querySelectorAll("button")[0].addEventListener("click", (event) => {
            expand(event)
        });
        for (tag of this.tags) {
            var box = clone.querySelectorAll(".tags")[0];
            var card = document.createElement("label");
            if (tag === undefined) {
                console.log(this.tag);
                continue;
            }
            card.innerHTML = tag["name"];
            if (tag["color"] !== null) {
                card.style.backgroundColor = tag["color"] + "33";
            } else {
                card.style.backgroundColor = "#FFFFFF"
            }
            clone.querySelector("article").classList.add(tag["class"]);
            box.appendChild(card);
        }
        clone.querySelectorAll(".div_id")[0].innerHTML = "#" + this.id;
        clone.querySelector("article").id = "div_" + this.id;
        explorer.appendChild(clone);
    },
    free() {
        var media = document.getElementById("div_" + this.id);
        media.querySelectorAll("button")[0].removeEventListener("click", (event) => {
            expand(event)
        });
        var url2 = this.source.src;
        URL.revokeObjectURL(url2)
        this.source.src = null;
        url2 = null;
        explorer.removeChild(media);
    }
}
var mediaTotal = 853;
const perPage = 20;
var page_count;
var pageArr = [
    
]

var currentPage = 1;

var counter = 1
function tags(tagBlob) {
    var tagsArr = []
    if (tagBlob != "") {
        for (l = 0; l < tagBlob.length; l++) {
            var tagID = tagBlob[l];
            tagsArr.push(tagsAll.get(tagID));
        }
        return tagsArr;
    } else {
        return [];
    }
}
async function parseCSV() {
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
                mediaCSVData[counter] = mediaNew;
                counter += 1;
            }
        },
        complete: function() {
            init_media();
        }
    })
    return true;
}

const tick = document.getElementById("page_counter");


async function init_media() {
    for (x = 1; x < mediaCSVData.length; x++) {
        let template = Object.create(mediaTemplate);
        let data = mediaCSVData[x];
        template["id"] = data["id"];
        template["filetype"] = data["filetype"];
        template["tags"] = tags(data["tags"]);
        mediaProcessedData[data["id"]] = template;
        mediaProcessedArr.push(data["id"]);
    }
    return true;
};
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
    console.log(page_count);
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
        console.log(page_count)
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
            if (x > mediaProcessedData.length) {
                break;
            }
            var tempID = x;
            var get = mediaProcessedData[tempID];
            if (get === undefined) {
                continue;
            }
            get.build();
            let check = await blobGuzzler(get);
            mediaDisplayed.push(tempID);
        }
        tick.value = currentPage;
        explorer.style.display = "grid";
        return true;
    }
};
async function want_get(mode, tagName) { // I WANT these medias, so go GET them!
    switch (mode) {
        case true:
            var orderArr = [];
            for (id in mediaProcessedData) {
                var media = mediaProcessedData[id];
                for (tag of media["tags"]) {
                    if (tag["class"] == tagName) {
                        orderArr.push(id);
                    }
                }
            }
            return orderArr;
        case false:
            
            break;
    }
}
async function search(tagArr) {
    //var tagArr = document.getElementById("tag_select").value;
    //console.log(tagArr)
    var arr2 = [];
    for (tag of tagArr) {
        var arr = await want_get(true, tag);
        for (id of arr) {
            if (arr2 .includes(id)) {
// if this id already has a key in the order array
                console.log(id + "is already in this array!")
            } else {
                arr2 .push(id);
            }
        }
    }
    if (arr2 .length < 1) {
        console.log("no entries found!")
        return false;
    }
    mediaOrdered = [];
    mediaOrdered = arr2;
    currentPage = 1;
    page(0);
    return true;
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

async function blobGuzzler(obj) {
    var blob = await fetch(FOLDER + obj["id"] + obj["filetype"], { cache: "no-store" })
    .then(response => response.blob())
    switch (obj["filetype"]) {
        case ".jpg":
            obj["source"].src = URL.createObjectURL(blob);
            break;
        case ".mp4":
            var elm = document.createElement("source");
            elm.src = URL.createObjectURL(blob);
            obj["source"].appendChild(elm);
            obj["source"].load();
            break;
    }
    return true;
}
function tags_popup() {
    const tags_box = document.getElementById("tags_selection");
    tags_box.style.display = "block"
}
function expand(event) {
    const selected = event.target;
    if (spyglass.children.length > 0) {
        for (element of spyglass.children) {
            spyglass.removeChild(element);
        }
    }
    var elm;
    console.log(selected.src);
    switch (selected.tagName) {
        case "IMG":
            elm = document.createElement("img");
            elm.src = selected.src
            break;
        case "VIDEO":
            elm = document.createElement("video");
            elm.controls = true;
            elm.autoplay = true;
            //elm.width = "100%"
            source = document.createElement("source");
            source.src = selected.querySelector("source").src;
            source.type = "video/mp4";
            elm.appendChild(source);
            break;
    }
    spyglass.appendChild(elm);
};
async function load() {
    var check = await parseCSV();
    setTimeout(() => {
        page(0)
    }, 500)
    window.addEventListener("keypress", (event) => {
        if (event.key == "Enter") {
            var currentPageRequested = tick.value;
            if (currentPageRequested != currentPage) {
                var dist = currentPageRequested - currentPage;
                page(dist);
            }
        }
    })
}