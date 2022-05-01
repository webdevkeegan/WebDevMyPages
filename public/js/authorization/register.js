const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("error")) {
    $('#error_msg').text(urlParams.get("error"));
}

$('form').on('submit', function () {

    const password = $('#password');
    const confirm = $('#confirm');

    if (password.val() === "") {
        $('#error_msg').text("Password cannot be empty")
        return false;
    }
    if (confirm.val() === "") {
        $('#error_msg').text("Confirm password cannot be empty")
        return false;
    }
    if ($('#username').val() === "") {
        $('#error_msg').text("username cannot be empty")
        return false;
    }

    if (password.val().length < 5) {
        $('#error_msg').text("Password must be at least 5 characters")
        return false;
    }
    if (confirm.val() !== password.val()) {
        $('#error_msg').text("Passwords do not match")
        return false;
    }
});