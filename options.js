document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get('repositories', function (allRepositories) {
        for (var repositoryName in allRepositories.repositories) {
            if(allRepositories.repositories.hasOwnProperty(repositoryName)) {
                var repositoryItem = document.createElement('li');
                repositoryItem.innerText = repositoryName + ' : ' + JSON.parse(allRepositories.repositories[repositoryName])[0];
                document.getElementById('repo_list').appendChild(repositoryItem);

                fetchTags(repositoryName, allRepositories);
            }
        }

        document.getElementById('info').addEventListener('click', function () {
            var repositoryName = document.getElementById('repo').value;
            var repositoryStore = fetchTags(repositoryName, allRepositories);

            chrome.storage.sync.set({'repositories': repositoryStore}, function () {
                // Notify that we saved.
                chrome.notifications.create(null, {
                    type: 'basic',
                    iconUrl: 'icon.png',
                    title: 'Saved',
                    message: 'Saved!'
                });
            });
            return null;
        });
    });

    document.getElementById('save').addEventListener('click', function (event) {
        chrome.storage.sync.set({'interval': document.getElementById('interval').value}, function () {});
        chrome.storage.sync.set({'accessToken': document.getElementById('access_token').value}, function () {});
    });

    chrome.storage.sync.get({'interval': 5000}, function (items) {
        document.getElementById('interval').value = items.interval;
    });

    chrome.storage.sync.get('accessToken', function (items) {
        if(typeof items.accessToken !== 'undefined') {
            document.getElementById('access_token').value = items.accessToken;
        }
    });
});