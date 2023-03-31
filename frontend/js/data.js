// =============================================================
// Блок, который собирает из api данные о задачах в json формате
// и потом строит с этими данными красивый список
// ============================================================

//fetch("http://127.0.0.1:5000/api",
//fetch("http://todo_backend:5000/api",
fetch("/api",
{
    mode: "cors",
    method: "GET",
})
.then(res => {
    return res.json();
})
.then(data => {
    // полученный json файл с задачами перебираю поэлементно и собираю данные о задаче - номер, текст, статус
    // создаю html код блока отображения данной задачи
    data.forEach(element => {
        id_check = `customCheck_${element.count}`
        const markup = `        
        <div id='todo_${element.count}' class="todo-item my-2 p-3 bg-light border border-light card">   
            <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="customCheck_${element.count}" name="tasks"/>    
                <label class="custom-control-label" for="customCheck_${element.count}">
                    <h4 style="float: left" class="m-0 p-0">${element.task}</h4>
                </label>
                <div style="float: right">
                    <i style="cursor: pointer" class="bi bi-pencil-square"></i>
                    <i style="cursor: pointer" onclick='delete_todo("${element.count}")' class="bi bi-trash3 text-danger"></i>
                </div>
            </div>
        </div>
        `
        // беру в DOM блок списка заадач и добавляю в него блок данной задачи
        document.getElementById("todo_list").insertAdjacentHTML('beforeend', markup);
        // завершенным задачкам надо поставить галочку в checkbox
        if(element.status == "done") {
            document.getElementById(id_check).checked = true;
        }
        // 
        count = element.count;

    });;
});

// ======================================================
// === Блок, который добавляет элемент в todo лист   ====
// ======================================================

function add_todo(title) {
    // Функция добавления html блока задачи в DOM, принимает аргумент tittle - это вводимое значение
    document.getElementById("todo_list").innerHTML += `
        <div id='todo_${count}' class="todo-item my-2 p-4 bg-light border border-light card">
            <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="customCheck_${count}" name="tasks"/>    
                <label class="custom-control-label" for="customCheck_${count}">
                    <h4 style="float: left" class="m-0 p-0">${title}</h4>
                </label>
                <div style="float: right">
                    <i style="cursor: pointer" class="bi bi-pencil-square"></i>
                    <i style="cursor: pointer" onclick='delete_todo("${count}")' class="bi bi-trash3 text-danger"></i>
            </div>
        </div>
    `
    count += 1
    

    //Тут добавлю через бекенд запросом POST новый элемент в JSON 
    // это будет fetch с методом POST в функции, срабатывающей
    // по нажатию кнопкии Add task
    
    // а это новая задача которая прилетела по нажатию кнопку add
    var data_new = {
        "count": count,
        "task": title,
        "status": "active" 
    }

    // запрос к api, отдаю данные по новой задаче
    //fetch("http://127.0.0.1:5000/api",
    //fetch("http://todo_backend:5000/api",
    fetch("/api",
    {
        mode: "cors",
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json; charset=UTF-8'
        },

        body: JSON.stringify(data_new)
    })
    //как бы вроде это и не надо, но без этого работает хуже, не обновляет страницу после
    // добавления и вылазят немного косяки, надо допиливать
    .then(res => {
       return res.json();});
}

// ====================================================
// === Блок, который удаляет элемент из todo листа ====
// ====================================================

// функция удления элемента в DOM

// ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?
// как JS находит этот id ? Почему он равен count ?

function delete_todo(id){
    $("#todo_" + id).slideUp()
        setTimeout(
            function(){
                $("#todo_" + id).remove()
                        },2000
                )
    
    // далее fetch запрос методом DELETE и удалять в списке JSON эту задачку
    
    // собрать данные по удаляемому элементу
    var custom_element_dom = document.getElementById("todo_" + id);
    var task = custom_element_dom.getElementsByTagName('h4')[0].innerText;

    var count = id;

    delete_data = {
        "count": count,
        "task": task,
    };
    
    // А вот и fetch запрос

    //fetch("http://127.0.0.1:5000/api",
    //fetch("http://todo_backend:5000/api",
    fetch("/api",
    {
        mode: "cors",
        method: "DELETE",
        headers: {
           'Accept': 'application/json',
           'Content-type': 'application/json; charset=UTF-8'
       },

        body: JSON.stringify(delete_data)

    });
    //.then(response => {
    //    console.log(response);
    //    response.json();
    //});

    
    }

// =========================================
// === Слушаем кнопку добавления задачи ====
// =========================================


$("#todo-form").submit(function(){
// вводимое значение забираем с вводимомго поля
    var title = document.getElementById("title-input").value
    add_todo(title)
    document.getElementById("todo-form").reset()
    return false
});

// ============================================================
// === Слушаем чекбоксы, отмечающие задачи как выполненные ====
// ===========================================================

// Слушатель на нативном JS
// Прослушку навешиваю на родительский элемент, если собрать массив чекбоксов
// и на каждый вешать, то почему прослушка отваливается.
// а тут прекрасно событие всплывает и на родительском элементе ловится

var todo_div = document.getElementById("todo_list");

todo_div.addEventListener('change', function(event){
    
    // введу две перемнные
    // 1-ая это непосредственно сам HTML элемента input где нажат checkbox
    var elementCheckbox = event.target;
    // 2-ая величина - это булевая переменная, отвечающая на вопрос стоит галочка
    // в чебоексе или нет
    var checkedTask = elementCheckbox.checked;

    // проверяю статус чекбокса, если нажат, то беру его  id и
    // присваиваю соовтетсвующее значение переменной обновления статуса
    var idTask = elementCheckbox.id;
    if (checkedTask == true) {
        var update_status = "done";
        };
    
    // проверяю статус чекбокса, если отжат, то беру его  id
    // присваиваю соовтетсвующее значение переменной обновления статуса
    // хотя наверное тут можно было бы просто else сделать и не морочить второй if
    if (checkedTask == false) {
        var update_status = "active";
        };
    
    // из Id этого inputa заберу значение count
    var count = idTask.slice(12);
    
    // из полученных данных соберу переменную об изменяемой задаче
    // для дальнейшей передачи бекенду
    var change_data = {
        "count": count,
        "status": update_status
      };

    // отправляем PUTом в fetch даннные в бекенд
    //fetch("http://127.0.0.1:5000/api",
    //fetch("http://todo_backend:5000/api",
    fetch("/api",
    {
        mode: "cors",
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(change_data)
 
    })
    //.then(response => {
    //   response.json();
    //   console.log(response);
    //})
    .catch(error => {
       console.log("Error: ", error);
    });
});