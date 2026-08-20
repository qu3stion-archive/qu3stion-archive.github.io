const changelog = [
    {
        date: "August 19th",
        updates: [
            ["Release", "Released archive on Qu3stion's anniversary!"],
            ["Embed fix", "Attempted to change embed; failed, neither Carrd nor Strawpage allow themselves to embed. The only thing I can embed is the form, though understandably people confuse it as Qu3stion's strawpage because it's front & center..."],
        ]
    },
    {
        date: "August 20th",
        updates: [
            "Renovated information page!",
            "Created /changelog.html!"
        ]
    },
]
function buildChangelog() {
    const outputs = document.getElementsByClassName("changelog")
    for (output of outputs) {
        for (day of changelog) {
            
        }
    }
}