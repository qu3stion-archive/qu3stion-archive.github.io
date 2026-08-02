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
tagsAll.set("?", {name: "Qu3stion",     class: "qu3stion",   color: "#FFF", description: ""});
tagsAll.set("¿", {name: "Old Qu3stion", class: "qu3stion2",  color: "#FFF", description: ""});
tagsAll.set("!", {name: "3xclamation",  class: "3xclamation",color: "#FFF", description: ""});
tagsAll.set(",", {name: "C0mma",        class: "c0mma",      color: "#FFF", description: ""});
tagsAll.set("&", {name: "Amp3rsand",    class: "amp3rsand",  color: "#FFF", description: ""});
tagsAll.set(":", {name: "Creator",      class: "creator",    color: "#FFF", description: ""});
tagsAll.set("G", {name: "Green",        class: "green",      color: "#FFF", description: ""});
tagsAll.set(".", {name: "...Peri0d??",  class: "peri0d",     color: "#FFF", description: ""});
//
tagsAll.set("l", {name: "Lore",         class: "lore",       color: "#FFF", description: ""});
tagsAll.set("i", {name: "Intro",        class: "intro",      color: "#FFF", description: "First time a character appears!"});
tagsAll.set("s", {name: "Silly",        class: "silly",      color: "#FFF", description: ""});
tagsAll.set("z", {name: "Spooky",       class: "spooky",     color: "#FFF", description: ""});
tagsAll.set("m", {name: "Mean",         class: "mean",       color: "#FFF", description: "WHEN THEY'RE MEAN TO QU3STION    ON TWITTER:"});
tagsAll.set("n", {name: "Nice",         class: "nice",       color: "#FFF", description: "WHEN THEY'RE [Nice! :3] TO QU3STION    ON TWITTER:"});
tagsAll.set("x", {name: "Explosion",    class: "explosion",  color: "#FFF", description: ""});
tagsAll.set("f", {name: "Fish",         class: "fish",       color: "#FFF", description: ""});
tagsAll.set("a", {name: "Animal",       class: "animal",     color: "#FFF", description: ""});
tagsAll.set("g", {name: "Games",        class: "gaming",     color: "#FFF", description: ""});
tagsAll.set("d", {name: "Drawings",     class: "drawings",   color: "#FFF", description: ""});
tagsAll.set("c", {name: "X-mas",        class: "x-mas",      color: "#FFF", description: ""});
tagsAll.set("h", {name: "Halloween",    class: "halloween",  color: "#FFF", description: ""});

let tagsDate = new Map();
tagsDate.set(0, {name: "August '25",     class: "august25"});
tagsDate.set(1, {name: "September '25",  class: "september25"});
tagsDate.set(2, {name: "October '25",    class: "october25"});
tagsDate.set(3, {name: "November '25",   class: "november25"});
tagsDate.set(4, {name: "December '25",   class: "december25"});
tagsDate.set(5, {name: "January '26",    class: "january26"});
tagsDate.set(6, {name: "February '26",   class: "february26"});
tagsDate.set(7, {name: "March '26",      class: "march26"});
tagsDate.set(9, {name: "April '26",      class: "april26"});
tagsDate.set(10,{name: "May '26",        class: "may26"});
tagsDate.set(11,{name: "June '26",       class: "june26"});
tagsDate.set(12,{name: "July '26",       class: "july26"});
tagsDate.set(13,{name: "August '26",     class: "august26"});

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
        clone.querySelectorAll("button")[0].addEventListener("click", (event) => {
            expand(event)
        });
        for (tag of this.tags) {
            var box = clone.querySelectorAll(".tags")[0];
            var card = document.createElement("label");
            card.innerHTML = tag["name"];
            clone.querySelector("article").classList.add(tag["class"])
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
var mediaTotal = 854;
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


async function load() {
    var check = await parseCSV();
    setTimeout(() => {
        page(0)
    }, 500)
}

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
async function page(s) {
    var mod = document.getElementById("step").value;
    var step = s * mod;
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
            var tempID = "m" + x;
            var get = mediaProcessedData[tempID];
            if (get === undefined) {
                continue;
            }
            get.build();
            let check = await blobGuzzler(get);
            mediaDisplayed.push(tempID);
        }
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

function expand(event) {
    const selected = event.target;
    console.log(selected)
    /*
    switch (selected.tagName) {
        case "IMG":
            url = selected.src;
            break;
        case "VIDEO":
            url = selected.firstElementChild.src;
            break;
    }
    if (spyglass.children.length > 0) {
        for (element of spyglass.children) {
            spyglass.removeChild(element);
        }
    }
    let filetype = url.slice(-3);
    var elm
    switch (filetype) {
        case "jpg":
            elm = document.createElement("img");
            elm.src = url;
            break;
        case "mp4":
            elm = document.createElement("video");
            elm.controls = true;
            elm.autoplay = true;
            //elm.width = "100%"
            source = document.createElement("source");
            source.src = url;
            source.type = "video/mp4";
            elm.appendChild(source);
            break;
        default:
            return false;
    }
    */
    spyglass.appendChild(elm);
};
