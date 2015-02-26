document.addEventListener('DOMContentLoaded', function()
{
    document.getElementById('acknowledge').addEventListener('click', function()
    {
        localStorage['warningAcknowledged'] = 'v0.2';
        window.location.href = 'options.html';
    });
});
