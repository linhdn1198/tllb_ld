document.addEventListener('DOMContentLoaded', function () {

});

function truncateWords(str, numWords) {
    let words = str.split(' ');
    if (words.length > numWords) {
        return words.slice(0, numWords).join(' ') + '...';
    }
    return str;
}
