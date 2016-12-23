document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get(null, function (allRepositories) {
        for (var repositoryName in allRepositories) {
            var repositoryItem = document.createElement('li');
            repositoryItem.innerText = repositoryName+' : '+JSON.parse(allRepositories[repositoryName])[0];
            document.getElementById('repo_list').appendChild(repositoryItem);
        }

        document.getElementById('info').addEventListener('click', function (form) {
            var repositoryName = form.target[0].value;
            var ajax = new XMLHttpRequest();

            ajax.open('GET', 'https://api.github.com/repos/' + repositoryName + '/tags', true);
            ajax.setRequestHeader('Accept', 'application/vnd.github.v3+json');
            ajax.send();

            ajax.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    var newTag = false;
                    var tagObject = [];

                    response.forEach(function (tag) {
                        if (typeof allRepositories[repositoryName] != 'undefined' && -1 === allRepositories[repositoryName].indexOf(tag.name)) {
                            newTag = true;
                        }

                        tagObject.push(tag.name);
                    });

                    var repositoryStore = {};
                    repositoryStore[repositoryName] = JSON.stringify(tagObject);

                    chrome.storage.sync.set(repositoryStore, function () {
                        // Notify that we saved.
                        chrome.notifications.create(null, {
                            type: 'basic',
                            iconUrl: 'icon.png',
                            title: 'Saved',
                            message: 'Saved!'
                        });
                    });

                    if (newTag) {
                        chrome.storage.sync.set(repositoryStore, function () {
                            // Notify that we saved.
                            chrome.notifications.create(null, {
                                type: 'basic',
                                iconUrl: 'icon.png',
                                title: 'New Tag',
                                message: 'New Tag!'
                            });
                        });
                    }
                } else {
                    console.log(this);
                }
            };

            return null;
        });
    });
});