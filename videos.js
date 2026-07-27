const explorer = document.querySelector(".explorer");
const spyglass = document.querySelector("#viewer");
const message = document.querySelector("#status");
//const eram = document.querySelector("#eram");

const accepted_file_types = [".jpg", ".mp4"]
// "eram" is my function testing dummy!!
const page_num = 50;
let page = 1;

let mediaURLs = [];
let mediaIDs = [];

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

async function get() { // CODE IS JANKY, RENOVATE AFTER CSV IS DONE
    for (x = 1; x < 855; x++) {
        var REQUEST = await fetch("media/" + "m" + x + ".jpg")
        if (REQUEST.status == 200) {
            mediaURLs.push(REQUEST.url);
        } else {
            var REQUEST2 = await fetch("media/" + "m" + x + ".mp4")
            if (REQUEST2.status == 200) {
                mediaURLs.push(REQUEST2.url);
            } else {
                mediaURLs.push(null);
                console.log(REQUEST2)
            }
        }
        message.innerHTML = "fetching media... (" + x + "/" + 854 + ")"
    }
    return true;
}
async function build() {
    explorer.style.display = "none";
    for (x = 0; x < 855; x++) {
        let mediaID = "m" + x;
        var article = document.createElement("article");
        var img = document.createElement("img");
        var p = document.createElement("p");
        var button = document.createElement("button");
        var elm;
        var url;
        url = mediaURLs[x];
        if (url === null) {
            console.warn("m" + x + " is NULL.")
            continue;
        }
        switch (url.slice(-3)) {
            case "jpg":
                elm = document.createElement("img");
                elm.src = url;
                break;
            case "mp4":
                elm = document.createElement("video");
                elm.controls = false;
                source = document.createElement("source");
                source.src = url;
                source.type = "video/mp4";
                elm.appendChild(source);
                break;
        }
        button.appendChild(elm);
        console.log(url)
        p.innerHTML = mediaID + url.slice(-4);
        button.addEventListener("click", (event) => {
            console.log("hmph!")
            expand(event);
        })
        article.appendChild(button);
        article.appendChild(p);
        article.id = mediaID;
        mediaIDs.push(mediaID);
        article.classList.add("hidden")
        explorer.appendChild(article);
    }
    return true;
};
async function load() {
    message.innerHTML = "fetching media..."
    let check = await get();
    if (check) {
        message.innerHTML = "building file explorer..."
        let check2 = await build();
        if (check2) {
            explorer.style.display = "grid";
            message.innerHTML = "archive loaded successfully! :3"
        } else {
            console.error("/!\ >> FAILED TO INIT EXPLORER");
        }
    } else {
        console.error("/!\ >> FAILED TO GET MEDIA");
    }
}

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
}
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

// Opening a file system with temporary storage
