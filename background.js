var acknowledged = function()
{
    if (!localStorage['warningAcknowledged'])
    {
        chrome.tabs.create({
            'url': 'warning.html'
        });

        return false;
    }

    return true;
};

var clearData = function(callback)
{
    var dataTypes;

    try
    {
        dataTypes = JSON.parse(localStorage['dataTypes']);
    }
    catch(e)
    {
        dataTypes = {
            'appcache': true,
            'cache': true,
            'cookies': true,
            'downloads': true,
            'fileSystems': true,
            'formData': false,
            'history': false,
            'indexedDB': true,
            'localStorage': true,
            'pluginData': true,
            'passwords': false,
            'webSQL': true
        };
        localStorage['dataTypes'] = JSON.stringify(dataTypes);
    }

    chrome.browsingData.remove({
        'since': 0
    }, dataTypes, function()
    {
        console.log('Cleared browser data.', dataTypes);
        callback && callback();
    });
};


var clearTimer;

chrome.tabs.onRemoved.addListener(function(tab, removeInfo)
{
    if (!localStorage['warningAcknowledged'])
    {
        console.warn('User has not acknowledged the warning.');
        return;
    }

    // If an entire window is closed, this event will fire again before the data is cleared
    clearInterval(clearTimer);
    clearTimer = setTimeout(function()
    {
        chrome.windows.getAll({'populate': true}, function(windows)
        {
            var tabCount = 0;

            windows.forEach(function(w)
            {
                tabCount += w.tabs.length;
            });

            if (!tabCount)
            {
                console.log('No tabs left.  Clearing browser data...');
                clearData();
            }
        });
    }, 500);
});


var badgeTimer;

chrome.browserAction.onClicked.addListener(function(tab)
{
    if (acknowledged())
    {
        clearInterval(badgeTimer);
        chrome.browserAction.setBadgeText({'text': ' '});
        chrome.browserAction.setBadgeBackgroundColor({'color': '#f39c12'});
        clearData(function()
        {
            chrome.browserAction.setBadgeBackgroundColor({'color': '#2ecc71'});
            badgeTimer = setTimeout(function()
            {
                chrome.browserAction.setBadgeText({'text': ''});
            }, 500);
        });
    }
});


chrome.runtime.onStartup.addListener(function()
{
    if (localStorage['warningAcknowledged'])
    {
        clearData();
    }
});


chrome.runtime.onInstalled.addListener(function()
{
    acknowledged();
});
