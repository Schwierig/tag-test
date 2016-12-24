function fetchTags(repositoryName, allRepositories) {
    if (typeof allRepositories.repositories == 'undefined') {
        allRepositories['repositories'] = {};
    }

    chrome.storage.sync.get('accessToken', function (item) {
        var ajax = new XMLHttpRequest();
        ajax.open('GET', 'https://api.github.com/repos/' + repositoryName + '/tags?access_token='+item.accessToken, true);
        ajax.setRequestHeader('Accept', 'application/vnd.github.v3+json');
        ajax.send();

        ajax.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(this.responseText);
                var newTag = false;
                var tagObject = [];

                response.forEach(function (tag) {
                    if (typeof allRepositories.repositories[repositoryName] == 'undefined' || typeof allRepositories.repositories[repositoryName] != 'undefined' && -1 === allRepositories.repositories[repositoryName].indexOf(tag.name)) {
                        newTag = true;
                    }

                    tagObject.push(tag.name);
                });

                allRepositories.repositories[repositoryName] = JSON.stringify(tagObject);

                if (newTag) {
                    chrome.storage.sync.set({'repositories': allRepositories.repositories}, function () {
                        // Notify that we saved.
                        chrome.notifications.create(null, {
                            type: 'basic',
                            iconUrl: 'icon.png',
                            title: repositoryName + " has a new tag!",
                            message: tagObject[0] + ' was just released'
                        });
                    });
                }

                return allRepositories.repositories[repositoryName];
            } else {
                console.log(this);
            }
        };
    });

}