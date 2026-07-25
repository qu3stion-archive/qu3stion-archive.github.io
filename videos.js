const media = document.querySelector(".media");

function build() {
    for (x = 0; x < 20; x++) {
        var article = document.createElement("article");
        var img = document.createElement("img");
        var p = document.createElement("p");
        img.src = "media/qu3stion.jpg";
        p.innerHTML = "Qu3stion";
        article.appendChild(img);
        article.appendChild(p);
        media.appendChild(article);
    }
};