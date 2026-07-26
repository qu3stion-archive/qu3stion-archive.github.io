const media = document.querySelector(".media");
const spyglass = document.querySelector("#spyglass");

const eram = document.querySelector("#eram");
// "eram" is my function testing dummy!!

const files = [ // Temporary way to pull files.

]


let tagsAll = new Map();
tagsAll.set("Q", {name: "Qu3stion",    class: "qu3stion",    color: "#FFF"});
tagsAll.set("X", {name: "Exclamation", class: "exclamation", color: "#FFF"});
tagsAll.set("C", {name: "C0mma",       class: "c0mma",       color: "#FFF"});
tagsAll.set("A", {name: "Ampersand",   class: "ampersand",   color: "#FFF"});
tagsAll.set("E", {name: "Creator",     class: "creator",     color: "#FFF"});
tagsAll.set("G", {name: "Green",       class: "green",       color: "#FFF"});
//
tagsAll.set("s", {name: "Silly",       class: "silly",       color: "#FFF"});
tagsAll.set("z", {name: "Spooky",      class: "spooky",      color: "#FFF"});
tagsAll.set("e", {name: "Explosion",   class: "explosion",   color: "#FFF"});
tagsAll.set("f", {name: "Fish",        class: "fish",        color: "#FFF"});
tagsAll.set("a", {name: "Animal",      class: "animal",      color: "#FFF"});

async function build() {
    media.style.display = "none";
    for (x = 1; x < 21; x++) {
        try {
            var article = document.createElement("article");
            var img = document.createElement("img");
            var p = document.createElement("p");
            var button = document.createElement("button");

            var REQUEST = await fetch("media/Q (" + x + ").jpg");
            if (REQUEST.status == 404) {
                console.log("eek! (404)")
                continue
            }
            var url = REQUEST.url
            img.src = url;
            //console.log(url)
            p.innerHTML = "Qu3stion";
            button.addEventListener("click", (event) => {
                expand(event);
            })

            button.appendChild(img);
            article.appendChild(button);
            article.appendChild(p);
            article.id = "Q (" + x + ")";
            media.appendChild(article);
        } catch (error) {
            console.log("eek!")
            return false;
        }
    }
    return true;
};
async function load() {
    let check = await build();
    if (check) {
        //console.log("archive loaded!")
        media.style.display = "grid";
    } else {
        //console.error("/!\ >> ARCHIVE FAILED TO LOAD")
    }
}

function expand(event) {
    const selected = event.target;
    const url = selected.src;
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
