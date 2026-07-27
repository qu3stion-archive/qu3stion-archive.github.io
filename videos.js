const explorer = document.querySelector(".explorer");
const spyglass = document.querySelector("#viewer");
const message = document.querySelector("#status");
//const eram = document.querySelector("#eram");

const accepted_file_types = [".jpg", ".mp4"]
// "eram" is my function testing dummy!!
const page_num = 50;
let currentPage = 1;

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


async function build() {
    for (x = 1; x < 855; x++) {
        message.innerHTML = "fetching media... (" + x + "/" + 854 + ")"
        let mediaID = "div_m" + x;
        var article = document.createElement("article");
        var img = document.createElement("img");
        var p = document.createElement("p");
        var button = document.createElement("button");
        var elm;
        var url;
        var REQUEST = await fetch("media/" + "m" + x + ".jpg")
        switch (REQUEST.status) {
            case 206:
            case 200:
                url = REQUEST.url
                break;
            case 404:
                var REQUEST2 = await fetch("media/" + "m" + x + ".mp4")
                if (REQUEST2.status == 200 || REQUEST2.status == 206) {
                    url = REQUEST2.url;
                } else {
                    url = null;
                }
                break;
            default:
                console.log("Weird status: " + REQUEST.status)
                url = null;
        }
        if (REQUEST.status == 200) {
            url = REQUEST.url
        } else {
            var REQUEST2 = await fetch("media/" + "m" + x + ".mp4")
            if (REQUEST2.status == 200) {
                url = REQUEST2.url;
            } else {
                url = null;
            }
        }
        if (url === null) {
            console.warn("m" + x + " is NULL.")
            mediaIDs.push(null);
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
        p.innerHTML = mediaID + url.slice(-4);
        button.addEventListener("click", (event) => {
            console.log("hmph!")
            expand(event);
        })
        article.appendChild(button);
        article.appendChild(p);
        article.id = mediaID;
            mediaIDs.push(mediaID);

        explorer.appendChild(article);
    }
    return true;
};
async function page(step) {
    if (currentPage + step < 1) {
        if (currentPage == 1) {
            return false;
        } else {
            currentPage = 1;
        }
    }
    currentPage = currentPage + step;
    let resetCheck = await reset();
    if (resetCheck) {
        let range = [((currentPage * 50) - 50), (currentPage * 50)];
        for (x = range[0]; x < range[1]; x++) {
            var this_media = document.getElementById(mediaIDs[x]);
            if (this_media !== null && this_media.classList.contains("shown") == false) {
                this_media.classList.add("shown");
            }
        }
    }
    return true;
}
async function reset() {
    for (id in mediaIDs) {
        var this_media = document.getElementById(mediaIDs[id]);
        if (this_media !== null && this_media.classList.contains("shown")) {
            this_media.classList.remove("shown");
        }
    }
    return true;
}
async function load() {
    message.innerHTML = "fetching media..."
    let check = await build();
    if (check) {
        let check2 = await page(0);
        if (check2) {
            message.innerHTML = "archive loaded successfully! :3"
        } else {
            console.error("/!\ >> FAILED TO INIT EXPLORER");
            console.log("yay!")
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
