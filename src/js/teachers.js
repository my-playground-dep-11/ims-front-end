const btnElm = document.querySelector('#btn-add');
const txtNameElm = document.querySelector("#txt-name");
const txtContactElm = document.querySelector("#txt-contact");
const tbodyElm = document.querySelector('tbody');
const teacherContainerElm = document.querySelector('#teacher-container');
const {API_URL} = process.env;

let id = 0;

loadAllTeachers();

function loadAllTeachers(){
    fetch(`${API_URL}/teachers`).then(res =>{
        if(res.ok){
            res.json().then(teacherList => teacherList.forEach(teacher => createTeacher(teacher)));
        }else{
            alert("Failed to load teachers")
        }

    }).catch(err =>{
        alert("Something went wrong, try again!");
    })
}

function createTeacher(teacher){
    const name =teacher.name;
    const contact =teacher.contact;
    
    const trElm = document.createElement('tr');
    tbodyElm.append(trElm);
    trElm.innerHTML = `
        <td>${teacher.id}</td>
        <td>${name}</td>
        <td>${contact}</td>
        <td class="d-flex gap-4">
            <i class= "edit bi bi-pencil-fill p-1"></i>
            <i class= "delete bi bi-trash-fill p-1"></i>
        </td>
    `;
}

btnElm.addEventListener('click', (e) =>{
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

    if(btnElm.innerText === "ADD"){
        fetch(`${API_URL}/teachers`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({name, contact})
        }).then(res =>{
            if(res.ok){
                res.json().then(teacher =>{
                    createTeacher(teacher);
                    txtNameElm.value ="";
                    txtContactElm.value = "";
                    txtNameElm.focus();
                });
            }else{
                alert("Failed to create the teacher's record!, try again")
            }
        }).catch(err =>{
            alert("Something went wrong, try again later!")
        })
    }else{
        fetch(`${API_URL}/teachers/${id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name, contact})
        }).then(res => {
            if(res.ok){
                document.querySelectorAll('tbody tr').forEach(tr => tr.remove());
                loadAllTeachers();
                txtNameElm.value ="";
                txtContactElm.value = "";
                txtNameElm.focus();
                btnElm.innerText = "ADD";
                
            }else{
                alert("Failed to update the teacher's record!, try again")
            }
        }).catch(err =>{
            alert("Something went wrong , try again!")
        });
    }
    
});

teacherContainerElm.addEventListener('click', (e) =>{
    if(e.target?.classList.contains('delete')){
        const teacherId = e.target.closest('tr').children[0].innerText;

        fetch(`${API_URL}/teachers/${teacherId}`, {method: 'DELETE'})
        .then(res =>{
            if(res.ok){
                e.target.closest("tr").remove();
            }else{
                alert("Failed to delete the teacher");
            }
        }).catch(err =>{
            alert("Something went wrong. try again later!")
        });

    }else if(e.target?.classList.contains('edit')){
        const teacherId = e.target.closest('tr').children[0].innerText;
        id = teacherId;
        fetch(`${API_URL}/teachers/${teacherId}`)
        .then(res => {
            if(res.ok){
                res.json().then(teacher =>{
                    txtNameElm.value = teacher.name;
                    txtContactElm.value = teacher.contact;
                    btnElm.innerText = "UPDATE";
                })
                
            }
            
        })

    }
});
