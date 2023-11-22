const btnElm = document.querySelector('#btn-add');
const txtNameElm = document.querySelector("#txt-name");
const txtContactElm = document.querySelector("#txt-contact");
const tbodyElm = document.querySelector('tbody');
const {API_URL} = process.env;


loadAllTeachers();

function loadAllTeachers(){
    fetch(`${API_URL}/teachers`).then(res =>{
        if(res.ok){
            res.json().then(teacherList => teacherList.forEach(teacher => createTeacher(teacher)));
        }else{
            alert("Failed to load teachers")
        }

    }).catch(err =>{
        alert("Something went wrong, try again!")
    })
}

function createTeacher(teacher){
    const trElm = document.createElement('tr');
    tbodyElm.append(trElm);
    trElm.innerHTML = `
        <td>${teacher.id}</td>
        <td>${teacher.name}</td>
        <td>${teacher.contact}</td>
        <td>
            <i class=".edit bi bi-pencil-fill p-1"></i>
            <i class=".deletebi bi-trash-fill"></i>
        </td>
    `
}

btnElm.addEventListener('click', () =>{
    const name = txtNameElm.value.trim();
    const contact = txtContactElm.value.trim();

    if(!/^[A-Za-z ]+$/.test(name)){
        txtNameElm.focus();
        txtNameElm.select();
        return;
    }else if(!/^\d{3}-\d{7}$/.test(contact)){
        txtContactElm.focus();
        txtContactElm.select();
        return;
    }

    fetch(`${API_URL}/teachers`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({name, contact})
    }).then(res =>{
        if(res.status === 201){
            res.json().then(teacher =>{
                createTeacher(teacher);
                txtNameElm ='';
                txtContactElm = '';
                txtNameElm.focus();

            });
        }else{
            alert("Failed to create the teacher's record!, try again")
        }
    }).catch(err =>{
        alert("Something went wrong, try again later!")
    })
});
