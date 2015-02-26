document.addEventListener('DOMContentLoaded', function()
{
    if (!localStorage['warningAcknowledged'])
    {
        window.location.href = 'warning.html';
        return;
    }

    var updateSettings = function()
    {
        var dataTypes = {};
        var inputs = document.getElementsByTagName('input');
        for (var i = 0; i < inputs.length; i++)
        {
            dataTypes[inputs[i].getAttribute('name')] = inputs[i].checked;
        }

        localStorage['dataTypes'] = JSON.stringify(dataTypes);
    };

    try
    {
        var dataTypes = JSON.parse(localStorage['dataTypes']);
        var input;
        for (var key in dataTypes)
        {
            document.getElementById(key).checked = dataTypes[key];
        }
    }
    catch(e){};

    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++)
    {
        inputs[i].addEventListener('change', updateSettings);
    }
});
