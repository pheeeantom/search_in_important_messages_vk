// ==UserScript==
// @name         Поиск по важным сообщениям вк
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      /^https\:\/\/vk\.com\/im.*$/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       context-menu
// ==/UserScript==

(function() {
    'use strict';

    var inp = document.createElement('input');
    inp.id = "pheeantom_search_input";
    var but = document.createElement('button');
    but.innerText = 'Найти';
    but.id = "pheeantom_search";
    document.querySelectorAll('._scroll_node.im-important-box')[0].insertBefore(but, document.getElementsByClassName('tb_tabs_wrap')[0].nextSibling);
    document.querySelectorAll('._scroll_node.im-important-box')[0].insertBefore(inp, but);

    document.getElementsByClassName('im-important')[0].parentNode.remove();

    /*let form = document.createElement('form');
    form.action = 'https://api.vk.com/method/messages.get';
    form.method = 'GET';
    form.innerHTML = '<input name="count" value="1">';
    form.innerHTML += '<input name="filters" value="8">';
    form.innerHTML += '<input name="access_token" value="???">';
    form.innerHTML += '<input name="v" value="5.131">';
    // перед отправкой формы, её нужно вставить в документ
    document.body.append(form);

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var data = new FormData(this) // Сборка формы
        var url = 'https://api.vk.com/method/messages.get'
        fetch(url, {
            method: 'get',
            body: data // Отправка самой формы
        })
            .then(response => response.json())
            .then((json) => { // Ответ
            console.log(json)
        })
            .catch(err => console.log(err));
    })

    form.submit();
    form.style.display = 'none';*/

    /*var formData = new FormData(form);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            alert(xhr.responseText);
        }
    }
    xhr.send(formData);*/

    function cl(){
        var xhr = new XMLHttpRequest();
        //xhr.open('POST', 'https://api.vk.com/method/messages.search', true);
        xhr.open('POST', 'https://api.vk.com/method/execute', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        //xhr.send('q=' + document.getElementById("pheeantom_search_input").value + '&preview_length=0&offset=0&count=100&access_token=???&v=5.131');
        xhr.send('code=' + encodeURIComponent('\
var a = API.messages.search({"q":"' + document.getElementById("pheeantom_search_input").value + '","preview_length":0,"offset":0,"count":100});\
if (a.count > 2500) {\
	return {"response":"messages>2500"};\
}\
var add1;\
if (a.count % 100 > 0) {\
	add1=1;\
} else {\
	add1=0;\
}\
var times = parseInt(parseDouble(a.count) / 100) + add1;\
var i = 100;\
while (i < times * 100) {\
	var b = API.messages.search({"q":"' + document.getElementById("pheeantom_search_input").value + '","preview_length":0,"offset":i,"count":100});\
	a.items = a.items + b.items;\
	i = i + 100;\
}\
return a;') + '&access_token=???&v=5.131');
        document.getElementsByClassName('im-important-box')[0].innerHTML += '<h3>' + document.getElementById("pheeantom_search_input").value + '</h3>';
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                const json = JSON.parse(xhr.responseText);
                const newJson = json.response.items.filter(item => item.important);
                //console.log(newJson);

                /*xhr.open('POST', 'https://api.vk.com/method/users.get', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send('user_ids=' + json.response.items[0].id + '&v=5.23&fields=photo_50');
            xhr.onreadystatechange = function() {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    const json = JSON.parse(xhr.responseText);
                    const newJson = json.response.items.filter(item => item.important);
                    console.log(newJson);
                }
            }*/

                /*var xhr2 = new XMLHttpRequest();
            xhr2.open('POST', 'https://api.vk.com/method/messages.getById', true);
            xhr2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            var message_ids = "";
            newJson.forEach(item => {message_ids += item.id + ","});
            if (newJson.length > 0) message_ids.slice(-1);
            xhr2.send('message_ids=' + message_ids + '&preview_length=0&fields=template&access_token=???&v=5.131');
            xhr2.onreadystatechange = function() {
                if (xhr2.readyState == XMLHttpRequest.DONE) {
                    console.log(JSON.parse(xhr2.responseText));
                }
            }*/

                newJson.forEach(item => {
                    var text = item.text;
                    const iterate = (obj) => {
                        obj.forEach(obj2 => {
                            text += obj2.text + " ";
                            if (obj2.fwd_messages) {
                                iterate(obj2.fwd_messages);
                            }
                        });
                    }
                    iterate(item.fwd_messages);
                    document.getElementsByClassName('im-important-box')[0].innerHTML += "<br><a href='https://vk.com/im?msgid=" + item.id + "&sel=" + item.peer_id + "'>" + text + "</a>";
                });
            }
            document.getElementById("pheeantom_search").onclick = cl;
        }
    }

    document.getElementById("pheeantom_search").onclick = cl;
})();