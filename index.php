<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Groovz – test</title>
<meta name="viewport" content="width=device-width, initial-scale=1">

<style>
    body {
        background-color: #000;
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
    }

    .container {
        background: #111;
        padding: 40px;
        border-radius: 15px;
        width: 380px;
        box-shadow: 0 0 20px rgba(255,255,255,0.05);
        color: white;
    }

    h1 {
        font-size: 28px;
        text-align: center;
        margin-bottom: 25px;
    }

    .input {
        background: #222;
        border: 1px solid #444;
        padding: 12px;
        border-radius: 10px;
        width: 100%;
        margin-bottom: 15px;
        color: white;
    }

    .button {
        background-color: #fff;
        padding: 15px;
        border-radius: 10px;
        border: none;
        width: 100%;
        color: black;
        font-weight: bold;
        cursor: pointer;
        margin-top: 10px;
        font-size: 16px;
    }

    .button:hover { opacity: 0.9; }

    .message {
        text-align: center;
        margin-top: 10px;
        color: #f55;
    }

    .success {
        color: #4caf50 !important;
    }

    .link {
        color: #ccc;
        text-align: center;
        margin-top: 10px;
        cursor: pointer;
    }
</style>
</head>
<body>

<div class="container">
    <h1>Connexion</h1>

    <div id="message"></div>

    <input class="input" id="mail" type="email" placeholder="Email">
    <input class="input" id="mdp" type="password" placeholder="Mot de passe">

    <button class="button" onclick="login()">Se connecter</button>
    <div class="link" onclick="quickLogin()">Connexion Rapide</div>
    <div class="link" onclick="location.href='register.php'">Créer un compte</div>
</div>

<script>
const API_URL = "groovz_api/login.php"; // 🔥 aucune modif API

async function login() {
    const mail = document.getElementById("mail").value.trim();
    const mdp  = document.getElementById("mdp").value.trim();
    const msg  = document.getElementById("message");

    msg.innerHTML = "";

    if (!mail || !mdp) {
        msg.innerHTML = "<div class='message'>Champs manquants</div>";
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ mail, mdp })
        });

        const data = await response.json();

        if (!data.success) {
            msg.innerHTML = `<div class='message'>${data.message}</div>`;
            return;
        }

        msg.innerHTML = "<div class='message success'>Connexion réussie !</div>";

        // Redirection future :
        // window.location.href = "home.php";

    } catch (err) {
        msg.innerHTML = "<div class='message'>Erreur : " + err + "</div>";
    }
}

function quickLogin() {
    document.getElementById("mail").value = "dev@mail.com";
    document.getElementById("mdp").value  = "devpassword";
}
</script>

</body>
</html>
