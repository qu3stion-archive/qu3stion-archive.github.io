const explorer = document.querySelector(".explorer");
const spyglass = document.querySelector("#viewer");
const message = document.querySelector("#status");

const FOLDER = "media/"
//const eram = document.querySelector("#eram");

const accepted_file_types = [".jpg", ".mp4"]
// "eram" is my function testing dummy!!

var mediaCSVData = []; // Data parsed from the CSV.
var mediaProcessedData = new Object(); // Contains all media objects.
var mediaDisplayed = []; // IDs of all displayed medias.

const mediaTemplate = {
    id      : undefined,
    filetype: undefined,
    tags    : [],
    note    : undefined,
    url()   {
        return FOLDER + this.id + this.filetype;
    },
    build() {
        let template;
        let clone;
        switch (this.filetype) {
            case ".jpg":
                template = document.querySelector("#template_image");
                clone = document.importNode(template.content, true);
                clone.querySelectorAll("img")[0].src = this.url();
                break;
            case ".mp4":
                template = document.querySelector("#template_video");
                clone = document.importNode(template.content, true);
                clone.querySelectorAll("source")[0].src = this.url();
                break;
        }
        clone.querySelectorAll("button")[0].addEventListener("click", (event) => {
            expand(event)
        });
        clone.querySelector("article").id = "div_" + this.id;
        explorer.appendChild(clone);
    },
    free() {
        explorer.removeChild(document.getElementById("div_" + this.id));
    }
}

var mediaTotal = 854;
const perPage = 20;
var page_count = Math.ceil(mediaTotal / perPage);
var pageArr = [
    
]

let currentPage = 1;

for (p = 1; p <= page_count; p++) {
    pageArr[p] = {
        "range": [((p * perPage) - perPage + 1), (p * perPage)],
        "fetched": false
    };
    if (pageArr[p]["range"][1] > [mediaTotal]) {
        pageArr[p]["range"][1] = mediaTotal;
    }
    // [id range (ex. m1->m20), fetched?]
}
var counter = 1
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
                mediaCSVData[counter] = mediaNew;
                counter += 1;
            }
        },
        complete: function() {
            init_media()
        }
    })
    return true;
}


let tagsAll = new Map();
tagsAll.set("Q", {name: "Qu3stion",    class: "qu3stion",    color: "#FFF", description: ""});
tagsAll.set("X", {name: "3xclamation", class: "3xclamation", color: "#FFF", description: ""});
tagsAll.set("C", {name: "C0mma",       class: "c0mma",       color: "#FFF", description: ""});
tagsAll.set("A", {name: "Amp3rsand",   class: "amp3rsand",   color: "#FFF", description: ""});
tagsAll.set("E", {name: "Creator",     class: "creator",     color: "#FFF", description: ""});
tagsAll.set("G", {name: "Green",       class: "green",       color: "#FFF", description: ""});
tagsAll.set("P", {name: "...Peri0d??", class: "peri0d",      color: "#FFF", description: ""});
//
tagsAll.set("l", {name: "Lore",         class: "lore",       color: "#FFF", description: ""});
tagsAll.set("i", {name: "Intro",        class: "intro",      color: "#FFF", description: "First time a character appears!"});
tagsAll.set("s", {name: "Silly",        class: "silly",      color: "#FFF", description: ""});
tagsAll.set("z", {name: "Spooky",       class: "spooky",     color: "#FFF", description: ""});
tagsAll.set("m", {name: "Mean",         class: "mean",       color: "#FFF", description: "WHEN THEY'RE MEAN TO QU3STION    ON TWITTER:"});
tagsAll.set("n", {name: "Nice",         class: "nice",       color: "#FFF", description: "WHEN THEY'RE [Nice! :3] TO QU3STION    ON TWITTER:"});
tagsAll.set("e", {name: "Explosion",    class: "explosion", color: "#FFF", description: ""});
tagsAll.set("f", {name: "Fish",         class: "fish",       color: "#FFF", description: ""});
tagsAll.set("a", {name: "Animal",       class: "animal",     color: "#FFF", description: ""});
tagsAll.set("g", {name: "Games",        class: "Gaming",     color: "#FFF", description: ""});
tagsAll.set("d", {name: "Drawings",     class: "drawings",   color: "#FFF", description: ""});

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
        mediaProcessedData[data["id"]] = template;
    }
    return true;
};
async function page(step) {
    var check2 = await reset();
    if (check2) {
        if (currentPage + step < 1) {
            if (currentPage == 1) {
                return false;
            } else {
                currentPage = 1;
                return false;
            }
        }
        currentPage = currentPage + step;
        let r = pageArr[currentPage]["range"];
        console.log(r)
        for (x = r[0]; x <= r[1]; x++) {
            var tempID = "m" + x
            mediaProcessedData[tempID].build()
            mediaDisplayed.push(tempID)
        }
        return true;
    }
};

async function reset() {
    for (key in mediaDisplayed) {
        var id = mediaDisplayed[key];
        mediaProcessedData[id].free();
        mediaDisplayed[key] = null;
    }
    mediaDisplayed = [];
    return true;
};

function expand(event) {
    const selected = event.target;
    let url
    switch (selected.tagName) {
        case "IMG":
            url = selected.src;
            break;
        case "VIDEO":
            url = selected.firstElementChild.src;
            break;
    }
    console.log(url)
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
    spyglass.appendChild(elm);
};
function search() {
    
}

function addTag(tagID, ID) {
    const tag = tagsAll.get(tag)["class"];
    const elm = document.getElementById(ID);
    elm.classList.add(tag)
}
function removeTag(tagID, ID) {
    const tag = tagsAll.get(tag)["class"];
    const elm = document.getElementById(ID);
    elm.classList.remove(tag)
}
