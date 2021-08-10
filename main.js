const input = document.getElementById('input');
const btnCreate = document.getElementById('btn_create');
const btnClearAll = document.getElementById('btn_clear_all');
const newTasks = document.getElementById('newTasks');
const completedTasks = document.getElementById('completed');
const savedTasks = document.getElementById('saved');

btnCreate.disabled = true;

const createToDo = () => {
    if (input.value) {
        const objToDo = {
            name: input.value,
            id: new Date().getMilliseconds(),
            status: true,
            category: 'newTasks'
        };
        itemsArray.push(objToDo);
        saveStorage();
        input.value = '';
        renderToDo(objToDo);
    }

}

function renderToDo(toDo) {
    const liElem = document.createElement('li');
    if (toDo.category === 'saved') {
        toDo.name = exclamationPoint(toDo);
    }

    const template = `<input class="checkBox" type="checkbox" ${!toDo.status ? 'checked' : ''}>
                      <span class="${!toDo.status ? 'line-trough' : ''}">${toDo.name}</span>
                      <button class="btnDelete">x</button>`

    liElem.id = toDo.id;
    liElem.draggable = true;
    liElem.innerHTML = template;

    if (toDo.category === 'newTasks') {
        !toDo.status ? newTasks.append(liElem) : newTasks.prepend(liElem);
    }
    if (toDo.category === 'completed') {
        !toDo.status ? completedTasks.append(liElem) : completedTasks.prepend(liElem);
    }
    if (toDo.category === 'saved') {
        !toDo.status ? savedTasks.append(liElem) : savedTasks.prepend(liElem);
    }
}

btnCreate.addEventListener('click', createToDo);

let itemsArray;
if (localStorage.getItem('items')) {
    getNewItemInStorage();
} else {
    itemsArray = [];
}
saveStorage();

const data = JSON.parse(localStorage.getItem('items'));

if (data.length > 0) {
    data.forEach(item => {
        renderToDo(item);
    })
}

function getNewItemInStorage() {
    itemsArray = JSON.parse(localStorage.getItem('items'));
}

function saveStorage() {
    localStorage.setItem('items', JSON.stringify(itemsArray));
}

function listen(event){

    const id = event.target.parentElement.id;
    const li = event.target.parentElement;
    const btnDelete = event.target.parentElement.lastChild;
    const checkBox = event.target.parentElement.firstChild;
    const span = event.target.parentElement.children[1];
    let ul = event.currentTarget;


    if (event.target === btnDelete) {
        deleteElArr(id);
        li.remove();
    }

    if (event.target === checkBox) {
        itemsArray.forEach((elem) => {
            if (Number(id) === elem.id) {
                elem.status = !elem.status;
            }
        })
        checkBoxChange(checkBox, span, ul);
    }
    saveStorage();
}


function checkBoxChange(checkBox, span, ul) {
    if (!checkBox.checked) {
        span.classList.add('line-trough');
    } else {
        span.classList.remove('line-trough');
    }
    filter(ul);
}

function deleteElArr(deleteId) {
    itemsArray = itemsArray.filter(toDo => toDo.id !== Number(deleteId));
    saveStorage();
}

let newTasksCategory = itemsArray.filter(elem => elem.category === 'newTasks');
let completedCategory = itemsArray.filter(elem => elem.category === 'completed');
let savedCategory = itemsArray.filter(elem => elem.category === 'saved');

function filter(ulColumn) {
    let arrSort;
    if (ulColumn.id === 'newTasks') {
        arrSort = newTasksCategory;
    }
    if (ulColumn.id === 'completed') {
        arrSort = completedCategory;
    }
    if (ulColumn.id === 'saved') {
        arrSort = savedCategory;
    }
    const active = arrSort.filter(elem => elem.status);
    const completed = arrSort.filter(elem => !elem.status);
    arrSort = [...completed, ...active];
    saveStorage();
    ulColumn.innerHTML = '';
    arrSort.forEach((elem) => {
        renderToDo(elem);
    })
}

input.addEventListener('input', () => {
    input.value ? btnCreate.disabled = false : btnCreate.disabled = true;
})

btnClearAll.addEventListener('click', function () {
    while (newTasks.firstChild) {
        newTasks.removeChild(newTasks.firstChild);
    }
    itemsArray = [];
    newTasks.innerHTML = '';
    completedTasks.innerHTML = '';
    savedTasks.innerHTML = '';
    saveStorage();
})



let currentLi;

function dragstart(event) {
    currentLi = event.target;
    event.target.classList.add('card');
    event.target.classList.add('hold');
    setTimeout(() => event.target.classList.add('hide'), 0);
}

function dragend() {
    currentLi.classList.remove('hold');
    currentLi.classList.remove('hide');
}

const placeholders = document.querySelectorAll('.placeholder');

for (const placeholder of placeholders) {
    placeholder.addEventListener('dragover', dragover);
    placeholder.addEventListener('dragenter', dragenter);
    placeholder.addEventListener('dragleave', dragleave);
    placeholder.addEventListener('drop', dragdrop);
    placeholder.addEventListener('dragstart', dragstart);
    placeholder.addEventListener('dragend', dragend);
    placeholder.addEventListener('click', listen);
}


function dragover(event) {
    event.preventDefault();
}

function dragenter(event) {
    event.target.classList.add('hovered');
}

function dragleave(event) {
    event.target.classList.remove('hovered');
}


function dragdrop(event) {
    event.target.classList.remove('hovered');

    if (event.target.classList.contains('placeholder')) {
        event.target.append(currentLi);
        currentLi.classList.remove('hide');
        itemsArray.forEach((elem) => {
            if(Number(currentLi.id) === elem.id){
                elem.category = event.target.id;
            }
        })
    } else if(!event.target.classList.contains('placeholder')) {
        event.target.classList.remove('card');
    }

    saveStorage();
}

function exclamationPoint(toDoSaved) {
   return toDoSaved.name += '!';
}

