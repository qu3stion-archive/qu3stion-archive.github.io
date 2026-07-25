const media = document.querySelector(".media");
const eram = document.querySelector("#eram");
// "eram" is my function testing dummy!!

async function build() {
    media.style.display = "none";
    for (x = 1; x < 21; x++) {
        try {
            var article = document.createElement("article");
            var img = document.createElement("img");
            var p = document.createElement("p");

            var REQUEST = await fetch("media/Q (" + x + ").jpg");
            if (REQUEST.status == 404) {
                console.log("eek! (404)")
                continue
            }
            img.src = REQUEST.url;

            p.innerHTML = "Qu3stion";
            article.appendChild(img);
            article.appendChild(p);
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
        console.log("archive loaded!")
        media.style.display = "grid";
    } else {
        console.error("/!\ >> ARCHIVE FAILED TO LOAD")
    }
}
async function cassarole() {
    fetch("media/").then((response) => {
        return response.text();
    }).then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        console.log(doc);
    })
    //eram.src = REQUEST.url;
}