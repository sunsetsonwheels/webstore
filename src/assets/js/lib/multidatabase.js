let openGiraffes_Stores = [
    "https://storedb.opengiraffes.top/data.json"
];
let openGiraffes_Ratings = [
    "https://opengiraffes-rating.herokuapp.com"
];
let BananaHackers_Stores = [
    "https://banana-hackers.gitlab.io/store-db/data.json",
    "https://bananahackers.github.io/store-db/data.json",
    "https://bananahackers.github.io/data.json"
];
let BananaHackers_Ratings = [
    "https://bhackers.uber.space/srs/v1"
];
class MultiDatabases {
    constructor () {
        // Default
        window.localStorage.setItem("DatabaseName", "BananaHackers");
        window.localStorage.setItem("DatabaseURLs", JSON.stringify(BananaHackers_Stores));
        window.localStorage.setItem("RatingServers", JSON.stringify(BananaHackers_Ratings));
        window.localStorage.setItem("QRHeader", "bhackers:");
    };
    openGiraffes () {
        window.localStorage.setItem("DatabaseName", "openGiraffes Store");
        window.localStorage.setItem("DatabaseURLs", JSON.stringify(openGiraffes_Stores));
        window.localStorage.setItem("RatingServers", JSON.stringify(openGiraffes_Ratings));
        window.localStorage.setItem("QRHeader", "opengiraffes:");
    };
    BananaHackers () {
        window.localStorage.setItem("DatabaseName", "BananaHackers");
        window.localStorage.setItem("DatabaseURLs", JSON.stringify(BananaHackers_Stores));
        window.localStorage.setItem("RatingServers", JSON.stringify(BananaHackers_Ratings));
        window.localStorage.setItem("QRHeader", "bhackers:");
    };
}