chrome.storage.sync.get({'interval': 5000}, function (items) {
    setInterval(function () {
        chrome.storage.sync.get('repositories', function (items) {
            for (var repositoryName in items.repositories) {
                if(items.repositories.hasOwnProperty(repositoryName)) {
                    fetchTags(repositoryName, items);
                }
            }
        });
    }, parseInt(items.interval));
});